// SPDX-License-Identifier: AGPL-3.0-only

pragma solidity 0.8.23;

import { IERC20 } from "contracts/lib/tokens/ERC20/interfaces/IERC20.sol";
import { SafeTransferLib } from "contracts/lib/utils/SafeTransferLib.sol";
import { RouterEvents } from "contracts/Shared/EventsAndErrors.sol";

abstract contract FeeHandler {
    ////////////////////////////////////////////////////////////////
    //                           STORAGE                          //
    ////////////////////////////////////////////////////////////////

    /// @notice The recipient address used for public mint fees.
    address public recipient;

    /// @notice Passed to feeLookup to return feeMint.
    bytes4 internal constant _FEE_MINT = 0x40d097c3;

    /// @notice Passed to feeLookup to return feeBurn.
    bytes4 internal constant _FEE_BURN = 0x44df8e70;

    /// @notice Mint fee store.
    // audit B.3 BlockHat Audit
    uint256 public feeMint = 1 ether;

    /// @notice Burn fee store.
    uint256 public feeBurn = 1 ether; /* = 0 */

    struct Fee {
        uint256 feeAmount;
        bool isValid;
    }

    /// @notice ERC20 Mint fee store.
    mapping(address madFeeTokenAddress => Fee mintPrice) private _feeMintErc20;

    /// @notice ERC20 Burn fee store.
    mapping(address madFeeTokenAddress => Fee burnPrice) private _feeBurnErc20;

    modifier isZeroAddress(address _address) {
        if (_address == address(0)) {
            revert RouterEvents.AddressNotValid();
        }
        _;
    }

    /**
     * @notice Fee mint erc20, a public view function.
     * @dev Has modifiers: isZeroAddress.
     * @param madFeeTokenAddress The mad fee token address.
     * @return Fee Result of feeMintErc20.
     * @custom:signature feeMintErc20(address)
     * @custom:selector 0x42b4d2fa
     */
    function feeMintErc20(address madFeeTokenAddress)
        public
        view
        isZeroAddress(madFeeTokenAddress)
        returns (Fee memory)
    {
        return _feeMintErc20[madFeeTokenAddress];
    }

    /**
     * @notice Fee burn erc20, a public view function.
     * @dev Has modifiers: isZeroAddress.
     * @param madFeeTokenAddress The mad fee token address.
     * @return Fee Result of feeBurnErc20.
     * @custom:signature feeBurnErc20(address)
     * @custom:selector 0x6a3a2c1b
     */
    function feeBurnErc20(address madFeeTokenAddress)
        public
        view
        isZeroAddress(madFeeTokenAddress)
        returns (Fee memory)
    {
        return _feeBurnErc20[madFeeTokenAddress];
    }

    ////////////////////////////////////////////////////////////////
    //                         HELPERS                            //
    ////////////////////////////////////////////////////////////////

    /**
     * @notice Mint and burn fee lookup, an internal view function.
     * @param sigHash The sig hash (bytes4) _FEE_MINT | _FEE_BURN.
     * @return uint256 Result of feeLookup.
     * @custom:signature feeLookup(bytes4)
     * @custom:selector 0xedc9e7a4
     */
    function feeLookup(bytes4 sigHash) internal view returns (uint256) {
        if (sigHash == _FEE_MINT) {
            return feeMint;
        } else if (sigHash == _FEE_BURN) {
            return feeBurn;
        } else {
            return 0;
        }
    }

    /**
     * @notice Handle fees, an internal state-modifying function.
     * @notice Payment handler for mint and burn functions.
     * @param _feeType The fee type (bytes4) _FEE_MINT | _FEE_BURN
     * @param _amount The Amount of tokens to be minted or burned. (uint256).
     * @return _fee An uint256 value.
     * @custom:signature _handleFees(bytes4,uint256)
     * @custom:selector 0xa9c8aed5
     */
    function _handleFees(bytes4 _feeType, uint256 _amount)
        internal
        returns (uint256 _fee)
    {
        _fee = feeLookup(_feeType) * _amount;
        // Check if msg.value balance is less than the fee.. logic to check the
        // price
        // (if any) will be handled in the NFT contract itself.
        if (msg.value < _fee) revert RouterEvents.InvalidFees();

        // Transfer Fees to recipient..
        SafeTransferLib.safeTransferETH(payable(recipient), _fee);
    }

    ///
    /// @param madFeeTokenAddress
    /// @param _feeErc20  Function to return the fee amount and validity of the
    /// fee token.

    /**
     * @notice Handle fees, an internal state-modifying function.
     * @notice Payment handler for mint and burn functions.
     * @param _amount  Amount of tokens to be minted or burned. (uint256).
     * @param madFeeTokenAddress Address of the ERC20 token to be used as
     * payment token..
     * @param _feeErc20 The fee erc20 (function).
     * @custom:signature _handleFees(uint256,address,address)
     * @custom:selector 0xb5bd392e
     */
    function _handleFees(
        uint256 _amount,
        address madFeeTokenAddress,
        function (address) external view returns (Fee memory) _feeErc20
    ) internal {
        Fee memory feeErc20 = _feeErc20(madFeeTokenAddress);
        if (!feeErc20.isValid) {
            revert RouterEvents.AddressNotValid();
        }
        uint256 _fee = feeErc20.feeAmount * _amount;

        IERC20 erc20 = IERC20(madFeeTokenAddress);
        // logic to check the
        // mint price (if any) will be handled in the NFT contract itself.

        // Transfer Fees to recipient..
        SafeTransferLib.safeTransferFrom(erc20, msg.sender, recipient, _fee);
    }

    /**
     * @notice Set fees, an internal state-modifying function.
     * @notice Change the Routers mint and burn fees.
     * @dev access control / events are handled in MADRouterBase
     * @param _feeMint New fee mint (uint256).
     * @param _feeBurn New fee burn (uint256).
     * @custom:signature _setFees(uint256,uint256)
     * @custom:selector 0x305e85ba
     */
    function _setFees(uint256 _feeMint, uint256 _feeBurn) internal {
        feeMint = _feeMint;
        feeBurn = _feeBurn;
    }
    /**
     * @notice Set fees, an internal state-modifying function.
     * @notice Change the Routers mint and burn fees for erc20 tokens.
     * @dev access control / events are handled in MADRouterBase
     * @param _feeMint New fee mint (uint256).
     * @param _feeBurn New fee burn (uint256).
     * @param madFeeTokenAddress The mad fee token address.
     * @custom:signature _setFees(uint256,uint256,address)
     * @custom:selector 0x7a52ee16
     */

    function _setFees(
        uint256 _feeMint,
        uint256 _feeBurn,
        address madFeeTokenAddress
    ) internal isZeroAddress(madFeeTokenAddress) {
        _feeMintErc20[madFeeTokenAddress] = Fee(_feeMint, true);
        _feeBurnErc20[madFeeTokenAddress] = Fee(_feeBurn, true);
    }

    /**
     * @notice Invalidate fee, an internal state-modifying function.
     * @dev Has modifiers: isZeroAddress.
     * @param madFeeTokenAddress The mad fee token address.
     * @param invalidateBurnFee invalidate the burn fee (bool).
     * @param invalidateMintFee invalidate the mint fee (bool).
     */
    function _invalidateFee(
        address madFeeTokenAddress,
        bool invalidateBurnFee,
        bool invalidateMintFee
    ) internal isZeroAddress(madFeeTokenAddress) {
        if (invalidateMintFee) {
            _feeMintErc20[madFeeTokenAddress] = Fee(0, false);
        }
        if (invalidateBurnFee) {
            _feeBurnErc20[madFeeTokenAddress] = Fee(0, false);
        }
    }
}
