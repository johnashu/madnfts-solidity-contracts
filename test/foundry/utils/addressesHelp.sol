// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.22;

import "test/lib/forge-std/src/Test.sol";
import { Enums } from "test/foundry/utils/enums.sol";

abstract contract AddressesHelp is Test, Enums {
    function setAndCheckAddress(
        function(address) external setTransferOwnershipFunc,
        function() external acceptOwnershipFunc,
        function() view external returns (address) expectedAddressFunction,
        bool is2Step
    ) internal {
        // Cache current address to reset at the end.
        address originalAddress = expectedAddressFunction();

        // Create temp new address for the check
        address newAddress = makeAddr("newAddress");

        // Attempt to set the address to address(0) and expect
        // the transaction to revert.
        vm.expectRevert(); //  error OwnableInvalidOwner();
        setTransferOwnershipFunc(address(0));

        // Set the address using the provided function
        setTransferOwnershipFunc(newAddress);
        if (is2Step) {
            vm.startPrank(newAddress);
            acceptOwnershipFunc();
        }

        // Check that the address is set correctly
        assertTrue(
            newAddress == expectedAddressFunction(),
            "newAddress == expectedAddressFunction() :: do not match"
        );

        // Reset the address to the original address if not address(0)
        if (originalAddress != address(0)) {
            // If it is the owner() function, we need to stop the prank and then
            // start it again
            if (
                expectedAddressFunction.selector == 0x8da5cb5b // sigHash =>  owner()
            ) {
                vm.stopPrank();
                vm.prank(newAddress);
                setTransferOwnershipFunc(originalAddress);
                if (is2Step) {
                    vm.prank(originalAddress);
                    acceptOwnershipFunc();
                }
            } else {
                setTransferOwnershipFunc(originalAddress);
                vm.prank(originalAddress);
                acceptOwnershipFunc();
            }

            // Check that the address is reset correctly
            assertTrue(
                originalAddress == expectedAddressFunction(),
                "originalAddress == expectedAddressFunction() :: do not match"
            );
        }
    }

    function createManyAddresses(
        uint256 numAddresses,
        string memory name,
        uint256 _deal
    ) internal returns (address[] memory addresses) {
        addresses = new address[](numAddresses);
        for (uint256 i = 0; i < numAddresses; i++) {
            addresses[i] = makeAddr(string(abi.encode(name, i)));
            vm.deal(addresses[i], _deal);
        }
    }

    // Helper function to compare two address arrays
    function compareAddressArray(
        address[] memory array1,
        address[] memory array2
    ) private pure returns (bool) {
        uint256 len = array1.length;
        if (len != array2.length) {
            return false;
        }
        for (uint256 i = 0; i < len; i++) {
            if (array1[i] != array2[i]) {
                return false;
            }
        }
        return true;
    }

    function deployZeroAddresses(
        ercTypes ercType,
        address[] memory addresses,
        address owner,
        function(ercTypes, address, address, address, address) internal returns(address)
            deployFunction
    ) internal {
        address temp;
        uint256 len = addresses.length;
        address[] memory _addresses = addresses;
        // iterate over the addresses array, each time setting one to address(0)
        unchecked {
            for (uint256 i = 0; i < len; i++) {
                temp = _addresses[i];
                emit log_named_address("temp", temp);
                emit log_named_address("addresses[i]", _addresses[i]);

                if (temp != address(0)) {
                    // If the address is address(0), we expect the transaction
                    // to revert. This is for the paymentToken in particular.
                    _addresses[i] = address(0);
                    vm.expectRevert(0xd92e233d); // error ZeroAddress();
                }
                deployFunction(
                    ercType, owner, _addresses[0], _addresses[1], _addresses[2]
                );
                // reset the address back to original for the next loop
                _addresses[i] = temp;
            }
        }
    }
}
