// SPDX-License-Identifier: AGPL-3.0-only

pragma solidity 0.8.19;

interface SplitterEventsAndErrors {
    ////////////////////////////////////////////////////////////////
    //                           EVENTS                           //
    ////////////////////////////////////////////////////////////////

    event PayeeAdded(address account, uint256 shares);

    event PaymentReleased(address to, uint256 amount);

    event PaymentReceived(address from, uint256 amount);

    event ERC20PaymentReleased(address indexed token, address to, uint256 amount);

    ////////////////////////////////////////////////////////////////
    //                           ERRORS                           //
    ////////////////////////////////////////////////////////////////

    /// @dev 0xff633a38
    error LengthMismatch();
    /// @dev 0x7b21919d
    error NoPayees();
    /// @dev 0xb317087b
    error NoShares();
    /// @dev 0xb8e10e7e
    error DeniedAccount();
    /// @dev 0x84ff3e1b
    error DeadAddress();
    /// @dev 0x100d5f74
    error InvalidShare();
    /// @dev 0x42b50ca2
    error AlreadyPayee();
}
