/* Autogenerated file. Do not edit manually. */

/* tslint:disable */

/* eslint-disable */
import type {
  MADRouter721,
  MADRouter721Interface,
} from "../../Router/MADRouter721";
import type { PromiseOrValue } from "../../common";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";

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
        name: "_paymentTokenAddress",
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
        internalType: "bytes32",
        name: "_id",
        type: "bytes32",
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
        indexed: true,
        internalType: "bytes32",
        name: "_id",
        type: "bytes32",
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
    name: "FreeClaimState",
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
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Paused",
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
        internalType: "bytes32",
        name: "_id",
        type: "bytes32",
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
        internalType: "bytes32",
        name: "_id",
        type: "bytes32",
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
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Unpaused",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "_id",
        type: "bytes32",
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
    name: "WhitelistMintState",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_token",
        type: "address",
      },
      {
        internalType: "address",
        name: "_to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "basicMintTo",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_token",
        type: "address",
      },
      {
        internalType: "uint256[]",
        name: "_ids",
        type: "uint256[]",
      },
    ],
    name: "burn",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "erc20",
    outputs: [
      {
        internalType: "contract ERC20",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
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
        internalType: "bytes4",
        name: "sigHash",
        type: "bytes4",
      },
    ],
    name: "feeLookup",
    outputs: [
      {
        internalType: "uint256",
        name: "fee",
        type: "uint256",
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
    inputs: [],
    name: "maxFeeBurn",
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
    name: "maxFeeMint",
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
    name: "pause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "paused",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
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
        internalType: "address",
        name: "_token",
        type: "address",
      },
      {
        internalType: "string",
        name: "_baseURI",
        type: "string",
      },
    ],
    name: "setBase",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_token",
        type: "address",
      },
    ],
    name: "setBaseLock",
    outputs: [],
    stateMutability: "nonpayable",
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
        internalType: "address",
        name: "_token",
        type: "address",
      },
      {
        internalType: "bool",
        name: "_state",
        type: "bool",
      },
    ],
    name: "setMintState",
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
  {
    inputs: [],
    name: "unpause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_token",
        type: "address",
      },
      {
        internalType: "contract ERC20",
        name: "_erc20",
        type: "address",
      },
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x34620000835762001756388190036080601f8201601f19168101906001600160401b03821190821017620000885760609282916040526080391262000083576200007360805162000050816200009e565b60a0516200005e816200009e565b60c051916200006d836200009e565b620000b0565b6040516113ef9081620003678239f35b600080fd5b634e487b7160e01b600052604160045260246000fd5b6001600160a01b038116036200008357565b91903315620001845762000170926200016a916000543360007f8292fce18fa69edf4db7b94ea2e58241df0ae57f97e0a6c9b29067028bf92d768180a36001600160a81b0319163360ff60a01b19161760005560018055620001126000600355565b6200011d6000600455565b6200012f6722b1c8c1227a0000600655565b620001416706f05b59d3b20000600755565b620001536703782dace9d90000600355565b6001600160a01b03811662000172575b50620001f5565b62000252565b565b6200017d90620002d8565b3862000163565b60405162461bcd60e51b815260206004820152600d60248201526c24b73b30b634b21037bbb732b960991b6044820152606490fd5b15620001c157565b60405162461bcd60e51b815260206004820152600c60248201526b15539055551213d49256915160a21b6044820152606490fd5b6000546001600160a01b039190620002119083163314620001b9565b8015620002445780600855167f24cd1310c8883cbeaf5b805ab13586ce018b79c022827158ff3e8df14d344936600080a2565b63d92e233d6000526004601cfd5b6000546001600160a01b03906200026d9082163314620001b9565b8116908115620002a1576005557f566f16f5ede69bb6f837d5da3a6cf41c863ba95621d677ff3c931aa687da6466600080a2565b60405162461bcd60e51b815260206004820152600f60248201526e496e76616c6964206164647265737360881b6044820152606490fd5b6001600160a01b031680156200032157600280546001600160a01b031916821790557fbd4032c1c91da2791730ea1bbc82c6b6f857da7c0a8318143d19ef74e62cd913600080a2565b60405162461bcd60e51b815260206004820152601560248201527f496e76616c696420746f6b656e206164647265737300000000000000000000006044820152606490fdfe6080604052600436101561001257600080fd5b60003560e01c806306fdde0314610187578063089f8b1b146101825780630b78f9c01461017d57806313af4035146101785780633bbed4a0146101735780633f4ba83a1461016e5780634328bd0014610169578063490f702714610164578063583fef341461015f578063586ba7821461015a5780635bb47808146101555780635c975abb1461015057806366d003ac1461014b578063785e9e86146101465780638456cb59146101415780638da5cb5b1461013c578063ba36b92d14610137578063c5cd1d3c14610132578063c99aa4e51461012d578063e427affe14610128578063edc9e7a414610123578063f940e3851461011e5763fde3704e1461011957600080fd5b610dd0565b610b64565b610aed565b610acf565b610ab1565b610a16565b610984565b61095b565b6108e5565b6108bc565b610893565b61086d565b6107f9565b6107db565b6107bd565b6106df565b610653565b610563565b6104c3565b610425565b61035e565b61022c565b6101eb565b600091031261019757565b600080fd5b60005b8381106101af5750506000910152565b818101518382015260200161019f565b604091602082526101df815180928160208601526020868601910161019c565b601f01601f1916010190565b3461019757600036600319011261019757602080526606726f7574657260465260606020f35b6001600160a01b0381160361019757565b8015150361019757565b346101975760403660031901126101975760043561024981610211565b60ff6024359161025883610222565b6102656001805414610df9565b600260015560009261027d83855460a01c1615610f00565b610286826110a1565b9093169160018303610326576001600160a01b0316803b156103225760405163879fbedf60e01b815282151560048201529085908290602490829084905af1801561031d57610304575b501515917f0c2bd698c33cf5bea165c8a607bdd7c7d806b8b10284bfcd5b6899674b5a486d8480a461030160018055565b80f35b8061031161031792610618565b8061018c565b386102d0565b610f35565b8480fd5b60405162461bcd60e51b815260206004820152600c60248201526b494e56414c49445f5459504560a01b6044820152606490fd5b0390fd5b346101975760403660031901126101975760043560243561038a60018060a01b0360005416331461132e565b60065482111580610419575b156103d5577f5c6323bf1c2d7aaea2c091a4751c1c87af7f2864650c336507a77d0557af37a191816040926004558160035582519182526020820152a1005b606460405162461bcd60e51b815260206004820152602060248201527f496e76616c6964206665652073657474696e67732c206265796f6e64206d61786044820152fd5b50600754811115610396565b346101975760203660031901126101975760043561044281610211565b60018060a01b039060009161045b81845416331461132e565b811690811561048e578255337f8292fce18fa69edf4db7b94ea2e58241df0ae57f97e0a6c9b29067028bf92d768380a380f35b60405162461bcd60e51b815260206004820152600d60248201526c24b73b30b634b21037bbb732b960991b6044820152606490fd5b34610197576020366003190112610197576004356104e081610211565b6000546001600160a01b03906104f9908216331461132e565b811690811561052c576005557f566f16f5ede69bb6f837d5da3a6cf41c863ba95621d677ff3c931aa687da6466600080a2005b60405162461bcd60e51b815260206004820152600f60248201526e496e76616c6964206164647265737360881b6044820152606490fd5b34610197576000806003193601126105ff57805461058b336001600160a01b0383161461132e565b60ff8160a01c16156105cf5760ff60a01b191681556040513381527f5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa90602090a180f35b60405162461bcd60e51b8152602060048201526008602482015267155394105554d15160c21b6044820152606490fd5b80fd5b634e487b7160e01b600052604160045260246000fd5b67ffffffffffffffff811161062c57604052565b610602565b90601f8019910116810190811067ffffffffffffffff82111761062c57604052565b346101975760403660031901126101975760043561067081610211565b6024359067ffffffffffffffff90818311610197573660238401121561019757826004013591821161062c57604051916106b4601f8201601f191660200184610631565b80835236602482860101116101975760208160009260246106dd97018387013784010152610e32565b005b6060366003190112610197576004356106f781610211565b60243561070381610211565b6107106001805414610df9565b600260015560009161072960ff845460a01c1615610f00565b600160ff610736836110a1565b905016036103265782906107486111b8565b6001600160a01b031691823b156107b95760405163438b1b4b60e01b81526001600160a01b039190911660048201526044803560248301523390820152918290606490829034905af1801561031d576107a6575b5061030160018055565b806103116107b392610618565b3861079c565b5080fd5b34610197576000366003190112610197576020600454604051908152f35b34610197576000366003190112610197576020600354604051908152f35b346101975760203660031901126101975760043561081681610211565b60018060a01b0360009161082e82845416331461132e565b80156108605780600855167f24cd1310c8883cbeaf5b805ab13586ce018b79c022827158ff3e8df14d3449368280a280f35b63d92e233d83526004601cfd5b3461019757600036600319011261019757602060ff60005460a01c166040519015158152f35b34610197576000366003190112610197576005546040516001600160a01b039091168152602090f35b34610197576000366003190112610197576002546040516001600160a01b039091168152602090f35b34610197576000806003193601126105ff57805461090d336001600160a01b0383161461132e565b61091d60ff8260a01c1615610f00565b60ff60a01b1916600160a01b1781556040513381527f62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a25890602090a180f35b34610197576000366003190112610197576000546040516001600160a01b039091168152602090f35b60403660031901126101975760043561099c81610211565b60243567ffffffffffffffff808211610197573660238301121561019757816004013590811161062c578060051b91604051926020926109de84830186610631565b84526024838501918301019136831161019757602401905b828210610a07576106dd8587610f61565b813581529083019083016109f6565b3461019757602036600319011261019757600435610a3381610211565b610a406001805414610df9565b6002600155600090610a5960ff835460a01c1615610f00565b600160ff610a66836110a1565b905016146000146103265781906001600160a01b0316803b15610aae5781906004604051809481936366c879a960e01b83525af1801561031d576107a6575061030160018055565b50fd5b34610197576000366003190112610197576020600654604051908152f35b34610197576000366003190112610197576020600754604051908152f35b346101975760203660031901126101975760048035906001600160e01b0319821682036101975763044df8e760e41b821491600091906340d097c360e01b14610b5657610b4a92610b4e57505b6040519081529081906020820190565b0390f35b905054610b3a565b505050610b4a600354610b3a565b34610197576040806003193601126101975760ff90600490813591610b8883610211565b602435610b9481610211565b610ba16001805414610df9565b6002600155610baf846110a1565b9095169360018503610d97576001600160a01b03908282168015159081610d23575b5015610c77576005549116906001600160a01b031691813b15610197579351632515bef360e21b81526001600160a01b0394851693810193845293909116602083015260009183919082908490829060400103925af1801561031d57610c64575b505b33917ff15624beb70c8e7a7515ad5f81ee4c24dba144c4ef1b258f8075e1a519b1a5a1600080a46106dd60018055565b80610311610c7192610618565b38610c32565b929392909150803115610ced576005546001600160a01b03169116803b156101975791516351cff8d960e01b81526001600160a01b0390911692810192835291600091839182908490829060200103925af1801561031d57610cda575b50610c34565b80610311610ce792610618565b38610cd4565b825162461bcd60e51b81526020818601818152600891810191909152674e4f5f46554e445360c01b604082015281906060010390fd5b86516370a0823160e01b81526001600160a01b038416878201908152909250602091839182908190850103915afa90811561031d57600091610d69575b50151538610bd1565b610d8a915060203d8111610d90575b610d828183610631565b810190611051565b38610d60565b503d610d78565b835162461bcd60e51b81528061035a81860160609060208152600c60208201526b494e56414c49445f5459504560a01b60408201520190565b34610197576000366003190112610197576008546040516001600160a01b039091168152602090f35b15610e0057565b60405162461bcd60e51b815260206004820152600a6024820152695245454e5452414e435960b01b6044820152606490fd5b9060ff90610e436001805414610df9565b6002600155600092610e5b83855460a01c1615610f00565b6001610e66826110a1565b90941603610326576001600160a01b031690813b15610efc578360405180936355f804b360e01b8252818381610e9f87600483016101bf565b03925af190811561031d577f43644489da8fbb6bf513e3cbb8aefbc47ed49a5d8159243b448b2444e1d38b9e92610edb92610ee9575b50610f41565b9280a3610ee760018055565b565b80610311610ef692610618565b38610ed5565b8380fd5b15610f0757565b60405162461bcd60e51b815260206004820152600660248201526514105554d15160d21b6044820152606490fd5b6040513d6000823e3d90fd5b610f599060206040519282848094519384920161019c565b810103902090565b610f6e6001805414610df9565b6002600155610f8560ff60005460a01c1615610f00565b600160ff610f92836110a1565b9050610f9c61129b565b1603610326576001600160a01b0316803b1561019757610fd691600091604051808095819463362c0cb560e01b8352339060048401611004565b039134905af1801561031d57610ff1575b50610ee760018055565b80610311610ffe92610618565b38610fe7565b9092919260408201604083528151809152606083019060208093019060005b8482821061103d57505050509360018060a01b0316910152565b835185529384019390920191600101611023565b90816020910312610197575190565b9190826040910312610197576020825161107981610211565b92015161108581610222565b90565b90816020910312610197575160ff811681036101975790565b6008546040805163617d1d3b60e01b81526001600160a01b039384166004820152939260209216908285602481855afa94851561031d57600095611199575b50805163b64bd5eb60e01b8152600481018690529185908284602481845afa92831561031d5761113094869461116d575b5051808095819463d93cb8fd60e01b8352600483019190602083019252565b03915afa91821561031d5760009261114757505090565b6110859250803d10611166575b61115e8183610631565b810190611088565b503d611154565b61118c90823d8411611192575b6111848183610631565b810190611060565b50611111565b503d61117a565b6111b1919550833d8511610d9057610d828183610631565b93386110e0565b6002546001600160a01b031680806111ce575050565b604051636eb1769f60e11b8152336004820152306024820152906020908190839060449082905afa91821561031d5760009261127c575b50604051633b7279e960e21b81526340d097c360e01b6004820152818180602481015b0381305afa91821561031d5760009261125f575b5050810361125157610ee79130903390611369565b63f7760f256000526004601cfd5b6112759250803d10610d9057610d828183610631565b388061123c565b816112949293503d8411610d9057610d828183610631565b9038611205565b6002546001600160a01b031680806112b1575050565b604051636eb1769f60e11b8152336004820152306024820152906020908190839060449082905afa91821561031d5760009261130f575b50604051633b7279e960e21b815263044df8e760e41b600482015281818060248101611228565b816113279293503d8411610d9057610d828183610631565b90386112e8565b1561133557565b60405162461bcd60e51b815260206004820152600c60248201526b15539055551213d49256915160a21b6044820152606490fd5b601c600060649281946020966040519860605260405260601b602c526323b872dd60601b600c525af13d156001600051141716156113ab576000606052604052565b637939f4246000526004601cfdfea2646970667358221220f2f38a48bfa3510637f0b00c0f09400f574cdfb5547141e2f837cf30ceb9564264736f6c63430008130033";

type MADRouter721ConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: MADRouter721ConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class MADRouter721__factory extends ContractFactory {
  constructor(...args: MADRouter721ConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    _factory: PromiseOrValue<string>,
    _paymentTokenAddress: PromiseOrValue<string>,
    _recipient: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<MADRouter721> {
    return super.deploy(
      _factory,
      _paymentTokenAddress,
      _recipient,
      overrides || {}
    ) as Promise<MADRouter721>;
  }
  override getDeployTransaction(
    _factory: PromiseOrValue<string>,
    _paymentTokenAddress: PromiseOrValue<string>,
    _recipient: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      _factory,
      _paymentTokenAddress,
      _recipient,
      overrides || {}
    );
  }
  override attach(address: string): MADRouter721 {
    return super.attach(address) as MADRouter721;
  }
  override connect(signer: Signer): MADRouter721__factory {
    return super.connect(signer) as MADRouter721__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): MADRouter721Interface {
    return new utils.Interface(_abi) as MADRouter721Interface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): MADRouter721 {
    return new Contract(address, _abi, signerOrProvider) as MADRouter721;
  }
}
