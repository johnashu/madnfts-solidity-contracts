// SPDX-License-Identifier: AGPL-3.0-only

pragma solidity 0.8.19;

import { SplitterImpl } from "contracts/Shared/Types.sol";
import { ERC20 } from "contracts/lib/tokens/ERC20.sol";
import { ERC1155Basic } from "contracts/lib/tokens/ERC1155/Impl/ERC1155Basic.sol";
import { CREATE3 } from "contracts/lib/utils/CREATE3.sol";

library ERC1155BasicDeployer {
    function _1155BasicDeploy(
        string memory _tokenSalt,
        string memory _uri,
        uint256 _price,
        uint256 _maxSupply,
        address _splitter,
        address _router,
        uint256 _royalty,
        ERC20 _erc20
    ) public returns (bytes32 tokenSalt, address deployed) {
        SplitterImpl splitter = SplitterImpl(payable(_splitter));
        tokenSalt = keccak256(bytes(_tokenSalt));
        deployed = CREATE3.deploy(
            tokenSalt,
            abi.encodePacked(
                type(ERC1155Basic).creationCode,
                abi.encode(_uri, _price, _maxSupply, splitter, _royalty, _router, _erc20)
            ),
            0
        );
    }
}
