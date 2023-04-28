/* Autogenerated file. Do not edit manually. */

/* tslint:disable */

/* eslint-disable */
import type { PromiseOrValue } from "../../../../../../common";
import type {
  ERC1155Holder,
  ERC1155HolderInterface,
} from "../../../../../../lib/tokens/ERC1155/Base/utils/ERC1155Holder";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";

const _abi = [
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
] as const;

const _bytecode =
  "0x6080806040523461001657610276908161001c8239f35b600080fdfe6080604052600436101561001257600080fd5b6000803560e01c8063bc197c81146100905763f23a6e611461003357600080fd5b3461008d5760a036600319011261008d5761004c61011e565b50610055610139565b5060843567ffffffffffffffff8111610089576100769036906004016101ed565b5060405163f23a6e6160e01b8152602090f35b5080fd5b80fd5b503461008d5760a036600319011261008d576100aa61011e565b506100b3610139565b5067ffffffffffffffff60443581811161011a576100d590369060040161018b565b5060643581811161011a576100ee90369060040161018b565b50608435908111610089576101079036906004016101ed565b5060405163bc197c8160e01b8152602090f35b8280fd5b600435906001600160a01b038216820361013457565b600080fd5b602435906001600160a01b038216820361013457565b6040519190601f01601f1916820167ffffffffffffffff81118382101761017557604052565b634e487b7160e01b600052604160045260246000fd5b81601f820112156101345780359167ffffffffffffffff8311610175578260051b60209283806101bc81850161014f565b809781520192820101928311610134578301905b8282106101de575050505090565b813581529083019083016101d0565b81601f820112156101345780359067ffffffffffffffff82116101755761021d601f8301601f191660200161014f565b92828452602083830101116101345781600092602080930183860137830101529056fea264697066735822122080356300c2ad6ef73abe4e6aff911b281a3037c4768faa77779caed77a8b458164736f6c63430008130033";

type ERC1155HolderConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ERC1155HolderConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class ERC1155Holder__factory extends ContractFactory {
  constructor(...args: ERC1155HolderConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ERC1155Holder> {
    return super.deploy(overrides || {}) as Promise<ERC1155Holder>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): ERC1155Holder {
    return super.attach(address) as ERC1155Holder;
  }
  override connect(signer: Signer): ERC1155Holder__factory {
    return super.connect(signer) as ERC1155Holder__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ERC1155HolderInterface {
    return new utils.Interface(_abi) as ERC1155HolderInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ERC1155Holder {
    return new Contract(address, _abi, signerOrProvider) as ERC1155Holder;
  }
}
