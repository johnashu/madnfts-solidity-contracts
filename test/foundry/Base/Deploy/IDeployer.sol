pragma solidity 0.8.23;

import { MockERC20 } from "test/foundry/Base/Tokens/ERC20/deployMockERC20.sol";
import { IFactory } from "test/foundry/Base/Factory/IFactory.sol";
import { IRouter } from "test/foundry/Base/Router/interfaces/IRouter.sol";

interface IDeployer {
    struct DeployedContracts {
        MockERC20 paymentToken;
        IFactory factory;
        IRouter router;
    }
}
