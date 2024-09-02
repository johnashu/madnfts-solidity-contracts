// SPDX-License-Identifier: AGPL-3.0-only

pragma solidity 0.8.23;

import { FactoryVerifier } from "contracts/lib/auth/FactoryVerifier.sol";

interface EventsAndErrorsBase {
    event PaymentTokenUpdated(address indexed newPaymentToken);
    event RecipientUpdated(address indexed newRecipient);
    event FeesUpdated(uint256 feeVal2, uint256 feeVal3);
    event FeesUpdated(uint256 feeVal2, uint256 feeVal3, address erc20Token);

    /// @dev Only the token owner or an approved account can manage the tokens.
    error NotOwnerNorApproved();
    /// @dev Insufficient balance.
    error InsufficientBalance();

    // 0xd92e233d
    error ZeroAddress();
}

interface FactoryEventsAndErrorsBase is EventsAndErrorsBase {
    ////////////////////////////////////////////////////////////////
    //                           EVENTS                           //
    ////////////////////////////////////////////////////////////////

    event RouterUpdated(address indexed newRouter);
    event CollectionTypeAdded(uint256 indexed index);
    event SplitterCreated(
        address indexed creator,
        uint256[] shares,
        address[] payees,
        address indexed splitter,
        uint256 flag
    );
    event CollectionCreated(
        address indexed newSplitter,
        address indexed newCollection,
        string collectionName,
        string collectionSymbol,
        uint256 royalties,
        uint256 maxSupply,
        uint256 mintPrice,
        uint8 tokenType,
        address collectionToken
    );

    ////////////////////////////////////////////////////////////////
    //                           ERRORS                           //
    ////////////////////////////////////////////////////////////////

    /// @dev 0x00adecf0
    error InvalidSplitter();
    /// @dev 0xe0e54ced
    error InvalidRoyalty();
    /// @dev 0xe6c4247b
    error InvalidAddress();
    /// @dev 0xa1e9dd9d
    error InvalidTokenType();
    /// @dev 0x4ca88867
    error ZeroMaxSupply();
}

interface RouterEvents is EventsAndErrorsBase {
    ////////////////////////////////////////////////////////////////
    //                           EVENTS                           //
    ////////////////////////////////////////////////////////////////

    event TokenFundsWithdrawn(
        address indexed _id, uint8 indexed _type, address indexed _payee
    );

    event PublicMintState(
        address indexed _id, uint8 indexed _type, bool indexed _state
    );

    event BaseURISet(address indexed _id, string indexed _baseURI);

    event FactoryUpdated(FactoryVerifier indexed newFactory);

    /// @dev 0xf7760f25
    error WrongPrice();
    /// @dev 0x2d8768f9
    error InvalidFees();

    error InvalidType();
    error NoFunds();
    /// @dev 0x18fda3e7
    error NotValidCollection();
    /// @dev 0xd23f9521
    error AddressNotValid();
    /// @dev 0x4fd9af3e
    error NotCollectionOwner();
}
