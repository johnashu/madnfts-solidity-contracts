// SPDX-License-Identifier: AGPL-3.0-only

pragma solidity 0.8.16;

/// @title Factory Verifier
/// @notice Core contract binding interface that connect both
/// `MADMarketplace` and `MADRouter` storage verifications made to `MADFactory`.
interface FactoryVerifier {
    // using Types for Types.ERC721Type;

    /// @dev 0x4ca88867
    error AccessDenied();

    /// @notice Authority validator for no-fee marketplace listing.
    /// @dev Function Sighash := 0x76de0f3d
    /// @dev Binds Marketplace's pull payment methods to Factory storage.
    /// @param _token Address of the traded token.
    /// @param _user Token Seller that must match collection creator for no-fee listing.
    /// @return stdout := 1 as boolean standard output.
    function creatorAuth(address _token, address _user) external view returns (bool stdout);

    /// @notice Authority validator for `MADRouter` creator settings and withdraw functions.
    /// @dev Function Sighash := 0xb64bd5eb
    /// @param _colID 32 bytes collection ID value.
    /// @return creator bb
    /// @return check Boolean output to either approve or reject call's `tx.origin` function access.
    function creatorCheck(bytes32 _colID) external view returns (address creator, bool check);

    /// @dev Convert address to `colID` (20bytes => 32bytes).
    /// @dev Function Sighash := 0x617d1d3b
    function getColID(address _colAddress) external pure returns (bytes32 colID);

    /// @dev Returns the collection type uint8 value in case token and user are authorized.
    /// @dev Function Sighash := 0xd93cb8fd
    function typeChecker(bytes32 _colID) external view returns (uint8 pointer);
}
