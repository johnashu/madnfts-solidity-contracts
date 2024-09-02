// SPDX-License-Identifier: AGPL-3.0-only

pragma solidity 0.8.23;

import { IPublicMint } from
    "contracts/MADTokens/common/interfaces/IPublicMint.sol";

interface IERC721EventsStructsAndErrors is IPublicMint {
    event PublicMintLimitSet(uint256 limit);
    event PublicMintStateSet(bool newPublicState);
    event PublicMintPriceSet(uint256 newPrice);
    event PublicMintDatesSet(uint256 newStartDate, uint256 newEndDate);
    event PublicMintValuesSet(
        bool newPublicMintState,
        uint256 newPrice,
        uint256 newLimit,
        uint256 newStartDate,
        uint256 newEndDate
    );
}
