// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.23;

import "test/lib/forge-std/src/Test.sol";
import { IRouter } from "test/foundry/Base/Router/interfaces/IRouter.sol";

abstract contract RouterBaseFunctions is Test {
    function _setRouterFees(
        address _owner,
        IRouter router,
        uint256 _feeMint,
        uint256 _feeBurn
    ) public {
        vm.prank(_owner);
        router.setFees(_feeMint, _feeBurn);
        assertTrue(
            router.feeMint() == _feeMint,
            "router.feeMint() == _feeMint :: do not match"
        );
        assertTrue(
            router.feeBurn() == _feeBurn,
            "router.feeBurn() == _feeBurn :: do not match"
        );
    }

    function _setRouterFees(
        address _owner,
        IRouter router,
        uint256 _feeMint,
        uint256 _feeBurn,
        address erc20Token
    ) public {
        vm.prank(_owner);
        router.setFees(_feeMint, _feeBurn, erc20Token);
        assertTrue(
            router.feeMintErc20(erc20Token).feeAmount == _feeMint,
            "router.feeMintErc20(erc20Token) == _feeMint :: do not match"
        );
        assertTrue(
            router.feeMintErc20(erc20Token).isValid == true,
            "router.feeMintErc20(erc20Token).isValid == true, :: do not match"
        );

        assertTrue(
            router.feeBurnErc20(erc20Token).isValid == true,
            "router.feeBurnErc20(erc20Token).isValid == true, :: do not match"
        );
    }
}
