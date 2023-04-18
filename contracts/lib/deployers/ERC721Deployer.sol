// SPDX-License-Identifier: AGPL-3.0-only

pragma solidity 0.8.19;

import { SplitterImpl } from "contracts/Shared/Types.sol";
import { ERC20 } from "contracts/lib/tokens/ERC20.sol";
import { ERC721Basic } from "contracts/lib/tokens/ERC721/Impl/ERC721Basic.sol";
import { CREATE3 } from "contracts/lib/utils/CREATE3.sol";

library ERC721BasicDeployer {
    function _721BasicDeploy(
        string memory _tokenSalt,
        string memory _name,
        string memory _symbol,
        string memory _baseURI,
        uint256 _price,
        uint256 _maxSupply,
        address _splitter,
        address _router,
        uint256 _royalty,
        ERC20 erc20
    ) public returns (bytes32 tokenSalt, address deployed) {
        SplitterImpl splitter = SplitterImpl(payable(_splitter));
        tokenSalt = keccak256(bytes(_tokenSalt));
        deployed = CREATE3.deploy(
            tokenSalt,
            abi.encodePacked(
                type(ERC721Basic).creationCode,
                abi.encode(_name, _symbol, _baseURI, _price, _maxSupply, splitter, _royalty, _router, erc20)
            ),
            0
        );
    }
}
