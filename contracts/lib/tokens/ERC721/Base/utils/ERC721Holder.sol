// SPDX-License-Identifier: AGPL-3.0-only

pragma solidity 0.8.23;

/// @notice A generic interface for a contract which properly accepts ERC721
/// tokens.
/// @author Solmate
/// (https://github.com/Rari-Capital/solmate/blob/main/src/tokens/ERC721.sol)
abstract contract ERC721TokenReceiver {
    function onERC721Received(address, address, uint256, bytes calldata)
        external
        virtual
        returns (bytes4)
    {
        return ERC721TokenReceiver.onERC721Received.selector;
    }
}

/// @author Modified from OpenZeppelin Contracts
/// (https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/utils/ERC721Holder.sol)
contract ERC721Holder is ERC721TokenReceiver {
    /// @dev Implementation of the {ERC721Receiver} abstract contract.
    /// Accepts all token transfers.
    /// Make sure the contract is able to use its token with
    /// {IERC721-safeTransferFrom}, {IERC721-approve} or
    /// {IERC721-setApprovalForAll}.
    function onERC721Received(address, address, uint256, bytes memory)
        public
        virtual
        override
        returns (bytes4)
    {
        return this.onERC721Received.selector;
    }
}
