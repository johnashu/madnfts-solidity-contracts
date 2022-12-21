// SPDX-License-Identifier: AGPL-3.0-only

pragma solidity 0.8.16;

/// @title Counters
/// @author Modified from OpenZeppelin Contracts
/// (https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/Counters.sol)
/// @notice Provides counters that can only be incremented, decrementedor reset.
/// @dev Include with `using Counters for Counters.Counter;`
library Counters {
    struct Counter {
        /// @dev Interactions must be restricted to the library's function.
        uint256 _val; // := 0
    }

    /// @dev 0xce3a3d37
    error DecOverflow();

    function current(Counter storage counter)
        internal
        view
        returns (uint256 _val)
    {
        assembly {
            _val := sload(counter.slot)
        }
    }

    function increment(Counter storage counter, uint256 amount) internal {
        assembly {
            let _val := sload(counter.slot)
            sstore(counter.slot, add(_val, amount))
        }
    }

    function increment(Counter storage counter) internal {
        assembly {
            let _val := sload(counter.slot)
            sstore(counter.slot, add(_val, 0x01))
        }
    }

    function decrement(Counter storage counter) internal {
        assembly {
            let _val := sload(counter.slot)
            if or(iszero(_val), lt(_val, 0x00)) {
                mstore(0x00, 0xce3a3d37)
                // mstore(0x00, 0x4445435f4f564552464c4f570000000000000000000000000000000000000000)
                revert(0x1c, 0x04)
            }
            sstore(counter.slot, sub(_val, 0x01))
        }
    }

    function decrement(Counter storage counter, uint256 amount) internal {
        assembly {
            let _val := sload(counter.slot)
            if or(or(iszero(_val), lt(_val, 0x00)), lt(sub(_val, amount), 0x00)) {
                mstore(0x00, 0xce3a3d37)
                // mstore(0x00, 0x4445435f4f564552464c4f570000000000000000000000000000000000000000)
                revert(0x1c, 0x04)
            }
            sstore(counter.slot, sub(_val, amount))
        }
    }

    function reset(Counter storage counter) internal {
        assembly {
            sstore(counter.slot, 0)
        }
    }

    // function incrementCounter() internal returns(uint256){
    //     Counters.Counter._val += 1;
    //     return Counters.Counter._val;
    // }
}
