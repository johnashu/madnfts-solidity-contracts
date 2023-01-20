// SPDX-License-Identifier: AGPL-3.0-only

pragma solidity 0.8.16;

import { ERC1155MinimalEventsAndErrors } from "../Base/interfaces/ERC1155EventAndErrors.sol";
import { ERC1155B as ERC1155, ERC1155TokenReceiver } from "../Base/ERC1155B.sol";
import { ERC2981 } from "../../common/ERC2981.sol";
import { ERC20 } from "../../ERC20.sol";
import { SplitterImpl } from "../../../splitter/SplitterImpl.sol";
import { Owned } from "../../../auth/Owned.sol";
import { SafeTransferLib } from "../../../utils/SafeTransferLib.sol";
import { FeeOracle } from "../../common/FeeOracle.sol";

contract ERC1155Minimal is
    ERC1155,
    ERC2981,
    ERC1155MinimalEventsAndErrors,
    ERC1155TokenReceiver,
    Owned
{
    ////////////////////////////////////////////////////////////////
    //                           STORAGE                          //
    ////////////////////////////////////////////////////////////////

    /// @notice Splitter address relationship.
    SplitterImpl public splitter;

    /// @notice ERC20 payment token address.
    ERC20 public erc20;

    /// @notice Public mint price.
    uint256 public price;

    /// @notice Token base URI string.
    string private _uri;
    
    /// @dev Is this minted, default := false
    bool private minted;
    
    /// @notice Public mint state default := false.
    bool public publicMintState;

    /// @notice Fee counter.
    uint256 public feeCount;

    ////////////////////////////////////////////////////////////////
    //                         CONSTRUCTOR                        //
    ////////////////////////////////////////////////////////////////

    constructor(
        string memory _tokenURI,
        uint256 _price,
        SplitterImpl _splitter,
        uint96 _fraction,
        address _router,
        ERC20 _erc20
    ) Owned(_router) {
        _uri = _tokenURI;
        price = _price;
        splitter = _splitter;
        _royaltyFee = _fraction;
        _royaltyRecipient = payable(splitter);
        erc20 = _erc20;

        emit RoyaltyFeeSet(_royaltyFee);
        emit RoyaltyRecipientSet(_royaltyRecipient);
    }

    ////////////////////////////////////////////////////////////////
    //                          OWNER FX                          //
    ////////////////////////////////////////////////////////////////

    function safeMint(
        address to,
        uint256 amount,
        address erc20Owner
    ) external payable onlyOwner {
        if (minted) revert AlreadyMinted();
        if (amount > 1) revert InvalidId();
        _paymentCheck(erc20Owner, 0);
        minted = true;
        _mint(to, 1, amount, "");
    }

    function burn(
        address to,
        uint256 amount,
        address erc20Owner
    ) external payable onlyOwner {
        _paymentCheck(erc20Owner, 1);
        _burn(to, 1, amount);
    }

    function setPublicMintState(bool _publicMintState)
        external
        onlyOwner
    {
        publicMintState = _publicMintState;

        emit PublicMintStateSet(publicMintState);
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

    function withdrawERC20(ERC20 _token, address recipient) external onlyOwner {
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
    //                           USER FX                          //
    ////////////////////////////////////////////////////////////////

    function publicMint(uint256 balance) external payable {
        if (!publicMintState) revert PublicMintOff();
        uint256 value = _getPriceValue(msg.sender);
        uint256 fee = _getFeeValue(0x40d097c3);
        if (value != price + fee) revert WrongPrice();
        if (minted) revert AlreadyMinted();
        
        _paymentCheck(msg.sender, 2);
        minted = true;
        feeCount += fee;
        _mint(msg.sender, 1, balance, "");
    }

    ////////////////////////////////////////////////////////////////
    //                           VIEW FX                          //
    ////////////////////////////////////////////////////////////////

    function uri(uint256 id)
        public
        view
        virtual
        override
        returns (string memory)
    {
        if (id != 1) revert InvalidId();
        if (!minted) revert NotMinted();
        return _uri;
    }

    ////////////////////////////////////////////////////////////////
    //                     INTERNAL FUNCTIONS                     //
    ////////////////////////////////////////////////////////////////

    /// @dev Checks if mint / burn fees are paid
    /// @dev If non router deploy we check msg.value if !erc20 OR checks erc20 approval and transfers
    /// @dev If router deploy we check msg.value if !erc20 BUT checks erc20 approval and transfers are via the router
    /// @param _erc20Owner Non router deploy =msg.sender; Router deploy =payer.address (msg.sender = router.address)
    /// @param _type Passed to _feeCheck to determin the fee 0=mint; 1=burn; ELSE _feeCheck is ignored
    function _paymentCheck(address _erc20Owner, uint8 _type)
        internal
    {
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

    function _feeCheck(bytes4 _method, uint256 _value)
        internal
        view
    {
        uint256 _fee = _getFeeValue(_method);
        assembly {
            if iszero(eq(_value, _fee)) {
                mstore(0x00, 0xf7760f25)
                revert(0x1c, 0x04)
            }
        }
    }

    function _getPriceValue(address _erc20Owner)
        internal
        view
        returns (uint256 value)
    {
        value = 
            (address(erc20) != address(0))
                ? erc20.allowance(_erc20Owner, address(this))
                : msg.value;
    }

    function _getFeeValue(bytes4 _method)
        internal
        view
        returns (uint256 value)
    {
        address _owner = owner;
        uint32 _size;
        assembly {
            _size := extcodesize(_owner)
        }
        value = _size == 0 ? 0 : FeeOracle(owner).feeLookup(_method);
    }

    ////////////////////////////////////////////////////////////////
    //                      REQUIRED OVERRIDES                    //
    ////////////////////////////////////////////////////////////////

    function supportsInterface(bytes4 interfaceId)
        public
        pure
        virtual
        override(ERC2981)
        returns (bool)
    {
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
