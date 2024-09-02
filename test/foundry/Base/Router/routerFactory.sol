// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.23;

import { MADRouter } from "contracts/Router/MADRouter.sol";
// import { MADRouter1155 } from "contracts/Router/MADRouter1155.sol";
import { FactoryVerifier } from "contracts/Shared/EventsAndErrors.sol";

import { Enums } from "test/foundry/utils/enums.sol";

contract RouterFactory is Enums {
    function createRouter(
        FactoryVerifier _factoryVerifier,
        address _recipientRouter
    ) public returns (address newRouter) {
        return address(new MADRouter(_factoryVerifier, _recipientRouter));
    }
}
