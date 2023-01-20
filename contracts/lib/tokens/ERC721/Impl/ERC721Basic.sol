// SPDX-License-Identifier: AGPL-3.0-only

pragma solidity 0.8.16;

import { ERC721BasicEventsAndErrors } from "../Base/interfaces/ERC721EventAndErrors.sol";
import { ERC721, ERC721TokenReceiver } from "../Base/ERC721.sol";
import { ERC2981 } from "../../common/ERC2981.sol";
import { ERC20 } from "../../ERC20.sol";
import { Owned } from "../../../auth/Owned.sol";
import { ReentrancyGuard } from "../../../security/ReentrancyGuard.sol";
import { SplitterImpl } from "../../../splitter/SplitterImpl.sol";
import { Counters } from "../../../utils/Counters.sol";
import { Strings } from "../../../utils/Strings.sol";
import { SafeTransferLib } from "../../../utils/SafeTransferLib.sol";
import { FeeOracle } from "../../common/FeeOracle.sol";

contract ERC721Basic is
    ERC721,
    ERC2981,
    ERC721BasicEventsAndErrors,
    ERC721TokenReceiver,
    Owned,
    ReentrancyGuard
{
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

    /// @notice Token base URI string.
    string private baseURI;

    /// @notice Lock the URI default := false.
    bool public baseURILock; 

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
        address _owner = owner;
        uint32 _size;
        uint256 _fee = 0; 
        assembly {
            _size := extcodesize(_owner)
        }
        if (_size > 0) {
            _fee = FeeOracle(owner).feeLookup(0x40d097c3);
            feeCount += _fee;
        }
        uint256 value = (address(erc20) != address(0))
            ? erc20.allowance(msg.sender, address(this))
            : msg.value;
        if ((_price * _amount) + _fee != value) revert WrongPrice();
        _;
    }

    modifier hasReachedMax(uint256 amount) {
        if (mintCount + amount > maxSupply)
            revert MaxSupplyReached();
        _;
    }

    ////////////////////////////////////////////////////////////////
    //                         CONSTRUCTOR                        //
    ////////////////////////////////////////////////////////////////

    constructor(
        string memory _name,
        string memory _symbol,
        string memory _baseURI,
        uint256 _price,
        uint256 _maxSupply,
        SplitterImpl _splitter,
        uint96 _fraction,
        address _router,
        ERC20 _erc20
    ) ERC721(_name, _symbol) Owned(_router) {
        baseURI = _baseURI;
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

    function setBaseURI(string memory _baseURI)
        external
        onlyOwner
    {
        if (baseURILock == true) revert UriLocked();
        baseURI = _baseURI;
        emit BaseURISet(_baseURI);
    }

    function setBaseURILock()
        external
        onlyOwner
    {
        baseURILock = true;
        emit BaseURILocked(baseURI);
    }

    function setPublicMintState(bool _publicMintState)
        external
        onlyOwner
    {
        publicMintState = _publicMintState;

        emit PublicMintStateSet(_publicMintState);
    }
    
    ////////////////////////////////////////////////////////////////
    //                       OWNER MINTING                        //
    ////////////////////////////////////////////////////////////////

    function mintTo(
        address to,
        uint256 amount,
        address erc20Owner
    ) external payable onlyOwner hasReachedMax(amount) {
        _paymentCheck(erc20Owner, 0);
        uint256 i;
        // for (uint256 i = 0; i < amount; i++) {
        for (i; i < amount; ) {
            _safeMint(to, _incrementCounter());
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
        // Transfer event emited by parent ERC721 contract
    }

    function burn(uint256[] memory ids, address erc20Owner)
        external
        payable
        onlyOwner
    {
        _paymentCheck(erc20Owner, 1);

        uint256 i;
        uint256 len = ids.length;
        // for (uint256 i = 0; i < ids.length; i++) {
        for (i; i < len; ) {
            // delId();
            liveSupply.decrement();
            _burn(ids[i]);
            unchecked {
                ++i;
            }
        }
        assembly {
            if lt(i, len) {
                // LoopOverflow()
                mstore(0x00, 0xdfb035c9)
                revert(0x1c, 0x04)
            }
        }
        // Transfer event emited by parent ERC721 contract
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
    //                          PUBLIC FX                         //
    ////////////////////////////////////////////////////////////////

    function mint(uint256 amount)
        external
        payable
        nonReentrant
        publicMintAccess
        hasReachedMax(amount)
        publicMintPriceCheck(price, amount)
    {
        _paymentCheck(msg.sender, 2);
        uint256 i;
        // for (uint256 i = 0; i < amount; i++) {
        for (i; i < amount; ) {
            _safeMint(msg.sender, _incrementCounter());
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
        // Transfer event emited by parent ERC721 contract
    }

    ////////////////////////////////////////////////////////////////
    //                           VIEW FX                          //
    ////////////////////////////////////////////////////////////////

    function getBaseURI()
        external
        view
        returns (string memory)
    {
        return baseURI;
    }

    function tokenURI(uint256 id)
        public
        view
        virtual
        override
        returns (string memory)
    {
        if (id > mintCount) revert NotMintedYet();
        return
            string(
                abi.encodePacked(
                    baseURI,
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

    ////////////////////////////////////////////////////////////////
    //                     INTERNAL FUNCTIONS                     //
    ////////////////////////////////////////////////////////////////

    /// @dev Checks if mint / burn fees are paid
    /// @dev If not router deployed we check msg.value if !erc20 OR checks erc20 approval and transfers
    /// @dev If router deployed we check msg.value if !erc20 BUT checks erc20 approval and transfers are via the router
    /// @param _erc20Owner Non router deploy =msg.sender; Router deploy =payer.address (msg.sender = router.address)
    /// @param _type Passed to _feeCheck to determin the fee 0=mint; 1=burn; ELSE _feeCheck is ignored
    function _paymentCheck(address _erc20Owner, uint8 _type)
        internal
    {
        uint256 value = (address(erc20) != address(0))
            ? erc20.allowance(_erc20Owner, address(this))
            : msg.value;

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
        address _owner = owner;
        uint32 size;
        assembly {
            size := extcodesize(_owner)
        }
        if (size == 0) {
            return;
        }

        uint256 _fee = FeeOracle(owner).feeLookup(_method);
        assembly {
            if iszero(eq(_value, _fee)) {
                mstore(0x00, 0xf7760f25)
                revert(0x1c, 0x04)
            }
        }
    }

    function _nextId() private returns (uint256) {
        liveSupply.increment();
        return liveSupply.current();
    }

    function _incrementCounter() private returns (uint256) {
        _nextId();
        mintCount += 1;
        return mintCount;
    }

    ////////////////////////////////////////////////////////////////
    //                     REQUIRED OVERRIDES                     //
    ////////////////////////////////////////////////////////////////

    function supportsInterface(bytes4 interfaceId)
        public
        pure
        virtual
        override(ERC721, ERC2981)
        returns (bool)
    {
        return
            // ERC165 Interface ID for ERC165
            interfaceId == 0x01ffc9a7 ||
            // ERC165 Interface ID for ERC721
            interfaceId == 0x80ac58cd ||
            // ERC165 Interface ID for ERC721Metadata
            interfaceId == 0x5b5e139f ||
            // ERC165 Interface ID for ERC2981
            interfaceId == 0x2a55205a;
    }
}
