// SPDX-License-Identifier: AGPL-3.0-only

pragma solidity 0.8.19;

/// @author Modified from OpenZeppelin Contracts
/// (https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC1155/utils/ERC1155Holder.sol)

import { ERC1155TokenReceiver } from "contracts/lib/tokens/ERC1155/Base/ERC1155B.sol";

contract ERC1155Holder is ERC1155TokenReceiver {
    /// @dev Implementation of the {ERC1155TokenReceiver} abstract contract
    /// that allows a contract to hold ERC1155 tokens.
    function onERC1155Received(
        address,
        address,
        uint256,
        uint256,
        bytes memory
    ) public virtual override returns (bytes4) {
        return this.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(
        address,
        address,
        uint256[] memory,
        uint256[] memory,
        bytes memory
    ) public virtual override returns (bytes4) {
        return this.onERC1155BatchReceived.selector;
    }
}
