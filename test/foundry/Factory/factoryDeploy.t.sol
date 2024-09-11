// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.23;

import "test/lib/forge-std/src/Test.sol";
import {
    DeployFactoryBase,
    IFactory
} from "test/foundry/Base/Factory/deployFactoryBase.sol";

import { AddressesHelp } from "test/foundry/utils/addressesHelp.sol";

contract DeployFactory is AddressesHelp, DeployFactoryBase {
    uint256 public feeCreateCollection = 1 ether;
    uint256 public feeCreateSplitter = 1 ether;

    function setUp() public {
        // vm.startPrank(factoryOwner);
        vm.deal(factoryOwner, 1000 ether);
    }

    function testDeployFactoryDefault() public {
        deployDefault();
    }

    function deployDefault() public {
        address factory = deployFactoryDefault();
        setRouter(IFactory(factory), factoryRouterAddress, factoryOwner);
        setFactoryFees(
            factoryOwner,
            IFactory(factory),
            feeCreateCollection,
            feeCreateSplitter
        );
    }
}
