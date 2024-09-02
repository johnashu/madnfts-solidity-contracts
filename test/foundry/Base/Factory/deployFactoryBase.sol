// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.22;

import "test/lib/forge-std/src/Test.sol";
import { IFactory } from "test/foundry/Base/Factory/IFactory.sol";
import { FactoryFactory } from "test/foundry/Base/Factory/factoryFactory.sol";

import { Helpers } from "test/foundry/utils/helpers.sol";

contract DeployFactoryBase is Test, FactoryFactory, Helpers {
    // Default Values for Factory Deploy tests
    address public factoryOwner = makeAddr("FactoryOwner");
    address public factorySigner = makeAddr("factorySigner");
    address public factoryRouterAddress = makeAddr("factoryRouterAddress");
    address public marketplaceAddressFactory =
        makeAddr("marketplaceAddressFactory");
    address public paymentTokenAddressFactory = address(0);
    address public paymentTokenAddressFactoryErc20 =
        makeAddr("paymentTokenAddressFactory");

    function deployFactoryDefault() public returns (address factoryAddress) {
        factoryAddress =
            address(deployFactoryCustom(factoryOwner, factorySigner));
    }

    function _deployFactoryCustomInternal(
        address _owner,
        address _factorySignerAddress
    ) internal returns (address factoryAddress) {
        factoryAddress =
            address(deployFactoryCustom(_owner, _factorySignerAddress));
    }

    function deployFactoryCustom(address _owner, address _factorySignerAddress)
        public
        returns (address factoryAddress)
    {
        vm.prank(_owner);
        factoryAddress = createFactory(_owner);

        IFactory newFactory = IFactory(factoryAddress);

        // emit log_named_address("factoryAddress", address(newFactory));
        // emit log_named_address("factoryOwner", _owner);
        // emit log_named_address("address(this)", address(this));

        verifyDeployment(newFactory, _owner, _factorySignerAddress);
    }

    function verifyDeployment(
        IFactory newFactory,
        address _owner,
        address _factorySignerAddress
    ) internal {
        if (address(newFactory) != address(1)) {
            vm.startPrank(_owner);
            // Check that newFactory's owner is the expected owner
            assertTrue(
                newFactory.owner() == _owner,
                "Owner should be the provided _owner"
            );

            // Check that collectionTypes for the given index returns empty
            // bytes
            assertTrue(
                newFactory.collectionTypes(0).length == 0,
                "collectionTypes should return an empty bytes array"
            );

            // At this point, _owner is the only user that has interacted with
            // the contract.
            // Thus, check that userTokens for the _owner reverts on an empty
            // bytes32 array

            vm.expectRevert();
            // vm.expectRevert(0x00adecf0);
            newFactory.userTokens(_owner);

            // Again, at this point, _owner is the only user that has interacted
            // with the contract.
            // Thus, check that getIDsLength for the _owner returns 0
            assertTrue(
                newFactory.getIDsLength(_owner) == 0,
                "getIDsLength should return 0"
            );

            // Test addCollectionType function
            // Deploy abitrary contract code and check
            // Get the bytecode of the Helpers contract
            bytes memory bytecode = type(Helpers).creationCode;

            // Test addCollectionType function
            newFactory.addCollectionType(5, bytecode);

            // Check that collectionTypes for the given index returns the
            // correct bytes
            assertTrue(
                keccak256(newFactory.collectionTypes(5)) == keccak256(bytecode),
                "keccak256(newFactory.collectionTypes(5)) == keccak256(bytecode) do not match"
            );

            // Probe they work..

            /**
             * @notice Verify deployment, an internal state-modifying contract
             * function.
             * @param newFactory The new factory (IFactory).
             * @param _owner The owner address.
             * @param _factorySignerAddress The factory signer address.
             * @custom:signature verifyDeployment(address,address,address)
             * @custom:selector 0x4ce98a1e
             */
            // Test setRouter function
            setAndCheckAddress(
                newFactory.setRouter,
                newFactory.acceptOwnership,
                newFactory.router,
                false
            );

            // Test setOwner function
            setAndCheckAddress(
                newFactory.transferOwnership,
                newFactory.acceptOwnership,
                newFactory.owner,
                true
            );

            vm.stopPrank();
        } else {
            emit log_string("Deployment Failed");
        }
    }

    function setTokenType(
        IFactory _factory,
        address _owner,
        uint8 collectionType,
        bytes memory _tokenType
    ) public {
        // Set Token FactoryTypes
        // emit log_named_address("factoryOwner", _owner);

        vm.startPrank(makeAddr("NotOwner"));
        vm.expectRevert(); // error OwnableUnauthorizedAccount();
        _factory.addCollectionType(collectionType, _tokenType);
        vm.stopPrank();

        vm.prank(_owner);
        _factory.addCollectionType(collectionType, _tokenType);
        assertEq(
            _factory.collectionTypes(collectionType),
            _tokenType,
            "collectionTypes(collectionType) == _tokenType"
        );
    }

    function setRouter(
        IFactory _factory,
        address _routerAddress,
        address _owner
    ) public {
        // Set Router
        // emit log_named_address("factoryRouterAddress", _routerAddress);

        vm.expectRevert(); // error OwnableUnauthorizedAccount();
        _factory.setRouter(address(0));

        vm.prank(_owner);
        _factory.setRouter(_routerAddress);
        assertEq(
            _factory.router(), _routerAddress, "router() == _routerAddress"
        );
    }

    function setFactoryFees(
        address _owner,
        IFactory factory,
        uint256 _feeCreateCollection,
        uint256 _feeCreateSplitter
    ) public {
        vm.prank(_owner);
        factory.setFees(_feeCreateCollection, _feeCreateSplitter);
        assertTrue(
            factory.feeCreateCollection() == _feeCreateCollection,
            "factory.feeCreateCollection() == _feeCreateCollection :: do not match"
        );
        assertTrue(
            factory.feeCreateSplitter() == _feeCreateSplitter,
            "factory.feeCreateSplitter() == _feeCreateSplitter :: do not match"
        );
    }

    function setFactoryFees(
        address _owner,
        IFactory factory,
        uint256 _feeCreateCollection,
        uint256 _feeCreateSplitter,
        address erc20Token
    ) public {
        vm.prank(_owner);
        factory.setFees(_feeCreateCollection, _feeCreateSplitter, erc20Token);
        assertTrue(
            factory.feeCreateCollectionErc20(erc20Token).feeAmount
                == _feeCreateCollection,
            "factory.feeCreateCollectionErc20(erc20Token) == _feeCreateCollection :: do not match"
        );
        assertTrue(
            factory.feeCreateCollectionErc20(erc20Token).isValid == true,
            "factory.feeCreateCollectionErc20(erc20Token).isValid == true, :: do not match"
        );
        assertTrue(
            factory.feeCreateSplitterErc20(erc20Token).feeAmount
                == _feeCreateSplitter,
            "factory.feeCreateSplitterErc20(erc20Token) == _feeCreateSplitter :: do not match"
        );
        assertTrue(
            factory.feeCreateSplitterErc20(erc20Token).isValid == true,
            "factory.feeCreateSplitterErc20(erc20Token).isValid == true, :: do not match"
        );
    }
}
