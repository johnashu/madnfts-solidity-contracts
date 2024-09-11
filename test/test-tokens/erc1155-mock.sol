// SPDX-License-Identifier: AGPL-3.0-only

pragma solidity 0.8.23;

import { ERC1155 } from "contracts/lib/tokens/ERC1155/Base/ERC1155.sol";

import { Owned } from "contracts/lib/auth/Owned.sol";

contract MockERC1155 is ERC1155, Owned(msg.sender) {
    string private _uri = "Hello/World";

    function uri(uint256)
        public
        view
        virtual
        override
        returns (string memory)
    {
        return _uri;
    }

    function mint(address to, uint256 id, uint256 total) public onlyOwner {
        _mint(to, id, total, "");
    }

    function batchMint(
        address to,
        uint256[] memory ids,
        uint256[] memory balances
    ) public onlyOwner {
        _batchMint(to, ids, balances, "");
    }

    function supportsInterface(bytes4 interfaceId)
        public
        pure
        override(ERC1155)
        returns (bool)
    {
        return
        // ERC165 Interface ID for ERC165
        interfaceId == 0x01ffc9a7
        // ERC165 Interface ID for ERC1155
        || interfaceId == 0xd9b67a26
        // ERC165 Interface ID for ERC1155MetadataURI
        || interfaceId == 0x0e89341c;
    }
}
