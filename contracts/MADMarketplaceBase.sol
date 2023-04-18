// SPDX-License-Identifier: AGPL-3.0-only

pragma solidity 0.8.16;

import { MAD } from "contracts/MAD.sol";
import { FactoryVerifier, MarketplaceEventsAndErrorsBase } from "contracts/EventsAndErrors.sol";
// import { Types } from "./Types.sol";
import { Pausable } from "contracts/lib/security/Pausable.sol";
import { Owned } from "contracts/lib/auth/Owned.sol";
import { SafeTransferLib } from "contracts/lib/utils/SafeTransferLib.sol";
import { ERC20 } from "contracts/lib/tokens/ERC20.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";

abstract contract MADMarketplaceBase is MAD, Owned(msg.sender), Pausable, MarketplaceEventsAndErrorsBase {
    /// @dev Function Signature := 0x06fdde03
    function name() external pure override(MAD) returns (string memory) {
        assembly {
            mstore(0x20, 0x20)
            mstore(0x46, 0x066D61726B6574)
            return(0x20, 0x60)
        }
    }

    ////////////////////////////////////////////////////////////////
    //                           STORAGE                          //
    ////////////////////////////////////////////////////////////////
    ISwapRouter public immutable swapRouter;
    uint24 public constant feeTier = 3000;

    uint256 public royaltyFee = 1.0e3; // 10 %
    uint256 public maxFee = 2.5e2; //  2.5%

    uint16 public constant basisPoints = 1.0e4;

    /// @dev when user is outbid on an erc20, deposit here and let the user withdraw it
    mapping(address => uint256) public userOutbid;

    /// @dev seller => orderID
    mapping(address => bytes32[]) public orderIdBySeller;

    uint public minAuctionIncrementMAX = 1200;
    uint public minOrderDurationtMAX = 600;

    // max fees, 15% for royalties, 5% for fees
    uint public MAX_ROYALTY_FEE = 1.5e3;
    uint public MAX_FEES = 5.0e2;

    uint256 public minOrderDuration;
    uint256 public minAuctionIncrement;
    uint256 public minBidValue;
    uint256 public maxOrderDuration;

    address public recipient;

    ERC20 public erc20;
    uint256 public totalOutbid;

    FactoryVerifier public MADFactory;

    ////////////////////////////////////////////////////////////////
    //                         CONSTRUCTOR                        //
    ////////////////////////////////////////////////////////////////

    constructor(address _recipient, address _paymentTokenAddress, address _swapRouter) {
        setRecipient(_recipient);

        // init settings
        updateSettings(
            300, // 5 min
            300, // 5 min
            20, // 5% (1/20th)
            31536000 // 24 months
        );

        swapRouter = ISwapRouter(_swapRouter);

        if (_paymentTokenAddress != address(0)) {
            require(address(swapRouter) != address(0), "invalid swap router configuration");
            _setPaymentToken(_paymentTokenAddress);

            // Approve the router to spend the ERC20 payment token.
            SafeTransferLib.safeApprove(ERC20(_paymentTokenAddress), address(_swapRouter), 2 ** 256 - 1);
        }
    }

    receive() external payable {}

    ////////////////////////////////////////////////////////////////
    //                         OWNER FX                           //
    ////////////////////////////////////////////////////////////////

    // Setter for minAuctionIncrementMAX
    function setMinAuctionIncrementMAX(uint _minAuctionIncrementMAX) public onlyOwner {
        minAuctionIncrementMAX = _minAuctionIncrementMAX;
    }

    // Setter for minOrderDurationtMAX
    function setMinOrderDurationtMAX(uint _minOrderDurationtMAX) public onlyOwner {
        minOrderDurationtMAX = _minOrderDurationtMAX;
    }

    /// @dev `MADFactory` instance setter.
    /// @dev Function Signature := 0x612990fe
    function setFactory(FactoryVerifier _factory) public onlyOwner {
        assembly {
            if iszero(_factory) {
                mstore(0x00, 0xd92e233d)
                revert(0x1c, 0x04)
            }
            sstore(MADFactory.slot, _factory)
        }
        emit FactoryUpdated(_factory);
    }

    function setFees(uint256 _royaltyFee, uint256 _maxFee) public onlyOwner {
        require(_royaltyFee <= MAX_ROYALTY_FEE && _maxFee <= MAX_FEES, "Invalid Fees");

        assembly {
            sstore(royaltyFee.slot, _royaltyFee)
            sstore(maxFee.slot, _maxFee)
        }

        emit FeesUpdated(_royaltyFee, _maxFee);
    }

    /// @notice Marketplace config setter.
    /// @dev Function Signature := 0x0465c563
    /// @dev Time tracking criteria based on `blocktimestamp`.
    /// @param _minAuctionIncrement Min. time threshold for Auction extension.
    /// @param _minOrderDuration Min. order listing duration
    /// @param _minBidValue Min. value for a bid to be considered.
    /// @param _maxOrderDuration Max. order listing duration.
    function updateSettings(
        uint256 _minAuctionIncrement,
        uint256 _minOrderDuration,
        uint256 _minBidValue,
        uint256 _maxOrderDuration
    ) public onlyOwner {
        // minOrderDuration = _minOrderDuration;
        // minAuctionIncrement = _minAuctionIncrement;
        // minBidValue = _minBidValue;
        // maxOrderDuration = _maxOrderDuration;

        // C.3 & D.3 BlockHat Audit
        // Allow anything greater than 10 and less than the amount configured.
        require(
            (_minAuctionIncrement >= 10 &&
                _minOrderDuration >= 10 &&
                _minAuctionIncrement <= minAuctionIncrementMAX &&
                _minOrderDuration <= minOrderDurationtMAX &&
                _minBidValue > 0) && _maxOrderDuration >= _minOrderDuration,
            "Invalid Settings"
        );

        assembly {
            sstore(minOrderDuration.slot, _minOrderDuration)
            sstore(minAuctionIncrement.slot, _minAuctionIncrement)
            sstore(minBidValue.slot, _minBidValue)
            sstore(maxOrderDuration.slot, _maxOrderDuration)
        }

        emit AuctionSettingsUpdated(_minOrderDuration, _minAuctionIncrement, _minBidValue, _maxOrderDuration);
    }

    /// @notice Paused state initializer for security risk mitigation pratice.
    /// @dev Function Signature := 0x8456cb59
    function pause() public onlyOwner {
        _pause();
    }

    /// @notice Unpaused state initializer for security risk mitigation pratice.
    /// @dev Function Signature := 0x3f4ba83a
    function unpause() public onlyOwner {
        _unpause();
    }

    /// @notice Enables the contract's owner to change payment token address.
    /// @dev Function Signature := ?
    function _setPaymentToken(address _paymentTokenAddress) private {
        require(_paymentTokenAddress != address(0), "Invalid token address");
        erc20 = ERC20(_paymentTokenAddress);

        emit PaymentTokenUpdated(_paymentTokenAddress);
    }

    /// @notice Enables the contract's owner to change recipient address.
    /// @dev Function Signature := 0x3bbed4a0
    function setRecipient(address _recipient) public onlyOwner {
        require(_recipient != address(0), "Invalid recipient");

        // recipient = _recipient;
        assembly {
            sstore(recipient.slot, _recipient)
        }

        emit RecipientUpdated(_recipient);
    }

    /// @dev Function Signature := 0x3ccfd60b
    function withdraw() external onlyOwner {
        // C.5 & D.5 BlockHat audit - remove whenPaused
        uint withdrawAmount = address(this).balance;
        require(withdrawAmount - totalOutbid > 0, "No balance to withdraw");
        SafeTransferLib.safeTransferETH(msg.sender, withdrawAmount - totalOutbid);
    }

    function withdrawERC20() external onlyOwner {
        // C.2 & D.2 BlockHat audit - remove _token (It is immutable by design)
        // C.5 & D.5 BlockHat audit - remove whenPaused
        uint withdrawAmount = erc20.balanceOf(address(this));

        require(withdrawAmount - totalOutbid > 0, "No balance to withdraw");
        SafeTransferLib.safeTransfer(erc20, msg.sender, withdrawAmount - totalOutbid);
    }

    /// @dev when outbid (eth) the user must withdraw manually.
    function withdrawOutbidEth() external {
        uint256 amountOut = userOutbid[msg.sender];
        require(amountOut > 0, "nothing to withdraw");
        require(address(erc20) == address(0), "cannot withdraw eth");

        userOutbid[msg.sender] = 0;
        totalOutbid -= amountOut;

        emit WithdrawOutbid(msg.sender, address(0), amountOut); // amount withdrawn

        SafeTransferLib.safeTransferETH(msg.sender, amountOut);
    }

    function withdrawOutbid(ERC20 _token, uint256 minOut, uint160 priceLimit) external {
        _withdrawOutbid(_token, minOut, priceLimit);
    }

    function _withdrawOutbid(ERC20 _token, uint256 minOut, uint160 priceLimit) private {
        require(address(erc20) != address(0) && address(_token) != address(0), "not erc20");
        require(userOutbid[msg.sender] > 0, "nothing to withdraw");

        uint256 amountIn = userOutbid[msg.sender];
        userOutbid[msg.sender] = 0;
        totalOutbid -= amountIn;

        if (_token == erc20) {
            SafeTransferLib.safeTransfer(_token, msg.sender, amountIn);
            emit WithdrawOutbid(msg.sender, address(_token), amountIn); // amount withdrawn
            return;
        }

        // Note: To use this example, you should explicitly set slippage limits, omitting for simplicity
        // uint256 minOut = /* Calculate min output */ 0;
        // uint160 priceLimit = /* Calculate price limit */ 0;
        // Create the params that will be used to execute the swap

        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter.ExactInputSingleParams({
            tokenIn: address(erc20),
            tokenOut: address(_token),
            fee: feeTier,
            recipient: msg.sender,
            deadline: block.timestamp + 60, // 1 minute from now
            amountIn: amountIn,
            amountOutMinimum: minOut,
            sqrtPriceLimitX96: priceLimit
        });
        // The call to `exactInputSingle` executes the swap.
        uint256 amountOut = swapRouter.exactInputSingle(params);
        emit WithdrawOutbid(msg.sender, address(_token), amountOut); // amount withdrawn
    }

    /// @dev retrieve how much balance
    function getOutbidBalance() external view returns (uint256 balance) {
        balance = userOutbid[msg.sender];
    }

    ////////////////////////////////////////////////////////////////
    //                        INTERNAL FX                          //
    ////////////////////////////////////////////////////////////////

    function _exceedsMaxEP(uint256 _startPrice, uint256 _endPrice) internal pure {
        assembly {
            // ExceedsMaxEP()
            if iszero(iszero(or(eq(_startPrice, _endPrice), lt(_startPrice, _endPrice)))) {
                mstore(0x00, 0x70f8f33a)
                revert(0x1c, 0x04)
            }
        }
    }

    function _isBidderOrSeller(address _bidder, address _seller) internal view {
        assembly {
            // AccessDenied()
            if iszero(or(eq(caller(), _seller), eq(caller(), _bidder))) {
                mstore(0x00, 0x4ca88867)
                revert(0x1c, 0x04)
            }
        }
    }

    function _makeOrderChecks(uint256 _endTime, uint256 _startPrice) internal view {
        assembly {
            // NeedMoreTime()
            if iszero(
                iszero(
                    or(
                        or(eq(timestamp(), _endTime), lt(_endTime, timestamp())),
                        lt(sub(_endTime, timestamp()), sload(minOrderDuration.slot))
                    )
                )
            ) {
                mstore(0x00, 0x921dbfec)
                revert(0x1c, 0x04)
            }
            // Exceeds max time - NeedMoreTime()
            if iszero(lt(sub(_endTime, timestamp()), sload(maxOrderDuration.slot))) {
                mstore(0x00, 0x921dbfec)
                revert(0x1c, 0x04)
            }
            // WrongPrice()
            if iszero(_startPrice) {
                mstore(0x00, 0xf7760f25)
                revert(0x1c, 0x04)
            }
        }
    }

    function _cancelOrderChecks(address _seller, bool _isSold, uint256 _lastBidPrice) internal view {
        assembly {
            // AccessDenied()
            if iszero(eq(_seller, caller())) {
                mstore(0x00, 0x4ca88867)
                revert(0x1c, 0x04)
            }
            // SoldToken()
            if iszero(iszero(_isSold)) {
                mstore(0x00, 0xf88b07a3)
                revert(0x1c, 0x04)
            }
            // BidExists()
            if iszero(iszero(_lastBidPrice)) {
                mstore(0x00, 0x3e0827ab)
                revert(0x1c, 0x04)
            }
        }
    }

    function _bidChecks(
        uint8 _orderType,
        uint256 _endTime,
        address _seller,
        uint256 _lastBidPrice,
        uint256 _startPrice,
        uint256 _bidValue
    ) internal view {
        assembly {
            // EAOnly()
            if iszero(eq(_orderType, 2)) {
                mstore(0x00, 0xffc96cb0)
                revert(0x1c, 0x04)
            }
            // CanceledOrder()
            if iszero(_endTime) {
                mstore(0x00, 0xdf9428da)
                revert(0x1c, 0x04)
            }
            // Timeout()
            if gt(timestamp(), _endTime) {
                mstore(0x00, 0x2af0c7f8)
                revert(0x1c, 0x04)
            }
            // InvalidBidder()
            if eq(caller(), _seller) {
                mstore(0x00, 0x0863b103)
                revert(0x1c, 0x04)
            }
            // WrongPrice()
            switch iszero(_lastBidPrice)
            case 0 {
                if lt(_bidValue, add(_lastBidPrice, div(_lastBidPrice, sload(minBidValue.slot)))) {
                    mstore(0x00, 0xf7760f25)
                    revert(0x1c, 0x04)
                }
            }
            case 1 {
                if or(iszero(_bidValue), lt(_bidValue, _startPrice)) {
                    mstore(0x00, 0xf7760f25)
                    revert(0x1c, 0x04)
                }
            }
        }
    }

    function _buyChecks(uint256 _endTime, uint8 _orderType, bool _isSold) internal view {
        assembly {
            // CanceledOrder()
            if iszero(_endTime) {
                mstore(0x00, 0xdf9428da)
                revert(0x1c, 0x04)
            }
            // Timeout()
            if or(eq(timestamp(), _endTime), lt(_endTime, timestamp())) {
                mstore(0x00, 0x2af0c7f8)
                revert(0x1c, 0x04)
            }
            // NotBuyable()
            if eq(_orderType, 0x02) {
                mstore(0x00, 0x07ae5744)
                revert(0x1c, 0x04)
            }
            // SoldToken()
            if iszero(iszero(_isSold)) {
                mstore(0x00, 0xf88b07a3)
                revert(0x1c, 0x04)
            }
        }
    }

    function _claimChecks(bool _isSold, uint8 _orderType, uint256 _endTime) internal view {
        assembly {
            // SoldToken()
            if iszero(iszero(_isSold)) {
                mstore(0x00, 0xf88b07a3)
                revert(0x1c, 0x04)
            }
            // EAOnly()
            if iszero(eq(_orderType, 0x02)) {
                mstore(0x00, 0xffc96cb0)
                revert(0x1c, 0x04)
            }
            // NeedMoreTime()
            if or(eq(timestamp(), _endTime), lt(timestamp(), _endTime)) {
                mstore(0x00, 0x921dbfec)
                revert(0x1c, 0x04)
            }
        }
    }

    ////////////////////////////////////////////////////////////////
    //                   PUBLIC/EXTERNAL GETTERS                  //
    ////////////////////////////////////////////////////////////////

    /// @notice Everything in storage can be fetch through the
    /// getters natively provided by all public mappings.
    /// @dev This public getter serve as a hook to ease frontend
    /// fetching whilst estimating `orderIdBySeller` indexes by length.
    /// @dev Function Signature := 0x8aae982a
    function sellerOrderLength(address _seller) external view returns (uint256) {
        return orderIdBySeller[_seller].length;
    }
}
