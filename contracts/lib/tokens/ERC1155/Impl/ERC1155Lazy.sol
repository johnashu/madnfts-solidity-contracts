// SPDX-License-Identifier: AGPL-3.0-only

pragma solidity 0.8.16;

import { ERC1155LazyEventsAndErrors } from "../Base/interfaces/ERC1155EventAndErrors.sol";
import { ERC1155B as ERC1155, ERC1155TokenReceiver } from "../Base/ERC1155B.sol";
import { ERC2981 } from "../../common/ERC2981.sol";
import { ERC20 } from "../../ERC20.sol";
import { ReentrancyGuard } from "../../../security/ReentrancyGuard.sol";
import { SplitterImpl } from "../../../splitter/SplitterImpl.sol";
import { Counters } from "../../../utils/Counters.sol";
import { Strings } from "../../../utils/Strings.sol";
import { Owned } from "../../../auth/Owned.sol";
import { SafeTransferLib } from "../../../utils/SafeTransferLib.sol";
import { Types } from "../../../../Types.sol";
import { FeeOracle } from "../../common/FeeOracle.sol";

contract ERC1155Lazy is
    ERC1155,
    ERC2981,
    ERC1155LazyEventsAndErrors,
    ERC1155TokenReceiver,
    Owned,
    ReentrancyGuard
{
    using Counters for Counters.Counter;
    using Strings for uint256;
    using Types for Types.Voucher;
    using Types for Types.UserBatch;

    ////////////////////////////////////////////////////////////////
    //                           STORAGE                          //
    ////////////////////////////////////////////////////////////////

    uint256 internal immutable _CHAIN_ID_OG;

    bytes32 internal immutable _DOMAIN_SEPARATOR_OG;

    bytes32 private constant _DOMAIN_TYPEHASH =
        keccak256(
            "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
        );

    bytes32 private constant _VOUCHER_TYPEHASH =
        keccak256(
            "Voucher(bytes32 voucherId,address[] users,uint256[] balances,uint256 amount,uint256 price)"
        );

    bytes32 private constant _USERBATCH_TYPEHASH =
        keccak256(
            "UserBatch(bytes32 voucherId,uint256[] ids,uint256[] balances,uint256 price,address user)"
        );

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

    /// @notice Token base URI string.
    string private _uri;

    /// @notice Lock the URI default := false.
    bool public URILock;

    /// @notice The signer address used for lazy minting voucher validation.
    address public signer;

    /// @notice Mapping for used vouchers.
    mapping(bytes32 => bool) public usedVouchers;

    ////////////////////////////////////////////////////////////////
    //                         CONSTRUCTOR                        //
    ////////////////////////////////////////////////////////////////

    constructor(
        string memory __uri,
        SplitterImpl _splitter,
        uint96 _fraction,
        address _router,
        address _signer,
        ERC20 _erc20
    ) Owned(_router) {
        _CHAIN_ID_OG = block.chainid;
        _DOMAIN_SEPARATOR_OG = computeDS();
        signer = _signer;
        _uri = __uri;
        splitter = _splitter;
        erc20 = _erc20;

        _royaltyFee = _fraction;
        _royaltyRecipient = payable(splitter);

        emit SignerUpdated(_signer);
        emit RoyaltyFeeSet(_royaltyFee);
        emit RoyaltyRecipientSet(_royaltyRecipient);
    }

    ////////////////////////////////////////////////////////////////
    //                        LAZY MINT                           //
    ////////////////////////////////////////////////////////////////

    /// @notice This method enables offchain ledgering of tokens to establish onchain provenance as
    /// long as a trusted signer can be retrieved as the validator of such contract state update.
    /// @dev Neither `totalSupply` nor `price` accountings for any of the possible mint
    /// types(e.g., public, free/gifted, toCreator) need to be recorded by the contract;
    /// since its condition checking control flow takes place in offchain databases.
    function lazyMint(
        Types.Voucher calldata voucher,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external payable nonReentrant {
        address _signer = _verifyVoucher(voucher, v, r, s);
        uint256 value = _getPriceValue(msg.sender);

        _voucherCheck(_signer, voucher, value);

        if (address(erc20) != address(0)) {
            SafeTransferLib.safeTransferFrom(
                erc20,
                msg.sender,
                address(this),
                value
            );
        }

        usedVouchers[voucher.voucherId] = true;
        uint256 len = voucher.users.length;
        uint256 i;
        for (i; i < len; ) {
            _userMint(
                voucher.amount,
                voucher.balances,
                voucher.users[i]
            );
            // can't overflow due to have been previously validated by signer
            unchecked {
                ++i;
            }
        }
    }

    /// @notice `_batchMint` version of `lazyMint`.
    function lazyMintBatch(
        Types.UserBatch calldata userBatch,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external payable nonReentrant {
        address _signer = _verifyBatch(userBatch, v, r, s);
        uint256 value = _getPriceValue(msg.sender);

        _batchCheck(_signer, userBatch, value);

        if (address(erc20) != address(0)) {
            SafeTransferLib.safeTransferFrom(
                erc20,
                msg.sender,
                address(this),
                value
            );
        }

        usedVouchers[userBatch.voucherId] = true;
        uint256 len = userBatch.ids.length;
        uint256 i;
        require(
            len == userBatch.balances.length,
            "INVALID_AMOUNT"
        );

        for (i; i < len; ) {
            _incrementCounter(userBatch.balances[i]);
            // can't overflow due to have been previously validated by signer
            unchecked {
                ++i;
            }
        }
        _batchMint(
            userBatch.user,
            userBatch.ids,
            userBatch.balances,
            ""
        );
    }

    ////////////////////////////////////////////////////////////////
    //                         OWNER FX                           //
    ////////////////////////////////////////////////////////////////

    function setSigner(address _signer) public onlyOwner {
        signer = _signer;

        emit SignerUpdated(_signer);
    }

    function setURI(string memory __uri) external onlyOwner {
        if (URILock == true) revert UriLocked();
        _uri = __uri;

        emit BaseURISet(__uri);
    }

    function setURILock() external onlyOwner {
        URILock = true;
        emit BaseURILocked(_uri);
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
        require(
            len == balances.length && len == from.length,
            "INVALID_AMOUNT"
        );
        // for (uint256 i = 0; i < ids.length; i++) {
        for (i; i < len; ) {
            // delId();
            liveSupply.decrement(balances[i]);
            _burn(from[i], ids[i], balances[i]);
            unchecked {
                ++i;
            }
        }
        assembly {
            if lt(i, len) {
                mstore(0x00, "LOOP_OVERFLOW")
                revert(0x00, 0x20)
            }
        }
        // Transfer events emited by parent ERC1155 contract
    }

    function burnBatch(
        address from,
        uint256[] memory ids,
        uint256[] memory balances,
        address erc20Owner
    ) external payable onlyOwner {
        _paymentCheck(erc20Owner, 1);

        uint256 i;
        uint256 len = ids.length;
        require(len == balances.length, "INVALID_AMOUNT");
        for (i; i < len; ) {
            // delId();
            liveSupply.decrement(balances[i]);
            unchecked {
                ++i;
            }
        }
        assembly {
            if lt(i, len) {
                mstore(0x00, "LOOP_OVERFLOW")
                revert(0x00, 0x20)
            }
        }
        _batchBurn(from, ids, balances);
        // Transfer event emited by parent ERC1155 contract
    }

    function withdraw(address recipient) external onlyOwner {
        uint256 len = splitter.payeesLength();
        address[] memory addrs = new address[](len);
        uint256[] memory values = new uint256[](len);
        uint256 _val;
        if (feeCount > 0 && recipient != address(0)) {
            _val = address(this).balance - feeCount;
            SafeTransferLib.safeTransferETH(
                payable(recipient),
                feeCount
            );
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
            SafeTransferLib.safeTransferETH(
                addrs[j],
                values[j]
            );
            unchecked {
                ++j;
            }
        }
    }

    function withdrawERC20(
        ERC20 _token,
        address recipient
    ) external onlyOwner {
        uint256 len = splitter.payeesLength();
        address[] memory addrs = new address[](len);
        uint256[] memory values = new uint256[](len);
        // Transfer mint fees
        uint256 _val;
        if (feeCount > 0 && recipient != address(0)) {
            _val = _token.balanceOf(address(this)) - feeCount;
            SafeTransferLib.safeTransfer(
                _token,
                recipient,
                feeCount
            );
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
            SafeTransferLib.safeTransfer(
                _token,
                addrs[j],
                values[j]
            );
            unchecked {
                ++j;
            }
        }
    }

    ////////////////////////////////////////////////////////////////
    //                          HELPER FX                         //
    ////////////////////////////////////////////////////////////////

    function _incrementCounter(
        uint256 amount
    ) private returns (uint256) {
        liveSupply.increment(amount);
        mintCount += amount;
        return mintCount;
    }

    function _voucherCheck(
        address _signer,
        Types.Voucher calldata voucher,
        uint256 _value
    ) private {
        if (_signer != signer) revert InvalidSigner();
        if (usedVouchers[voucher.voucherId])
            revert UsedVoucher();
        uint256 _fee = _getFeeValue(0x40d097c3);
        if (
            _fee > _value ||
            (_value - _fee !=
                (voucher.price *
                    voucher.amount *
                    voucher.users.length))
        ) revert WrongPrice();
        feeCount += _fee;
    }

    function _batchCheck(
        address _signer,
        Types.UserBatch calldata userBatch,
        uint256 _value
    ) private {
        if (_signer != signer) revert InvalidSigner();
        if (usedVouchers[userBatch.voucherId])
            revert UsedVoucher();
        uint256 _fee = _getFeeValue(0x40d097c3);
        if (
            _value !=
            _fee + (userBatch.price * userBatch.ids.length)
        ) revert WrongPrice();
        feeCount += _fee;
    }

    function _verifyVoucher(
        Types.Voucher calldata _voucher,
        // bytes calldata _sig
        uint8 v,
        bytes32 r,
        bytes32 s
    ) internal view returns (address recovered) {
        unchecked {
            recovered = ecrecover(
                keccak256(
                    abi.encodePacked(
                        "\x19\x01",
                        DOMAIN_SEPARATOR(),
                        keccak256(
                            abi.encode(
                                _VOUCHER_TYPEHASH,
                                _voucher.voucherId,
                                keccak256(
                                    abi.encodePacked(
                                        _voucher.users
                                    )
                                ),
                                keccak256(
                                    abi.encodePacked(
                                        _voucher.balances
                                    )
                                ),
                                _voucher.amount,
                                _voucher.price
                            )
                        )
                    )
                ),
                v,
                r,
                s
            );
        }
    }

    function _verifyBatch(
        Types.UserBatch calldata _userBatch,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) internal view returns (address recovered) {
        unchecked {
            recovered = ecrecover(
                keccak256(
                    abi.encodePacked(
                        "\x19\x01",
                        DOMAIN_SEPARATOR(),
                        keccak256(
                            abi.encode(
                                _USERBATCH_TYPEHASH,
                                _userBatch.voucherId,
                                keccak256(
                                    abi.encodePacked(
                                        _userBatch.ids
                                    )
                                ),
                                keccak256(
                                    abi.encodePacked(
                                        _userBatch.balances
                                    )
                                ),
                                _userBatch.price,
                                _userBatch.user
                            )
                        )
                    )
                ),
                v,
                r,
                s
            );
        }
    }

    function computeDS() internal view returns (bytes32) {
        return
            keccak256(
                abi.encode(
                    _DOMAIN_TYPEHASH,
                    keccak256(bytes("MAD")),
                    keccak256("1"),
                    block.chainid,
                    address(this)
                )
            );
    }

    function _userMint(
        uint256 _amount,
        uint256[] memory _balances,
        address _key
    ) internal {
        require(
            _balances.length == _amount,
            "INVALID_AMOUNT"
        );
        uint256 j;
        while (j < _amount) {
            _mint(
                _key,
                _incrementCounter(_balances[j]),
                _balances[j],
                ""
            );
            // can't overflow due to have been previously validated by signer
            unchecked {
                ++j;
            }
        }
    }

    ////////////////////////////////////////////////////////////////
    //                           VIEW FX                          //
    ////////////////////////////////////////////////////////////////

    function getURI() external view returns (string memory) {
        return _uri;
    }

    function uri(
        uint256 id
    ) public view virtual override returns (string memory) {
        if (id > mintCount) revert NotMintedYet();
        return
            string(
                abi.encodePacked(
                    _uri,
                    Strings.toString(id),
                    ".json"
                )
            );
    }

    function totalSupply() public view returns (uint256) {
        return liveSupply.current();
    }

    function getMintCount() public view returns (uint256) {
        return mintCount;
    }

    function DOMAIN_SEPARATOR()
        public
        view
        returns (bytes32)
    {
        return
            block.chainid == _CHAIN_ID_OG
                ? _DOMAIN_SEPARATOR_OG
                : computeDS();
    }

    ////////////////////////////////////////////////////////////////
    //                     INTERNAL FUNCTIONS                     //
    ////////////////////////////////////////////////////////////////

    /// @dev Checks if mint / burn fees are paid
    /// @dev If non router deploy we check msg.value if !erc20 OR checks erc20 approval and transfers
    /// @dev If router deploy we check msg.value if !erc20 BUT checks erc20 approval and transfers are via the router
    /// @param _erc20Owner Non router deploy =msg.sender; Router deploy =payer.address (msg.sender = router.address)
    /// @param _type Passed to _feeCheck to determin the fee 0=mint; 1=burn; ELSE _feeCheck is ignored
    function _paymentCheck(
        address _erc20Owner,
        uint8 _type
    ) internal {
        uint256 value = _getPriceValue(_erc20Owner);

        // Check fees are paid
        // ERC20 fees for router calls are checked and transfered via in the router
        if (
            address(msg.sender) == address(_erc20Owner) ||
            (address(erc20) == address(0))
        ) {
            if (_type == 0) {
                _feeCheck(0x40d097c3, value);
            } else if (_type == 1) {
                _feeCheck(0x44df8e70, value);
            }
            if (address(erc20) != address(0)) {
                SafeTransferLib.safeTransferFrom(
                    erc20,
                    _erc20Owner,
                    address(this),
                    value
                );
            }
        }
    }

    function _feeCheck(
        bytes4 _method,
        uint256 _value
    ) internal view {
        uint256 _fee = _getFeeValue(_method);
        assembly {
            if iszero(eq(_value, _fee)) {
                mstore(0x00, 0xf7760f25)
                revert(0x1c, 0x04)
            }
        }
    }

    function _getPriceValue(
        address _erc20Owner
    ) internal view returns (uint256 value) {
        value = (address(erc20) != address(0))
            ? erc20.allowance(_erc20Owner, address(this))
            : msg.value;
    }

    function _getFeeValue(
        bytes4 _method
    ) internal view returns (uint256 value) {
        address _owner = owner;
        uint32 _size;
        assembly {
            _size := extcodesize(_owner)
        }
        value = _size == 0
            ? 0
            : FeeOracle(owner).feeLookup(_method);
    }

    ////////////////////////////////////////////////////////////////
    //                     REQUIRED OVERRIDES                     //
    ////////////////////////////////////////////////////////////////

    function supportsInterface(
        bytes4 interfaceId
    ) public pure virtual override(ERC2981) returns (bool) {
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
