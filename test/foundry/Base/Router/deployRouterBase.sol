// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.22;

import "test/lib/forge-std/src/Test.sol";
import { IRouter } from "test/foundry/Base/Router/interfaces/IRouter.sol";
import {
    RouterFactory,
    FactoryVerifier
} from "test/foundry/Base/Router/routerFactory.sol";

import { AddressesHelp } from "test/foundry/utils/addressesHelp.sol";

import { RouterBaseFunctions } from
    "test/foundry/Base/Router/routerBaseFunctions.sol";

contract DeployRouterBase is
    AddressesHelp,
    RouterFactory,
    RouterBaseFunctions
{
    address routerOwner = makeAddr("RouterOwner");
    address paymentTokenAddressRouter = address(0);
    address paymentTokenAddressRouterErc20 =
        makeAddr("paymentTokenAddressRouter");
    address recipientRouter = makeAddr("RecipientRouter");
    address factoryVerifierRouter = makeAddr("RouterFactory");

    uint256 feeBurn = 1 ether;
    uint256 feeMint = 1 ether;

    address[] routerDefaultAddresses =
        [recipientRouter, paymentTokenAddressRouter, factoryVerifierRouter];

    function deployRouterDefault(ercTypes _ercType)
        public
        returns (address madRouter)
    {
        madRouter = deployRouterCustom(
            _ercType,
            routerOwner,
            recipientRouter,
            paymentTokenAddressRouter,
            factoryVerifierRouter
        );
    }

    function _deployRouterCustomInternal(
        ercTypes _ercType,
        address _owner,
        address _recipientRouter,
        address _paymentTokenAddressRouter,
        address factory
    ) internal returns (address routerAddress) {
        routerAddress = deployRouterCustom(
            _ercType,
            _owner,
            _recipientRouter,
            _paymentTokenAddressRouter,
            factory
        );
    }

    function deployRouterCustom(
        ercTypes _ercType,
        address _owner,
        address _recipientRouter,
        address _paymentTokenAddressRouter,
        address factory
    ) public returns (address routerAddress) {
        FactoryVerifier _factoryVerifier = FactoryVerifier(factory);

        vm.prank(_owner);

        routerAddress = createRouter(_factoryVerifier, _recipientRouter);

        IRouter madRouter = IRouter(routerAddress);

        verifyRouter(madRouter, _owner, _recipientRouter, _factoryVerifier);
    }

    function verifyRouter(
        IRouter _router,
        address _owner,
        address _recipientRouter,
        FactoryVerifier _factoryVerifier
    ) public {
        if (address(_router) != address(1)) {
            vm.startPrank(_owner);
            // Verify owner
            assertTrue(_router.owner() == _owner, "Incorrect owner");
            assertTrue(
                _router.owner() != address(0), "Owner cannot be address(0)"
            );
            setAndCheckAddress(
                _router.transferOwnership,
                _router.acceptOwnership,
                _router.owner,
                true
            );

            // Verify madFactory
            assertTrue(
                _router.madFactory() == _factoryVerifier, "Incorrect madFactory"
            );
            assertTrue(
                address(_factoryVerifier) != address(0),
                "madFactory cannot be address(0)"
            );

            // Verify recipient
            assertTrue(
                _router.recipient() == _recipientRouter, "Incorrect recipient"
            );
            assertTrue(
                _router.recipient() != address(0),
                "Recipient router cannot be address(0)"
            );

            assertTrue(_router.feeBurn() == feeBurn, "Incorrect feeBurn value");
            assertTrue(_router.feeMint() == feeMint, "Incorrect feeMint value");

            vm.stopPrank();
        } else {
            emit log_string("Deployment Failed");
        }
    }
}
