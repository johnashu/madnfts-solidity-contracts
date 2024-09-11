// SPDX-License-Identifier: AGPL-3.0-only

pragma solidity 0.8.23;

// solhint-disable-next-line
import { MADBase, IERC20 } from "contracts/Shared/MADBase.sol";
import { FeeHandler } from "contracts/Router/FeeHandler.sol";

import {
    RouterEvents, FactoryVerifier
} from "contracts/Shared/EventsAndErrors.sol";

interface IOwned {
    function getOwner() external view returns (address);
}

abstract contract MADRouterBase is MADBase, FeeHandler, RouterEvents {
    /// @notice Contract name.
    /// @dev Function Sighash := 0x06fdde03
    function name() public pure returns (string memory) {
        assembly {
            mstore(0x20, 0x20)
            mstore(0x46, 0x6726F75746572)
            return(0x20, 0x60)
        }
    }

    ////////////////////////////////////////////////////////////////
    //                           STORAGE                          //
    ////////////////////////////////////////////////////////////////

    /// @notice FactoryVerifier connecting the router to madFactory.
    FactoryVerifier public madFactory;

    ////////////////////////////////////////////////////////////////
    //                         CONSTRUCTOR                        //
    ////////////////////////////////////////////////////////////////

    /// @notice Constructor requires a valid factory address and an optional
    /// erc20 payment token
    /// address.
    /// @param _recipient Public mint fee recipient address.
    constructor(FactoryVerifier _factory, address _recipient) {
        setFactory(_factory);
        setRecipient(_recipient);
    }

    ////////////////////////////////////////////////////////////////
    //                         OWNER FX                           //
    ////////////////////////////////////////////////////////////////

    /**
     * @notice Set factory, a public state-modifying function.
     * @dev Has modifiers: onlyOwner.
     * @dev `madFactory` instance setter.
     * @param _factory The factory (FactoryVerifier).
     * @custom:signature setFactory(address)
     * @custom:selector 0x5bb47808
     */
    function setFactory(FactoryVerifier _factory) public onlyOwner {
        assembly {
            if iszero(_factory) {
                mstore(0x00, 0xd92e233d)
                revert(0x1c, 0x04)
            }
            sstore(madFactory.slot, _factory)
        }
        emit FactoryUpdated(_factory);
    }

    /**
     * @notice Set recipient, a public state-modifying function.
     * @dev Has modifiers: onlyOwner.
     * @dev Setter for public mint / burn fee _recipient.
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

    /**
     * @notice Set fees, a public state-modifying function.
     * @notice Change the Routers mint and burn fees.
     * @dev Has modifiers: onlyOwner.
     * @param _feeMint The fee mint (uint256).
     * @param _feeBurn The fee burn (uint256).
     * @custom:signature setFees(uint256,uint256)
     * @custom:selector 0x0b78f9c0
     */
    function setFees(uint256 _feeMint, uint256 _feeBurn) public onlyOwner {
        _setFees(_feeMint, _feeBurn);
        emit FeesUpdated(_feeMint, _feeBurn);
    }

    /**
     * @notice Set fees, a public state-modifying function.
     *  @notice Change the Routers mint and burn fees for erc20 Tokens.
     * @dev Has modifiers: onlyOwner.
     * @param _feeMint The fee mint (uint256).
     * @param _feeBurn The fee burn (uint256).
     * @param madFeeTokenAddress The mad fee token address.
     * @custom:signature setFees(uint256,uint256,address)
     * @custom:selector 0xe4d73e59
     */
    function setFees(
        uint256 _feeMint,
        uint256 _feeBurn,
        address madFeeTokenAddress
    ) public onlyOwner {
        _setFees(_feeMint, _feeBurn, madFeeTokenAddress);
        emit FeesUpdated(_feeMint, _feeBurn, madFeeTokenAddress);
    }

    /**
     * @notice Invalidate fee, a public state-modifying function.
     * @dev Has modifiers: onlyOwner.
     * @param madFeeTokenAddress The mad fee token address.
     * @param invalidateBurnFee The invalidate burn fee (bool).
     * @param invalidateMintFee The invalidate mint fee (bool).
     * @custom:signature invalidateFee(address,bool,bool)
     * @custom:selector 0x65e11e6e
     */
    function invalidateFee(
        address madFeeTokenAddress,
        bool invalidateBurnFee,
        bool invalidateMintFee
    ) public onlyOwner {
        _invalidateFee(madFeeTokenAddress, invalidateBurnFee, invalidateMintFee);
    }

    ////////////////////////////////////////////////////////////////
    //                         HELPERS                            //
    ////////////////////////////////////////////////////////////////

    /**
     * @notice Token render, an internal view function.
     * 	 @notice auth-check mechanism that verifies `madFactory` storage.
     * @dev Retrieves both `collectionId` (bytes32) and collection type (uint8)
     *     for valid token and approved user.
     * @param collectionId 721 / 1155 token address.
     * @custom:signature _tokenRender(address)
     * @custom:selector 0xdbf62b2e
     */
    function _tokenRender(address collectionId) internal view {
        if (!madFactory.collectionCheck(collectionId)) {
            revert NotValidCollection();
        }
    }

    /**
     * @notice Is collection owner, an internal view function.
     * @dev Checks if the msg.sender is the collection owner for mintTo calls.
     * @param collectionId The collection id address.
     * @custom:signature _isCollectionOwner(address)
     * @custom:selector 0x69a58d80
     */
    function _isCollectionOwner(address collectionId) internal view {
        if (msg.sender != IOwned(collectionId).getOwner()) {
            revert NotCollectionOwner();
        }
    }
}
