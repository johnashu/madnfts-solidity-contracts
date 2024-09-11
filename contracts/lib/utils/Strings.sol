// SPDX-License-Identifier: AGPL-3.0-only

/// @title Uint256 to string conversion library.
/// @author Solady
/// (https://github.com/vectorized/solady/blob/main/src/utils/LibString.sol)
/// @author Modified from Solmate
/// (https://github.com/Rari-Capital/solmate/blob/main/src/utils/LibString.sol)

pragma solidity 0.8.23;

library Strings {
    /// @dev Converts a `uint256` to its ASCII `string` decimal representation.
    function toString(uint256 value)
        internal
        pure
        returns (string memory str)
    {
        assembly {
            // The maximum value of a uint256 contains 78 digits (1 byte per
            // digit),
            // but we allocate 128 bytes to keep the free memory pointer 32-byte
            // word aliged.
            // We will need 1 32-byte word to store the length,
            // and 3 32-byte words to store a maximum of 78 digits. Total: 32 +
            // 3 * 32 = 128.
            str := add(mload(0x40), 128)
            // Update the free memory pointer to allocate.
            mstore(0x40, str)

            // Cache the end of the memory to calculate the length later.
            let end := str

            // We write the string from the rightmost digit to the leftmost
            // digit.
            // The following is essentially a do-while loop that also handles
            // the zero case.
            // Costs a bit more than early returning for the zero case,
            // but cheaper in terms of deployment and overall runtime costs.
            for {
                // Initialize and perform the first pass without check.
                let temp := value
                // Move the pointer 1 byte leftwards to point to an empty
                // character slot.
                str := sub(str, 1)
                // Write the character to the pointer. 48 is the ASCII index of
                // '0'.
                mstore8(str, add(48, mod(temp, 10)))
                temp := div(temp, 10)
            } temp {
                // Keep dividing `temp` until zero.
                temp := div(temp, 10)
            } {
                // Body of the for loop.
                str := sub(str, 1)
                mstore8(str, add(48, mod(temp, 10)))
            }

            let length := sub(end, str)
            // Move the pointer 32 bytes leftwards to make room for the length.
            str := sub(str, 32)
            // Store the length.
            mstore(str, length)
        }
    }
}
