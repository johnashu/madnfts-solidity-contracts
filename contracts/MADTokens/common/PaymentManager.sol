// SPDX-License-Identifier: AGPL-3.0-only

pragma solidity 0.8.23;

import { IERC20 } from "contracts/lib/tokens/ERC20/interfaces/IERC20.sol";
import { SplitterImpl } from "contracts/Splitter/SplitterImpl.sol";
import { SafeTransferLib } from "contracts/lib/utils/SafeTransferLib.sol";

abstract contract PaymentManager {
    ////////////////////////////////////////////////////////////////
    //                          ERRORS                            //
    ////////////////////////////////////////////////////////////////

    // @dev 0xd0d04f60
    error NothingToWithdraw();
    // @dev 0xa0f3feea
    error WrongToken();
    // @dev 0x68e26200
    error IncorrectPriceAmount();

    ////////////////////////////////////////////////////////////////
    //                          IMMUTABLE                         //
    ////////////////////////////////////////////////////////////////

    /// @notice Splitter address relationship.
    SplitterImpl public immutable splitter;

    /// @notice ERC20 payment token address.
    IERC20 public immutable erc20;

    ////////////////////////////////////////////////////////////////
    //                           STORAGE                          //
    ////////////////////////////////////////////////////////////////

    /// @notice total amount of fees accumulated in native currency.
    uint256 public feeCount;

    /// @notice total amount of fees accumulated in wrapped token (erc20).
    uint256 public feeCountERC20;

    /// @notice boolean check if ERC20 Payments are enabled.
    bool public immutable erc20PaymentsEnabled;

    ////////////////////////////////////////////////////////////////
    //                         CONSTRUCTOR                        //
    ////////////////////////////////////////////////////////////////
    constructor(address _splitter, address _erc20) {
        splitter = SplitterImpl(payable(_splitter));
        erc20 = IERC20(_erc20);
        if (address(_erc20) != address(0)) {
            erc20PaymentsEnabled = true;
        }
    }

    ////////////////////////////////////////////////////////////////
    //             OWNER WITHDRAW / FEE DISTRIBUTION              //
    ////////////////////////////////////////////////////////////////

    modifier _isZeroAddr(address _addr) {
        assembly {
            if iszero(_addr) {
                // Revert ZeroAddress()
                mstore(0x00, 0xd92e233d)
                revert(0x1c, 0x04)
            }
        }
        _;
    }

    ////////////////////////////////////////////////////////////////
    //                       OWNER WITHDRAW                       //
    ////////////////////////////////////////////////////////////////

    ///

    /**
     * @notice Withdraw, an internal state-modifying function.
     * @dev Withdraws the balance of the contract to the splitter.
     * @notice Owner Withdraw ETH.
     * @dev If any Eth is trapped in the contract, owner can withdraw it to the
     * splitter.
     * @custom:signature _withdraw()
     * @custom:selector 0xc10eb14d
     */
    function _withdraw() internal {
        uint256 balance = address(this).balance;
        SafeTransferLib.safeTransferETH(payable(address(splitter)), balance);
    }

    /**
     * @notice Owner Withdraw ERC20 Tokens.
     * @dev If any ERC20 Tokens are trapped in the contract, owner can withdraw
     * it to the splitter.
     * @dev Has modifiers: _isZeroAddr.
     * @param _erc20 The erc20 address.
     * @custom:signature _withdrawERC20(address)
     * @custom:selector 0xa1b2cf01
     */
    function _withdrawERC20(address _erc20) internal _isZeroAddr(_erc20) {
        IERC20 _token = IERC20(_erc20);
        uint256 balance = _token.balanceOf(address(this));
        SafeTransferLib.safeTransfer(_token, address(splitter), balance);
    }

    /**
     * @notice Public payment handler, an internal state-modifying function.
     * @param _mintAmount The mint amount (uint256).
     * @param _minter The minter address.
     * @custom:signature _publicPaymentHandler(uint256,address)
     * @custom:selector 0xab242a31
     */
    function _publicPaymentHandler(uint256 _mintAmount, address _minter)
        internal
    {
        if (erc20PaymentsEnabled) {
            feeCountERC20 = feeCountERC20 + _mintAmount;
            SafeTransferLib.safeTransferFrom(
                erc20, _minter, address(splitter), _mintAmount
            );
        } else {
            feeCount = feeCount + _mintAmount;
            // Relay the msg.value to the splitter.
            SafeTransferLib.safeTransferETH(address(splitter), _mintAmount);
        }
    }

    ////////////////////////////////////////////////////////////////
    //                     INTERNAL HELPERS                       //
    ////////////////////////////////////////////////////////////////

    /**
     * @notice Public mint price check, an internal view function.
     * @param _amount The amount (uint256).
     * @param _minter The minter address.
     * @return _value An uint256 value.
     * @custom:signature _publicMintPriceCheck(uint256,address)
     * @custom:selector 0x18dbe601
     */
    function _publicMintPriceCheck(
        uint256 _amount,
        address _minter,
        uint256 _price
    ) internal view returns (uint256 _value) {
        // No point in doing any calcluations if the price is 0 (Free).
        if (_price == 0) {
            return 0;
        }

        if (!erc20PaymentsEnabled) {
            _value = msg.value;
            if ((_price * _amount) != _value) revert IncorrectPriceAmount();
        } else {
            uint256 allowed = erc20.allowance(_minter, address(this));
            _value = _price * _amount;
            if (allowed < _value) revert IncorrectPriceAmount();
        }
    }
}
