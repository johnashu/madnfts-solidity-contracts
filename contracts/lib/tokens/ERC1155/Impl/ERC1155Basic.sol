// SPDX-License-Identifier: AGPL-3.0-only

pragma solidity 0.8.19;

import { ERC1155BasicEventsAndErrors } from "contracts/lib/tokens/ERC1155/Base/interfaces/ERC1155EventAndErrors.sol";
import { ERC1155B as ERC1155, ERC1155TokenReceiver } from "contracts/lib/tokens/ERC1155/Base/ERC1155B.sol";
import { ERC2981 } from "contracts/lib/tokens/common/ERC2981.sol";
import { ERC20 } from "contracts/lib/tokens/ERC20.sol";
import { Owned } from "contracts/lib/auth/Owned.sol";
import { ReentrancyGuard } from "contracts/lib/security/ReentrancyGuard.sol";
import { SplitterImpl } from "contracts/lib/splitter/SplitterImpl.sol";
import { Counters } from "contracts/lib/utils/Counters.sol";
import { Strings } from "contracts/lib/utils/Strings.sol";
import { SafeTransferLib } from "contracts/lib/utils/SafeTransferLib.sol";
import { FeeOracle } from "contracts/lib/tokens/common/FeeOracle.sol";

contract ERC1155Basic is ERC1155, ERC2981, ERC1155BasicEventsAndErrors, ERC1155TokenReceiver, Owned, ReentrancyGuard {
    using Counters for Counters.Counter;
    using Strings for uint256;

    ////////////////////////////////////////////////////////////////
    //                           STORAGE                          //
    ////////////////////////////////////////////////////////////////

    /// @notice Splitter address relationship.
    SplitterImpl public splitter;

    /// @notice ERC20 payment token address.
    ERC20 public erc20;

    /// @notice Live supply counter, excludes burned tokens.
    Counters.Counter private liveSupply;

    /// @notice Mint counter, includes burnt count.
    uint256 private mintCount;

    /// @notice Fee counter.
    uint256 public feeCount;

    /// @notice Lock the URI default := false.
    bool public URILock;

    /// @notice Token base URI string.
    string private _uri;

    /// @notice Public mint price.
    uint256 public price;

    /// @notice Capped max supply.
    uint256 public maxSupply;

    /// @notice Public mint state default := false.
    bool public publicMintState;

    ////////////////////////////////////////////////////////////////
    //                          MODIFIERS                         //
    ////////////////////////////////////////////////////////////////

    modifier publicMintAccess() {
        if (!publicMintState) revert PublicMintClosed();
        _;
    }

    modifier publicMintPriceCheck(uint256 _price, uint256 _amount) {
        uint256 _fee = _getFeeValue(0x40d097c3);
        feeCount += _fee;
        uint256 value = _getPriceValue(msg.sender);
        if ((_price * _amount) + _fee != value) revert WrongPrice();
        _;
    }

    modifier hasReachedMax(uint256 amount) {
        if (mintCount + amount > maxSupply) revert MaxSupplyReached();
        _;
    }

    ////////////////////////////////////////////////////////////////
    //                         CONSTRUCTOR                        //
    ////////////////////////////////////////////////////////////////

    constructor(
        string memory __uri,
        uint256 _price,
        uint256 _maxSupply,
        SplitterImpl _splitter,
        uint96 _fraction,
        address _router,
        ERC20 _erc20
    ) Owned(_router) {
        _uri = __uri;
        price = _price;
        maxSupply = _maxSupply;
        splitter = _splitter;
        _royaltyFee = _fraction;
        _royaltyRecipient = payable(splitter);
        erc20 = _erc20;

        emit RoyaltyFeeSet(_royaltyFee);
        emit RoyaltyRecipientSet(_royaltyRecipient);
    }

    ////////////////////////////////////////////////////////////////
    //                         OWNER FX                           //
    ////////////////////////////////////////////////////////////////

    function setURI(string memory __uri) external onlyOwner {
        if (URILock == true) revert UriLocked();
        _uri = __uri;

        emit BaseURISet(__uri);
    }

    function setURILock() external onlyOwner {
        URILock = true;
        emit BaseURILocked(_uri);
    }

    function setPublicMintState(bool _publicMintState) external onlyOwner {
        publicMintState = _publicMintState;

        emit PublicMintStateSet(_publicMintState);
    }

    ////////////////////////////////////////////////////////////////
    //                       OWNER MINTING                        //
    ////////////////////////////////////////////////////////////////

    function mintTo(
        address to,
        uint256 amount,
        uint256[] memory balance,
        address erc20Owner
    ) external payable onlyOwner hasReachedMax(_sumAmounts(balance) * amount) {
        _paymentCheck(erc20Owner, 0);
        uint256 i;
        // for (uint256 i = 0; i < amount; i++) {
        for (i; i < amount; ) {
            _mint(to, _incrementCounter(1), balance[i], "");
            unchecked {
                ++i;
            }
        }

        assembly {
            if lt(i, amount) {
                // LoopOverflow()
                mstore(0x00, 0xdfb035c9)
                revert(0x1c, 0x04)
            }
        }
        // Transfer event emited by parent ERC1155 contract
    }

    function mintBatchTo(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        address erc20Owner
    ) external payable onlyOwner hasReachedMax(_sumAmounts(amounts)) {
        _paymentCheck(erc20Owner, 0);
        uint256 i;
        uint256 len = ids.length;
        for (i; i < len; ) {
            liveSupply.increment(amounts[i]);
            unchecked {
                ++i;
            }
        }
        assembly {
            if lt(i, len) {
                mstore(0x00, 0xdfb035c9)
                revert(0x1c, 0x04)
            }
        }
        _batchMint(to, ids, amounts, "");
        // Transfer event emited by parent ERC1155 contract
    }

    function burn(
        address[] memory from,
        uint256[] memory ids,
        uint256[] memory balances,
        address erc20Owner
    ) external payable onlyOwner {
        _paymentCheck(erc20Owner, 1);
        uint256 i;
        uint256 len = ids.length;
        require(from.length == ids.length && ids.length == balances.length, "LENGTH_MISMATCH");
        for (i; i < len; ) {
            liveSupply.decrement(balances[i]);
            _burn(from[i], ids[i], balances[i]);
            unchecked {
                ++i;
            }
        }
        assembly {
            if lt(i, len) {
                mstore(0x00, 0xdfb035c9)
                revert(0x1c, 0x04)
            }
        }
        // Transfer events emited by parent ERC1155 contract
    }

    function burnBatch(
        address from,
        uint256[] memory ids,
        uint256[] memory amounts,
        address erc20Owner
    ) external payable onlyOwner {
        require(ids.length == amounts.length, "LENGTH_MISMATCH");
        _paymentCheck(erc20Owner, 1);
        uint256 i;
        uint256 len = ids.length;
        for (i; i < len; ) {
            liveSupply.decrement(amounts[i]);
            unchecked {
                ++i;
            }
        }
        assembly {
            if lt(i, len) {
                mstore(0x00, 0xdfb035c9)
                revert(0x1c, 0x04)
            }
        }
        _batchBurn(from, ids, amounts);
        // Transfer event emited by parent ERC1155 contract
    }

    function withdraw(address recipient) external onlyOwner {
        uint256 len = splitter.payeesLength();
        address[] memory addrs = new address[](len);
        uint256[] memory values = new uint256[](len);
        uint256 _val;
        if (feeCount > 0 && recipient != address(0)) {
            _val = address(this).balance - feeCount;
            SafeTransferLib.safeTransferETH(payable(recipient), feeCount);
            feeCount = 0;
        } else {
            _val = address(this).balance;
        }
        uint256 i;
        for (i; i < len; ) {
            address addr = splitter._payees(i);
            uint256 share = splitter._shares(addr);
            addrs[i] = addr;
            values[i] = ((_val * (share * 1e2)) / 10_000);
            unchecked {
                ++i;
            }
        }
        uint256 j;
        while (j < len) {
            SafeTransferLib.safeTransferETH(addrs[j], values[j]);
            unchecked {
                ++j;
            }
        }
    }

    function withdrawERC20(ERC20 _token, address recipient) external onlyOwner {
        uint256 len = splitter.payeesLength();
        address[] memory addrs = new address[](len);
        uint256[] memory values = new uint256[](len);
        // Transfer mint fees
        uint256 _val;
        if (feeCount > 0 && recipient != address(0)) {
            _val = _token.balanceOf(address(this)) - feeCount;
            SafeTransferLib.safeTransfer(_token, recipient, feeCount);
            feeCount = 0;
        } else {
            _val = _token.balanceOf(address(this));
        }
        // Transfer splitter funds to shareholders
        uint256 i;
        for (i; i < len; ) {
            address addr = splitter._payees(i);
            uint256 share = splitter._shares(addr);
            addrs[i] = addr;
            values[i] = ((_val * (share * 1e2)) / 10_000);
            unchecked {
                ++i;
            }
        }
        uint256 j;
        while (j < len) {
            SafeTransferLib.safeTransfer(_token, addrs[j], values[j]);
            unchecked {
                ++j;
            }
        }
    }

    ////////////////////////////////////////////////////////////////
    //                          PUBLIC FX                         //
    ////////////////////////////////////////////////////////////////

    function mint(
        uint256 amount,
        uint256 balance
    )
        external
        payable
        nonReentrant
        publicMintAccess
        hasReachedMax(amount * balance)
        publicMintPriceCheck(price, amount)
    {
        _paymentCheck(msg.sender, 2);
        uint256 i;
        for (i; i < amount; ) {
            _mint(msg.sender, _incrementCounter(1), balance, "");
            unchecked {
                ++i;
            }
        }
        // assembly overflow check
        assembly {
            if lt(i, amount) {
                mstore(0x00, 0xdfb035c9)
                revert(0x1c, 0x04)
            }
        }
        // Transfer events emited by parent ERC1155 contract
    }

    function mintBatch(
        uint256[] memory ids,
        uint256[] memory amounts
    )
        external
        payable
        nonReentrant
        publicMintAccess
        hasReachedMax(_sumAmounts(amounts))
        publicMintPriceCheck(price, ids.length)
    {
        require(ids.length == amounts.length, "MISMATCH_LENGTH");
        uint256 value = _getPriceValue(msg.sender);
        uint256 len = ids.length;
        if (address(erc20) != address(0)) {
            SafeTransferLib.safeTransferFrom(erc20, msg.sender, address(this), value);
        }
        uint256 i;
        for (i; i < len; ) {
            _incrementCounter(amounts[i]);
            unchecked {
                ++i;
            }
        }
        assembly {
            if lt(i, len) {
                mstore(0x00, 0xdfb035c9)
                revert(0x1c, 0x04)
            }
        }
        _batchMint(msg.sender, ids, amounts, "");
        // Transfer event emited by parent ERC1155 contract
    }

    ////////////////////////////////////////////////////////////////
    //                          HELPER FX                         //
    ////////////////////////////////////////////////////////////////

    function _incrementCounter(uint256 amount) private returns (uint256) {
        liveSupply.increment(amount);
        mintCount += amount;
        return mintCount;
    }

    function _sumAmounts(uint256[] memory amounts) private pure returns (uint256 _result) {
        uint256 len = amounts.length;
        uint256 i;
        for (i; i < len; ) {
            _result += amounts[i];
            unchecked {
                ++i;
            }
        }
    }

    ////////////////////////////////////////////////////////////////
    //                           VIEW FX                          //
    ////////////////////////////////////////////////////////////////

    function getURI() external view returns (string memory) {
        return _uri;
    }

    function uri(uint256 id) public view virtual override returns (string memory) {
        if (id > mintCount) {
            // revert("NotMintedYet");
            assembly {
                mstore(0x00, 0xbad086ea)
                revert(0x1c, 0x04)
            }
        }
        return string(abi.encodePacked(_uri, Strings.toString(id), ".json"));
    }

    function totalSupply() public view returns (uint256) {
        return liveSupply.current();
    }

    function getMintCount() public view returns (uint256) {
        return mintCount;
    }

    ////////////////////////////////////////////////////////////////
    //                     INTERNAL FUNCTIONS                     //
    ////////////////////////////////////////////////////////////////

    /// @dev Checks if mint / burn fees are paid
    /// @dev If non router deploy we check msg.value if !erc20 OR checks erc20 approval and transfers
    /// @dev If router deploy we check msg.value if !erc20 BUT checks erc20 approval and transfers are via the router
    /// @param _erc20Owner Non router deploy =msg.sender; Router deploy =payer.address (msg.sender = router.address)
    /// @param _type Passed to _feeCheck to determin the fee 0=mint; 1=burn; ELSE _feeCheck is ignored
    function _paymentCheck(address _erc20Owner, uint8 _type) internal {
        uint256 value = _getPriceValue(_erc20Owner);

        // Check fees are paid
        // ERC20 fees for router calls are checked and transfered via in the router
        if (address(msg.sender) == address(_erc20Owner) || (address(erc20) == address(0))) {
            if (_type == 0) {
                _feeCheck(0x40d097c3, value);
            } else if (_type == 1) {
                _feeCheck(0x44df8e70, value);
            }
            if (address(erc20) != address(0)) {
                SafeTransferLib.safeTransferFrom(erc20, _erc20Owner, address(this), value);
            }
        }
    }

    function _feeCheck(bytes4 _method, uint256 _value) internal view {
        uint256 _fee = _getFeeValue(_method);
        assembly {
            if iszero(eq(_value, _fee)) {
                mstore(0x00, 0xf7760f25)
                revert(0x1c, 0x04)
            }
        }
    }

    function _getPriceValue(address _erc20Owner) internal view returns (uint256 value) {
        value = (address(erc20) != address(0)) ? erc20.allowance(_erc20Owner, address(this)) : msg.value;
    }

    function _getFeeValue(bytes4 _method) internal view returns (uint256 value) {
        address _owner = owner;
        uint32 _size;
        assembly {
            _size := extcodesize(_owner)
        }
        value = _size == 0 ? 0 : FeeOracle(owner).feeLookup(_method);
    }

    ////////////////////////////////////////////////////////////////
    //                     REQUIRED OVERRIDES                     //
    ////////////////////////////////////////////////////////////////

    function supportsInterface(bytes4 interfaceId) public pure virtual override(ERC2981) returns (bool) {
        return
            // ERC165 Interface ID for ERC165
            interfaceId == 0x01ffc9a7 ||
            // ERC165 Interface ID for ERC1155
            interfaceId == 0xd9b67a26 ||
            // ERC165 Interface ID for ERC1155MetadataURI
            interfaceId == 0x0e89341c ||
            // ERC165 Interface ID for ERC2981
            interfaceId == 0x2a55205a;
    }
}
