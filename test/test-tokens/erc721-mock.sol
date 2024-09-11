// SPDX-License-Identifier: AGPL-3.0-only

pragma solidity 0.8.23;

import { ERC721 } from "contracts/lib/tokens/ERC721/Base/ERC721.sol";

contract MockERC721 is ERC721 {
    string internal _name;
    string internal _symbol;
    string internal _uri;

    constructor(
        string memory __name,
        string memory __symbol /* ERC721(_name, _symbol) */
    ) {
        _name = __name;
        _symbol = __symbol;
    }

    function tokenURI(uint256)
        public
        view
        virtual
        override
        returns (string memory)
    {
        return _uri;
    }

    function mint(address to, uint256 tokenId) public {
        _mint(to, tokenId);
    }

    function name() public view override(ERC721) returns (string memory) {
        return _name;
    }

    function symbol() public view override(ERC721) returns (string memory) {
        return _symbol;
    }
}
