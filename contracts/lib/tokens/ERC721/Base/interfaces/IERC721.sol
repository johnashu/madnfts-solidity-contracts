// SPDX-License-Identifier: AGPL-3.0-only

pragma solidity 0.8.16;

/// @title Required interface of an ERC721 compliant contract.
interface IERC721 {
    /// @dev Emitted when `tokenId` token is transferred from `from` to `to`.
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);

    /// @dev Emitted when `owner` enables `approved` to manage the `tokenId` token.
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);

    /// @dev Emitted when `owner` enables or disables (`approved`) `operator` to manage all of its assets.
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);

    /// @return balance Returns the number of tokens in ``owner``'s account.
    function balanceOf(address owner) external view returns (uint256 balance);

    /// @return owner Returns the owner of the `tokenId` token.
    /// @dev Requirements: `tokenId` must exist.
    function ownerOf(uint256 tokenId) external view returns (address owner);

    /// @notice Safely transfers `tokenId` token from `from` to `to`.
    /// @dev Emits a {Transfer} event.
    function safeTransferFrom(address from, address to, uint256 tokenId, bytes calldata data) external;

    /// @notice Safely transfers `tokenId` token from `from` to `to`, checking first that contract recipients
    /// are aware of the ERC721 protocol to prevent tokens from being forever locked.
    /// @dev Emits a {Transfer} event.
    function safeTransferFrom(address from, address to, uint256 tokenId) external;

    /// @notice Transfers `tokenId` token from `from` to `to`.
    /// @dev Usage of this method is discouraged, use {safeTransferFrom} whenever possible.
    /// @dev Emits a {Transfer} event.
    function transferFrom(address from, address to, uint256 tokenId) external;

    /// @notice Gives permission to `to` to transfer `tokenId` token to another account.
    /// The approval is cleared when the token is transferred. Only a single account can be
    /// approved at a time, so approving the zero address clears previous approvals.
    /// @dev Emits an {Approval} event.
    function approve(address to, uint256 tokenId) external;

    /// @notice Approve or remove `operator` as an operator for the caller.
    /// @dev Operators can call {transferFrom} or {safeTransferFrom} for any token owned by the caller.
    /// @dev Emits an {ApprovalForAll} event.
    function setApprovalForAll(address operator, bool _approved) external;

    /// @notice Returns the account approved for `tokenId` token.
    function getApproved(uint256 tokenId) external view returns (address operator);

    /// @notice Returns if the `operator` is allowed to manage all of the assets of `owner`.
    function isApprovedForAll(address owner, address operator) external view returns (bool);

    /// @notice Queries EIP2981 royalty info for marketplace royalty payment enforcement.
    function royaltyInfo(
        uint256 tokenId,
        uint256 salePrice
    ) external view returns (address receiver, uint256 royaltyAmount);

    function supportsInterface(bytes4 interfaceId) external view returns (bool);
}
