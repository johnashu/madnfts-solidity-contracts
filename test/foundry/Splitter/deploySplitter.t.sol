pragma solidity 0.8.23;

import "test/lib/forge-std/src/Test.sol";
import {
    DeploySplitterBase,
    ISplitter,
    Deployer,
    IFactory
} from "test/foundry/Base/Splitter/deploySplitterBase.sol";

import { SplitterModifiers } from
    "test/foundry/Base/Splitter/splitterModifiers.sol";

import { IDeployer } from "test/foundry/Base/Deploy/IDeployer.sol";

contract TestSplitterDeployment is DeploySplitterBase, SplitterModifiers {
    IFactory[] deployedContracts;
    Deployer deployer;
    address[] madFeeTokenAddresses;

    function setUp() public {
        // Instantiate deployer contracts
        deployer = new Deployer();

        IDeployer.DeployedContracts memory erc721 =
            deployer.deployAll(ercTypes.ERC721, isERC20);
        IDeployer.DeployedContracts memory erc1155 =
            deployer.deployAll(ercTypes.ERC1155, isERC20);

        // Create array of Factory instances to cover both 721 & 1155 Factories
        deployedContracts = [erc721.factory, erc1155.factory];

        madFeeTokenAddresses =
            [address(erc721.paymentToken), address(erc1155.paymentToken)];
    }

    // @dev tests the condition:
    // (_ambassador == address(0) && _project == address(0))
    function testSplitterDeployment_creatorOnly(uint8 x) public {
        vm.assume(x < deployedContracts.length);
        _runSplitterDeploy_creatorOnly(
            deployedContracts[x], madFeeTokenAddresses[x]
        );
    }

    /// @dev tests the condition:
    /// _project != address(0) && _ambassador == address(0)
    /// && _projectShare > 99 && _projectShare < 10001
    function testSplitterDeployment_projectWithNoAmbassador_100Percent()
        public
    {
        _runSplitterDeploy_projectWithNoAmbassador(
            deployedContracts[0], 10_000, madFeeTokenAddresses[0]
        );
    }

    /// @dev tests the condition:
    /// _ambassador != address(0) && _project == address(0)
    ///             && _ambassadorShare > 99 && _ambassadorShare < 2001
    function testSplitterDeploymentFuzzy_ambassadorWithNoProject(
        uint16 _ambassadorShare,
        uint8 x
    ) public ambassadorWithNoProjectAssumptions(_ambassadorShare) {
        vm.assume(x < deployedContracts.length);
        _runSplitterDeploy_ambassadorWithNoProject(
            deployedContracts[x],
            uint256(_ambassadorShare),
            madFeeTokenAddresses[x]
        );
    }

    /// @dev tests the condition:
    /// _project != address(0) && _ambassador == address(0)
    /// && _projectShare > 99 && _projectShare < 10001
    function testSplitterDeploymentFuzzy_projectWithNoAmbassador(
        uint16 _projectShare,
        uint8 x
    ) public projectWithNoAmbassadorAssumptions(_projectShare) {
        vm.assume(x < deployedContracts.length);
        _runSplitterDeploy_projectWithNoAmbassador(
            deployedContracts[x],
            uint256(_projectShare),
            madFeeTokenAddresses[x]
        );
    }

    /// @dev tests the condition:
    /// _ambassador != address(0) && _project != address(0)
    ///            && _ambassadorShare > 99 && _ambassadorShare < 2001 &&
    /// _projectShare > 99
    ///             && _projectShare < 10001
    function testSplitterDeploymentFuzzy_All(
        uint16 _ambassadorShare,
        uint16 _projectShare,
        uint8 x
    )
        public
        bothAmbassadorAndProjectAssumptions(_ambassadorShare, _projectShare)
    {
        vm.assume(x < deployedContracts.length);
        _runSplitterDeploy_BothAmbassadorAndProject(
            deployedContracts[x],
            uint256(_ambassadorShare),
            uint256(_projectShare),
            madFeeTokenAddresses[x]
        );
    }

    /// @dev tests the condition:
    /// _ambassador != address(0) && _project != address(0)
    ///            && _ambassadorShare > 99 && _ambassadorShare < 2001 &&
    /// _projectShare > 99
    ///             && _projectShare < 10001
    function testSplitterDeployment_All() public {
        _runSplitterDeploy_BothAmbassadorAndProject(
            deployedContracts[0], 2000, 2000, madFeeTokenAddresses[0]
        );
    }
}
