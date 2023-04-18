/* Autogenerated file. Do not edit manually. */

/* tslint:disable */

/* eslint-disable */
import type { PromiseOrValue } from "../../../../../common";
import type {
  MockERC1155,
  MockERC1155Interface,
} from "../../../../../contracts/lib/test/erc1155-mock.sol/MockERC1155";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "ApprovalForAll",
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
        name: "operator",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "ids",
        type: "uint256[]",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "amounts",
        type: "uint256[]",
      },
    ],
    name: "TransferBatch",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "TransferSingle",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "value",
        type: "string",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "URI",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "bal",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "owners",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "ids",
        type: "uint256[]",
      },
    ],
    name: "balanceOfBatch",
    outputs: [
      {
        internalType: "uint256[]",
        name: "balances",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256[]",
        name: "ids",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "balances",
        type: "uint256[]",
      },
    ],
    name: "batchMint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "isApprovedForAll",
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
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "total",
        type: "uint256",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "onERC1155BatchReceived",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "onERC1155Received",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    stateMutability: "nonpayable",
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
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "ownerOf",
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
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256[]",
        name: "ids",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "amounts",
        type: "uint256[]",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "safeBatchTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "setApprovalForAll",
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
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "uri",
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
] as const;

const _bytecode =
  "0x6080806040523461005157600280546001600160a01b0319163390811790915560007f8292fce18fa69edf4db7b94ea2e58241df0ae57f97e0a6c9b29067028bf92d768184a361110590816100578239f35b600080fdfe6080604081815260048036101561001557600080fd5b600092833560e01c908162f7486714610b7557508062fdd58e14610b3357806301ffc9a714610ac65780630ca83480146109045780630e89341c146108aa57806313af40351461080d578063156e29f6146107125780632eb2c2d6146104f15780634e1273f4146103ef5780638da5cb5b146103c6578063a22cb46514610343578063bc197c811461031b578063e985e9c5146102ce578063f23a6e61146102a45763f242432a146100c657600080fd5b346102a0576100d436610e0c565b9095939490926001600160a01b039182163381148015610283575b6100f890610e9d565b818a5260209660018852898b20828c5288526101188a8c20541515610eda565b828b5260018852898b20828c528852610136858b8d20541015610f13565b828b5260018852898b2093811693848c528852898b20610157868254610f50565b9055828b5260018852898b20828c528852898b2080549086820391821161027057838a7fc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f628f9695948f908a95558a8151938a85528401523392a43b1561025c576101fa88998b99979899519889978896879563f23a6e6160e01b9d8e8852339088015260248701526044860152606485015260a0608485015260a4840191610fd3565b03925af190811561025257610222938692610225575b50506001600160e01b03191614610ff4565b51f35b6102449250803d1061024b575b61023c8183610c18565b810190610fb3565b3880610210565b503d610232565b84513d87823e3d90fd5b505050935050505061022291501515610f73565b634e487b7160e01b8d526011895260248dfd5b50808a5260208a8152898b20338c529052888a205460ff166100ef565b8280fd5b5050346102ca576020906102b736610e0c565b5050505050505163f23a6e6160e01b8152f35b5080fd5b5050346102ca57806003193601126102ca5760ff816020936102ee610bd0565b6102f6610bb5565b6001600160a01b03918216835282875283832091168252855220549151911615158152f35b5050346102ca5760209061032e36610d4f565b50505050505050505163bc197c8160e01b8152f35b5050346102ca57806003193601126102ca5761035d610bd0565b6024358015158091036103c257338452836020528284209160018060a01b03169182855260205282842060ff1981541660ff831617905582519081527f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c3160203392a351f35b8380fd5b5050346102ca57816003193601126102ca5760025490516001600160a01b039091168152602090f35b5090346102a057806003193601126102a05767ffffffffffffffff9082358281116104ed576104219036908501610cf0565b9290936024359182116104e95761043a91369101610cf0565b9390610447858514611033565b61045084610c3a565b9461045d84519687610c18565b848652601f1961046c86610c3a565b01946020953687890137875b81811061049557855187815280610491818a018b610dd8565b0390f35b6104a0818387611071565b356001600160a01b03811691908290036104e5576001916104c2828688611071565b358b52828952878b20908b528852868a20546104de828b6110bb565b5201610478565b8980fd5b8580fd5b8480fd5b509190346102ca5761050236610d4f565b9092610514838697999c989614611033565b6001600160a01b039a8b169433861480156106f5575b61053390610e9d565b8a5b878110610663575088868b7f4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb61057d9b9c9d9e9f85169b8c948c845194808652850191611097565b9180830360208201528061059333948b8a611097565b0390a43b1561064f578951988996879663bc197c8160e01b9a8b8952339089015260248801526044870160a0905260a48701906105cf92611097565b60031993848783030160648801526105e692611097565b918483030160848501526105f992610fd3565b0381875a94602095f1801561064257610222928591610624575b506001600160e01b03191614610ff4565b61063c915060203d811161024b5761023c8183610c18565b38610613565b50505051903d90823e3d90fd5b505050505050905061022291501515610f73565b808d8c8e8a6106768f968e600198611071565b3593610683868c8b611071565b3594808452879160209383855286862081875285526106a6878720541515610eda565b82865283855286862090865284526106c387878720541015610f13565b818552828452858520908a168552835284842086815401905583528152828220908c8352522090815403905501610535565b50858b5260208b81528a8c20338d529052898b205460ff1661052a565b50346102a05760603660031901126102a05761072c610bd0565b9060243560443560018060a01b039061074a82600254163314610e62565b8686519361075785610be6565b8185528082526020966001885288832094811694858452885288832061077e858254610f50565b905584838a51848152868b8201527fc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f628c3392a43b156107fb57918693916101fa959389519687958694859363f23a6e6160e01b9b8c865233908601528560248601526044850152606484015260a0608484015260a4830190610cb0565b50505091505061022291501515610f73565b5090346102a05760203660031901126102a057610828610bd0565b6002546001600160a01b03906108419082163314610e62565b811692831561087757506002555190337f8292fce18fa69edf4db7b94ea2e58241df0ae57f97e0a6c9b29067028bf92d768484a3f35b606490602084519162461bcd60e51b8352820152600d60248201526c24b73b30b634b21037bbb732b960991b6044820152fd5b5050346102ca576020806003193601126102a057918151928391818352606051918281850152815b8381106108ef575050828201840152601f01601f19168101030190f35b608081015187820187015286945081016108d2565b50346102a057600319906060368301126103c257610920610bd0565b9167ffffffffffffffff602435818111610ac2576109419036908501610c52565b90604435908111610ac2579061095b879236908601610c52565b9260018060a01b039561097387600254163314610e62565b87519061097f82610be6565b848252835185988216985b818110610a7c57505087858a518b81527f4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb6109c78d830189610dd8565b918083036020820152806109dc33948d610dd8565b0390a43b15610a6b5792610a379692610a46610a2793602097968b519a8b988997889663bc197c8160e01b9d8e8952339089015288602489015260a0604489015260a4880190610dd8565b9084878303016064880152610dd8565b91848303016084850152610cb0565b03925af180156106425761022292859161062457506001600160e01b03191614610ff4565b505050505050610222901515610f73565b859650610a8f81600193949596976110bb565b51610a9a828a6110bb565b51908d528c8c8c60209186835283209252528b8d2090815401905501908a959493929161098a565b8680fd5b50346102a05760203660031901126102a057359063ffffffff60e01b82168092036102a057602092506301ffc9a760e01b8214918215610b22575b8215610b11575b50519015158152f35b6303a24d0760e21b14915038610b08565b636cdb3d1360e11b81149250610b01565b5050346102ca57806003193601126102ca5780602092610b51610bd0565b6024358252600185528282206001600160a01b039091168252845220549051908152f35b92919050346103c257816003193601126103c25792602093610b95610bb5565b90358252600185528282206001600160a01b039091168252845220548152f35b602435906001600160a01b0382168203610bcb57565b600080fd5b600435906001600160a01b0382168203610bcb57565b6020810190811067ffffffffffffffff821117610c0257604052565b634e487b7160e01b600052604160045260246000fd5b90601f8019910116810190811067ffffffffffffffff821117610c0257604052565b67ffffffffffffffff8111610c025760051b60200190565b81601f82011215610bcb57803591610c6983610c3a565b92610c776040519485610c18565b808452602092838086019260051b820101928311610bcb578301905b828210610ca1575050505090565b81358152908301908301610c93565b919082519283825260005b848110610cdc575050826000602080949584010152601f8019910116010190565b602081830181015184830182015201610cbb565b9181601f84011215610bcb5782359167ffffffffffffffff8311610bcb576020808501948460051b010111610bcb57565b9181601f84011215610bcb5782359167ffffffffffffffff8311610bcb5760208381860195010111610bcb57565b9060a0600319830112610bcb576001600160a01b03916004358381168103610bcb57926024359081168103610bcb579167ffffffffffffffff604435818111610bcb5783610d9f91600401610cf0565b93909392606435838111610bcb5782610dba91600401610cf0565b93909392608435918211610bcb57610dd491600401610d21565b9091565b90815180825260208080930193019160005b828110610df8575050505090565b835185529381019392810192600101610dea565b60a0600319820112610bcb576001600160a01b03916004358381168103610bcb57926024359081168103610bcb579160443591606435916084359067ffffffffffffffff8211610bcb57610dd491600401610d21565b15610e6957565b60405162461bcd60e51b815260206004820152600c60248201526b15539055551213d49256915160a21b6044820152606490fd5b15610ea457565b60405162461bcd60e51b815260206004820152600e60248201526d1393d517d055551213d49256915160921b6044820152606490fd5b15610ee157565b60405162461bcd60e51b815260206004820152600a60248201526957524f4e475f46524f4d60b01b6044820152606490fd5b15610f1a57565b60405162461bcd60e51b815260206004820152600e60248201526d1253959053125117d05353d5539560921b6044820152606490fd5b91908201809211610f5d57565b634e487b7160e01b600052601160045260246000fd5b15610f7a57565b60405162461bcd60e51b81526020600482015260116024820152701253959053125117d49150d25412515395607a1b6044820152606490fd5b90816020910312610bcb57516001600160e01b031981168103610bcb5790565b908060209392818452848401376000828201840152601f01601f1916010190565b15610ffb57565b60405162461bcd60e51b815260206004820152601060248201526f155394d0519157d49150d2541251539560821b6044820152606490fd5b1561103a57565b60405162461bcd60e51b815260206004820152600f60248201526e0988a9c8ea890be9a92a69a82a8869608b1b6044820152606490fd5b91908110156110815760051b0190565b634e487b7160e01b600052603260045260246000fd5b81835290916001600160fb1b038311610bcb5760209260051b809284830137010190565b80518210156110815760209160051b01019056fea2646970667358221220620482b945bd07265a4b1d82364b52309df030ad63fddc390c9576345f1135d864736f6c63430008100033";

type MockERC1155ConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: MockERC1155ConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class MockERC1155__factory extends ContractFactory {
  constructor(...args: MockERC1155ConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<MockERC1155> {
    return super.deploy(overrides || {}) as Promise<MockERC1155>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): MockERC1155 {
    return super.attach(address) as MockERC1155;
  }
  override connect(signer: Signer): MockERC1155__factory {
    return super.connect(signer) as MockERC1155__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): MockERC1155Interface {
    return new utils.Interface(_abi) as MockERC1155Interface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): MockERC1155 {
    return new Contract(address, _abi, signerOrProvider) as MockERC1155;
  }
}
