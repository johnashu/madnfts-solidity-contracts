// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.23;

import "test/lib/forge-std/src/Test.sol";
import { MockERC20 } from "test/test-tokens/erc20-mock.sol";
import { AddressesHelp } from "test/foundry/utils/addressesHelp.sol";

contract DeployERC20 is Test, AddressesHelp {
    MockERC20 public mockERC20;

    address erc20Owner = makeAddr("ERC20Owner");
    address ercHolder = makeAddr("ERCHolder");
    string name = "MockERC20";
    string symbol = "MERC20";
    uint8 decimals = 18;
    uint256 amountToMint = 1000 ether;
    uint256 numHolders = 10;

    function setUp() public {
        // vm.startPrank(erc20Owner);
        vm.deal(erc20Owner, 1000 ether);
    }

    function testDeployERC20() internal returns (MockERC20 _mockERC20) {
        _deploy(erc20Owner);
    }

    function testDeployAndMint() public returns (MockERC20 _mockERC20) {
        address[] memory holders =
            createManyAddresses(numHolders, "ERC20Holder", amountToMint);
        _mockERC20 = _deploy(erc20Owner);
        for (uint256 i = 0; i < numHolders; i++) {
            _mockERC20.mint(holders[i], amountToMint);
            assertTrue(
                _mockERC20.balanceOf(holders[i]) == amountToMint,
                "_mockERC20.balanceOf(holders[i]) == amountToMint :: do not match"
            );
        }
    }

    function _deploy(address owner) public returns (MockERC20 _mockERC20) {
        vm.prank(owner);
        _mockERC20 = new MockERC20(name, symbol, decimals, amountToMint);
        _mockERC20.mint(ercHolder, amountToMint);

        // emit log_named_address("erc20Owner", erc20Owner);
        // emit log_named_address("ercHolder", ercHolder);
        // emit log_named_address("owner", owner);

        assertTrue(
            _mockERC20.balanceOf(ercHolder) == amountToMint,
            "_mockERC20.balanceOf(ercHolder) == amountToMint :: do not match"
        );
        assertTrue(
            _mockERC20.balanceOf(owner) == amountToMint,
            "_mockERC20.balanceOf(owner) == amountToMint :: do not match"
        );
    }
}
