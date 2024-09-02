// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.22;

import { FactoryVerifier } from "contracts/Shared/EventsAndErrors.sol";

interface IRouter {
    // Pure Functions
    function name() external pure returns (string memory);

    // View Functions
    function owner() external view returns (address);
    function recipient() external view returns (address);
    function erc20() external view returns (address);
    function madFactory() external view returns (FactoryVerifier);

    function feeBurn() external view returns (uint256);
    function feeMint() external view returns (uint256);

    function feeLookup(bytes4 sigHash) external view returns (uint256 fee);

    // Setter Functions
    function setFactory(address _factory) external;
    function setOwner(address newOwner) external;
    function setRecipient(address _recipient) external;

    function setFees(uint256 _feeMint, uint256 _feeBurn) external;

    function setFees(uint256 _feeMint, uint256 _feeBurn, address erc20Token)
        external;

    struct Fee {
        uint256 feeAmount;
        bool isValid;
    }

    function feeMintErc20(address erc20Token)
        external
        view
        returns (Fee memory);
    function feeBurnErc20(address erc20Token)
        external
        view
        returns (Fee memory);

    function mintTo(address collection, address to, uint128 amount)
        external
        payable;

    function mintTo(
        address collection,
        address to,
        uint128 amount,
        address erc20Token
    ) external payable;

    function mintTo(
        address collection,
        address _to,
        uint256 _id,
        uint256 _amount,
        address madFeeTokenAddress,
        uint256 _maxSupply
    ) external payable;

    function mintTo(
        address collection,
        address _to,
        uint256 _id,
        uint256 _amount,
        uint256 _maxSupply
    ) external payable;

    function mint(address collection, uint256 _id, uint256 _amount)
        external
        payable;

    function mint(
        address collection,
        uint256 _id,
        uint256 _amount,
        address madFeeTokenAddress
    ) external payable;

    function mint(address collection, uint128 amount) external payable;

    function mint(address collection, uint128 amount, address erc20Token)
        external
        payable;

    function burn(address collection, uint128[] memory _ids) external payable;

    function burn(address collection, uint128[] memory _ids, address erc20Token)
        external;

    function transferOwnership(address newOwner) external;
    function acceptOwnership() external;
}
