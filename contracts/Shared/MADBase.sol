// SPDX-License-Identifier: AGPL-3.0-only

pragma solidity 0.8.19;

import { EventsAndErrorsBase } from "contracts/Shared/EventsAndErrors.sol";
import { ERC20 } from "contracts/lib/tokens/ERC20.sol";

import { ReentrancyGuard } from "contracts/lib/security/ReentrancyGuard.sol";
import { Pausable } from "contracts/lib/security/Pausable.sol";
import { Owned } from "contracts/lib/auth/Owned.sol";

abstract contract MADBase is EventsAndErrorsBase, Owned(msg.sender), Pausable, ReentrancyGuard {
    ////////////////////////////////////////////////////////////////
    //                           STORAGE                          //
    ////////////////////////////////////////////////////////////////

    /// @notice ERC20 payment token address.
    ERC20 public erc20;

    ////////////////////////////////////////////////////////////////
    //                         OWNER FX                           //
    ////////////////////////////////////////////////////////////////

    /// @notice Paused state initializer for security risk mitigation pratice.
    /// @dev Function Signature := 0x8456cb59
    function pause() public onlyOwner {
        _pause();
    }

    /// @notice Unpaused state initializer for security risk mitigation pratice.
    /// @dev Function Signature := 0x3f4ba83a
    function unpause() public onlyOwner {
        _unpause();
    }

    /// @notice Enables the contract's owner to change payment token address.
    /// @dev Function Signature := ?
    function _setPaymentToken(address _paymentTokenAddress) internal {
        require(_paymentTokenAddress != address(0), "Invalid token address");
        erc20 = ERC20(_paymentTokenAddress);

        emit PaymentTokenUpdated(_paymentTokenAddress);
    }
}
