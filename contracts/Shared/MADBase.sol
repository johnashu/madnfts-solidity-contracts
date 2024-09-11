// SPDX-License-Identifier: AGPL-3.0-only

pragma solidity 0.8.23;

import { EventsAndErrorsBase } from "contracts/Shared/EventsAndErrors.sol";
import { IERC20 } from "contracts/lib/tokens/ERC20/interfaces/IERC20.sol";
import { Ownable2Step } from "contracts/lib/auth/Ownable2Step.sol";
import { Ownable } from "contracts/lib/auth/Ownable.sol";

abstract contract MADBase is EventsAndErrorsBase, Ownable2Step {
    constructor() Ownable(msg.sender) { }
}
