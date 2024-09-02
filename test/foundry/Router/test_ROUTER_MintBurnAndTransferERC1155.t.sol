pragma solidity 0.8.23;

import "test/lib/forge-std/src/Test.sol";
import {
    ISplitter,
    Deployer,
    IDeployer
} from "test/foundry/Base/Splitter/deploySplitterBase.sol";

import { Enums } from "test/foundry/utils/enums.sol";

import {
    CreateCollectionHelpers,
    DeploySplitterBase,
    IFactory,
    SplitterHelpers
} from "test/foundry/CreateCollection/createCollectionHelpers.sol";

import { IERC1155Basic } from
    "test/foundry/Base/Tokens/ERC1155/IERC1155Basic.sol";
import { CreateCollectionParams } from
    "test/foundry/Base/Factory/createCollectionParams.sol";

contract TestROUTERMintBurnAndTransferERC1155 is
    CreateCollectionParams,
    CreateCollectionHelpers,
    Enums
{
    IDeployer.DeployedContracts _deployedContracts;
    Deployer _deployer;
    DeploySplitterBase public splitterDeployer;

    uint256 public nftPublicMintPrice = 1 ether;

    uint256 public defaultTokenId = 1;

    // Create default addresses
    address public nftReceiver = makeAddr("nftReceiverDefault");
    address public nftMinter = makeAddr("nftMinterDefault");
    address public prankster = makeAddr("prankster");

    uint128[] public idsToBurn =
        [1, 2, 3, 4, 5, 100, 1000, 2000, 3000, 4000, 5000, 9999, 10_000];

    function setUp() public {
        vm.deal(prankster, 100_000 ether);
        vm.deal(nftMinter, 100_000 ether);
        vm.deal(nftReceiver, 100_000 ether);
        // Instantiate _deployer contracts
        _deployer = new Deployer();

        // Instantiate splitter _deployer contract
        splitterDeployer = new DeploySplitterBase();

        CreateCollectionParams.changeTokenType(2);

        // Create array of deployed contracts instances for ERC1155
        _deployedContracts = _deployer.deployAll(ercTypes.ERC1155, isERC20);
        erc20Token = _deployedContracts.paymentToken;
    }

    function test_ROUTER_MintTo_DefaultSingle() public {
        uint128 _amountToMint = 1;
        MintData memory mintData =
            _setupMint(nftMinter, nftReceiver, 0, _amountToMint, defaultTokenId);
        _doMintTo(mintData, 0, defaultTokenId, _amountToMint);

        _checkMint(mintData, defaultTokenId);
    }

    function test_ROUTER_PublicMint_DefaultSingle() public {
        uint128 _amountToMint = 1;
        MintData memory mintData = _setupMint(
            nftMinter,
            nftReceiver,
            nftPublicMintPrice,
            _amountToMint,
            defaultTokenId
        );

        _doPublicMint(
            mintData,
            true,
            0,
            _amountToMint,
            defaultTokenId,
            block.timestamp,
            block.timestamp + 100
        );

        _checkMint(mintData, defaultTokenId);
    }

    function test_ROUTER_MintTo_DefaultMultiple() public {
        for (uint256 i = 0; i < 10; i++) {
            uint128 _amountToMint = 10;
            MintData memory mintData =
                _setupMint(nftMinter, nftReceiver, 0, _amountToMint, i + 1);
            _doMintTo(mintData, 0, i + 1, _amountToMint);
            _checkMint(mintData, i + 1);
        }
    }

    function test_ROUTER_PublicMint_DefaultMultiple() public {
        for (uint256 i = 0; i < 10; i++) {
            uint128 _amountToMint = 100;
            address _nftReceiver =
                makeAddr(string(abi.encodePacked("NFTReceiver", i)));
            MintData memory mintData = _setupMint(
                nftMinter,
                _nftReceiver,
                nftPublicMintPrice,
                _amountToMint,
                i + 1
            );

            _doPublicMint(
                mintData,
                true,
                0,
                _amountToMint,
                i + 1,
                block.timestamp,
                block.timestamp + 100
            );

            _checkMint(mintData, i + 1);
        }
    }

    function test_ROUTER_MintTo_DefaultFuzzy(uint256 _tokenId) public {
        vm.assume(_tokenId > 0);
        uint128 _amountToMint = 10;
        MintData memory mintData =
            _setupMint(nftMinter, nftReceiver, 0, _amountToMint, _tokenId);
        _doMintTo(mintData, 0, _tokenId, _amountToMint);
        _checkMint(mintData, _tokenId);
    }

    function test_ROUTER_PublicMint_DefaultFuzzy(uint256 x, uint256 _tokenId)
        public
    {
        uint128 _amountToMint = 10;
        address _nftReceiver =
            makeAddr(string(abi.encodePacked("NFTReceiver", x)));
        MintData memory mintData = _setupMint(
            nftMinter, _nftReceiver, nftPublicMintPrice, _amountToMint, _tokenId
        );
        _doPublicMint(
            mintData,
            true,
            0,
            _amountToMint,
            _tokenId,
            block.timestamp,
            block.timestamp + 100
        );

        _checkMint(mintData, _tokenId);
    }

    function test_ROUTER_SetPublicMintValues_DefaultFuzzy(
        uint256 x,
        uint256 _tokenId
    ) public {
        uint128 _amountToMint = 10;
        address _nftReceiver =
            makeAddr(string(abi.encodePacked("NFTReceiver", x)));
        MintData memory mintData = _setupMint(
            nftMinter, _nftReceiver, nftPublicMintPrice, _amountToMint, _tokenId
        );

        _updatePublicMintValues(
            _tokenId, mintData, 0, block.timestamp, block.timestamp + 100
        );
        _doPublicMint(
            mintData,
            true,
            0,
            _amountToMint,
            _tokenId,
            block.timestamp,
            block.timestamp + 100
        );
        _checkMint(mintData, _tokenId);
    }

    function test_ROUTER_SetPublicMintValues_PublicMintDatesOutOfRange()
        public
    {
        uint128 _amountToMint = 1;
        MintData memory mintData = _setupMint(
            nftMinter,
            nftReceiver,
            nftPublicMintPrice,
            _amountToMint,
            defaultTokenId
        );
        uint256 _start = block.timestamp;
        uint256 _end = block.timestamp + 100;
        _updatePublicMintValues(defaultTokenId, mintData, 0, _start, _end);
        vm.warp(block.timestamp + 1000);
        _doPublicMint(
            mintData,
            true,
            0xe4719bd6,
            _amountToMint,
            defaultTokenId,
            _start,
            _end
        );
    }

    function test_ROUTER_SetPublicMintValues_InvalidPublicMintDatesZeroEndDate()
        public
    {
        uint128 _amountToMint = 1;
        MintData memory mintData = _setupMint(
            nftMinter,
            nftReceiver,
            nftPublicMintPrice,
            _amountToMint,
            defaultTokenId
        );

        // end date 0
        _updatePublicMintValues(
            defaultTokenId, mintData, 0xc0caac2c, block.timestamp, 0
        );

        // start date > end date
        _updatePublicMintValues(
            defaultTokenId,
            mintData,
            0xc0caac2c,
            block.timestamp + 100,
            block.timestamp
        );
    }

    function test_ROUTER_PublicMint_FreeMintZeroPrice() public {
        uint128 _amountToMint = 10;
        uint256 _nftPublicMintPrice = 0;
        MintData memory mintData = _setupMint(
            nftMinter,
            nftReceiver,
            _nftPublicMintPrice,
            _amountToMint,
            defaultTokenId
        );

        _doPublicMint(
            mintData,
            true,
            0,
            _amountToMint,
            defaultTokenId,
            block.timestamp,
            block.timestamp + 100
        );

        _checkMint(mintData, defaultTokenId);
    }

    function test_ROUTER_PublicMint_PublicMintClosed() public {
        uint128 _amountToMint = 1;
        MintData memory mintData = _setupMint(
            nftMinter,
            nftReceiver,
            nftPublicMintPrice,
            _amountToMint,
            defaultTokenId
        );

        _doPublicMint(
            mintData,
            false,
            0x2d0a3f8e, // error PublicMintClosed();
            _amountToMint,
            defaultTokenId,
            block.timestamp,
            block.timestamp + 100
        );
    }

    function test_ROUTER_PublicMint_IncorrectPriceAmountSingleFuzzy(
        uint256 _nftPublicMintPrice,
        uint256 _tokenId
    ) public {
        vm.assume(_nftPublicMintPrice < nftPublicMintPrice);
        vm.assume(_tokenId > 0);
        uint128 _amountToMint = 1;
        MintData memory mintData = _setupMint(
            nftMinter, nftReceiver, nftPublicMintPrice, _amountToMint, _tokenId
        );

        mintData.nftPublicMintPrice = _nftPublicMintPrice; // change mint fee

        _doPublicMint(
            mintData,
            true,
            0x68e26200, // error IncorrectPriceAmount();
            _amountToMint,
            _tokenId,
            block.timestamp,
            block.timestamp + 100
        );
    }

    function test_ROUTER_MintTo_MaxSupply() public {
        _mintTo_MaxSupply();
    }

    function test_ROUTER_PublicMint_MaxSupply() public {
        _publicMint_MaxSupply();
    }

    ////////////////////////////////////////////////////////////////
    //                          BURN TESTS                        //
    ////////////////////////////////////////////////////////////////

    // function test_ROUTER_BurnFromMintTo_DefaultSingle() public {
    //     // Mint Max supply
    //     MintData memory mintData = _mintTo_MaxSupply();
    //     _doBurn(mintData, mintData.nftReceiver);
    // }

    // function test_ROUTER_BurnFromPublicMint_DefaultSingle() public {
    //     // Mint Max supply
    //     MintData memory mintData = _publicMint_MaxSupply();
    //     _doBurn(mintData, mintData.nftReceiver);
    // }

    ////////////////////////////////////////////////////////////////
    //                          HELPERS                           //
    ////////////////////////////////////////////////////////////////

    // function _doBurn(MintData memory mintData, address _tokenOwner) internal
    // {
    //     uint256 idsToBurnLength = idsToBurn.length;
    //     uint256 val = _deployedContracts.router.feeBurn() * idsToBurnLength;

    //     uint256 tokenId = 1;
    //     uint256 amount = 1;

    //     // Burn tokens
    //     IERC1155Basic collection = IERC1155Basic(mintData.collectionAddress);

    //     // log balance of nftMinter before
    //     uint256 _balanceNftMinterBefore = collection.balanceOf(_tokenOwner,
    // 1);

    //     vm.prank(_tokenOwner, _tokenOwner);
    //     _deployedContracts.router.burn{ value: val }(
    //         mintData.collectionAddress, _tokenOwner, tokenId, amount
    //     );

    //     uint256 _expectedBalanceNftMinterAfter =
    //         _balanceNftMinterBefore - idsToBurnLength;

    //     // Check that nftMinter no longer has the token(s)
    //     assertTrue(
    //         collection.balanceOf(_tokenOwner, tokenId) ==
    // _expectedBalanceNftMinterAfter,
    //         "collection.balanceOf(_tokenOwner) ==
    // _expectedBalanceNftMinterAfter ::  do not match"
    //     );

    //     // Check the totalSupply of the collection has decreased
    //     assertTrue(
    //         collection.totalSupply(tokenId)
    //             == mintData.newTotalSupply - idsToBurnLength,
    //         "collection.totalSupply(tokenId) == mintData.newTotalSupply -
    // idsToBurnLength ::  do not match"
    //     );

    //     // Check that the tokenId owner is the Zero Address 0x0
    //     for (uint256 i = 0; i < idsToBurnLength; i++) {
    //         vm.expectRevert(0xceea21b6); // `TokenDoesNotExist()`.
    //         collection.ownerOf(idsToBurn[i], tokenId);
    //     }

    //     // Try to burn the same tokens again
    //     vm.startPrank(_tokenOwner, _tokenOwner);
    //     vm.expectRevert(0xceea21b6); // `TokenDoesNotExist()`.
    //     _deployedContracts.router.burn{ value: val }(
    //         mintData.collectionAddress, idsToBurn
    //     );
    // }

    function _mintTo_MaxSupply() internal returns (MintData memory mintData) {
        // Mint Max Supply
        uint128 _amountToMint = 10_000;
        mintData =
            _setupMint(nftMinter, nftReceiver, 0, _amountToMint, defaultTokenId);
        _doMintTo(mintData, 0, defaultTokenId, _amountToMint);

        // Try and mint more..
        _doMintTo(mintData, 0xd05cb609, defaultTokenId, 0); // error
            // MaxSupplyReached();
    }

    function _publicMint_MaxSupply()
        internal
        returns (MintData memory mintData)
    {
        // Mint Max Supply
        uint128 _amountToMint = 10_000;
        mintData = _setupMint(
            nftMinter,
            nftReceiver,
            nftPublicMintPrice,
            _amountToMint,
            defaultTokenId
        );
        _doPublicMint(
            mintData,
            true,
            0,
            _amountToMint + 10,
            defaultTokenId,
            block.timestamp,
            block.timestamp + 100
        );

        // Try and mint more..
        _doPublicMint(
            mintData,
            true,
            0xd05cb609,
            _amountToMint * 2 + 10,
            defaultTokenId,
            block.timestamp,
            block.timestamp + 100
        ); // error
            // MaxSupplyReached();
    }

    function _setupMint(
        address _nftMinter,
        address _nftReceiver,
        uint256 _nftPublicMintPrice,
        uint128 _amountToMint,
        uint256 _tokenId
    ) internal returns (MintData memory mintData) {
        // Create Collection & Splitter
        vm.prank(_nftMinter);
        (address _collectionAddress, address _splitterAddress) =
        _createCollectionDefault(
            _deployedContracts.factory,
            splitterDeployer,
            _nftMinter,
            _nftPublicMintPrice,
            address(erc20Token)
        );

        IERC1155Basic collection = IERC1155Basic(_collectionAddress);
        // ISplitter splitter = ISplitter(_splitterAddress);

        // Add Ether to Accounts
        vm.deal(_nftMinter, 20_000 ether);
        vm.deal(_nftReceiver, 20_000 ether);

        uint256 _totalSupplyBefore = collection.totalSupply(_tokenId);

        mintData = MintData({
            nftMinter: _nftMinter,
            nftReceiver: _nftReceiver,
            nftPublicMintPrice: _nftPublicMintPrice,
            amountToMint: _amountToMint,
            collectionAddress: _collectionAddress,
            splitterAddress: _splitterAddress,
            totalSupplyBefore: _totalSupplyBefore,
            newTotalSupply: _totalSupplyBefore + _amountToMint,
            balanceNftReceiverBefore: collection.balanceOf(_nftReceiver, _tokenId),
            balanceNftMinterBefore: collection.balanceOf(_nftMinter, _tokenId)
        });

        return mintData;
    }

    function _doMintTo(
        MintData memory mintData,
        bytes4 _errorSelector,
        uint256 tokenId,
        uint256 _maxSupply
    ) internal {
        uint256 val = _deployedContracts.router.feeMint();

        vm.startPrank(mintData.nftMinter, mintData.nftMinter);

        if (_errorSelector != 0x00000000) {
            vm.expectRevert(_errorSelector);
        }

        _deployedContracts.router.mintTo{ value: val }(
            mintData.collectionAddress,
            mintData.nftReceiver,
            tokenId,
            mintData.amountToMint,
            _maxSupply
        );
        vm.stopPrank();
    }

    function _doPublicMint(
        MintData memory mintData,
        bool _mintState,
        bytes4 _errorSelector,
        uint256 _mintLimit,
        uint256 tokenId,
        uint256 _startDate,
        uint256 _endDate
    ) internal {
        IERC1155Basic collection = IERC1155Basic(mintData.collectionAddress);
        uint256 _madMintFee = _deployedContracts.router.feeMint();

        vm.startPrank(mintData.nftMinter, mintData.nftMinter);
        collection.setPublicMintPrice(tokenId, mintData.nftPublicMintPrice);
        if (_errorSelector == 0x68e26200) {
            collection.setPublicMintPrice(
                tokenId, mintData.nftPublicMintPrice + 3
            );
        }

        if (_errorSelector != 0xe4719bd6) {
            collection.setPublicMintDates(tokenId, _startDate, _endDate);
        }

        // Mint 1 token to set the max supply.
        bool maxSupplyIsSet = collection.maxSupply(tokenId) > 0;
        if (!maxSupplyIsSet) {
            _deployedContracts.router.mintTo{ value: _madMintFee }(
                mintData.collectionAddress,
                mintData.nftMinter,
                tokenId,
                1,
                mintData.amountToMint + 1
            );
        }

        emit log_named_uint("nftPublicMintPrice", mintData.nftPublicMintPrice);
        emit log_named_uint("Price", collection.publicMintPrice(tokenId));
        emit log_named_uint("amountToMint", mintData.amountToMint);
        emit log_named_uint("_mintLimit", _mintLimit);
        emit log_named_address("owner", collection.getOwner());

        collection.setPublicMintState(tokenId, _mintState);
        if (_errorSelector == 0xa3f7d515) {
            // error ZeroPublicMintLimit();
            vm.expectRevert(_errorSelector);
            collection.setPublicMintLimit(tokenId, _mintLimit);
            return;
        }
        collection.setPublicMintLimit(tokenId, _mintLimit);

        emit log_named_uint(
            "PublicMintLimit", collection.publicMintLimit(tokenId)
        );

        // Turn on router authority
        vm.startPrank(mintData.nftMinter, mintData.nftMinter);
        collection.setRouterHasAuthority(true);

        uint256 _nftPublicMintPrice =
            mintData.nftPublicMintPrice * mintData.amountToMint;

        uint256 value = _nftPublicMintPrice + _madMintFee;

        emit log_named_uint(
            "nftPublicMintPrice AFTER", mintData.nftPublicMintPrice
        );

        vm.startPrank(mintData.nftReceiver);
        vm.deal(mintData.nftReceiver, value);
        if (_errorSelector != 0x00000000) {
            vm.expectRevert(_errorSelector);
        }

        _deployedContracts.router.mint{ value: value }(
            mintData.collectionAddress, tokenId, mintData.amountToMint
        );
        vm.stopPrank();
    }

    function _updatePublicMintValues(
        uint256 tokenId,
        MintData memory mintData,
        bytes4 _errorSelector,
        uint256 _startDate,
        uint256 _endDate
    ) internal {
        vm.startPrank(mintData.nftMinter, mintData.nftMinter);
        IERC1155Basic collection = IERC1155Basic(mintData.collectionAddress);
        uint256 _madMintFee = _deployedContracts.router.feeMint();
        // Mint 1 token to set the max supply.
        bool maxSupplyIsSet = collection.maxSupply(tokenId) > 0;
        if (!maxSupplyIsSet) {
            _deployedContracts.router.mintTo{ value: _madMintFee }(
                mintData.collectionAddress,
                mintData.nftMinter,
                tokenId,
                1,
                mintData.amountToMint + 1
            );
        }
        if (_errorSelector != 0x00000000) {
            vm.expectRevert(_errorSelector);
        }
        collection.setPublicMintValues(
            tokenId,
            IERC1155Basic.PublicMintValues({
                publicMintState: true,
                price: nftPublicMintPrice,
                limit: mintData.amountToMint,
                startDate: _startDate,
                endDate: _endDate
            })
        );
    }

    function _checkMint(MintData memory mintData, uint256 tokenId) internal {
        IERC1155Basic collection = IERC1155Basic(mintData.collectionAddress);

        // add 1 to mintData.newTotalSupply to account for the mintTo single
        // used to set the max supply
        // Check if the nftReceiver has minted any tokens using publicMint, if
        // so, mintTo was used to set the max supply.
        if (collection.mintedByAddress(tokenId, mintData.nftReceiver) > 0) {
            mintData.newTotalSupply += 1;
        }

        // Check that nftReceiver has the token(s)
        assertTrue(
            collection.balanceOf(mintData.nftReceiver, tokenId)
                == mintData.balanceNftReceiverBefore + mintData.amountToMint,
            "collection.balanceOf(mintData.nftReceiver) == mintData.balanceNftReceiverBefore + mintData.amountToMint ::  do not match"
        );

        // Check the totalSupply of the collection has increased
        assertTrue(
            collection.totalSupply(tokenId) == mintData.newTotalSupply,
            "collection.totalSupply(totalSupply) == mintData.newTotalSupply ::  do not match"
        );

        assertTrue(
            _checkOwnerOf1155(mintData.nftReceiver, mintData, tokenId),
            "_checkOwnerOf(mintData.nftReceiver, mintData) ::  false"
        );

        _checkTransferFrom1155(mintData, tokenId);
        _checkSafeTransferFrom1155(mintData, tokenId);
        _checkSafeTransferFromWithData1155(mintData, tokenId);
    }
}
