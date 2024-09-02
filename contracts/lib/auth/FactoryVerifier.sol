// SPDX-License-Identifier: AGPL-3.0-only

pragma solidity 0.8.23;

/// @title Factory Verifier
/// @notice Core contract binding interface that connect both
/// `MADMarketplace` and `MADRouter` storage verifications made to `madFactory`.
interface FactoryVerifier {
    /// @dev 0x4ca88867
    error AccessDenied();

    /// @notice Authority validator for no-fee marketplace listing.
    /// @dev Function Sighash := 0x76de0f3d
    /// @dev Binds Marketplace's pull payment methods to Factory storage.
    /// @param _token Address of the traded token.
    /// @param _user Token Seller that must match collection creator for no-fee
    /// listing.
    /// @return stdout := 1 as boolean standard output.
    function creatorAuth(address _token, address _user)
        external
        view
        returns (bool stdout);

    /// @notice Authority validator for `MADRouter` creator settings and
    /// withdraw functions.
    /// @dev Function Sighash := 0xb64bd5eb
    /// @param _collectionId address collection ID value.
    /// @return check Boolean output
    function collectionCheck(address _collectionId)
        external
        view
        returns (bool check);
}
