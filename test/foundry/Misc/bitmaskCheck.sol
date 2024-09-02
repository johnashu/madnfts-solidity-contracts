// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.23;

import "test/lib/forge-std/src/Test.sol";

contract BitMaskCheck is Test {
    bytes32 collectionId =
        0x27b72c5e04929c8f06a5f959b6d2ccaf3b171706000000000000000000000000;
    bytes32 zeroEndingAddress =
        0x00000000000000000000000027b72c5e04929c8f06a5f959b6d2ccaf3b171706;
    //                            0x0000055b68Dc11A06f6ECA9EdE1E6E6766813D70
    // PK:                        0xc075e8db94ed1cb7a4d41fd9af8bdd0d45e5b820eac222942a631af27f07b62b

    function setUp() public { }

    function testBitMask() public {
        address creatorEnd;
        address creatorFixRight;
        address creatorFixLeft;
        address _collectionId;
        assembly {
            // bitmask to get the first 20 bytes of storage slot
            creatorEnd :=
                and(
                    sload(zeroEndingAddress.slot),
                    0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF
                )
            _collectionId :=
                and(
                    sload(collectionId.slot),
                    0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF
                )

            creatorFixLeft := shl(24, sload(collectionId.slot))
            creatorFixRight := shr(96, sload(collectionId.slot))
        }

        // emit log_address(creatorEnd);
        // emit log_address(_collectionId);
        // emit log_address(creatorFixLeft);
        // emit log_address(creatorFixRight);
    }
}
