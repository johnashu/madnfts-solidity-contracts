pragma solidity 0.8.23;

import {
    DeploySplitterBase,
    IFactory,
    SplitterHelpers
} from "test/foundry/Base/Splitter/deploySplitterBase.sol";

import {
    CreateCollectionBase,
    Strings
} from "test/foundry/Base/Factory/createCollectionBase.sol";

import {
    ERC721TransferFunctions,
    ICollection
} from "test/foundry/CreateCollection/_transferFunctionsERC721.sol";

import { ERC1155TransferFunctions } from
    "test/foundry/CreateCollection/_transferFunctions1155.sol";

contract CreateCollectionHelpers is
    CreateCollectionBase,
    ERC721TransferFunctions,
    ERC1155TransferFunctions,
    ICollection
{
    function _createCollectionDefault(
        IFactory _factory,
        DeploySplitterBase splitterDeployer,
        address _currentSigner,
        uint256 _price,
        address madFeeTokenAddress
    ) internal returns (address _collectionAddress, address _splitter) {
        splitterDeployer.setCurrentSigner(_currentSigner);

        _splitter = splitterDeployer._runSplitterDeploy_creatorOnly(
            _factory, madFeeTokenAddress
        );

        setCurrentSigner(_currentSigner);
        // emit log_named_address("currentSigner", currentSigner);

        _collectionAddress =
            createCollectionDefault(_factory, _splitter, _price);

        assertTrue(
            _collectionAddress != address(0), "collectionAddress != address(0)"
        );
        assertTrue(_splitter != address(0), "splitter != address(0)");
    }

    function _createCollectionsWithAllSplitterCombosCustom(
        address _currentSigner,
        DeploySplitterBase _splitterDeployer,
        uint256 _price,
        uint128 _maxSupply,
        uint96 _royalty,
        uint256 _amountToMint,
        address factory,
        uint256 _ambassadorShare,
        uint256 _projectShare,
        string memory _baseURI,
        address madFeeTokenAddress
    ) internal {
        // Define arrays for function signatures and arguments
        (bytes4[4] memory functionSignatures, bytes[4] memory functionArgs) =
        SplitterHelpers.allSplitterCombinations(
            address(factory),
            _ambassadorShare,
            _projectShare,
            madFeeTokenAddress
        );

        _splitterDeployer.setCurrentSigner(_currentSigner);

        // Iterate over the function signatures and arguments
        uint256 funcSignaturesLength = 4;
        for (uint256 j = 0; j < funcSignaturesLength; j++) {
            address splitter = SplitterHelpers.callFunctionAndGetSplitter(
                address(_splitterDeployer),
                functionSignatures[j],
                functionArgs[j]
            );

            for (uint256 i = 0; i < _amountToMint; i++) {
                emit log_named_uint("Block Number", block.number);

                string memory BASE_NAME = string(
                    abi.encodePacked("createCollection_", Strings.toString(i))
                );

                string memory BASE_SYMBOL =
                    string(abi.encodePacked("CC", Strings.toString(i)));

                address collectionAddress = createCollectionCustom(
                    IFactory(factory),
                    splitter,
                    IFactory.CreateCollectionParams(
                        madFeeTokenAddress,
                        1,
                        updateCreateCollectionSalt(),
                        BASE_NAME,
                        BASE_SYMBOL,
                        _price,
                        _maxSupply,
                        _baseURI,
                        splitter,
                        _royalty
                    ),
                    _currentSigner
                );

                assertTrue(
                    collectionAddress != address(0),
                    "collectionAddress != address(0)  ::  Do match"
                );
            }
        }
    }

    function _createCollectionAssumptions(
        uint256 _price,
        uint128 _maxSupply,
        uint96 _royalty
    ) internal pure {
        vm.assume(_price < type(uint256).max);
        vm.assume(_maxSupply > 0 && _maxSupply < type(uint32).max);
        vm.assume(_royalty < 1001 && _royalty % 25 == 0);
    }
}
