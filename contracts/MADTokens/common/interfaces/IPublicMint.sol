// SPDX-License-Identifier: AGPL-3.0-only

pragma solidity 0.8.23;

interface IPublicMint {
    struct PublicMintValues {
        bool publicMintState;
        uint256 price;
        uint256 limit;
        uint256 startDate;
        uint256 endDate;
    }
}
