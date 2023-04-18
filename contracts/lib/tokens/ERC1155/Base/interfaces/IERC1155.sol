// SPDX-License-Identifier: AGPL-3.0-only

pragma solidity 0.8.19;

/// @title Required interface of an ERC1155 compliant contract.
interface IERC1155 {
    /// @dev Emitted when `value` tokens of token type `id` are transferred
    /// from `from` to `to` by `operator`.
    event TransferSingle(address indexed operator, address indexed from, address indexed to, uint256 id, uint256 value);

    /// @dev Equivalent to multiple {TransferSingle} events, where `operator`, `from`
    /// and `to` are the same for all transfers.
    event TransferBatch(
        address indexed operator,
        address indexed from,
        address indexed to,
        uint256[] ids,
        uint256[] values
    );

    /// @dev Emitted when `account` grants or revokes permission to `operator` to
    /// transfer their tokens, according to `approved`.
    event ApprovalForAll(address indexed account, address indexed operator, bool approved);

    /// @return Returns the amount of tokens of token type `id` owned by `account`.
    function balanceOf(address account, uint256 id) external view returns (uint256);

    /// @dev Batched version of {balanceOf}.
    function balanceOfBatch(
        address[] calldata accounts,
        uint256[] calldata ids
    ) external view returns (uint256[] memory);

    /// @notice Transfers `amount` tokens of token type `id` from `from` to `to`,
    /// making sure the recipient can receive the tokens.
    /// @dev Emits a {TransferSingle} event.
    function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes calldata data) external;

    /// @dev Batched version of {safeTransferFrom}.
    /// @dev Emits a {TransferBatch} event.
    function safeBatchTransferFrom(
        address from,
        address to,
        uint256[] calldata ids,
        uint256[] calldata amounts,
        bytes calldata data
    ) external;

    /// @notice Grants or revokes permission to `operator` to transfer the caller's tokens, according to `approved`.
    /// @dev `operator` cannot be the caller.
    /// @dev Emits an {ApprovalForAll} event.
    function setApprovalForAll(address operator, bool approved) external;

    /// @notice Returns true if `operator` is approved to transfer ``account``'s tokens.
    function isApprovedForAll(address account, address operator) external view returns (bool);

    /// @notice Queries EIP2981 royalty info for marketplace royalty payment enforcement.
    function royaltyInfo(
        uint256 tokenId,
        uint256 salePrice
    ) external view returns (address receiver, uint256 royaltyAmount);

    /// @notice Queries for ERC165 introspection support.
    function supportsInterface(bytes4 interfaceId) external view returns (bool);
}
