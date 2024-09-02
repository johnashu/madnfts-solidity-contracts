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

import { IERC721Basic } from "test/foundry/Base/Tokens/ERC721/IERC721Basic.sol";

contract TestMintBurnAndTransferERC721 is CreateCollectionHelpers, Enums {
    IDeployer.DeployedContracts deployedContracts;
    Deployer deployer;
    DeploySplitterBase splitterDeployer;

    uint256 nftPublicMintPrice = 1 ether;

    // Create default addresses
    address nftReceiver = makeAddr("nftReceiverDefault");
    address nftMinter = makeAddr("nftMinterDefault");
    address prankster = makeAddr("prankster");

    uint128[] idsToBurn =
        [1, 2, 3, 4, 5, 100, 1000, 2000, 3000, 4000, 5000, 9999, 10_000];

    function setUp() public {
        vm.deal(prankster, 20_000 ether);
        // Instantiate deployer contracts
        deployer = new Deployer();

        // Instantiate splitter deployer contract
        splitterDeployer = new DeploySplitterBase();

        // Create array of deployed contracts instances for ERC721
        deployedContracts = deployer.deployAll(ercTypes.ERC721, isERC20);
        erc20Token = deployedContracts.paymentToken;
    }

    function testMintTo_DefaultSingle() public {
        uint128 _amountToMint = 1;
        MintData memory mintData =
            _setupMint(nftMinter, nftReceiver, 0, _amountToMint);
        _doMintTo(mintData, 0);

        _checkMint(mintData);
    }

    function testPublicMint_DefaultSingle() public {
        uint128 _amountToMint = 1;
        MintData memory mintData = _setupMint(
            nftMinter, nftReceiver, nftPublicMintPrice, _amountToMint
        );

        _doPublicMint(mintData, true, 0, _amountToMint);

        _checkMint(mintData);
    }

    function testMintTo_DefaultMultiple() public {
        for (uint256 i = 0; i < 10; i++) {
            uint128 _amountToMint = 10;
            address _nftReceiver =
                makeAddr(string(abi.encodePacked("NFTReceiver", i)));
            MintData memory mintData =
                _setupMint(nftMinter, _nftReceiver, 0, _amountToMint);
            _doMintTo(mintData, 0);

            _checkMint(mintData);
        }
    }

    function TestPublicMint_DefaultMultiple() public {
        for (uint256 i = 0; i < 10; i++) {
            uint128 _amountToMint = 10;
            MintData memory mintData = _setupMint(
                nftMinter, nftReceiver, nftPublicMintPrice, _amountToMint
            );

            _doPublicMint(mintData, true, 0, _amountToMint);

            _checkMint(mintData);
        }
    }

    function testMintTo_DefaultFuzzy(uint256) public {
        uint128 _amountToMint = 10;
        MintData memory mintData =
            _setupMint(nftMinter, nftReceiver, 0, _amountToMint);
        _doMintTo(mintData, 0);
        _checkMint(mintData);
    }

    function testPublicMint_DefaultFuzzy(uint256) public {
        uint128 _amountToMint = 10;
        MintData memory mintData = _setupMint(
            nftMinter, nftReceiver, nftPublicMintPrice, _amountToMint
        );
        _doPublicMint(mintData, true, 0, _amountToMint);
        _checkMint(mintData);
    }

    function testSetPublicMintValues_DefaultFuzzy(uint256) public {
        uint128 _amountToMint = 10;
        MintData memory mintData = _setupMint(
            nftMinter, nftReceiver, nftPublicMintPrice, _amountToMint
        );

        _updatePublicMintValues(
            mintData, 0, block.timestamp, block.timestamp + 100
        );
        _doPublicMint(mintData, true, 0, _amountToMint);
        _checkMint(mintData);
    }

    function testSetPublicMintValues_PublicMintDatesOutOfRange() public {
        uint128 _amountToMint = 10;
        MintData memory mintData = _setupMint(
            nftMinter, nftReceiver, nftPublicMintPrice, _amountToMint
        );

        _updatePublicMintValues(
            mintData, 0, block.timestamp, block.timestamp + 1
        );
        vm.warp(block.timestamp + 100);
        _doPublicMint(mintData, true, 0xe4719bd6, _amountToMint);
    }

    function testSetPublicMintValues_InvalidPublicMintDatesZeroEndDate()
        public
    {
        uint128 _amountToMint = 10;
        MintData memory mintData = _setupMint(
            nftMinter, nftReceiver, nftPublicMintPrice, _amountToMint
        );
        // end date 0
        _updatePublicMintValues(mintData, 0xc0caac2c, block.timestamp, 0);
        // start date > end date
        _updatePublicMintValues(
            mintData, 0xc0caac2c, block.timestamp + 100, block.timestamp
        );
    }

    function testPublicMint_FreeMintZeroPrice() public {
        uint128 _amountToMint = 10;
        uint256 _nftPublicMintPrice = 0;
        MintData memory mintData = _setupMint(
            nftMinter, nftReceiver, _nftPublicMintPrice, _amountToMint
        );

        _doPublicMint(mintData, true, 0, _amountToMint);
    }

    function testSetPublicMint_Unauthorised() public {
        uint128 _amountToMint = 1;
        MintData memory mintData = _setupMint(
            nftMinter, nftReceiver, nftPublicMintPrice, _amountToMint
        );

        IERC721Basic collection = IERC721Basic(mintData.collectionAddress);

        vm.startPrank(prankster);
        vm.deal(prankster, 20_000 ether);
        vm.expectRevert(0x1648fd01); // error NotAuthorised();
        collection.setPublicMintState(true);
        vm.stopPrank();
    }

    function testPublicMint_PublicMintClosed() public {
        uint128 _amountToMint = 1;
        MintData memory mintData = _setupMint(
            nftMinter, nftReceiver, nftPublicMintPrice, _amountToMint
        );

        _doPublicMint(
            mintData,
            false,
            0x2d0a3f8e, // error PublicMintClosed();
            _amountToMint
        );
    }

    function testPublicMint_IncorrectFeeSingleFuzzy(uint256 _nftPublicMintPrice)
        public
    {
        vm.assume(_nftPublicMintPrice < nftPublicMintPrice);
        uint128 _amountToMint = 1;
        MintData memory mintData = _setupMint(
            nftMinter, nftReceiver, nftPublicMintPrice, _amountToMint
        );

        mintData.nftPublicMintPrice = _nftPublicMintPrice; // change mint fee

        _doPublicMint(
            mintData,
            true,
            0x68e26200, // error IncorrectPriceAmount();
            _amountToMint
        );
    }

    function testPublicMint_MintLimitReached() public {
        uint128 _amountToMint = 10;
        MintData memory mintData = _setupMint(
            nftMinter, nftReceiver, nftPublicMintPrice, _amountToMint
        );

        _doPublicMint(
            mintData,
            true,
            0x303b682f, // error ZeroPublicMintLimit();
            1
        );
    }

    function testPublicMint_ZeroAmount() public {
        uint128 _amountToMint = 0;
        MintData memory mintData = _setupMint(
            nftMinter, nftReceiver, nftPublicMintPrice, _amountToMint
        );

        _doPublicMint(
            mintData,
            true,
            0x1f2a2005, // error ZeroAmount();
            _amountToMint + 1
        );
    }

    function testMintTo_ZeroAmount() public {
        uint128 _amountToMint = 0;
        MintData memory mintData =
            _setupMint(nftMinter, nftReceiver, 0, _amountToMint);

        _doMintTo(mintData, 0x1f2a2005); // error ZeroAmount();
    }

    function testMintTo_UnAuthorised() public {
        uint128 _amountToMint = 1;
        MintData memory mintData = _setupMint(
            nftMinter, nftReceiver, nftPublicMintPrice, _amountToMint
        );

        // Attempt to Mint to nftReceiver
        vm.prank(prankster);

        vm.expectRevert(0x1648fd01); // error NotAuthorised();
        IERC721Basic(mintData.collectionAddress).mintTo(prankster, 1);
    }

    function testMintTo_MaxSupply() public {
        _mintTo_MaxSupply();
    }

    function testPublicMint_MaxSupply() public {
        _publicMint_MaxSupply();
    }

    ////////////////////////////////////////////////////////////////
    //                          BURN TESTS                        //
    ////////////////////////////////////////////////////////////////

    function testBurnFromMintTo_DefaultSingle() public {
        // Mint Max supply
        MintData memory mintData = _mintTo_MaxSupply();
        _doBurn(mintData, mintData.nftReceiver);
    }

    function testBurnFromPublicMint_DefaultSingle() public {
        // Mint Max supply
        MintData memory mintData = _publicMint_MaxSupply();
        _doBurn(mintData, mintData.nftReceiver);
    }

    ////////////////////////////////////////////////////////////////
    //                          WIHDRAW TESTS                     //
    ////////////////////////////////////////////////////////////////

    function testWithdrawEth() public {
        uint128 amountToMint = 10;
        uint256 _amountToSend = 10 ether;

        // Create Collection & Splitter
        MintData memory mintData =
            _setupMint(nftMinter, nftReceiver, nftPublicMintPrice, amountToMint);
        address contractAddress = mintData.collectionAddress;
        address _splitterAddress = mintData.splitterAddress;

        uint256 balanceBefore = _splitterAddress.balance;

        IERC721Basic collection = IERC721Basic(contractAddress);

        // Send some NAtive  tokens to the contractAddress
        vm.deal(contractAddress, _amountToSend);

        // Check the balance of the contract address
        assertTrue(
            contractAddress.balance == _amountToSend,
            "contractAddress.balance == _amountToSend ::  do not match"
        );

        // Withdraw NAtive tokens
        vm.startPrank(mintData.nftMinter);
        collection.withdraw();

        // Check the balance of the contract address
        assertTrue(
            contractAddress.balance == 0,
            "contractAddress.balance == 0 ::  do not match"
        );

        // Check ETH has been sent to the Splitter contract
        assertTrue(
            _splitterAddress.balance == balanceBefore + _amountToSend,
            "_splitterAddress.balance == balanceBefore + _amountToSend ::  do not match"
        );
    }

    ////////////////////////////////////////////////////////////////
    //                          HELPERS                           //
    ////////////////////////////////////////////////////////////////

    function _doBurn(MintData memory mintData, address _tokenOwner) internal {
        uint256 idsToBurnLength = idsToBurn.length;
        // Burn tokens
        IERC721Basic collection = IERC721Basic(mintData.collectionAddress);

        // log balance of nftMinter before
        uint256 _balanceNftMinterBefore = collection.balanceOf(_tokenOwner);

        vm.prank(_tokenOwner, _tokenOwner);
        collection.burn(idsToBurn);

        uint256 _expectedBalanceNftMinterAfter =
            _balanceNftMinterBefore - idsToBurnLength;

        // Check that nftMinter no longer has the token(s)
        assertTrue(
            collection.balanceOf(_tokenOwner) == _expectedBalanceNftMinterAfter,
            "collection.balanceOf(_tokenOwner) == _expectedBalanceNftMinterAfter ::  do not match"
        );

        // Check the totalSupply of the collection has decreased
        assertTrue(
            collection.totalSupply()
                == mintData.newTotalSupply - idsToBurnLength,
            "collection.totalSupply() == mintData.newTotalSupply - idsToBurnLength ::  do not match"
        );

        // Check that the tokenId owner is the Zero Address 0x0
        for (uint256 i = 0; i < idsToBurnLength; i++) {
            vm.expectRevert(0xceea21b6); // `TokenDoesNotExist()`.
            collection.ownerOf(idsToBurn[i]);
        }

        // Try to burn the same tokens again
        vm.startPrank(_tokenOwner, _tokenOwner);
        vm.expectRevert(0xceea21b6); // `TokenDoesNotExist()`.
        collection.burn(idsToBurn);
    }

    function _mintTo_MaxSupply() internal returns (MintData memory mintData) {
        // Mint Max Supply
        uint128 _amountToMint = 10_000;
        mintData = _setupMint(nftMinter, nftReceiver, 0, _amountToMint);
        _doMintTo(mintData, 0);

        // Try and mint more..
        vm.deal(nftMinter, 20_000 ether);
        _doMintTo(mintData, 0xd05cb609); // error MaxSupplyReached();
    }

    function _publicMint_MaxSupply()
        internal
        returns (MintData memory mintData)
    {
        // Mint Max Supply
        uint128 _amountToMint = 10_000;
        mintData = _setupMint(
            nftMinter, nftReceiver, nftPublicMintPrice, _amountToMint
        );
        _doPublicMint(mintData, true, 0, _amountToMint + 10);

        // Try and mint more..
        vm.deal(nftMinter, 20_000 ether);
        _doPublicMint(mintData, true, 0xd05cb609, 5); // error
            // MaxSupplyReached();
    }

    function _setupMint(
        address _nftMinter,
        address _nftReceiver,
        uint256 _nftPublicMintPrice,
        uint128 _amountToMint
    ) internal returns (MintData memory mintData) {
        // Create Collection & Splitter
        vm.prank(_nftMinter);
        (address _collectionAddress, address _splitterAddress) =
        _createCollectionDefault(
            deployedContracts.factory,
            splitterDeployer,
            _nftMinter,
            _nftPublicMintPrice,
            address(erc20Token)
        );

        IERC721Basic collection = IERC721Basic(_collectionAddress);
        // ISplitter splitter = ISplitter(_splitterAddress);

        // Turn off router authority
        vm.prank(_nftMinter);
        collection.setRouterHasAuthority(false);

        // Add Ether to Accounts
        vm.deal(_nftMinter, 20_000 ether);
        vm.deal(_nftReceiver, 20_000 ether);

        uint256 _totalSupplyBefore = collection.totalSupply();

        mintData = MintData({
            nftMinter: _nftMinter,
            nftReceiver: _nftReceiver,
            nftPublicMintPrice: _nftPublicMintPrice,
            amountToMint: _amountToMint,
            collectionAddress: _collectionAddress,
            splitterAddress: _splitterAddress,
            totalSupplyBefore: _totalSupplyBefore,
            newTotalSupply: _totalSupplyBefore + _amountToMint,
            balanceNftReceiverBefore: collection.balanceOf(_nftReceiver),
            balanceNftMinterBefore: collection.balanceOf(_nftMinter)
        });

        return mintData;
    }

    function _doMintTo(MintData memory mintData, bytes4 _errorSelector)
        internal
    {
        vm.startPrank(mintData.nftMinter, mintData.nftMinter);
        IERC721Basic collection = IERC721Basic(mintData.collectionAddress);

        if (_errorSelector != 0x00000000) {
            vm.expectRevert(_errorSelector);
        }
        collection.mintTo(mintData.nftReceiver, mintData.amountToMint);
        vm.stopPrank();
    }

    function _doPublicMint(
        MintData memory mintData,
        bool _mintState,
        bytes4 _errorSelector,
        uint256 _mintLimit
    ) internal {
        IERC721Basic collection = IERC721Basic(mintData.collectionAddress);

        emit log_named_uint("nftPublicMintPrice", mintData.nftPublicMintPrice);
        emit log_named_uint("Price", collection.price());
        emit log_named_uint("amountToMint", mintData.amountToMint);
        emit log_named_uint("_mintLimit", _mintLimit);

        vm.startPrank(mintData.nftMinter, mintData.nftMinter);
        collection.setPublicMintState(_mintState);
        if (_errorSelector == 0xa3f7d515) {
            // error ZeroPublicMintLimit();
            vm.expectRevert(_errorSelector);
            collection.setPublicMintLimit(_mintLimit);
            return;
        }
        collection.setPublicMintLimit(_mintLimit);

        emit log_named_uint("PublicMintLimit", collection.publicMintLimit());

        uint256 _nftPublicMintPrice =
            mintData.nftPublicMintPrice * mintData.amountToMint;

        emit log_named_uint(
            "nftPublicMintPrice AFTER", mintData.nftPublicMintPrice
        );

        vm.startPrank(mintData.nftReceiver);
        if (_errorSelector != 0x00000000) {
            vm.expectRevert(_errorSelector);
        }
        collection.mint{ value: _nftPublicMintPrice }(mintData.amountToMint);
        vm.stopPrank();
    }

    function _updatePublicMintValues(
        MintData memory mintData,
        bytes4 _errorSelector,
        uint256 _startDate,
        uint256 _endDate
    ) internal {
        IERC721Basic collection = IERC721Basic(mintData.collectionAddress);
        vm.startPrank(mintData.nftMinter, mintData.nftMinter);
        if (_errorSelector != 0x00000000) {
            vm.expectRevert(_errorSelector);
        }
        collection.setPublicMintValues(
            IERC721Basic.PublicMintValues({
                publicMintState: true,
                price: nftPublicMintPrice,
                limit: mintData.amountToMint,
                startDate: _startDate,
                endDate: _endDate
            })
        );
    }

    function _checkMint(MintData memory mintData) internal {
        IERC721Basic collection = IERC721Basic(mintData.collectionAddress);

        // Check that nftReceiver has the token(s)
        assertTrue(
            collection.balanceOf(mintData.nftReceiver)
                == mintData.balanceNftReceiverBefore + mintData.amountToMint,
            "collection.balanceOf(mintData.nftReceiver) == mintData.balanceNftReceiverBefore + mintData.amountToMint ::  do not match"
        );

        // Check the totalSupply of the collection has increased
        assertTrue(
            collection.totalSupply() == mintData.newTotalSupply,
            "collection.totalSupply() == mintData.newTotalSupply ::  do not match"
        );

        assertTrue(
            _checkOwnerOf(mintData.nftReceiver, mintData),
            "_checkOwnerOf(mintData.nftReceiver, mintData) ::  false"
        );

        _checkTransferFrom(mintData);
        _checkSafeTransferFrom(mintData);
        _checkSafeTransferFromWithData(mintData);
    }
}
