// SPDX-License-Identifier: AGPL-3.0-only

pragma solidity 0.8.19;
import { CREATE3 } from "contracts/lib/utils/CREATE3.sol";
import { SplitterImpl } from "contracts/Shared/Types.sol";

library SplitterDeployer {
    function _SplitterDeploy(
        string memory _salt,
        address[] memory _payees,
        uint256[] memory _shares
    ) public returns (address deployed, bytes32 salt) {
        salt = keccak256(bytes(_salt));
        deployed = CREATE3.deploy(
            salt,
            abi.encodePacked(type(SplitterImpl).creationCode, abi.encode(_payees, _shares)),
            0
        );
    }
}
