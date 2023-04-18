// SPDX-License-Identifier: AGPL-3.0-only

pragma solidity 0.8.19;

interface FeeOracle {
    function feeLookup(bytes4 sigHash) external view returns (uint256 fee);
}
