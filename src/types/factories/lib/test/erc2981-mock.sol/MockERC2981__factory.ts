/* Autogenerated file. Do not edit manually. */

/* tslint:disable */

/* eslint-disable */
import type { NonPayableOverrides } from "../../../../common";
import type {
  MockERC2981,
  MockERC2981Interface,
} from "../../../../lib/test/erc2981-mock.sol/MockERC2981";
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type {
  Signer,
  BigNumberish,
  AddressLike,
  ContractDeployTransaction,
  ContractRunner,
} from "ethers";

const _abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "fee",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "NotAuthorised",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnerUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "newRoyaltyFee",
        type: "uint256",
      },
    ],
    name: "RoyaltyFeeSet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "newRecipient",
        type: "address",
      },
    ],
    name: "RoyaltyRecipientSet",
    type: "event",
  },
  {
    inputs: [],
    name: "_royaltyFee",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "_royaltyRecipient",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "salePrice",
        type: "uint256",
      },
    ],
    name: "royaltyInfo",
    outputs: [
      {
        internalType: "address",
        name: "receiver",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "royaltyAmount",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "setOwner",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
    ],
    name: "setRoyaltyRecipient",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
] as const;

const _bytecode =
  "0x34610077576105ed3881900360a0601f8201601f19168101906001600160401b0382119082101761007c576040928291845260a039126100775760a05160c0516001600160a01b03811681036100775761005891610092565b6040516104aa908161014382396080518181816102d601526103ff0152f35b600080fd5b634e487b7160e01b600052604160045260246000fd5b908160805233156101345760008054336001600160a01b0319918216811783557fc36422dcc77a5c93a5c48743078f8130c9fcc2a0ff893904ee62a3565688117c9390837f8292fce18fa69edf4db7b94ea2e58241df0ae57f97e0a6c9b29067028bf92d768180a360018060a01b0316809160015416176001557f2a5a1009e36beb67c3a1ada61dd1343d7e9ec62c70965492fbaa06234f8316b18280a280a2565b63d92e233d6000526004601cfdfe6080604052600436101561001257600080fd5b6000803560e01c90816301ffc9a71461008a5750806313af4035146100855780631525131c146100805780632a55205a1461007b57806341e42f3014610076578063769da9431461007157638da5cb5b1461006c57600080fd5b610422565b6103c9565b610348565b610289565b610237565b61019e565b346101495760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc36011261014957600435907fffffffff00000000000000000000000000000000000000000000000000000000821680920361014957507f01ffc9a700000000000000000000000000000000000000000000000000000000811490811561011f575b50151560805260206080f35b7f2a55205a0000000000000000000000000000000000000000000000000000000091501481610113565b80fd5b7ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc60209101126101995760043573ffffffffffffffffffffffffffffffffffffffff811681036101995790565b600080fd5b34610199576101ac3661014c565b73ffffffffffffffffffffffffffffffffffffffff60009181835416330361020d5780156102005780835516337f8292fce18fa69edf4db7b94ea2e58241df0ae57f97e0a6c9b29067028bf92d768380a380f35b63d92e233d83526004601cfd5b60046040517f1648fd01000000000000000000000000000000000000000000000000000000008152fd5b346101995760007ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc36011261019957602073ffffffffffffffffffffffffffffffffffffffff60015416604051908152f35b346101995760407ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126101995760243573ffffffffffffffffffffffffffffffffffffffff600154167f000000000000000000000000000000000000000000000000000000000000000091828102928184041490151715610319576127106040928351928352046020820152f35b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b34610199576103563661014c565b73ffffffffffffffffffffffffffffffffffffffff908160005416330361020d5716807fffffffffffffffffffffffff000000000000000000000000000000000000000060015416176001557f2a5a1009e36beb67c3a1ada61dd1343d7e9ec62c70965492fbaa06234f8316b1600080a2005b346101995760007ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126101995760206040517f00000000000000000000000000000000000000000000000000000000000000008152f35b346101995760007ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc36011261019957602073ffffffffffffffffffffffffffffffffffffffff60005416604051908152f3fea2646970667358221220ac108a4769021080f85ad74a85a52f097d83df39a3747bdcb2fa59457941bf6d64736f6c63430008160033";

type MockERC2981ConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: MockERC2981ConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class MockERC2981__factory extends ContractFactory {
  constructor(...args: MockERC2981ConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    fee: BigNumberish,
    recipient: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(fee, recipient, overrides || {});
  }
  override deploy(
    fee: BigNumberish,
    recipient: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ) {
    return super.deploy(fee, recipient, overrides || {}) as Promise<
      MockERC2981 & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): MockERC2981__factory {
    return super.connect(runner) as MockERC2981__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): MockERC2981Interface {
    return new Interface(_abi) as MockERC2981Interface;
  }
  static connect(address: string, runner?: ContractRunner | null): MockERC2981 {
    return new Contract(address, _abi, runner) as unknown as MockERC2981;
  }
}
