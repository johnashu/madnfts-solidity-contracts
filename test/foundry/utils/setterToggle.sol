// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.23;

import "test/lib/forge-std/src/Test.sol";

contract SettersToggle is Test {
    address public currentSigner;

    constructor(string memory _signer) {
        currentSigner = makeAddr(_signer);
    }

    function setCurrentSigner(address _currentSigner) public {
        currentSigner = _currentSigner;
    }
}
