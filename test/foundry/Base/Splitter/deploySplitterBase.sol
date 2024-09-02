// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.23;

import { IFactory } from "test/foundry/Base/Factory/IFactory.sol";
import { ISplitter, IERC20 } from "test/foundry/Base/Splitter/ISplitter.sol";
import { SplitterImpl } from "contracts/Splitter/SplitterImpl.sol";
import { FactoryTypes } from "contracts/Shared/FactoryTypes.sol";
import { Deployer } from "test/foundry/Deploy/deployer.t.sol";

import {
    IDeployer,
    IFactory,
    Enums,
    MockERC20
} from "test/foundry/Base/Deploy/deployerBase.sol";

import { Strings } from "contracts/MADTokens/common/ImplBase.sol";
import { SettersToggle } from "test/foundry/utils/setterToggle.sol";
import { SplitterHelpers } from "test/foundry/Base/Splitter/splitterHelpers.sol";

contract DeploySplitterBase is Enums, SettersToggle("defaultSplitterSigner") {
    using FactoryTypes for FactoryTypes.SplitterConfig;

    uint256 public splitterSaltNonce = 67_891_012_456_894_561;
    bool public isERC20;

    function updateIsErc20(bool _isERC20) public {
        isERC20 = _isERC20;
    }

    function updateSplitterSalt() public returns (bytes32) {
        splitterSaltNonce++;
        return bytes32(abi.encodePacked(splitterSaltNonce));
    }

    // Define default variables
    uint256 public ambassadorShare = 2000;
    uint256 public projectShare = 3000;

    address public ambassador = makeAddr("AmbassadorAddress");
    address public project = makeAddr("ProjectAddress");

    event log_named_bool(string name, bool value);

    // Test the deployment
    function splitterDeployment(ISplitter.SplitterData memory splitterData)
        public
        returns (address splitterAddress)
    {
        emit log_named_bool("isERC20", isERC20);

        if (!isERC20) {
            // Prank tx.origin as well here, otherwise the splitter will be
            // owned by
            // the calling test contract
            uint256 _splitterFee = splitterData.factory.feeCreateSplitter();
            vm.prank(splitterData.deployer, splitterData.deployer);
            splitterData.factory.createSplitter{ value: _splitterFee }(
                splitterData.createSplitterParams
            );
        } else {
            // Prank tx.origin as well here, otherwise the splitter will be
            // owned by
            // the calling test contract
            uint256 _splitterFee = splitterData.factory.feeCreateSplitterErc20(
                splitterData.paymentToken
            ).feeAmount;
            vm.prank(splitterData.deployer, splitterData.deployer);
            MockERC20(splitterData.paymentToken).approve(
                address(splitterData.factory), _splitterFee
            );
            vm.prank(splitterData.deployer, splitterData.deployer);
            splitterData.factory.createSplitter(
                splitterData.createSplitterParams
            );
        }
        splitterAddress = splitterData.factory.getDeployedAddress(
            splitterData.createSplitterParams.splitterSalt,
            splitterData.deployer
        );

        validateDeployment(splitterData, splitterAddress);
    }

    // Helper function to validate the deployment
    function validateDeployment(
        ISplitter.SplitterData memory splitterData,
        address splitterAddress
    ) public {
        FactoryTypes.SplitterConfig memory config = splitterData
            .factory
            .splitterInfo(splitterData.deployer, splitterAddress);

        ISplitter splitter = ISplitter(splitterAddress);
        uint256 creatorShares = splitter._shares(splitterData.deployer);

        uint256 _payeesExpectedLength = splitterData.payeesExpected.length;

        uint256 totalShares = splitter.totalShares();

        uint256 splitterDataAmbassadorShare =
            splitterData.createSplitterParams.ambassadorShare;

        uint256 _splitterDataProjectShare =
            splitterData.createSplitterParams.projectShare;

        uint256 splitterDataProjectShare = (
            (10_000 - splitterDataAmbassadorShare) * _splitterDataProjectShare
        ) / 10_000;

        uint256 sharesOrZero = totalShares
            - (splitterDataAmbassadorShare + splitterDataProjectShare);

        emit log_named_uint("creatorShares", creatorShares);
        emit log_named_uint("totalShares", totalShares);
        emit log_named_uint(
            "splitterDataAmbassadorShare", splitterDataAmbassadorShare
        );
        emit log_named_uint(
            "splitterDataProjectShare", splitterDataProjectShare
        );
        emit log_named_uint("sharesOrZero", sharesOrZero);
        emit log_named_uint("config.projectShare", config.projectShare);

        assertTrue(
            splitterAddress != address(0),
            "Splitter address should not be zero."
        );

        assertTrue(
            splitterAddress == config.splitter,
            "Splitter address should match with storage splitter address."
        );

        assertTrue(
            splitterData.createSplitterParams.splitterSalt
                == config.splitterSalt,
            "Splitter salt should match with the stored splitter salt."
        );

        assertTrue(
            splitterData.createSplitterParams.ambassador == config.ambassador,
            "Ambassador address should match with the stored ambassador address."
        );

        assertTrue(
            splitterData.createSplitterParams.project == config.project,
            "Project address should match with the stored project address."
        );

        assertTrue(
            splitterDataAmbassadorShare == config.ambassadorShare,
            "Ambassador share should match with the stored ambassador share."
        );

        assertTrue(
            splitterDataProjectShare == config.projectShare,
            "Project share should match with the stored project share."
        );

        assertTrue(true == config.valid, "Splitter must be valid.");

        if (splitterDataProjectShare == 10_000) {
            // 100% of the shares
            _payeesExpectedLength = 1;
        }
        assertTrue(
            _payeesExpectedLength == splitter.payeesLength(),
            "Payees Lengths should match expected"
        );

        assertTrue(
            sharesOrZero == creatorShares, "Creator shares should match."
        );
        assertTrue(totalShares == 10_000, "Shares should add up to 10_000");

        assertTrue(splitter.totalReleased() == 0, "Total released should be 0");

        assertTrue(
            splitter.totalReleased() == 0,
            "Total released for specific token should be 0"
        );

        assertZeroBalanceRelease(
            splitter, splitterData.deployer, splitterData.paymentToken
        );
        assertZeroBalanceRelease(
            splitter,
            splitterData.createSplitterParams.ambassador,
            splitterData.paymentToken
        );
        assertZeroBalanceRelease(
            splitter,
            splitterData.createSplitterParams.project,
            splitterData.paymentToken
        );

        // Assuming payees are returned in the order [ambassador, project,
        // currentSigner]
        emit log_array(splitterData.payeesExpected);
        for (uint256 i = 0; i < _payeesExpectedLength; ++i) {
            address payee = splitter._payees(i);
            assertTrue(
                payee == splitterData.payeesExpected[i],
                "Payees addresses should match."
            );
        }
    }

    function assertZeroBalanceRelease(
        ISplitter splitter,
        address _currentSigner,
        address _paymentToken
    ) public {
        assertTrue(
            splitter.released(_currentSigner) == 0,
            "Released amount for specific _currentSigner should be 0"
        );

        // ERC20
        if (_paymentToken != address(0)) {
            assertTrue(
                splitter.released(IERC20(_paymentToken), _currentSigner) == 0,
                "Released amount for specific token and _currentSigner should be 0"
            );
        }
    }

    function _runSplitterDeploy_creatorOnly(
        IFactory factory,
        address madFeeTokenAddress
    ) public returns (address splitter) {
        return _runSplitterDeploy(
            ISplitter.SplitterData({
                factory: factory,
                deployer: currentSigner,
                createSplitterParams: IFactory.CreateSplitterParams({
                    splitterSalt: updateSplitterSalt(),
                    ambassador: address(0),
                    project: address(0),
                    ambassadorShare: 0,
                    projectShare: 0,
                    madFeeTokenAddress: madFeeTokenAddress
                }),
                payeesExpected: SplitterHelpers.getExpectedSplitterAddresses(
                    currentSigner, address(0), address(0)
                ),
                paymentToken: madFeeTokenAddress
            })
        );
    }

    function _runSplitterDeploy_ambassadorWithNoProject(
        IFactory factory,
        uint256 _ambassadorShare,
        address madFeeTokenAddress
    ) public returns (address splitter) {
        return _runSplitterDeploy(
            ISplitter.SplitterData({
                factory: factory,
                deployer: currentSigner,
                createSplitterParams: IFactory.CreateSplitterParams({
                    splitterSalt: updateSplitterSalt(),
                    ambassador: ambassador,
                    project: address(0),
                    ambassadorShare: _ambassadorShare,
                    projectShare: 0,
                    madFeeTokenAddress: madFeeTokenAddress
                }),
                payeesExpected: SplitterHelpers.getExpectedSplitterAddresses(
                    currentSigner, ambassador, address(0)
                ),
                paymentToken: madFeeTokenAddress
            })
        );
    }

    function _runSplitterDeploy_projectWithNoAmbassador(
        IFactory factory,
        uint256 _projectShare,
        address madFeeTokenAddress
    ) public returns (address splitter) {
        return _runSplitterDeploy(
            ISplitter.SplitterData({
                factory: factory,
                deployer: currentSigner,
                createSplitterParams: IFactory.CreateSplitterParams({
                    splitterSalt: updateSplitterSalt(),
                    ambassador: address(0),
                    project: project,
                    ambassadorShare: 0,
                    projectShare: _projectShare,
                    madFeeTokenAddress: madFeeTokenAddress
                }),
                payeesExpected: SplitterHelpers.getExpectedSplitterAddresses(
                    currentSigner, address(0), project
                ),
                paymentToken: madFeeTokenAddress
            })
        );
    }

    function _runSplitterDeploy_BothAmbassadorAndProject(
        IFactory factory,
        uint256 _ambassadorShare,
        uint256 _projectShare,
        address madFeeTokenAddress
    ) public returns (address splitter) {
        return _runSplitterDeploy(
            ISplitter.SplitterData({
                factory: factory,
                deployer: currentSigner,
                createSplitterParams: IFactory.CreateSplitterParams({
                    splitterSalt: updateSplitterSalt(),
                    ambassador: ambassador,
                    project: project,
                    ambassadorShare: _ambassadorShare,
                    projectShare: _projectShare,
                    madFeeTokenAddress: madFeeTokenAddress
                }),
                payeesExpected: SplitterHelpers.getExpectedSplitterAddresses(
                    currentSigner, ambassador, project
                ),
                paymentToken: madFeeTokenAddress
            })
        );
    }

    function _runSplitterDeploy(ISplitter.SplitterData memory splitterData)
        internal
        returns (address splitter)
    {
        vm.deal(splitterData.deployer, 20_000 ether);
        splitter = splitterDeployment(splitterData);
        assertTrue(
            splitter != address(0), "Splitter address should not be zero."
        );
    }
}
