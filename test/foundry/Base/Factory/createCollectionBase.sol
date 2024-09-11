// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.23;

import "test/lib/forge-std/src/Test.sol";
import {
    IFactory,
    CreateCollectionParams,
    Strings
} from "test/foundry/Base/Factory/createCollectionParams.sol";

import { IERC1155Basic } from
    "test/foundry/Base/Tokens/ERC1155/IERC1155Basic.sol";
import { IERC721Basic } from "test/foundry/Base/Tokens/ERC721/IERC721Basic.sol";

import { MockERC20 } from "test/foundry/Base/Tokens/ERC20/deployMockERC20.sol";

import { IImplBase } from "test/foundry/Base/Tokens/common/IImplBase.sol";

import { SettersToggle } from "test/foundry/utils/setterToggle.sol";

abstract contract CreateCollectionBase is
    SettersToggle("defaultCollectionOwner"),
    CreateCollectionParams
{
    MockERC20 public erc20Token;
    bool public isERC20;

    function updateIsErc20(bool _isERC20) public {
        isERC20 = _isERC20;
    }

    function createCollectionDefault(
        IFactory factory,
        address _splitter,
        uint256 _price
    ) public returns (address collectionAddress) {
        collectionAddress = createCollectionCustom(
            factory,
            _splitter,
            CreateCollectionParams.defaultCollectionParams(
                _splitter, _price, address(erc20Token)
            ),
            currentSigner
        );
    }

    function createCollectionCustom(
        IFactory factory,
        address _splitter,
        IFactory.CreateCollectionParams memory params,
        address collectionOwner
    ) public returns (address collectionAddress) {
        params.splitter = _splitter;

        if (!isERC20) {
            uint256 _createCollectionFee = factory.feeCreateCollection();
            vm.prank(collectionOwner, collectionOwner);
            factory.createCollection{ value: _createCollectionFee }(params);
        } else {
            uint256 _createCollectionFee = factory.feeCreateCollectionErc20(
                params.madFeeTokenAddress
            ).feeAmount;
            vm.prank(collectionOwner, collectionOwner);
            erc20Token.approve(address(factory), _createCollectionFee);
            vm.prank(collectionOwner, collectionOwner);
            factory.createCollection(params, params.madFeeTokenAddress);
        }

        collectionAddress =
            factory.getDeployedAddress(params.tokenSalt, collectionOwner);

        _verifyCollectionFactory(
            factory, params, collectionOwner, collectionAddress
        );

        // Shared assertions
        _verifyCollectionTokensShared(
            IImplBase(collectionAddress), params, factory, collectionOwner
        );

        // Find Collection Type and verify..
        if (IERC721Basic(collectionAddress).supportsInterface(0x80ac58cd)) {
            _verifyCollectionERC721(collectionAddress, params, collectionOwner);
        }
        if (IERC1155Basic(collectionAddress).supportsInterface(0xd9b67a26)) {
            _verifyCollectionERC1155(collectionAddress, params, collectionOwner);
        }
    }

    function _verifyCollectionFactory(
        IFactory factory,
        IFactory.CreateCollectionParams memory params,
        address collectionOwner,
        address collectionId
    ) private {
        // Perform verification checks
        uint256 expectedBlockNumber = block.number; // Get current block number

        (
            address creator,
            uint8 collectionType,
            bytes32 collectionSalt,
            uint256 blocknumber,
            address splitter
        ) = factory.collectionInfo(collectionId);

        vm.prank(collectionOwner, collectionOwner);
        assertTrue(
            factory.creatorAuth(collectionId, collectionOwner),
            "Invalid creator auth"
        );

        vm.prank(factory.router(), collectionOwner);
        bool _check = factory.collectionCheck(collectionId);

        assertTrue(creator == collectionOwner, "Invalid creator");
        assertTrue(_check, "Invalid creator check");

        vm.prank(factory.router(), collectionOwner);

        assertTrue(collectionType == params.tokenType, "Invalid token type");
        assertTrue(creator == collectionOwner, "Invalid collection owner");
        assertTrue(splitter == params.splitter, "Invalid splitter address");

        assertTrue(
            collectionSalt == params.tokenSalt, "Invalid collection salt"
        );

        assertTrue(blocknumber == expectedBlockNumber, "Invalid block number");
    }

    function _verifyCollectionERC1155(
        address collectionAddress,
        IFactory.CreateCollectionParams memory params,
        address collectionOwner
    ) internal {
        IERC1155Basic collection = IERC1155Basic(collectionAddress);

        // totalSupply()
        assertTrue(
            collection.totalSupply(1) == 0,
            "collection.totalSupply(1) == 0 :: Incorrect totalSupply"
        );
        // liveSupply()
        assertTrue(
            collection.liveSupply(1) == 0,
            "collection.liveSupply() == 0 :: Incorrect liveSupply"
        );

        // // maxSupply()
        assertTrue(
            collection.maxSupply(1) == 0,
            "collection.maxSupply() == 0 :: Incorrect maxSupply"
        );

        // mintCount()
        assertTrue(
            collection.mintCount(1) == 0,
            "collection.mintCount() == 0 :: Incorrect mintCount"
        );

        // price()
        assertTrue(
            collection.publicMintPrice(1) == 0,
            "collection.price(1) == 0 :: Incorrect price"
        );

        // publicMintState()
        assertTrue(
            collection.publicMintState(1) == false,
            "collection.publicMintState() == false :: Incorrect publicMintState"
        );

        // Test mintCount function
        uint256 mintCount = collection.mintCount(1);
        assertTrue(mintCount == 0, "Incorrect mintCount value");

        // Test balanceOf function
        uint256 balance = collection.balanceOf(collectionOwner, 1);
        assertTrue(balance == 0, "Incorrect balanceOf value");
    }

    function _verifyCollectionERC721(
        address collectionAddress,
        IFactory.CreateCollectionParams memory params,
        address collectionOwner
    ) internal {
        // Additional assertions specific to IERC721Basic interface
        IERC721Basic collection = IERC721Basic(collectionAddress);

        // totalSupply()
        assertTrue(
            collection.totalSupply() == 0,
            "collection.totalSupply() == 0 :: Incorrect totalSupply"
        );
        // liveSupply()
        assertTrue(
            collection.liveSupply() == 0,
            "collection.liveSupply() == 0 :: Incorrect liveSupply"
        );

        // maxSupply()
        assertTrue(
            collection.maxSupply() == params.maxSupply,
            "collection.maxSupply() == params.maxSupply :: Incorrect maxSupply"
        );

        // mintCount()
        assertTrue(
            collection.mintCount() == 0,
            "collection.mintCount() == 0 :: Incorrect mintCount"
        );

        // price()
        assertTrue(
            collection.price() == params.price,
            "collection.price() == params.price :: Incorrect price"
        );

        // publicMintState()
        assertTrue(
            collection.publicMintState() == false,
            "collection.publicMintState() == false :: Incorrect publicMintState"
        );

        // Test balanceOf function
        uint256 balance = collection.balanceOf(collectionAddress);
        assertTrue(balance == 0, "Incorrect balanceOf value");

        // Test getApproved function
        vm.expectRevert(0xceea21b6); // `TokenDoesNotExist()`.
        collection.getApproved(1);

        // Test ownerOf function fails
        vm.expectRevert(0xceea21b6); // `TokenDoesNotExist()`.
        collection.ownerOf(1);

        // Test tokenURI function
        vm.expectRevert(0xbad086ea); // NotMintedYet()
        collection.tokenURI(1);

        // Test name function
        string memory name = collection.name();
        assertEq(name, params.collectionName, "Incorrect name value");

        // Test symbol function
        string memory symbol = collection.symbol();
        assertEq(symbol, params.collectionSymbol, "Incorrect symbol value");
    }

    function _verifyCollectionTokensShared(
        IImplBase collection,
        IFactory.CreateCollectionParams memory params,
        IFactory factory,
        address collectionOwner
    ) internal {
        // baseURI()
        assertEq(collection.baseURI(), params.uri, "Incorrect baseURI");

        // isApprovedForAll(address, address)
        assertFalse(
            collection.isApprovedForAll(
                makeAddr("WorldAddress"), makeAddr("HelloAddress")
            ),
            "Incorrect isApprovedForAll"
        );

        // _royaltyFee()
        assertTrue(
            collection._royaltyFee() == params.royalty,
            "collection._royaltyFee() == params.royalty :: Incorrect _royaltyFee"
        );

        // getOwner()
        assertTrue(
            collection.getOwner() != address(0),
            "collection.getOwner() != address(0) :: Incorrect getOwner"
        );
        assertTrue(
            collection.getOwner() == collectionOwner,
            "collection.getOwner() == collectionOwner :: Incorrect getOwner"
        );

        // getRouter()
        assertTrue(
            collection.getRouter() != address(0),
            "collection.getRouter() != address(0) :: Incorrect getRouter"
        );
        assertTrue(
            collection.getRouter() == factory.router(),
            "collection.getRouter() == factory.router() :: Incorrect getRouter"
        );

        // splitter()
        assertTrue(
            collection.splitter() != address(0),
            "collection.splitter() != address(0) :: Incorrect splitter"
        );
        assertTrue(
            collection.splitter() == params.splitter,
            "collection.splitter() == params.splitter :: Incorrect splitter"
        );

        // feeCount()
        assertTrue(
            collection.feeCount() == 0,
            "collection.feeCount() == 0 :: Incorrect feeCount"
        );

        // feeCountERC20()
        assertTrue(
            collection.feeCountERC20() == 0,
            "collection.feeCountERC20() == 0 :: Incorrect feeCountERC20"
        );

        // royaltyInfo(uint256, uint256)
        (address receiver, uint256 royaltyAmount) =
            collection.royaltyInfo(0, 1 ether);
        uint256 _royaltyAmount = (1 ether * params.royalty) / 10_000;

        assertTrue(
            receiver == params.splitter && royaltyAmount == _royaltyAmount,
            "Incorrect royaltyInfo"
        );

        // uriLock()
        assertTrue(
            collection.uriLock() == false,
            "collection.uriLock() == false :: Incorrect uriLock"
        );
    }
}
