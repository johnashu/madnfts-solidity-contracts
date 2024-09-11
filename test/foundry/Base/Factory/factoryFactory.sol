// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.23;

import { MADFactory } from "contracts/Factory/MADFactory.sol";
import { Enums } from "test/foundry/utils/enums.sol";

contract FactoryFactory is Enums {
    function createFactory(
        // ercTypes ercType,
        // address _paymentTokenAddressFactory,
        address _recipient
    ) public returns (address newFactory) {
        return address(
            new MADFactory(
                // _paymentTokenAddressFactory,
                _recipient
            )
        );
        //     if (ercType == ercTypes.ERC721) {
        //         return address(
        //             new MADFactory(
        //             _marketplaceAddressFactory,
        //             _factorySignerAddress,
        //             _paymentTokenAddressFactory
        //             )
        //         );
        //     } else if (ercType == ercTypes.ERC1155) {
        //         return address(
        //             new MADFactory(
        //             _marketplaceAddressFactory,
        //             _factorySignerAddress,
        //             _paymentTokenAddressFactory
        //             )
        //         );
        //     } else {
        //         revert("Invalid factory type");
        //     }
    }
}
