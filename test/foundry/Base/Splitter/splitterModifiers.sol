// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.23;

import "test/lib/forge-std/src/Test.sol";

abstract contract SplitterModifiers is Test {
    /// _ambassador != address(0) && _project == address(0)
    ///             && _ambassadorShare > 99 && _ambassadorShare < 2001
    modifier ambassadorWithNoProjectAssumptions(uint16 _ambassadorShare) {
        vm.assume(_ambassadorShare > 99 && _ambassadorShare < 2001);
        _;
    }

    /// _project != address(0) && _ambassador == address(0)
    /// && _projectShare > 99 && _projectShare < 10001
    modifier projectWithNoAmbassadorAssumptions(uint16 _projectShare) {
        vm.assume(_projectShare > 99 && _projectShare < 10_001);
        _;
    }

    /// _ambassador != address(0) && _project != address(0)
    ///            && _ambassadorShare > 99 && _ambassadorShare < 2001 &&
    /// _projectShare > 99
    ///             && _projectShare < 10001
    modifier bothAmbassadorAndProjectAssumptions(
        uint16 _ambassadorShare,
        uint16 _projectShare
    ) {
        vm.assume(_ambassadorShare > 99 && _ambassadorShare < 2001);
        vm.assume(_projectShare > 99 && _projectShare < 10_001);
        vm.assume(_ambassadorShare + _projectShare < 10_001);
        _;
    }
}
