// SPDX-License-Identifier: AGPL-3.0-only

pragma solidity 0.8.23;

import { IERC20 } from "contracts/lib/tokens/ERC20/interfaces/IERC20.sol";
import { SafeTransferLib } from "contracts/lib/utils/SafeTransferLib.sol";
import { RouterEvents } from "contracts/Shared/EventsAndErrors.sol";

abstract contract FeeHandlerFactory {
    ////////////////////////////////////////////////////////////////
    //                           STORAGE                          //
    ////////////////////////////////////////////////////////////////

    error AddressNotValid();

    /// @notice The recipient address used for fees.
    address public recipient;

    // Native Token fees
    uint256 public feeCreateCollection = 1 ether;
    uint256 public feeCreateSplitter = 1 ether;

    struct Fee {
        uint256 feeAmount;
        bool isValid;
    }

    /// @notice ERC20 Mint fee store.
    mapping(address madFeeTokenAddress => Fee collectionPrice) private
        _feeCreateCollectionErc20;

    /// @notice ERC20 Burn fee store.
    mapping(address madFeeTokenAddress => Fee splitterPrice) private
        _feeCreateSplitterErc20;

    modifier isZeroAddress(address _address) {
        if (_address == address(0)) {
            revert AddressNotValid();
        }
        _;
    }

    /**
     * @notice Fee create collection erc20, a public state-modifying function.
     * @dev Has modifiers: isZeroAddress.
     * @param madFeeTokenAddress The mad fee token address.
     * @return Fee Result of feeCreateCollectionErc20.
     * @custom:signature feeCreateCollectionErc20(address)
     * @custom:selector 0xfec89cd8
     */
    function feeCreateCollectionErc20(address madFeeTokenAddress)
        public
        view
        isZeroAddress(madFeeTokenAddress)
        returns (Fee memory)
    {
        return _feeCreateCollectionErc20[madFeeTokenAddress];
    }

    /**
     * @notice Fee create splitter erc20, a public state-modifying function.
     * @dev Has modifiers: isZeroAddress.
     * @param madFeeTokenAddress The mad fee token address.
     * @return Fee Result of feeCreateSplitterErc20.
     * @custom:signature feeCreateSplitterErc20(address)
     * @custom:selector 0xcbf71c1c
     */
    function feeCreateSplitterErc20(address madFeeTokenAddress)
        public
        view
        isZeroAddress(madFeeTokenAddress)
        returns (Fee memory)
    {
        return _feeCreateSplitterErc20[madFeeTokenAddress];
    }

    ////////////////////////////////////////////////////////////////
    //                         HELPERS                            //
    ////////////////////////////////////////////////////////////////

    /**
     * @notice Handle fees, an internal state-modifying function.
     * @notice Payment handler for mint and burn functions.
     * @param _fee The fee (uint256).
     * @custom:signature _handleFees(uint256)
     * @custom:selector 0x6e92f8ca
     */
    function _handleFees(uint256 _fee) internal {
        // Check if msg.sender balance is less than the fee.. logic to check the
        // price
        // (if any) will be handled in the NFT contract itself.
        if (msg.value != _fee) revert RouterEvents.InvalidFees();

        // Transfer Fees to recipient..
        SafeTransferLib.safeTransferETH(payable(recipient), _fee);
    }

    /**
     * @notice Handle fees, an internal state-modifying function.
     * @notice Payment handler for mint and burn functions.
     * @param madFeeTokenAddress The mad fee token address.
     * @param _feeErc20 The fee erc20 (function).
     * @custom:signature _handleFees(address,address)
     * @custom:selector 0xfbdb8dd3
     */
    function _handleFees(
        address madFeeTokenAddress,
        function(address) external view returns (Fee memory) _feeErc20
    ) internal {
        // Check if msg.sender balance is less than the fee.. logic to check the
        // price
        // (if any) will be handled in the NFT contract itself.
        Fee memory feeErc20 = _feeErc20(madFeeTokenAddress);
        uint256 _fee = feeErc20.feeAmount;

        if (!feeErc20.isValid) {
            revert AddressNotValid();
        }

        IERC20 erc20 = IERC20(madFeeTokenAddress);

        // Transfer Fees to recipient..
        SafeTransferLib.safeTransferFrom(erc20, msg.sender, recipient, _fee);
    }

    /**
     * @notice Set fees, an internal state-modifying function.
     * @notice Change the Factorys mint and burn fees.
     * @dev access control / events are handled in MADFactoryBase
     * @param _feeCreateCollection fee for creating a new collection (uint256).
     * @param _feeCreateSplitter fee for creating a new splitter (uint256).
     * @custom:signature _setFees(uint256,uint256)
     * @custom:selector 0x305e85ba
     */
    function _setFees(uint256 _feeCreateCollection, uint256 _feeCreateSplitter)
        internal
    {
        feeCreateCollection = _feeCreateCollection;
        feeCreateSplitter = _feeCreateSplitter;
    }

    ///
    /// @param _madFeeCreateCollectionErc20 fee for creating a new collection
    /// @param _madFeeCreateSplitterErc20 fee for creating a new splitter

    /**
     * @notice Set fees, an internal state-modifying function.
     * @notice Change the Factorys mint and burn fees for erc20 tokens.
     * @dev Has modifiers: isZeroAddress.     *
     * @dev access control / events are handled in MADFactoryBase
     * @param _madFeeCreateCollectionErc20 The mad fee create collection erc20
     * (uint256).
     * @param _madFeeCreateSplitterErc20 The mad fee create splitter erc20
     * (uint256).
     * @param madFeeTokenAddress The mad fee token address.
     * @custom:signature _setFees(uint256,uint256,address)
     * @custom:selector 0x7a52ee16
     */
    function _setFees(
        uint256 _madFeeCreateCollectionErc20,
        uint256 _madFeeCreateSplitterErc20,
        address madFeeTokenAddress
    ) internal isZeroAddress(madFeeTokenAddress) {
        _feeCreateCollectionErc20[madFeeTokenAddress] =
            Fee(_madFeeCreateCollectionErc20, true);
        _feeCreateSplitterErc20[madFeeTokenAddress] =
            Fee(_madFeeCreateSplitterErc20, true);
    }

    /**
     * @notice Invalidate fee, an internal state-modifying function.
     * @dev Has modifiers: isZeroAddress.
     * @param madFeeTokenAddress The mad fee token address.
     * @param invalidateCollectionFee The invalidate collection fee (bool).
     * @param invalidateSplitterFee The invalidate splitter fee (bool).
     * @custom:signature _invalidateFee(address,bool,bool)
     * @custom:selector 0xbc076e7e
     */
    function _invalidateFee(
        address madFeeTokenAddress,
        bool invalidateCollectionFee,
        bool invalidateSplitterFee
    ) internal isZeroAddress(madFeeTokenAddress) {
        if (invalidateCollectionFee) {
            _feeCreateCollectionErc20[madFeeTokenAddress] = Fee(0, false);
        }
        if (invalidateSplitterFee) {
            _feeCreateSplitterErc20[madFeeTokenAddress] = Fee(0, false);
        }
    }
}
