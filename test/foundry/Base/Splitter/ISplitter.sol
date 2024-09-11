pragma solidity 0.8.23;

import { IERC20 } from "contracts/lib/utils/SafeTransferLib.sol";
import { IFactory } from "test/foundry/Base/Factory/IFactory.sol";

interface ISplitter {
    // Public getters
    function _shares(address account) external view returns (uint256);
    function _payees(uint256 index) external view returns (address);
    function payeesLength() external view returns (uint256);
    function totalShares() external view returns (uint256);
    function totalReleased() external view returns (uint256);
    function totalReleased(IERC20 token) external view returns (uint256);
    function released(address account) external view returns (uint256);
    function released(IERC20 token, address account)
        external
        view
        returns (uint256);
    function releasable(address account) external view returns (uint256);
    function releasable(IERC20 token, address account)
        external
        view
        returns (uint256);

    // Public methods
    function release(address payable account) external;
    function releaseAll() external;
    function release(IERC20 token, address account) external;

    struct SplitterData {
        IFactory factory;
        address deployer;
        IFactory.CreateSplitterParams createSplitterParams;
        address[] payeesExpected;
        address paymentToken;
    }
}
