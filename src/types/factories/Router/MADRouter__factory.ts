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
        name: "madFeeTokenAddress",
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
        name: "madFeeTokenAddress",
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
        name: "madFeeTokenAddress",
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
        name: "madFeeTokenAddress",
        type: "address",
      },
    ],
    name: "feeBurnErc20",
    outputs: [
      {
        components: [
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
        internalType: "struct FeeHandler.Fee",
        name: "",
        type: "tuple",
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
        name: "madFeeTokenAddress",
        type: "address",
      },
    ],
    name: "feeMintErc20",
    outputs: [
      {
        components: [
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
        internalType: "struct FeeHandler.Fee",
        name: "",
        type: "tuple",
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
        name: "madFeeTokenAddress",
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
        name: "madFeeTokenAddress",
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
        name: "madFeeTokenAddress",
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
        name: "madFeeTokenAddress",
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
        name: "madFeeTokenAddress",
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
  "0x34620000745762001dda388190036080601f8201601f19168101906001600160401b03821190821017620000795760409282918452608039126200007457620000646080516200004f816200008f565b60a051906200005e826200008f565b620000a1565b604051611c5b90816200017f8239f35b600080fd5b634e487b7160e01b600052604160045260246000fd5b6001600160a01b038116036200007457565b33156200017057600080546001600160a01b031916339081178255909290837f8292fce18fa69edf4db7b94ea2e58241df0ae57f97e0a6c9b29067028bf92d768180a3670de0b6b3a7640000806002556003558115620001635760068290556001600160a01b039182167f24cd1310c8883cbeaf5b805ab13586ce018b79c022827158ff3e8df14d3449368480a28015620001635790817f566f16f5ede69bb6f837d5da3a6cf41c863ba95621d677ff3c931aa687da646692600155169180a2565b63d92e233d83526004601cfd5b63d92e233d6000526004601cfdfe6080604052600436101561001257600080fd5b60003560e01c806306fdde03146101e75780630a7309b2146101e25780630b78f9c0146101dd5780630d9bd2aa146101d857806313af4035146101d357806318c9fb16146101ce57806321d501b9146101c9578063292af4be146101c4578063395e37ec146101bf5780633bbed4a0146101ba57806342b4d2fa146101b557806349fa55ad146101b05780634a6e87a8146101ab578063583fef34146101a6578063586ba782146101a15780635bb478081461019c57806366431b2d1461019757806366d003ac146101925780636a3a2c1b1461018d5780637f82d7e5146101885780638da5cb5b146101835780639a255db61461017e578063b553384514610179578063bb05d8ef14610174578063be29184f1461016f578063bfa33dd81461016a578063e4d73e5914610165578063f12bd09e146101605763fde3704e1461015b57600080fd5b6116d0565b611620565b611497565b611411565b61134e565b6112a1565b6111b8565b61110e565b6110da565b611054565b610f93565b610f5f565b610e92565b610e21565b610e03565b610de5565b610d7d565b610c78565b610bba565b610b49565b610a75565b610991565b610848565b61075c565b61052e565b610463565b6103c9565b6102df565b6101fc565b60009103126101f757565b600080fd5b346101f75760006003193601126101f757602080526606726f7574657260465260606020f35b73ffffffffffffffffffffffffffffffffffffffff8116036101f757565b604435906fffffffffffffffffffffffffffffffff821682036101f757565b602435906fffffffffffffffffffffffffffffffff821682036101f757565b60031960a09101126101f75760043561029681610222565b906024356102a381610222565b906fffffffffffffffffffffffffffffffff9060443582811681036101f7579160643590811681036101f757906084356102dc81610222565b90565b73ffffffffffffffffffffffffffffffffffffffff61032a6103003661027e565b6103108593959794969297611869565b30906fffffffffffffffffffffffffffffffff8616611987565b1691823b156101f7576040517ff204ed5900000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff90911660048201526fffffffffffffffffffffffffffffffff9182166024820152921660448301526000919082908290818381606481015b03925af180156103c4576103b8575080f35b6103c1906105db565b80f35b611704565b346101f75760406003193601126101f75760043560243573ffffffffffffffffffffffffffffffffffffffff60005416330361043957816040917f5c6323bf1c2d7aaea2c091a4751c1c87af7f2864650c336507a77d0557af37a1936002558060035582519182526020820152a1005b60046040517f1648fd01000000000000000000000000000000000000000000000000000000008152fd5b73ffffffffffffffffffffffffffffffffffffffff6104ae6104843661027e565b6104948593959794969297611869565b30906fffffffffffffffffffffffffffffffff8816611987565b1691823b156101f7576040517f9762287000000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff90911660048201526fffffffffffffffffffffffffffffffff9182166024820152921660448301526000919082908290818381606481016103a6565b346101f75760206003193601126101f75760043561054b81610222565b73ffffffffffffffffffffffffffffffffffffffff60009181835416330361043957801561059f5780835516337f8292fce18fa69edf4db7b94ea2e58241df0ae57f97e0a6c9b29067028bf92d768380a380f35b63d92e233d83526004601cfd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b67ffffffffffffffff81116105ef57604052565b6105ac565b6040810190811067ffffffffffffffff8211176105ef57604052565b90601f7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0910116810190811067ffffffffffffffff8211176105ef57604052565b6040519061065e826105f4565b565b67ffffffffffffffff81116105ef5760051b60200190565b9080601f830112156101f757602090823561069281610660565b936106a06040519586610610565b81855260208086019260051b8201019283116101f757602001905b8282106106c9575050505090565b81356fffffffffffffffffffffffffffffffff811681036101f75781529083019083016106bb565b9060a06003198301126101f75760043561070a81610222565b9160243561071781610222565b9167ffffffffffffffff6044358181116101f7578361073891600401610678565b926064359182116101f75761074f91600401610678565b906084356102dc81610222565b73ffffffffffffffffffffffffffffffffffffffff61079761077d366106f1565b61078d8593959794969297611869565b8451903091611987565b1691823b156101f757604051928380927f685d2ca5000000000000000000000000000000000000000000000000000000008252816103a66000988997889460048501611756565b9080601f830112156101f75760209082356107f881610660565b936108066040519586610610565b81855260208086019260051b8201019283116101f757602001905b82821061082f575050505090565b838091833561083d81610222565b815201910190610821565b6000608060031936011261093a5760043561086281610222565b67ffffffffffffffff9060243582811161093657610884903690600401610678565b60443583811161092d5761089c9036906004016107de565b9260643590811161092d576108b5903690600401610678565b906108bf83611869565b6108c98151611b4c565b3403903482116109315773ffffffffffffffffffffffffffffffffffffffff86941691823b1561092d576103a695604051968795869485937fa4ddb2a3000000000000000000000000000000000000000000000000000000008552600485016117c6565b8480fd5b611797565b8380fd5b80fd5b60031960809101126101f75760043561095581610222565b9060243561096281610222565b906fffffffffffffffffffffffffffffffff9060443582811681036101f7579160643590811681036101f75790565b61099a3661093d565b906109a484611869565b6109bf6fffffffffffffffffffffffffffffffff8216611bc0565b3403933485116109315773ffffffffffffffffffffffffffffffffffffffff1690813b156101f7576040517ff204ed5900000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff90941660048501526fffffffffffffffffffffffffffffffff9081166024850152909116604483015290916000918391829081606481015b03925af180156103c457610a6a57005b610a73906105db565b005b6000608060031936011261093a57600435610a8f81610222565b8160243591610a9d83610222565b73ffffffffffffffffffffffffffffffffffffffff610aba610240565b91610ad3606435610aca81610222565b61031083611869565b16803b15610b45576040517fa7fcf7b500000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff90941660048501526fffffffffffffffffffffffffffffffff90911660248401528290818381604481016103a6565b8280fd5b346101f75760206003193601126101f757600435610b6681610222565b73ffffffffffffffffffffffffffffffffffffffff60009181835416330361043957801561059f5780600155167f566f16f5ede69bb6f837d5da3a6cf41c863ba95621d677ff3c931aa687da64668280a280f35b346101f75760206003193601126101f75773ffffffffffffffffffffffffffffffffffffffff600435610bec81610222565b610bf4611832565b50168015610c4e576000526004602052610c4a604060002060ff600160405192610c1d846105f4565b80548452015416151560208201526040519182918291909160208060408301948051845201511515910152565b0390f35b60046040517fd23f9521000000000000000000000000000000000000000000000000000000008152fd5b60606003193601126101f757600435610c9081610222565b60243590610c9d82610222565b610ca5610240565b610cae82611869565b610cc96fffffffffffffffffffffffffffffffff8216611bc0565b3403913483116109315773ffffffffffffffffffffffffffffffffffffffff16803b156101f7576040517fa7fcf7b500000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff90941660048501526fffffffffffffffffffffffffffffffff9091166024840152600091839190829081604481015b03925af180156103c457610d6a57005b80610d77610a73926105db565b806101ec565b73ffffffffffffffffffffffffffffffffffffffff610d9e61077d366106f1565b1691823b156101f757604051928380927f7cc22f70000000000000000000000000000000000000000000000000000000008252816103a66000988997889460048501611756565b346101f75760006003193601126101f7576020600354604051908152f35b346101f75760006003193601126101f7576020600254604051908152f35b346101f75760206003193601126101f757600435610e3e81610222565b73ffffffffffffffffffffffffffffffffffffffff60009181835416330361043957801561059f5780600655167f24cd1310c8883cbeaf5b805ab13586ce018b79c022827158ff3e8df14d3449368280a280f35b610e9b3661093d565b90610ea584611869565b610ec06fffffffffffffffffffffffffffffffff8316611bc0565b3403933485116109315773ffffffffffffffffffffffffffffffffffffffff1690813b156101f7576040517f9762287000000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff90941660048501526fffffffffffffffffffffffffffffffff908116602485015290911660448301529091600091839182908160648101610a5a565b346101f75760006003193601126101f757602073ffffffffffffffffffffffffffffffffffffffff60015416604051908152f35b346101f75760206003193601126101f75773ffffffffffffffffffffffffffffffffffffffff600435610fc581610222565b610fcd611832565b50168015610c4e576000526005602052610c4a604060002060ff600160405192610c1d846105f4565b9060806003198301126101f75760043561100f81610222565b9160243561101c81610222565b9167ffffffffffffffff6044358181116101f7578361103d91600401610678565b926064359182116101f7576102dc91600401610678565b61105d36610ff6565b611068849294611869565b6110728451611b4c565b936000943403903482116109315773ffffffffffffffffffffffffffffffffffffffff86941691823b1561092d576103a695604051968795869485937f7cc22f7000000000000000000000000000000000000000000000000000000000855260048501611756565b346101f75760006003193601126101f757602073ffffffffffffffffffffffffffffffffffffffff60005416604051908152f35b6000606060031936011261093a578060043561112981610222565b73ffffffffffffffffffffffffffffffffffffffff61114661025f565b91611156604435610aca81610222565b1690813b156111b4576040517fbe29184f0000000000000000000000000000000000000000000000000000000081523360048201526fffffffffffffffffffffffffffffffff909116602482015291908290818381604481016103a6565b5050fd5b60a06003193601126101f7576004356111d081610222565b67ffffffffffffffff6024358181116101f7576111f1903690600401610678565b916044358281116101f75761120a9036906004016107de565b916064359081116101f75761123873ffffffffffffffffffffffffffffffffffffffff913690600401610678565b9161125b60843561124881610222565b61125183611869565b8651903091611987565b16803b156101f757610a5a9360008094604051968795869485937fa4ddb2a3000000000000000000000000000000000000000000000000000000008552600485016117c6565b6000606060031936011261093a57806004356112bc81610222565b60243567ffffffffffffffff81116111b4576112f173ffffffffffffffffffffffffffffffffffffffff913690600401610678565b9161130a60443561130181610222565b61078d83611869565b1690813b156111b45782916103a6916040519485809481937f40475c160000000000000000000000000000000000000000000000000000000083526004830161184b565b60406003193601126101f75760043561136681610222565b61136e61025f565b61137782611869565b6113926fffffffffffffffffffffffffffffffff8216611bc0565b3403913483116109315773ffffffffffffffffffffffffffffffffffffffff1690813b156101f7576040517fbe29184f0000000000000000000000000000000000000000000000000000000081523360048201526fffffffffffffffffffffffffffffffff909116602482015291600091839182908160448101610d5a565b61141a36610ff6565b611425849294611869565b61142f8451611bc0565b936000943403903482116109315773ffffffffffffffffffffffffffffffffffffffff86941691823b1561092d576103a695604051968795869485937f685d2ca500000000000000000000000000000000000000000000000000000000855260048501611756565b346101f75760606003193601126101f7576044356024356004356114ba83610222565b73ffffffffffffffffffffffffffffffffffffffff806000541633036104395783168015610c4e577f660e7095066fd91b05cfad0851f3cefa62b4a62de319c3c13ef7db8982e785019361156b61161b9260405190611518826105f4565b858252600160208301526000526004602052604060002060016020918351815501910151151560ff7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff008354169116179055565b6115e6611576610651565b858152600160208201526115aa8373ffffffffffffffffffffffffffffffffffffffff166000526005602052604060002090565b60016020918351815501910151151560ff7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff008354169116179055565b6040519384938491604091949373ffffffffffffffffffffffffffffffffffffffff9160608501968552602085015216910152565b0390a1005b6000604060031936011261093a5760043561163a81610222565b60243567ffffffffffffffff8111610b455761165a903690600401610678565b9061166481611869565b61166e8251611b4c565b3403913483116109315773ffffffffffffffffffffffffffffffffffffffff849216803b15610b45576103a6916040519485809481937f40475c160000000000000000000000000000000000000000000000000000000083526004830161184b565b346101f75760006003193601126101f757602073ffffffffffffffffffffffffffffffffffffffff60065416604051908152f35b6040513d6000823e3d90fd5b90815180825260208080930193019160005b828110611730575050505090565b83516fffffffffffffffffffffffffffffffff1685529381019392810192600101611722565b916117899073ffffffffffffffffffffffffffffffffffffffff6102dc9593168452606060208501526060840190611710565b916040818403910152611710565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b91939290936060830194606084528051809652608084019560208092019160005b82811061180857505050508461178991846102dc9697036020860152611710565b835173ffffffffffffffffffffffffffffffffffffffff16895297810197928101926001016117e7565b6040519061183f826105f4565b60006020838281520152565b9060206102dc928181520190611710565b519081151582036101f757565b602073ffffffffffffffffffffffffffffffffffffffff602481600654169360405194859384927f97cf65af0000000000000000000000000000000000000000000000000000000084521660048301525afa9081156103c4576000916118fc575b50156118d257565b60046040517ffe026803000000000000000000000000000000000000000000000000000000008152fd5b90506020813d60201161192e575b8161191760209383610610565b810103126101f7576119289061185c565b386118ca565b3d915061190a565b908160409103126101f75761195d602060405192611953846105f4565b805184520161185c565b602082015290565b8181029291811591840414171561093157565b908160209103126101f7575190565b604080517f42b4d2fa00000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff841660048201529094938590829060249082905afa9081156103c457600091611b1f575b506119fc6119f86020830151151590565b1590565b611af65773ffffffffffffffffffffffffffffffffffffffff91611a209151611965565b84517f70a0823100000000000000000000000000000000000000000000000000000000815233600482015290929190911690602081602481855afa80156103c4578391600091611ac7575b5010611a9e5761065e929350611a9660015473ffffffffffffffffffffffffffffffffffffffff1690565b903390611bcc565b600484517f2d8768f9000000000000000000000000000000000000000000000000000000008152fd5b611ae9915060203d602011611aef575b611ae18183610610565b810190611978565b38611a6b565b503d611ad7565b600485517fd23f9521000000000000000000000000000000000000000000000000000000008152fd5b611b3f9150853d8711611b45575b611b378183610610565b810190611936565b386119e7565b503d611b2d565b611b5890600354611965565b90813410611b965760008080808573ffffffffffffffffffffffffffffffffffffffff600154165af115611b8857565b63b12d13eb6000526004601cfd5b60046040517f2d8768f9000000000000000000000000000000000000000000000000000000008152fd5b611b5890600254611965565b601c600060649281946020966040519860605260405260601b602c526f23b872dd000000000000000000000000600c525af13d15600160005114171615611c17576000606052604052565b637939f4246000526004601cfdfea26469706673582212205f2846f90a0aa5a608af9d8b679506178dd50b3469f92fe63e3cb918b2e0d64864736f6c63430008160033";

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
