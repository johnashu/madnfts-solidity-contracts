// SPDX-License-Identifier: AGPL-3.0-only

pragma solidity 0.8.19;

interface ERC721BasicEventsAndErrors {
    ////////////////////////////////////////////////////////////////
    //                           EVENTS                           //
    ////////////////////////////////////////////////////////////////

    event BaseURISet(string indexed newBaseURI);
    event BaseURILocked(string indexed baseURI);
    event RoyaltyRecipientSet(address indexed newRecipient);
    event RoyaltyFeeSet(uint256 indexed newRoyaltyFee);
    event PublicMintStateSet(bool indexed newPublicState);

    ////////////////////////////////////////////////////////////////
    //                           ERRORS                           //
    ////////////////////////////////////////////////////////////////

    /// @dev 0x2d0a3f8e
    error PublicMintClosed();
    /// @dev 0xd05cb609
    error MaxSupplyReached();
    /// @dev 0xbad086ea
    error NotMintedYet();
    /// @dev 0xf7760f25
    error WrongPrice();
    /// @dev 0xdfb035c9
    error LoopOverflow();
    /// @dev ?
    error UriLocked();
}
