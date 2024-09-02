// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.23;

import "test/lib/forge-std/src/Test.sol";
import { DeployERC20 } from "test/foundry/Base/Tokens/ERC20/deployMockERC20.sol";

import { DeployFactoryBase } from
    "test/foundry/Base/Factory/deployFactoryBase.sol";
import { DeployRouterBase } from "test/foundry/Base/Router/deployRouterBase.sol";

import { Enums } from "test/foundry/utils/enums.sol";

import {
    IDeployer,
    IRouter,
    IFactory,
    MockERC20
} from "test/foundry/Base/Deploy/IDeployer.sol";

import { ERC721Basic } from "contracts/MADTokens/ERC721/ERC721Basic.sol";
import { ERC1155Basic } from "contracts/MADTokens/ERC1155/ERC1155Basic.sol";

import { SettersToggle } from "test/foundry/utils/setterToggle.sol";

abstract contract DeployerBase is
    IDeployer,
    Enums,
    SettersToggle("defaultMADOwner")
{
    MockERC20 public paymentToken;
    IFactory public factory;
    IRouter public router;

    // Instantiate deployer contracts
    DeployFactoryBase factoryDeployer = new DeployFactoryBase();
    DeployRouterBase routerDeployer = new DeployRouterBase();

    DeployERC20 erc20Deployer = new DeployERC20();

    // Create necessary addresses
    address recipientMarketplace = makeAddr("RecipientMarketplace");
    address factorySigner = makeAddr("factorySigner");
    address recipientRouter = makeAddr("RecipientRouter");
    address swapRouter = makeAddr("SwapRouter");

    uint256 public erc20MintFee = 1 ether;
    uint256 public erc20BurnFee = 1 ether;
    uint256 public erc20CreateSplitterFee = 1 ether;
    uint256 public erc20CreateCollectionFee = 1 ether;

    function deployAll(ercTypes ercType, bool isERC20)
        public
        returns (DeployedContracts memory deployedContracts)
    {
        // First, deploy the ERC20 token contract
        if (isERC20) {
            paymentToken = erc20Deployer._deploy(currentSigner);
        } else {
            paymentToken = MockERC20(address(0));
        }

        // Deploy Factory
        factory = IFactory(
            factoryDeployer.deployFactoryCustom(currentSigner, factorySigner)
        );

        // Deploy Router
        router = IRouter(
            routerDeployer.deployRouterCustom(
                ercType,
                currentSigner,
                recipientRouter,
                address(paymentToken),
                address(factory)
            )
        );

        factoryDeployer.setRouter(factory, address(router), currentSigner);

        // Set the token types for the factory

        factoryDeployer.setTokenType(
            factory, currentSigner, 1, type(ERC721Basic).creationCode
        );

        factoryDeployer.setTokenType(
            factory, currentSigner, 2, type(ERC1155Basic).creationCode
        );

        if (isERC20) {
            // Set the fees for the factory
            factoryDeployer.setFactoryFees(
                currentSigner,
                factory,
                erc20CreateCollectionFee,
                erc20CreateSplitterFee,
                address(paymentToken)
            );

            // Set the fees for the router
            routerDeployer._setRouterFees(
                currentSigner,
                router,
                erc20MintFee,
                erc20BurnFee,
                address(paymentToken)
            );
        }

        // Return the addresses of the deployed contracts in an array
        deployedContracts = DeployedContracts({
            paymentToken: paymentToken,
            factory: factory,
            router: router
        });
    }

    function sendERC20(address to, uint256 amount) public {
        vm.startPrank(currentSigner);
        paymentToken.approve(to, amount);
        paymentToken.transfer(to, amount);
    }
}
