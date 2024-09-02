// SPDX-License-Identifier: AGPL-3.0-only

pragma solidity 0.8.23;

import { IPublicMint } from
    "contracts/MADTokens/common/interfaces/IPublicMint.sol";

interface IERC1155EventsStructsAndErrors is IPublicMint {
    ////////////////////////////////////////////////////////////////
    //                           EVENTS                           //
    ////////////////////////////////////////////////////////////////

    event PublicMintStateSet(uint256 indexed _id, bool _publicMintState);
    event BatchPublicMintStateSet(
        uint256[] indexed _ids, bool[] _publicMintStates
    );
    event MaxSupplySet(uint256 indexed _id, uint256 _maxSupply);
    event BatchMaxSupplySet(uint256[] indexed _ids, uint256[] _maxSupplies);

    event PublicMintLimitSet(uint256 indexed _id, uint256 _limit);
    event BatchPublicMintLimitSet(uint256[] indexed _ids, uint256[] _limits);

    event PublicMintPriceSet(uint256 indexed _id, uint256 _price);
    event BatchPublicMintPriceSet(uint256[] indexed _ids, uint256[] _prices);

    event PublicMintDatesSet(
        uint256 indexed _id, uint256 _startDate, uint256 _endDate
    );
    event BatchPublicMintDatesSet(
        uint256[] indexed _ids, uint256[] _startDates, uint256[] _endDates
    );

    event PublicMintValuesSet(
        uint256 indexed _id, PublicMintValues _publicMintValues
    );

    event BatchPublicMintValuesSet(
        uint256[] indexed _ids, PublicMintValues[] _publicMintValues
    );

    ////////////////////////////////////////////////////////////////
    //                           ERRORS                           //
    ////////////////////////////////////////////////////////////////

    /// @dev 0x1a3ed2ab
    error MaxSupplyNotSet(uint256 _id);

    // @dev 0xa763b501
    error ZeroArrayLength();
}
