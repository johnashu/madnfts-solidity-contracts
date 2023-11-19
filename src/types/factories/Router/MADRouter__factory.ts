/* Autogenerated file. Do not edit manually. */

/* tslint:disable */

/* eslint-disable */
import type { MADRouter, MADRouterInterface } from "../../Router/MADRouter";
import type { NonPayableOverrides } from "../../common";
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type {
  Signer,
  AddressLike,
  ContractDeployTransaction,
  ContractRunner,
} from "ethers";

const _abi = [
  {
    inputs: [
      {
        internalType: "contract FactoryVerifier",
        name: "_factory",
        type: "address",
      },
      {
        internalType: "address",
        name: "_recipient",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "AddressNotValid",
    type: "error",
  },
  {
    inputs: [],
    name: "InsufficientBalance",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidFees",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidType",
    type: "error",
  },
  {
    inputs: [],
    name: "NoFunds",
    type: "error",
  },
  {
    inputs: [],
    name: "NotAuthorised",
    type: "error",
  },
  {
    inputs: [],
    name: "NotOwnerNorApproved",
    type: "error",
  },
  {
    inputs: [],
    name: "NotValidCollection",
    type: "error",
  },
  {
    inputs: [],
    name: "WrongPrice",
    type: "error",
  },
  {
    inputs: [],
    name: "ZeroAddress",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_id",
        type: "address",
      },
      {
        indexed: true,
        internalType: "string",
        name: "_baseURI",
        type: "string",
      },
    ],
    name: "BaseURISet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "contract FactoryVerifier",
        name: "newFactory",
        type: "address",
      },
    ],
    name: "FactoryUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "feeVal2",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "feeVal3",
        type: "uint256",
      },
    ],
    name: "FeesUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "feeVal2",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "feeVal3",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "erc20Token",
        type: "address",
      },
    ],
    name: "FeesUpdated",
    type: "event",
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
        internalType: "address",
        name: "newPaymentToken",
        type: "address",
      },
    ],
    name: "PaymentTokenUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_id",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint8",
        name: "_type",
        type: "uint8",
      },
      {
        indexed: true,
        internalType: "bool",
        name: "_state",
        type: "bool",
      },
    ],
    name: "PublicMintState",
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
    name: "RecipientUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_id",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint8",
        name: "_type",
        type: "uint8",
      },
      {
        indexed: true,
        internalType: "address",
        name: "_payee",
        type: "address",
      },
    ],
    name: "TokenFundsWithdrawn",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "collection",
        type: "address",
      },
      {
        internalType: "address",
        name: "_from",
        type: "address",
      },
      {
        internalType: "uint128[]",
        name: "_ids",
        type: "uint128[]",
      },
      {
        internalType: "uint128[]",
        name: "_balances",
        type: "uint128[]",
      },
      {
        internalType: "address",
        name: "erc20Token",
        type: "address",
      },
    ],
    name: "batchBurn",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "collection",
        type: "address",
      },
      {
        internalType: "address",
        name: "_from",
        type: "address",
      },
      {
        internalType: "uint128[]",
        name: "_ids",
        type: "uint128[]",
      },
      {
        internalType: "uint128[]",
        name: "_balances",
        type: "uint128[]",
      },
    ],
    name: "batchBurn",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "collection",
        type: "address",
      },
      {
        internalType: "uint128[]",
        name: "_ids",
        type: "uint128[]",
      },
      {
        internalType: "address[]",
        name: "to",
        type: "address[]",
      },
      {
        internalType: "uint128[]",
        name: "_amount",
        type: "uint128[]",
      },
    ],
    name: "burn",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "collection",
        type: "address",
      },
      {
        internalType: "uint128[]",
        name: "_ids",
        type: "uint128[]",
      },
      {
        internalType: "address[]",
        name: "to",
        type: "address[]",
      },
      {
        internalType: "uint128[]",
        name: "_amount",
        type: "uint128[]",
      },
      {
        internalType: "address",
        name: "erc20Token",
        type: "address",
      },
    ],
    name: "burn",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "collection",
        type: "address",
      },
      {
        internalType: "uint128[]",
        name: "_ids",
        type: "uint128[]",
      },
      {
        internalType: "address",
        name: "erc20Token",
        type: "address",
      },
    ],
    name: "burn",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "collection",
        type: "address",
      },
      {
        internalType: "uint128[]",
        name: "_ids",
        type: "uint128[]",
      },
    ],
    name: "burn",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "feeBurn",
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
    inputs: [
      {
        internalType: "address",
        name: "erc20token",
        type: "address",
      },
    ],
    name: "feeBurnErc20",
    outputs: [
      {
        internalType: "uint256",
        name: "feeAmount",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "isValid",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "feeMint",
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
    inputs: [
      {
        internalType: "address",
        name: "erc20token",
        type: "address",
      },
    ],
    name: "feeMintErc20",
    outputs: [
      {
        internalType: "uint256",
        name: "feeAmount",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "isValid",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "madFactory",
    outputs: [
      {
        internalType: "contract FactoryVerifier",
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
        internalType: "address",
        name: "collection",
        type: "address",
      },
      {
        internalType: "address",
        name: "_to",
        type: "address",
      },
      {
        internalType: "uint128",
        name: "_id",
        type: "uint128",
      },
      {
        internalType: "uint128",
        name: "_amount",
        type: "uint128",
      },
      {
        internalType: "address",
        name: "erc20Token",
        type: "address",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "collection",
        type: "address",
      },
      {
        internalType: "address",
        name: "_to",
        type: "address",
      },
      {
        internalType: "uint128",
        name: "_id",
        type: "uint128",
      },
      {
        internalType: "uint128",
        name: "_amount",
        type: "uint128",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "collection",
        type: "address",
      },
      {
        internalType: "uint128",
        name: "_amount",
        type: "uint128",
      },
      {
        internalType: "address",
        name: "erc20Token",
        type: "address",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "collection",
        type: "address",
      },
      {
        internalType: "uint128",
        name: "_amount",
        type: "uint128",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "collection",
        type: "address",
      },
      {
        internalType: "address",
        name: "_to",
        type: "address",
      },
      {
        internalType: "uint128[]",
        name: "_ids",
        type: "uint128[]",
      },
      {
        internalType: "uint128[]",
        name: "_balances",
        type: "uint128[]",
      },
      {
        internalType: "address",
        name: "erc20Token",
        type: "address",
      },
    ],
    name: "mintBatchTo",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "collection",
        type: "address",
      },
      {
        internalType: "address",
        name: "_to",
        type: "address",
      },
      {
        internalType: "uint128[]",
        name: "_ids",
        type: "uint128[]",
      },
      {
        internalType: "uint128[]",
        name: "_balances",
        type: "uint128[]",
      },
    ],
    name: "mintBatchTo",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "collection",
        type: "address",
      },
      {
        internalType: "address",
        name: "_to",
        type: "address",
      },
      {
        internalType: "uint128",
        name: "_amount",
        type: "uint128",
      },
      {
        internalType: "uint128",
        name: "_balance",
        type: "uint128",
      },
      {
        internalType: "address",
        name: "erc20Token",
        type: "address",
      },
    ],
    name: "mintTo",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "collection",
        type: "address",
      },
      {
        internalType: "address",
        name: "_to",
        type: "address",
      },
      {
        internalType: "uint128",
        name: "_amount",
        type: "uint128",
      },
      {
        internalType: "uint128",
        name: "_balance",
        type: "uint128",
      },
    ],
    name: "mintTo",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "collection",
        type: "address",
      },
      {
        internalType: "address",
        name: "_to",
        type: "address",
      },
      {
        internalType: "uint128",
        name: "_amount",
        type: "uint128",
      },
      {
        internalType: "address",
        name: "erc20Token",
        type: "address",
      },
    ],
    name: "mintTo",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "collection",
        type: "address",
      },
      {
        internalType: "address",
        name: "_to",
        type: "address",
      },
      {
        internalType: "uint128",
        name: "_amount",
        type: "uint128",
      },
    ],
    name: "mintTo",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "pure",
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
    inputs: [],
    name: "recipient",
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
        internalType: "contract FactoryVerifier",
        name: "_factory",
        type: "address",
      },
    ],
    name: "setFactory",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_feeMint",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_feeBurn",
        type: "uint256",
      },
    ],
    name: "setFees",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_feeMint",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_feeBurn",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "madFeeTokenAddress",
        type: "address",
      },
    ],
    name: "setFees",
    outputs: [],
    stateMutability: "nonpayable",
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
        name: "_recipient",
        type: "address",
      },
    ],
    name: "setRecipient",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x34620000745762001d33388190036080601f8201601f19168101906001600160401b03821190821017620000795760409282918452608039126200007457620000646080516200004f816200008f565b60a051906200005e826200008f565b620000a1565b604051611bb490816200017f8239f35b600080fd5b634e487b7160e01b600052604160045260246000fd5b6001600160a01b038116036200007457565b33156200017057600080546001600160a01b031916339081178255909290837f8292fce18fa69edf4db7b94ea2e58241df0ae57f97e0a6c9b29067028bf92d768180a3670de0b6b3a7640000806002556003558115620001635760068290556001600160a01b039182167f24cd1310c8883cbeaf5b805ab13586ce018b79c022827158ff3e8df14d3449368480a28015620001635790817f566f16f5ede69bb6f837d5da3a6cf41c863ba95621d677ff3c931aa687da646692600155169180a2565b63d92e233d83526004601cfd5b63d92e233d6000526004601cfdfe6080604052600436101561001257600080fd5b60003560e01c806306fdde03146101e75780630a7309b2146101e25780630b78f9c0146101dd5780630d9bd2aa146101d857806313af4035146101d357806318c9fb16146101ce57806321d501b9146101c9578063292af4be146101c4578063395e37ec146101bf5780633bbed4a0146101ba57806342b4d2fa146101b557806349fa55ad146101b05780634a6e87a8146101ab578063583fef34146101a6578063586ba782146101a15780635bb478081461019c57806366431b2d1461019757806366d003ac146101925780636a3a2c1b1461018d5780637f82d7e5146101885780638da5cb5b146101835780639a255db61461017e578063b553384514610179578063bb05d8ef14610174578063be29184f1461016f578063bfa33dd81461016a578063e4d73e5914610165578063f12bd09e146101605763fde3704e1461015b57600080fd5b6116c4565b611614565b611461565b6113db565b611318565b61126a565b611183565b6110d8565b6110a4565b61101e565b610f57565b610f23565b610e56565b610de5565b610dc7565b610da9565b610d29565b610c24565b610bb7565b610b46565b610a71565b61098d565b610844565b61075a565b61052c565b610462565b6103c8565b6102df565b6101fc565b60009103126101f757565b600080fd5b346101f75760006003193601126101f757602080526606726f7574657260465260606020f35b73ffffffffffffffffffffffffffffffffffffffff8116036101f757565b604435906fffffffffffffffffffffffffffffffff821682036101f757565b602435906fffffffffffffffffffffffffffffffff821682036101f757565b60031960a09101126101f75760043561029681610222565b906024356102a381610222565b906fffffffffffffffffffffffffffffffff9060443582811681036101f7579160643590811681036101f757906084356102dc81610222565b90565b73ffffffffffffffffffffffffffffffffffffffff6103286103003661027e565b6103108593959794969297611837565b6fffffffffffffffffffffffffffffffff851661192b565b501691823b156101f7576040517ff204ed5900000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff90911660048201526fffffffffffffffffffffffffffffffff9182166024820152921660448301526000919082908290818381606481015b03925af180156103c3576103b7575080f35b6103c0906105d9565b80f35b6116f8565b346101f75760406003193601126101f75760043560243573ffffffffffffffffffffffffffffffffffffffff60005416330361043857816040917f5c6323bf1c2d7aaea2c091a4751c1c87af7f2864650c336507a77d0557af37a1936002558060035582519182526020820152a1005b60046040517f1648fd01000000000000000000000000000000000000000000000000000000008152fd5b73ffffffffffffffffffffffffffffffffffffffff6104ab6104833661027e565b6104938593959794969297611837565b6fffffffffffffffffffffffffffffffff871661192b565b501691823b156101f7576040517f9762287000000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff90911660048201526fffffffffffffffffffffffffffffffff9182166024820152921660448301526000919082908290818381606481016103a5565b346101f75760206003193601126101f75760043561054981610222565b73ffffffffffffffffffffffffffffffffffffffff60009181835416330361043857801561059d5780835516337f8292fce18fa69edf4db7b94ea2e58241df0ae57f97e0a6c9b29067028bf92d768380a380f35b63d92e233d83526004601cfd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b67ffffffffffffffff81116105ed57604052565b6105aa565b6040810190811067ffffffffffffffff8211176105ed57604052565b90601f7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0910116810190811067ffffffffffffffff8211176105ed57604052565b6040519061065c826105f2565b565b67ffffffffffffffff81116105ed5760051b60200190565b9080601f830112156101f75760209082356106908161065e565b9361069e604051958661060e565b81855260208086019260051b8201019283116101f757602001905b8282106106c7575050505090565b81356fffffffffffffffffffffffffffffffff811681036101f75781529083019083016106b9565b9060a06003198301126101f75760043561070881610222565b9160243561071581610222565b9167ffffffffffffffff6044358181116101f7578361073691600401610676565b926064359182116101f75761074d91600401610676565b906084356102dc81610222565b73ffffffffffffffffffffffffffffffffffffffff61079261077b366106ef565b61078b8593959794969297611837565b845161192b565b501691823b156101f757604051928380927f685d2ca5000000000000000000000000000000000000000000000000000000008252816103a5600098899788946004850161174a565b9080601f830112156101f75760209082356107f48161065e565b93610802604051958661060e565b81855260208086019260051b8201019283116101f757602001905b82821061082b575050505090565b838091833561083981610222565b81520191019061081d565b600060806003193601126109365760043561085e81610222565b67ffffffffffffffff9060243582811161093257610880903690600401610676565b604435838111610929576108989036906004016107da565b92606435908111610929576108b1903690600401610676565b906108bb83611837565b6108c58151611acf565b34039034821161092d5773ffffffffffffffffffffffffffffffffffffffff86941691823b15610929576103a595604051968795869485937fa4ddb2a3000000000000000000000000000000000000000000000000000000008552600485016117ba565b8480fd5b61178b565b8380fd5b80fd5b60031960809101126101f75760043561095181610222565b9060243561095e81610222565b906fffffffffffffffffffffffffffffffff9060443582811681036101f7579160643590811681036101f75790565b61099636610939565b906109a084611837565b6109bb6fffffffffffffffffffffffffffffffff8216611b19565b34039334851161092d5773ffffffffffffffffffffffffffffffffffffffff1690813b156101f7576040517ff204ed5900000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff90941660048501526fffffffffffffffffffffffffffffffff9081166024850152909116604483015290916000918391829081606481015b03925af180156103c357610a6657005b610a6f906105d9565b005b6000608060031936011261093657600435610a8b81610222565b8160243591610a9983610222565b73ffffffffffffffffffffffffffffffffffffffff610ab6610240565b91610acf606435610ac681610222565b61031083611837565b5016803b15610b42576040517fa7fcf7b500000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff90941660048501526fffffffffffffffffffffffffffffffff90911660248401528290818381604481016103a5565b8280fd5b346101f75760206003193601126101f757600435610b6381610222565b73ffffffffffffffffffffffffffffffffffffffff60009181835416330361043857801561059d5780600155167f566f16f5ede69bb6f837d5da3a6cf41c863ba95621d677ff3c931aa687da64668280a280f35b346101f75760206003193601126101f75773ffffffffffffffffffffffffffffffffffffffff600435610be981610222565b166000526004602052604060002060ff600182549201541690610c2060405192839283909291602090604083019483521515910152565b0390f35b60606003193601126101f757600435610c3c81610222565b60243590610c4982610222565b610c51610240565b610c5a82611837565b610c756fffffffffffffffffffffffffffffffff8216611b19565b34039134831161092d5773ffffffffffffffffffffffffffffffffffffffff16803b156101f7576040517fa7fcf7b500000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff90941660048501526fffffffffffffffffffffffffffffffff9091166024840152600091839190829081604481015b03925af180156103c357610d1657005b80610d23610a6f926105d9565b806101ec565b73ffffffffffffffffffffffffffffffffffffffff610d61610d4a366106ef565b610d5a8593959794969297611837565b8451611a68565b501691823b156101f757604051928380927f7cc22f70000000000000000000000000000000000000000000000000000000008252816103a5600098899788946004850161174a565b346101f75760006003193601126101f7576020600354604051908152f35b346101f75760006003193601126101f7576020600254604051908152f35b346101f75760206003193601126101f757600435610e0281610222565b73ffffffffffffffffffffffffffffffffffffffff60009181835416330361043857801561059d5780600655167f24cd1310c8883cbeaf5b805ab13586ce018b79c022827158ff3e8df14d3449368280a280f35b610e5f36610939565b90610e6984611837565b610e846fffffffffffffffffffffffffffffffff8316611b19565b34039334851161092d5773ffffffffffffffffffffffffffffffffffffffff1690813b156101f7576040517f9762287000000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff90941660048501526fffffffffffffffffffffffffffffffff908116602485015290911660448301529091600091839182908160648101610a56565b346101f75760006003193601126101f757602073ffffffffffffffffffffffffffffffffffffffff60015416604051908152f35b346101f75760206003193601126101f75773ffffffffffffffffffffffffffffffffffffffff600435610f8981610222565b166000526005602052604060002060ff600182549201541690610c2060405192839283909291602090604083019483521515910152565b9060806003198301126101f757600435610fd981610222565b91602435610fe681610222565b9167ffffffffffffffff6044358181116101f7578361100791600401610676565b926064359182116101f7576102dc91600401610676565b61102736610fc0565b611032849294611837565b61103c8451611acf565b9360009434039034821161092d5773ffffffffffffffffffffffffffffffffffffffff86941691823b15610929576103a595604051968795869485937f7cc22f700000000000000000000000000000000000000000000000000000000085526004850161174a565b346101f75760006003193601126101f757602073ffffffffffffffffffffffffffffffffffffffff60005416604051908152f35b6000606060031936011261093657806004356110f381610222565b73ffffffffffffffffffffffffffffffffffffffff61111061025f565b91611120604435610ac681610222565b501690813b1561117f576040517fbe29184f0000000000000000000000000000000000000000000000000000000081523360048201526fffffffffffffffffffffffffffffffff909116602482015291908290818381604481016103a5565b5050fd5b60a06003193601126101f75760043561119b81610222565b67ffffffffffffffff6024358181116101f7576111bc903690600401610676565b916044358281116101f7576111d59036906004016107da565b916064359081116101f75761120373ffffffffffffffffffffffffffffffffffffffff913690600401610676565b9161122360843561121381610222565b61121c83611837565b8651611a68565b5016803b156101f757610a569360008094604051968795869485937fa4ddb2a3000000000000000000000000000000000000000000000000000000008552600485016117ba565b60006060600319360112610936578060043561128581610222565b60243567ffffffffffffffff811161117f576112ba73ffffffffffffffffffffffffffffffffffffffff913690600401610676565b916112d36044356112ca81610222565b610d5a83611837565b501690813b1561117f5782916103a5916040519485809481937f40475c1600000000000000000000000000000000000000000000000000000000835260048301611826565b60406003193601126101f75760043561133081610222565b61133861025f565b61134182611837565b61135c6fffffffffffffffffffffffffffffffff8216611b19565b34039134831161092d5773ffffffffffffffffffffffffffffffffffffffff1690813b156101f7576040517fbe29184f0000000000000000000000000000000000000000000000000000000081523360048201526fffffffffffffffffffffffffffffffff909116602482015291600091839182908160448101610d06565b6113e436610fc0565b6113ef849294611837565b6113f98451611b19565b9360009434039034821161092d5773ffffffffffffffffffffffffffffffffffffffff86941691823b15610929576103a595604051968795869485937f685d2ca50000000000000000000000000000000000000000000000000000000085526004850161174a565b346101f75760606003193601126101f75760443560243560043561148483610222565b73ffffffffffffffffffffffffffffffffffffffff8060005416330361043857831680156115ea577f660e7095066fd91b05cfad0851f3cefa62b4a62de319c3c13ef7db8982e78501936115356115e592604051906114e2826105f2565b858252600160208301526000526004602052604060002060016020918351815501910151151560ff7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff008354169116179055565b6115b061154061064f565b858152600160208201526115748373ffffffffffffffffffffffffffffffffffffffff166000526005602052604060002090565b60016020918351815501910151151560ff7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff008354169116179055565b6040519384938491604091949373ffffffffffffffffffffffffffffffffffffffff9160608501968552602085015216910152565b0390a1005b60046040517fd23f9521000000000000000000000000000000000000000000000000000000008152fd5b600060406003193601126109365760043561162e81610222565b60243567ffffffffffffffff8111610b425761164e903690600401610676565b9061165881611837565b6116628251611acf565b34039134831161092d5773ffffffffffffffffffffffffffffffffffffffff849216803b15610b42576103a5916040519485809481937f40475c1600000000000000000000000000000000000000000000000000000000835260048301611826565b346101f75760006003193601126101f757602073ffffffffffffffffffffffffffffffffffffffff60065416604051908152f35b6040513d6000823e3d90fd5b90815180825260208080930193019160005b828110611724575050505090565b83516fffffffffffffffffffffffffffffffff1685529381019392810192600101611716565b9161177d9073ffffffffffffffffffffffffffffffffffffffff6102dc9593168452606060208501526060840190611704565b916040818403910152611704565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b91939290936060830194606084528051809652608084019560208092019160005b8281106117fc57505050508461177d91846102dc9697036020860152611704565b835173ffffffffffffffffffffffffffffffffffffffff16895297810197928101926001016117db565b9060206102dc928181520190611704565b602073ffffffffffffffffffffffffffffffffffffffff602481600654169360405194859384927f97cf65af0000000000000000000000000000000000000000000000000000000084521660048301525afa9081156103c3576000916118ca575b50156118a057565b60046040517ffe026803000000000000000000000000000000000000000000000000000000008152fd5b6020813d602011611901575b816118e36020938361060e565b810103126118fd5751908115158203610936575038611898565b5080fd5b3d91506118d6565b8181029291811591840414171561092d57565b908160209103126101f7575190565b91909160ff600161195c8573ffffffffffffffffffffffffffffffffffffffff166000526004602052604060002090565b015416156115ea57611998906119928473ffffffffffffffffffffffffffffffffffffffff166000526004602052604060002090565b54611909565b9173ffffffffffffffffffffffffffffffffffffffff809116906040517f70a08231000000000000000000000000000000000000000000000000000000008152336004820152602081602481865afa80156103c3578591600091611a39575b5010611a0f5761065c91849160015416903390611b25565b60046040517f2d8768f9000000000000000000000000000000000000000000000000000000008152fd5b611a5b915060203d602011611a61575b611a53818361060e565b81019061191c565b386119f7565b503d611a49565b91909160ff6001611a998573ffffffffffffffffffffffffffffffffffffffff166000526005602052604060002090565b015416156115ea57611998906119928473ffffffffffffffffffffffffffffffffffffffff166000526005602052604060002090565b611adb90600354611909565b90813410611a0f5760008080808573ffffffffffffffffffffffffffffffffffffffff600154165af115611b0b57565b63b12d13eb6000526004601cfd5b611adb90600254611909565b601c600060649281946020966040519860605260405260601b602c526f23b872dd000000000000000000000000600c525af13d15600160005114171615611b70576000606052604052565b637939f4246000526004601cfdfea26469706673582212209a64112d6bf923c281949f8176bbb34d4c3d7d8352357f4987f9333ed124d0db64736f6c63430008160033";

type MADRouterConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: MADRouterConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class MADRouter__factory extends ContractFactory {
  constructor(...args: MADRouterConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    _factory: AddressLike,
    _recipient: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(_factory, _recipient, overrides || {});
  }
  override deploy(
    _factory: AddressLike,
    _recipient: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ) {
    return super.deploy(_factory, _recipient, overrides || {}) as Promise<
      MADRouter & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): MADRouter__factory {
    return super.connect(runner) as MADRouter__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): MADRouterInterface {
    return new Interface(_abi) as MADRouterInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): MADRouter {
    return new Contract(address, _abi, runner) as unknown as MADRouter;
  }
}
