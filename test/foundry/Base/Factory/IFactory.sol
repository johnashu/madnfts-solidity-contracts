// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.23;

import { FactoryTypes } from "contracts/Shared/FactoryTypes.sol";

interface IFactory {
    function name() external pure returns (string memory);

    // Deployment
    function owner() external view returns (address);
    function erc20() external view returns (address);
    function router() external view returns (address);
    function createSplitter(CreateSplitterParams calldata params)
        external
        payable;

    function createCollection(CreateCollectionParams calldata params)
        external
        payable;

    function createCollection(
        CreateCollectionParams calldata params,
        address collectionPaymentToken
    ) external payable;

    struct CreateSplitterParams {
        bytes32 splitterSalt;
        address ambassador;
        address project;
        uint256 ambassadorShare;
        uint256 projectShare;
        address madFeeTokenAddress;
    }

    struct CreateCollectionParams {
        address madFeeTokenAddress;
        uint8 tokenType;
        bytes32 tokenSalt;
        string collectionName;
        string collectionSymbol;
        uint256 price;
        uint256 maxSupply;
        string uri;
        address splitter;
        uint96 royalty;
    }

    struct CollectionParams {
        address collectionOwner;
        uint8 collectionType;
        bytes32 collectionSalt;
        uint256 blocknumber;
        address splitter;
    }

    // Storage
    function collectionInfo(address)
        external
        view
        returns (
            address creator,
            uint8 collectionType,
            bytes32 collectionSalt,
            uint256 blocknumber,
            address splitter
        );

    function collectionTypes(uint256 index)
        external
        view
        returns (bytes memory);

    function creatorAuth(address _token, address _user)
        external
        view
        returns (bool stdout);

    function collectionCheck(address _collectionId)
        external
        view
        returns (bool check);

    function userTokens(address user)
        external
        view
        returns (bytes32[] memory);

    function splitterInfo(address creator, address splitterContract)
        external
        view
        returns (FactoryTypes.SplitterConfig memory);

    // Helpers
    function getIDsLength(address _user) external view returns (uint256);

    function getDeployedAddress(bytes32 _salt, address _addr)
        external
        view
        returns (address);

    // Owner functions
    function addCollectionType(uint256 index, bytes memory impl) external;
    // function setMarket(address _market) external;
    function setOwner(address newOwner) external;
    function setRouter(address _router) external;

    function setFees(uint256 _feeCreateCollection, uint256 _feeCreateSplitter)
        external;

    function setFees(
        uint256 _feeCreateCollection,
        uint256 _feeCreateSplitter,
        address erc20Token
    ) external;

    function feeCreateCollection() external view returns (uint256);
    function feeCreateSplitter() external view returns (uint256);

    struct Fee {
        uint256 feeAmount;
        bool isValid;
    }

    function feeCreateCollectionErc20(address erc20Token)
        external
        view
        returns (Fee memory);

    function feeCreateSplitterErc20(address erc20Token)
        external
        view
        returns (Fee memory);

    function transferOwnership(address newOwner) external;
    function acceptOwnership() external;
}
