// SPDX-License-Identifier: AGPL-3.0-only

pragma solidity 0.8.16;

import { MarketplaceEventsAndErrors721, IERC721 } from "contracts/EventsAndErrors.sol";
import { ERC721Holder } from "contracts/lib/tokens/ERC721/Base/utils/ERC721Holder.sol";
import { FactoryVerifier, MADMarketplaceBase, SafeTransferLib } from "contracts/MADMarketplaceBase.sol";
import { Types } from "contracts/Types.sol";

contract MADMarketplace721 is MADMarketplaceBase, MarketplaceEventsAndErrors721, ERC721Holder {
    using Types for Types.Order721;

    constructor(
        address _recipient,
        address _paymentTokenAddress,
        address _swapRouter
    ) MADMarketplaceBase(_recipient, _paymentTokenAddress, _swapRouter) {}

    ////////////////////////////////////////////////////////////////
    //                           STORAGE                          //
    ////////////////////////////////////////////////////////////////

    /// @dev token => id => orderID[]
    mapping(IERC721 => mapping(uint256 => bytes32[])) public orderIdByToken;

    /// @dev orderID => order details
    mapping(bytes32 => Types.Order721) public orderInfo;

    /// @dev token => tokenId => case0(feePercent0)/case1(feePercent1)
    mapping(uint256 => mapping(uint256 => bool)) public feeSelector;

    ////////////////////////////////////////////////////////////////
    //                           USER FX                          //
    ////////////////////////////////////////////////////////////////

    /// @notice Fixed Price listing order public pusher.
    /// @dev Function Signature := 0x40b78b0f
    function fixedPrice(IERC721 _token, uint256 _id, uint256 _price, uint256 _endTime) external whenNotPaused {
        _makeOrder(0, _token, _id, _price, 0, _endTime);
    }

    /// @notice Dutch Auction listing order public pusher.
    /// @dev Function Signature := 0x205e409c
    function dutchAuction(
        IERC721 _token,
        uint256 _id,
        uint256 _startPrice,
        uint256 _endPrice,
        uint256 _endTime
    ) external whenNotPaused {
        _exceedsMaxEP(_startPrice, _endPrice);
        _makeOrder(1, _token, _id, _startPrice, _endPrice, _endTime);
    }

    /// @notice English Auction listing order public pusher.
    /// @dev Function Signature := 0x47c4be17
    function englishAuction(IERC721 _token, uint256 _id, uint256 _startPrice, uint256 _endTime) external whenNotPaused {
        _makeOrder(2, _token, _id, _startPrice, 0, _endTime);
    }

    /// @notice Bidding function available for English Auction only.
    /// @dev Function Signature := 0x957bb1e0
    /// @dev By default, bids must be at least 5% higher than the previous one.
    /// @dev By default, auction will be extended in 5 minutes if last bid is placed 5 minutes prior to auction's end.
    /// @dev 5 minutes eq to 300 mined blocks since block mining time is expected to take 1s in the harmony blockchain.
    function bid(bytes32 _order) public payable whenNotPaused {
        Types.Order721 storage order = orderInfo[_order];

        uint256 lastBidPrice = order.lastBidPrice;

        uint256 bidValue = msg.value;

        if (address(erc20) != address(0)) {
            bidValue = erc20.allowance(msg.sender, address(this));
            SafeTransferLib.safeTransferFrom(erc20, msg.sender, address(this), bidValue);
        }

        _bidChecks(order.orderType, order.endTime, order.seller, lastBidPrice, order.startPrice, bidValue);

        // 1s blocktime
        assembly {
            let endTime := and(sload(add(order.slot, 4)), shr(32, not(0)))
            if gt(timestamp(), sub(endTime, sload(minAuctionIncrement.slot))) {
                let inc := add(endTime, sload(minAuctionIncrement.slot))
                sstore(add(order.slot, 4), inc)
            }
            sstore(add(order.slot, 6), caller())
            sstore(add(order.slot, 5), bidValue)
        }

        if (lastBidPrice != 0) {
            totalOutbid += lastBidPrice;
            userOutbid[order.lastBidder] += lastBidPrice;

            emit UserOutbid(order.lastBidder, address(erc20) != address(0) ? address(erc20) : address(0), lastBidPrice);
        }

        emit Bid(order.token, order.tokenId, _order, msg.sender, bidValue);
    }

    /// @notice Enables user to buy an nft for both Fixed Price and Dutch Auction listings.
    /// @dev Price overrunning not accepted in fixed price and dutch auction.
    /// @dev Function Signature := 0x9c9a1061
    function buy(bytes32 _order) external payable whenNotPaused {
        Types.Order721 storage order = orderInfo[_order];

        _buyChecks(order.endTime, order.orderType, order.isSold);

        uint256 currentPrice = getCurrentPrice(_order);
        if (address(erc20) != address(0)) {
            if (erc20.allowance(msg.sender, address(this)) < currentPrice) {
                revert WrongPrice();
            }
            SafeTransferLib.safeTransferFrom(erc20, msg.sender, address(this), currentPrice);
        } else {
            if (msg.value != currentPrice) revert WrongPrice();
        }

        order.isSold = true;

        uint256 key = uint256(uint160(address(order.token))) << 12;

        // path for inhouse minted tokens
        if (!feeSelector[key][order.tokenId] && MADFactory.creatorAuth(address(order.token), order.seller) == true) {
            _intPath(order, currentPrice, _order, msg.sender, key);
        }
        // path for external tokens
        else {
            // case for external tokens with ERC2981 support
            if (ERC165Check(address(order.token)) && interfaceCheck(address(order.token), 0x2a55205a) == true) {
                _extPath0(
                    order,
                    currentPrice,
                    _order,
                    msg.sender // ,
                    //key
                );
            }
            // case for external tokens without ERC2981 support
            else {
                _extPath1(
                    order,
                    currentPrice,
                    _order,
                    msg.sender // ,
                    // key
                );
            }
        }
    }

    /// @notice Pull method for NFT withdrawing in English Auction.
    /// @dev Function Signature := 0xbd66528a
    /// @dev Callable by both the seller and the auction winner.
    function claim(bytes32 _order) external whenNotPaused {
        Types.Order721 storage order = orderInfo[_order];

        _isBidderOrSeller(order.lastBidder, order.seller);
        _claimChecks(order.isSold, order.orderType, order.endTime);

        order.isSold = true;

        uint256 key = uint256(uint160(address(order.token))) << 12;

        // path for inhouse minted tokens
        if (!feeSelector[key][order.tokenId] && MADFactory.creatorAuth(address(order.token), order.seller) == true) {
            _intPath(order, order.lastBidPrice, _order, order.lastBidder, key);
        }
        // path for external tokens
        else {
            // case for external tokens with ERC2981 support
            if (ERC165Check(address(order.token)) && interfaceCheck(address(order.token), 0x2a55205a) == true) {
                _extPath0(
                    order,
                    order.lastBidPrice,
                    _order,
                    order.lastBidder // ,
                    // key
                );
            }
            // case for external tokens without ERC2981 support
            else {
                _extPath1(
                    order,
                    order.lastBidPrice,
                    _order,
                    order.lastBidder // ,
                    // key
                );
            }
        }
    }

    /// @notice Enables sellers to withdraw their tokens.
    /// @dev Function Signature := 0x7489ec23
    /// @dev Cancels order setting endTime value to 0.
    function cancelOrder(bytes32 _order) external {
        Types.Order721 storage order = orderInfo[_order];
        _cancelOrderChecks(order.seller, order.isSold, order.lastBidPrice);

        IERC721 token = order.token;
        uint256 tokenId = order.tokenId;

        order.endTime = 0;

        emit CancelOrder(token, tokenId, _order, msg.sender);

        token.safeTransferFrom(address(this), msg.sender, tokenId);
    }

    ////////////////////////////////////////////////////////////////
    //                         OWNER FX                           //
    ////////////////////////////////////////////////////////////////

    /// @notice Delete order function only callabe by contract's owner,
    /// when contract is paused, as security measure.
    /// @dev Function Signature := 0x0c026db9
    function delOrder(bytes32 hash, IERC721 _token, uint256 _id, address _seller) external onlyOwner whenPaused {
        delete orderInfo[hash];
        delete orderIdByToken[_token][_id];
        delete orderIdBySeller[_seller];

        _token.transferFrom(address(this), _seller, _id);
    }

    ////////////////////////////////////////////////////////////////
    //                        INTERNAL FX                         //
    ////////////////////////////////////////////////////////////////

    /// @notice Internal order path resolver.
    /// @dev Function Signature := 0x4ac079a6
    /// @param _orderType Values legend:
    /// 0=Fixed Price; 1=Dutch Auction; 2=English Auction.
    /// @param _endTime Equals to canceled order when value is set to 0.
    function _makeOrder(
        uint8 _orderType,
        IERC721 _token,
        uint256 _id,
        uint256 _startPrice,
        uint256 _endPrice,
        uint256 _endTime
    ) internal {
        _makeOrderChecks(_endTime, _startPrice);

        bytes32 hash = _hash(_token, _id, msg.sender);
        orderInfo[hash] = Types.Order721(
            _id,
            _startPrice,
            _endPrice,
            block.timestamp,
            _endTime,
            0,
            address(0),
            _token,
            msg.sender,
            _orderType,
            false
        );
        orderIdByToken[_token][_id].push(hash);
        orderIdBySeller[msg.sender].push(hash);

        emit MakeOrder(_token, _id, hash, msg.sender);

        _token.safeTransferFrom(msg.sender, address(this), _id);
    }

    /// @notice Provides hash of an order used as an order info pointer
    /// @dev Function Signature := 0x3b1ce0d2
    function _hash(IERC721 _token, uint256 _id, address _seller) internal view returns (bytes32) {
        return keccak256(abi.encodePacked(block.number, _token, _id, _seller));
    }

    /// @notice Modified from OpenZeppelin Contracts
    /// (v4.4.1 - utils/introspection/ERC165Checker.sol)
    /// (https://github.com/OpenZeppelin/openzeppelin-contracts)
    function interfaceCheck(address account, bytes4 interfaceId) internal view returns (bool) {
        bytes memory encodedParams = abi.encodeWithSelector(IERC721.supportsInterface.selector, interfaceId);
        bool success;
        uint256 returnSize;
        uint256 returnValue;
        assembly {
            success := staticcall(30000, account, add(encodedParams, 0x20), mload(encodedParams), 0x00, 0x20)
            returnSize := returndatasize()
            returnValue := mload(0x00)
        }
        return success && returnSize >= 0x20 && returnValue > 0;
    }

    /// @notice Modified from OpenZeppelin Contracts
    /// (v4.4.1 - utils/introspection/ERC165Checker.sol)
    /// (https://github.com/OpenZeppelin/openzeppelin-contracts)
    function ERC165Check(address account) internal view returns (bool) {
        return interfaceCheck(account, 0x01ffc9a7) && !interfaceCheck(account, 0xffffffff);
    }

    function _intPath(
        Types.Order721 storage _order,
        uint256 _price,
        bytes32 _orderId,
        address _to,
        uint256 key
    ) internal {
        // load royalty info query to mem
        uint16 feePercent = _feeResolver(key, _order.tokenId);
        // load royalty info query to mem
        (address _receiver, uint256 _amount) = _order.token.royaltyInfo(_order.tokenId, _price);
        // transfer royalties
        if (address(erc20) != address(0)) {
            SafeTransferLib.safeTransfer(erc20, payable(_receiver), _amount);
        } else {
            SafeTransferLib.safeTransferETH(payable(_receiver), _amount);
        }
        // update price and transfer fee to recipient
        uint256 fee = (_price * feePercent) / basisPoints;
        if (address(erc20) != address(0)) {
            SafeTransferLib.safeTransfer(erc20, payable(recipient), fee);
        } else {
            SafeTransferLib.safeTransferETH(payable(recipient), fee);
        }
        // transfer remaining value to seller
        if (address(erc20) != address(0)) {
            SafeTransferLib.safeTransfer(erc20, payable(_order.seller), (_price - (_amount + fee)));
        } else {
            SafeTransferLib.safeTransferETH(payable(_order.seller), (_price - (_amount + fee)));
        }
        // transfer token and emit event
        _order.token.safeTransferFrom(address(this), _to, _order.tokenId);
        emit Claim(_order.token, _order.tokenId, _orderId, _order.seller, _to, _price);
    }

    function _extPath0(Types.Order721 storage _order, uint256 _price, bytes32 _orderId, address _to) internal {
        // note: 2.5% flat fee for external listings
        uint256 feePercent = maxFee; // _feeResolver(key, _order.tokenId);
        // load royalty info query to mem
        (address _receiver, uint256 _amount) = _order.token.royaltyInfo(_order.tokenId, _price);
        // transfer royalties
        if (address(erc20) != address(0)) {
            SafeTransferLib.safeTransfer(erc20, payable(_receiver), _amount);
        } else {
            SafeTransferLib.safeTransferETH(payable(_receiver), _amount);
        }
        // update price and transfer fee to recipient
        uint256 fee = (_price * feePercent) / basisPoints;
        if (address(erc20) != address(0)) {
            SafeTransferLib.safeTransfer(erc20, payable(recipient), fee);
        } else {
            SafeTransferLib.safeTransferETH(payable(recipient), fee);
        }
        // transfer remaining value to seller
        if (address(erc20) != address(0)) {
            SafeTransferLib.safeTransfer(erc20, payable(_order.seller), (_price - (_amount + fee)));
        } else {
            SafeTransferLib.safeTransferETH(payable(_order.seller), (_price - (_amount + fee)));
        }
        // transfer token and emit event
        _order.token.safeTransferFrom(address(this), _to, _order.tokenId);
        emit Claim(_order.token, _order.tokenId, _orderId, _order.seller, _to, _price);
    }

    function _extPath1(Types.Order721 storage _order, uint256 _price, bytes32 _orderId, address _to) internal {
        // note: 2.5% flat fee for external listings
        uint256 feePercent = maxFee; // _feeResolver(key, _order.tokenId);
        uint256 fee = (_price * feePercent) / basisPoints;
        if (address(erc20) != address(0)) {
            SafeTransferLib.safeTransfer(erc20, payable(recipient), fee);
            SafeTransferLib.safeTransfer(erc20, payable(_order.seller), _price - fee);
        } else {
            SafeTransferLib.safeTransferETH(payable(recipient), fee);
            SafeTransferLib.safeTransferETH(payable(_order.seller), _price - fee);
        }
        // transfer token and emit event
        _order.token.safeTransferFrom(address(this), _to, _order.tokenId);
        emit Claim(_order.token, _order.tokenId, _orderId, _order.seller, _to, _price);
    }

    function _feeResolver(uint256 _key, uint256 _tokenId) internal returns (uint16 _feePercent) {
        assembly {
            mstore(0x00, _key)
            mstore(0x20, feeSelector.slot)
            let x := keccak256(0x00, 0x40)
            mstore(0x20, x)
            mstore(0x00, _tokenId)
            let y := keccak256(0x00, 0x40)
            switch sload(y)
            case 0 {
                sstore(y, 1)
                _feePercent := sload(royaltyFee.slot)
            }
            case 1 {
                _feePercent := sload(maxFee.slot)
            }
        }
    }

    ////////////////////////////////////////////////////////////////
    //                   PUBLIC/EXTERNAL GETTERS                  //
    ////////////////////////////////////////////////////////////////

    /// @notice Works as price fetcher of listed tokens
    /// @dev Function Signature := 0x161e444e
    /// @dev Used for price fetching in buy function.
    function getCurrentPrice(bytes32 _order) public view returns (uint256 price) {
        Types.Order721 storage order = orderInfo[_order];

        assembly {
            let orderType := shr(160, sload(add(order.slot, 8)))
            mstore(0x80, orderType)
            switch mload(0x80)
            // Fixed Price
            case 0 {
                price := and(sload(add(order.slot, 1)), shr(32, not(0)))
            }
            // Ductch Auction
            case 1 {
                let _startPrice := and(sload(add(order.slot, 1)), shr(32, not(0)))
                let _startTime := and(sload(add(order.slot, 3)), shr(32, not(0)))
                let _endPrice := and(sload(add(order.slot, 2)), shr(32, not(0)))
                let _endTime := and(sload(add(order.slot, 4)), shr(32, not(0)))
                let _tick := div(sub(_startPrice, _endPrice), sub(_endTime, _startTime))
                price := sub(_startPrice, mul(sub(timestamp(), _startTime), _tick))
            }
            // English Auction
            case 2 {
                let lastBidPrice := and(sload(add(order.slot, 5)), shr(32, not(0)))
                switch iszero(lastBidPrice)
                case 1 {
                    price := and(sload(add(order.slot, 1)), shr(32, not(0)))
                }
                case 0 {
                    price := lastBidPrice
                }
            }
        }
    }

    /// @notice Everything in storage can be fetch through the
    /// getters natively provided by all public mappings.
    /// @dev This public getter serve as a hook to ease frontend
    /// fetching whilst estimating `orderIdByToken` indexes by length.
    /// @dev Function Signature := 0x8c5ac795
    function tokenOrderLength(IERC721 _token, uint256 _id) external view returns (uint256) {
        return orderIdByToken[_token][_id].length;
    }
}
