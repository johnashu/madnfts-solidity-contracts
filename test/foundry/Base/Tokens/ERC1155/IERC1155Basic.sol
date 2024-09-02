// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.23;

import { IImplBase } from "test/foundry/Base/Tokens/common/IImplBase.sol";

interface IERC1155Basic is IImplBase {
    struct PublicMintValues {
        bool publicMintState;
        uint256 price;
        uint256 limit;
        uint256 startDate;
        uint256 endDate;
    }

    // View Functions
    function mintCount(uint256 id) external view returns (uint256);

    function balanceOf(address owner, uint256 id)
        external
        view
        returns (uint256 result);

    function balanceOfBatch(address[] memory owners, uint256[] memory ids)
        external
        view
        returns (uint256[] memory balances);

    function getOwner() external view returns (address);

    function getRouter() external view returns (address);

    function liveSupply(uint256 id) external view returns (uint256);

    function totalSupply(uint256 id) external view returns (uint256);

    function maxSupply(uint256 id) external view returns (uint256);

    function publicMintPrice(uint256 id) external view returns (uint256);

    function setPublicMintPrice(uint256 id, uint256 price) external;

    function publicMintState(uint256 id) external view returns (bool);

    function setPublicMintState(uint256 id, bool _state) external;

    function mintedByAddress(uint256 id, address minter)
        external
        view
        returns (uint256);

    function uri(uint256 id) external view returns (string memory);

    // Other Functions
    function burn(
        address[] memory from,
        uint256[] memory ids,
        uint256[] memory balances
    ) external payable;

    function burnBatch(
        address from,
        uint256[] memory ids,
        uint256[] memory amounts
    ) external payable;

    function mint(uint256 _id, uint256 _amount) external payable;

    function mint(address _to, uint256 _id, uint256 amount) external payable;

    function mintBatch(uint256[] memory ids, uint256[] memory amounts)
        external
        payable;

    function mintBatchTo(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts
    ) external payable;

    function mintTo(address to, uint256 amount, uint256 balance)
        external
        payable;

    function safeBatchTransferFrom(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) external;

    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) external;

    function setApprovalForAll(address operator, bool isApproved) external;

    function withdraw() external payable;

    function withdrawERC20(address erc20) external;

    function publicMintLimit(uint256 _id) external view returns (uint256);

    function setPublicMintLimit(uint256 _id, uint256 _limit) external;

    function setPublicMintDates(
        uint256 _id,
        uint256 _startDate,
        uint256 _endDate
    ) external;

    function setPublicMintValues(uint256 _id, PublicMintValues memory _values)
        external;
}
