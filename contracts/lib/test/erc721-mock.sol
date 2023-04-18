// SPDX-License-Identifier: AGPL-3.0-only

pragma solidity 0.8.19;

import { ERC721 } from "contracts/lib/tokens/ERC721/Base/ERC721.sol";

contract MockERC721 is ERC721 {
    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) {}

    function tokenURI(uint256) public pure virtual override returns (string memory) {}

    function mint(address to, uint256 tokenId) public {
        _mint(to, tokenId);
    }
}
