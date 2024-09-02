// SPDX-License-Identifier: AGPL-3.0-only

pragma solidity 0.8.23;

import { MADBase } from "contracts/Shared/MADBase.sol";
import {
    FactoryEventsAndErrorsBase,
    FactoryVerifier
} from "contracts/Shared/EventsAndErrors.sol";
import { FactoryTypes } from "contracts/Shared/FactoryTypes.sol";
import { SplitterImpl } from "contracts/Splitter/SplitterImpl.sol";
import { CREATE3, Bytes32AddressLib } from "contracts/lib/utils/CREATE3.sol";
import { SplitterBufferLib } from "contracts/Splitter/SplitterBufferLib.sol";

import { FeeHandlerFactory } from "contracts/Factory/FeeHandler.sol";

// prettier-ignore
abstract contract MADFactoryBase is
    MADBase,
    FactoryEventsAndErrorsBase,
    FactoryVerifier,
    FeeHandlerFactory
{
    using FactoryTypes for FactoryTypes.CollectionArgs;
    using FactoryTypes for FactoryTypes.SplitterConfig;
    using FactoryTypes for FactoryTypes.Collection;
    using Bytes32AddressLib for address;
    using Bytes32AddressLib for bytes32;

    ////////////////////////////////////////////////////////////////
    //                           STORAGE                          //
    ////////////////////////////////////////////////////////////////

    /// @dev Function SigHash: 0x06fdde03
    function name() public pure returns (string memory) {
        assembly {
            mstore(0x20, 0x20)
            mstore(0x47, 0x07666163746F7279)
            return(0x20, 0x60)
        }
    }

    ////////////////////////////////////////////////////////////////
    //                           STORAGE                          //
    ////////////////////////////////////////////////////////////////

    /// @dev `collectionIds` are derived from a collection's address.
    mapping(address collectionId => FactoryTypes.Collection) public
        collectionInfo;

    /// @dev Nested mapping that takes an collection creator as key of
    /// a hashmap of splitter contracts to its respective deployment configs.
    mapping(address => mapping(address => FactoryTypes.SplitterConfig)) public
        splitterInfo;

    /// @dev Maps collection's index to its respective bytecode.
    mapping(uint256 collectionIndex => bytes collectionBytecode) public
        collectionTypes;

    /// @dev Maps a collection creator, of type address, to an array of
    /// `collectionIds`.
    mapping(address collectionOwner => address[] deployedCollections) public
        userTokens;

    /// @dev Instance of `MADRouter` being passed as parameter of collection's
    /// constructor.
    address public router;
    address public constant ADDRESS_ZERO = address(0);

    ////////////////////////////////////////////////////////////////
    //                         CONSTRUCTOR                        //
    ////////////////////////////////////////////////////////////////

    constructor(address _recipient) {
        setRecipient(_recipient);
    }

    /**
     * @notice Create collection, an internal state-modifying function.
     * @param params The params (CreateCollectionParams).
     * @param collectionToken The collection token address.
     * @return address Result of _createCollection.
     * @custom:signature _createCollection(address,address)
     * @custom:selector 0x279bd0e5
     */
    function _createCollection(
        FactoryTypes.CreateCollectionParams calldata params,
        address collectionToken
    ) internal returns (address) {
        _isZeroAddr(router);

        // Only required if the collection has a splitter AND royalty share > 0
        // Will revert if either of these are 0.
        if (params.splitter != ADDRESS_ZERO && params.royalty > 0) {
            _limiter(params.tokenType, params.splitter);
            _royaltyLocker(params.royalty);
        }

        address madFeeTokenAddress = params.madFeeTokenAddress;
        if (madFeeTokenAddress == ADDRESS_ZERO) {
            _handleFees(feeCreateCollection);
        } else {
            _handleFees(madFeeTokenAddress, this.feeCreateCollectionErc20);
        }
        address deployedCollection = _collectionDeploy(
            params.tokenType,
            params.tokenSalt,
            FactoryTypes.CollectionArgs(
                params.collectionName,
                params.collectionSymbol,
                params.uri,
                params.price,
                params.maxSupply,
                params.splitter,
                params.royalty,
                router,
                collectionToken,
                msg.sender
            )
        );

        userTokens[msg.sender].push(deployedCollection);

        collectionInfo[deployedCollection] = FactoryTypes.Collection(
            msg.sender,
            params.tokenType,
            params.tokenSalt,
            block.number,
            params.splitter,
            true
        );
        return deployedCollection;
    }

    ////////////////////////////////////////////////////////////////
    //                           HELPERS                          //
    ///////////////////////////////////////////////////////////////

    /**
     * @notice Create splitter, an internal state-modifying function.
     * @param params The params (CreateSplitterParams).
     * @param _flag The flag (uint256).
     * @custom:signature _createSplitter(address,uint256)
     * @custom:selector 0x7e308ce4
     */
    function _createSplitter(
        FactoryTypes.CreateSplitterParams calldata params,
        uint256 _flag
    ) internal {
        address madFeeTokenAddress = params.madFeeTokenAddress;
        if (madFeeTokenAddress == ADDRESS_ZERO) {
            _handleFees(feeCreateSplitter);
        } else {
            _handleFees(madFeeTokenAddress, this.feeCreateSplitterErc20);
        }

        uint256 projectShareParsed =
            ((10_000 - params.ambassadorShare) * params.projectShare) / 10_000;

        address[] memory _payees;
        uint256[] memory _shares;

        if (projectShareParsed < 10_000) {
            _payees = SplitterBufferLib.payeesBuffer(
                params.ambassador, params.project
            );

            _shares = SplitterBufferLib.sharesBuffer(
                params.ambassadorShare, projectShareParsed
            );
        } else {
            _payees = new address[](1);
            _payees[0] = params.project;
            _shares = new uint256[](1);
            _shares[0] = 10_000;
        }

        address splitter =
            _splitterDeploy(params.splitterSalt, _payees, _shares);

        splitterInfo[msg.sender][splitter] = FactoryTypes.SplitterConfig(
            splitter,
            params.splitterSalt,
            params.ambassador,
            params.project,
            params.ambassadorShare,
            projectShareParsed,
            true
        );

        emit SplitterCreated(msg.sender, _shares, _payees, splitter, _flag);
    }

    /**
     * @notice Collection deploy, an internal state-modifying function.
     * @param _tokenType The token type (uint8).
     * @param _tokenSalt The token salt (bytes32).
     * @param _args The args (CollectionArgs).
     * @return deployed An address value.
     * @custom:signature _collectionDeploy(uint8,bytes32,address)
     * @custom:selector 0x29eb98ce
     */
    function _collectionDeploy(
        uint8 _tokenType,
        bytes32 _tokenSalt,
        FactoryTypes.CollectionArgs memory _args
    ) internal returns (address deployed) {
        deployed = CREATE3.deploy(
            keccak256(abi.encode(msg.sender, _tokenSalt)),
            abi.encodePacked(
                // implementation
                collectionTypes[uint256(_tokenType)],
                abi.encode(_args)
            ),
            0
        );
    }

    /**
     * @notice Splitter deploy, an internal state-modifying function.
     * @param _salt The salt (bytes32).
     * @param _payees List of addresses.
     * @param _shares List of uint256s.
     * @return deployed An address value.
     * @custom:signature _splitterDeploy(bytes32,address[],uint256[])
     * @custom:selector 0x9b7300e0
     */
    function _splitterDeploy(
        bytes32 _salt,
        address[] memory _payees,
        uint256[] memory _shares
    ) internal returns (address deployed) {
        deployed = CREATE3.deploy(
            keccak256(abi.encode(msg.sender, _salt)),
            abi.encodePacked(
                type(SplitterImpl).creationCode, abi.encode(_payees, _shares)
            ),
            0
        );
    }

    /**
     * @notice Get ids length I, a public view function.
     * @notice Everything in storage can be fetch through the
     * getters natively provided by all public mappings.
     * @dev This public getter serves as a hook to ease frontend
     * fetching whilst estimating user's collectionId indexes.
     * @param _user The user address.
     * @return uint256 Result of getIDsLength.
     * @custom:signature getIDsLength(address)
     * @custom:selector 0x8691fe46
     */
    function getIDsLength(address _user) public view returns (uint256) {
        return userTokens[_user].length;
    }

    /// @inheritdoc FactoryVerifier
    /**
     * @notice Creator auth, an external state-modifying function.
     * @param _token The token address.
     * @param _user The user address.
     * @return stdout A bool value.
     * @custom:signature creatorAuth(address,address)
     * @custom:selector 0x76de0f3d
     */
    function creatorAuth(address _token, address _user)
        external
        view
        override(FactoryVerifier)
        returns (bool stdout)
    {
        stdout = _userRender(_user);

        uint256 len = getIDsLength(_user);

        for (uint256 i = 0; i < len; ++i) {
            if (_token == userTokens[_user][i]) {
                stdout = true;
                break;
            }
        }
    }

    /**
     * @notice Royalty locker, an internal pure function.
     * @dev Reverts if provided share is greater
     * than 1000 or does not fit the tick (i.e., 25).
     * @param _share The share (uint96).
     * @custom:signature _royaltyLocker(uint96)
     * @custom:selector 0xe04dc3ca
     */
    function _royaltyLocker(uint96 _share) internal pure {
        if (_share > 1000 || _share % 25 != 0) revert InvalidRoyalty();
    }

    /**
     * @notice Limiter, an internal view function.
     * @param _tokenType The token type (uint8).
     * @param _splitter The splitter address.
     * @custom:signature _limiter(uint8,address)
     * @custom:selector 0x485a1cff
     */
    function _limiter(uint8 _tokenType, address _splitter) internal view {
        bool isValid = splitterInfo[msg.sender][_splitter].valid;
        if (!isValid) revert InvalidSplitter();

        assembly {
            mstore(0, _tokenType)
            mstore(32, collectionTypes.slot)

            if iszero(sload(keccak256(0, 64))) {
                mstore(0x00, 0xa1e9dd9d) // InvalidTokenType()
                revert(0x1c, 0x04)
            }
        }
    }

    /**
     * @notice Is zero addr, a private pure function.
     * @param _addr The addr address.
     * @custom:signature _isZeroAddr(address)
     * @custom:selector 0x13e92334
     */
    function _isZeroAddr(address _addr) private pure {
        assembly {
            if iszero(_addr) {
                // Revert ZeroAddress()
                mstore(0x00, 0xd92e233d)
                revert(0x1c, 0x04)
            }
        }
    }

    /**
     * @notice Private view helper that checks an user against `userTokens`
     * storage slot.
     * @dev Function Sighash := 0xbe749257
     * @dev `creatorAuth` method extension.
     * @return _stdout := 1 as boolean standard output.
     * @custom:signature _userRender(address)
     * @custom:selector 0xbe749257
     */
    function _userRender(address _user) private view returns (bool _stdout) {
        assembly {
            _stdout := true
            let pointer := mload(0x40)
            mstore(add(pointer, 32), userTokens.slot)
            mstore(add(pointer, 64), _user)
            let hash := keccak256(pointer, 64)
            if iszero(sload(hash)) { _stdout := false }
        }
    }

    /**
     * @notice External getter for deployed splitters and collections.
     * @param _salt The salt (bytes32).
     * @param _addr The addr address.
     * @return address Result of getDeployedAddress.
     * @custom:signature getDeployedAddress(bytes32,address)
     * @custom:selector 0xc661d4b1
     */
    function getDeployedAddress(bytes32 _salt, address _addr)
        public
        view
        returns (address)
    {
        bytes32 salt = keccak256(abi.encode(_addr, _salt));
        return CREATE3.getDeployed(salt);
    }

    ////////////////////////////////////////////////////////////////
    //                         OWNER FX                           //
    ////////////////////////////////////////////////////////////////

    /**
     * @notice Set MadRouter, a public state-modifying function.
     * @dev Has modifiers: onlyOwner.
     * @param _router The router address.
     * @custom:signature setRouter(address)
     * @custom:selector 0xc0d78655
     */
    function setRouter(address _router) public onlyOwner {
        _isZeroAddr(_router);
        assembly {
            sstore(router.slot, _router)
        }

        emit RouterUpdated(_router);
    }

    /**
     * @notice Add collection type, a public state-modifying function.
     * @dev Has modifiers: onlyOwner.
     * @dev We allow a collectionType to be set as the zeroAddr,
     *      so its slot can be reset to default value.
     * @param index The index (uint256).
     * @param impl The impl (bytes).
     * @custom:signature addCollectionType(uint256,bytes)
     * @custom:selector 0x71337391
     */
    function addCollectionType(uint256 index, bytes calldata impl)
        public
        onlyOwner
    {
        collectionTypes[index] = impl;

        emit CollectionTypeAdded(index);
    }

    ////////////////////////////////////////////////////////////////
    //                           HELPERS                          //
    ////////////////////////////////////////////////////////////////

    /**
     * @notice Collection check, an external state-modifying function.
     * @inheritdoc FactoryVerifier
     * @notice This function is used by `MADRouter` to check if a  collection
     *  is a valid MAD collection.
     * @dev Function Sighash := 97cf65af
     * @param _collectionId address of the collection.
     * @return Boolean output to either approve or reject call's
     * @custom:signature collectionCheck(address)
     * @custom:selector 0x97cf65af
     */
    function collectionCheck(address _collectionId)
        external
        view
        override(FactoryVerifier)
        returns (bool)
    {
        return collectionInfo[_collectionId].isValid;
    }

    /**
     * @notice Set fees, a public state-modifying function.
     * @dev Has modifiers: onlyOwner.
     * @param _feeCreateCollectionNew The fee create collection new (uint256).
     * @param _feeCreateSplitterNew The fee create splitter new (uint256).
     * @custom:signature setFees(uint256,uint256)
     * @custom:selector 0x0b78f9c0
     */
    function setFees(
        uint256 _feeCreateCollectionNew,
        uint256 _feeCreateSplitterNew
    ) public onlyOwner {
        _setFees(_feeCreateCollectionNew, _feeCreateSplitterNew);
        emit FeesUpdated(_feeCreateCollectionNew, _feeCreateSplitterNew);
    }

    /**
     * @notice Set fees, a public state-modifying function.
     * @dev Has modifiers: onlyOwner.
     * @param _feeCreateCollectionErc20New The fee create collection erc20 new
     * (uint256).
     * @param _feeCreateSplitterErc20New The fee create splitter erc20 new
     * (uint256).
     * @param madFeeTokenAddress The mad fee token address.
     * @custom:signature setFees(uint256,uint256,address)
     * @custom:selector 0xe4d73e59
     */
    function setFees(
        uint256 _feeCreateCollectionErc20New,
        uint256 _feeCreateSplitterErc20New,
        address madFeeTokenAddress
    ) public onlyOwner {
        _setFees(
            _feeCreateCollectionErc20New,
            _feeCreateSplitterErc20New,
            madFeeTokenAddress
        );
        emit FeesUpdated(
            _feeCreateCollectionErc20New,
            _feeCreateSplitterErc20New,
            madFeeTokenAddress
        );
    }

    /**
     * @notice Invalidate fee, a public state-modifying function.
     * @dev Has modifiers: onlyOwner.
     * @param madFeeTokenAddress The mad fee token address.
     * @param invalidateCollectionFee The invalidate collection fee (bool).
     * @param invalidateSplitterFee The invalidate splitter fee (bool).
     */
    function invalidateFee(
        address madFeeTokenAddress,
        bool invalidateCollectionFee,
        bool invalidateSplitterFee
    ) public onlyOwner {
        _invalidateFee(
            madFeeTokenAddress, invalidateCollectionFee, invalidateSplitterFee
        );
    }

    /**
     * @notice Set recipient, a public state-modifying function.
     * @notice Setter for public mint / burn fee _recipient.
     * @dev Has modifiers: onlyOwner.
     * @param _recipient The recipient address.
     * @custom:signature setRecipient(address)
     * @custom:selector 0x3bbed4a0
     */
    function setRecipient(address _recipient) public onlyOwner {
        // require(_recipient != address(0), "Invalid address");

        assembly {
            if iszero(_recipient) {
                mstore(0x00, 0xd92e233d)
                revert(0x1c, 0x04)
            }
            sstore(recipient.slot, _recipient)
        }

        emit RecipientUpdated(_recipient);
    }
}
