// SPDX-License-Identifier: AGPL-3.0-only

pragma solidity 0.8.19;

/// @author Modified from OpenZeppelin Contracts
/// (https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/utils/ERC721Holder.sol)

import { ERC721TokenReceiver } from "contracts/lib/tokens/ERC721/Base/ERC721.sol";

contract ERC721Holder is ERC721TokenReceiver {
    /// @dev Implementation of the {ERC721Receiver} abstract contract.
    /// Accepts all token transfers.
    /// Make sure the contract is able to use its token with
    /// {IERC721-safeTransferFrom}, {IERC721-approve} or {IERC721-setApprovalForAll}.
    function onERC721Received(address, address, uint256, bytes memory) public virtual override returns (bytes4) {
        return this.onERC721Received.selector;
    }
}
