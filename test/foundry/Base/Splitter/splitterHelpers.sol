// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.23;

import { IFactory } from "test/foundry/Base/Factory/IFactory.sol";

library SplitterHelpers {
    // address[] payeesExpected_onlyCreator = [currentSigner];
    // address[] payeesExpected_ambassadorWithNoProject = [ambassador,
    // currentSigner];
    // address[] payeesExpected_projectWithNoAmbassador = [project,
    // currentSigner];
    // address[] payeesExpected_All = [ambassador, project, currentSigner];

    function getExpectedSplitterAddresses(
        address currentSigner,
        address ambassador,
        address project
    ) internal pure returns (address[] memory) {
        address[] memory addresses = new address[](3);
        uint256 count = 0;

        // Add non-zero addresses to the array
        if (ambassador != address(0)) {
            addresses[count] = ambassador;
            count++;
        }

        if (project != address(0)) {
            addresses[count] = project;
            count++;
        }

        if (currentSigner != address(0)) {
            addresses[count] = currentSigner;
            count++;
        }

        // Resize the array to remove any unused elements
        assembly {
            mstore(addresses, count)
        }

        return addresses;
    }

    function allSplitterCombinations(
        address factory,
        uint256 _ambassadorShare,
        uint256 _projectShare,
        address madFeeTokenAddress
    )
        external
        pure
        returns (
            bytes4[4] memory functionSignatures,
            bytes[4] memory functionArgs
        )
    {
        return (
            [
                bytes4(0x0286a88c), //  =>  _runSplitterDeploy_creatorOnly(address,address)
                bytes4(0x849ba238), //  =>  _runSplitterDeploy_ambassadorWithNoProject(address,uint256,address)
                bytes4(0x08f3e5ff), //  =>  _runSplitterDeploy_projectWithNoAmbassador(address,uint256,address)
                bytes4(0x14a78a6e) //   =>  _runSplitterDeploy_BothAmbassadorAndProject(address,uint256,uint256,address)
            ],
            [
                abi.encode(factory, madFeeTokenAddress),
                abi.encode(factory, _ambassadorShare, madFeeTokenAddress),
                abi.encode(factory, _projectShare, madFeeTokenAddress),
                abi.encode(
                    factory, _ambassadorShare, _projectShare, madFeeTokenAddress
                )
            ]
        );
    }

    function callFunctionAndGetSplitter(
        address splitterDeployer,
        bytes4 functionSignature,
        bytes calldata functionArgs
    ) external returns (address splitter) {
        bool success;
        bytes memory _splitter;

        bytes memory data = abi.encodeWithSelector(functionSignature);
        data = abi.encodePacked(data, functionArgs);

        (success, _splitter) = splitterDeployer.call(data);

        require(success, "Function call failed");

        assembly {
            splitter := mload(add(_splitter, 0x20))
        }
    }
}
