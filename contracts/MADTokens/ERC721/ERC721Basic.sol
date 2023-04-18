// SPDX-License-Identifier: AGPL-3.0-only

pragma solidity 0.8.19;

import { ImplBase, SplitterImpl, ERC20, ERC2981, Counters, Strings, SafeTransferLib } from "contracts/MADTokens/common/ImplBase.sol";
import { ERC721, ERC721TokenReceiver } from "contracts/lib/tokens/ERC721/Base/ERC721.sol";

contract ERC721Basic is ERC721, ImplBase, ERC721TokenReceiver {
    using Counters for Counters.Counter;
    using Strings for uint256;

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
    ) ImplBase(_baseURI, _price, _maxSupply, _splitter, _fraction, _router, _erc20) ERC721(_name, _symbol) {}

    ////////////////////////////////////////////////////////////////
    //                       OWNER MINTING                        //
    ////////////////////////////////////////////////////////////////

    function mintTo(
        address to,
        uint256 amount,
        address erc20Owner
    ) external payable onlyOwner nonReentrant hasReachedMax(amount) {
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

    function burn(uint256[] memory ids, address erc20Owner) external payable onlyOwner {
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

    ////////////////////////////////////////////////////////////////
    //                          PUBLIC FX                         //
    ////////////////////////////////////////////////////////////////

    function mint(
        uint256 amount
    ) external payable nonReentrant publicMintAccess hasReachedMax(amount) publicMintPriceCheck(price, amount) {
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

    function tokenURI(uint256 id) public view virtual override(ERC721) returns (string memory) {
        if (id > mintCount) revert NotMintedYet();
        return string(abi.encodePacked(baseURI, Strings.toString(id), ".json"));
    }

    ////////////////////////////////////////////////////////////////
    //                     REQUIRED OVERRIDES                     //
    ////////////////////////////////////////////////////////////////

    function supportsInterface(bytes4 interfaceId) public pure virtual override(ERC721, ERC2981) returns (bool) {
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
