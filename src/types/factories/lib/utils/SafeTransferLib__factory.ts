/* Autogenerated file. Do not edit manually. */

/* tslint:disable */

/* eslint-disable */
import type { PromiseOrValue } from "../../../common";
import type {
  SafeTransferLib,
  SafeTransferLibInterface,
} from "../../../lib/utils/SafeTransferLib";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";

const _abi = [
  {
    inputs: [],
    name: "ApproveFailed",
    type: "error",
  },
  {
    inputs: [],
    name: "ETHTransferFailed",
    type: "error",
  },
  {
    inputs: [],
    name: "TransferFailed",
    type: "error",
  },
  {
    inputs: [],
    name: "TransferFromFailed",
    type: "error",
  },
] as const;

const _bytecode =
  "0x60808060405234601757603a9081601d823930815050f35b600080fdfe600080fdfea2646970667358221220e886f6c47857b77b6e736ea82dfa1fc5b46787f36b5e446df7790426356641a864736f6c63430008130033";

type SafeTransferLibConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: SafeTransferLibConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class SafeTransferLib__factory extends ContractFactory {
  constructor(...args: SafeTransferLibConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<SafeTransferLib> {
    return super.deploy(overrides || {}) as Promise<SafeTransferLib>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): SafeTransferLib {
    return super.attach(address) as SafeTransferLib;
  }
  override connect(signer: Signer): SafeTransferLib__factory {
    return super.connect(signer) as SafeTransferLib__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): SafeTransferLibInterface {
    return new utils.Interface(_abi) as SafeTransferLibInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): SafeTransferLib {
    return new Contract(address, _abi, signerOrProvider) as SafeTransferLib;
  }
}
