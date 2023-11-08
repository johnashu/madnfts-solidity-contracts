/* Autogenerated file. Do not edit manually. */

/* tslint:disable */

/* eslint-disable */
import type {
  DCPrevent,
  DCPreventInterface,
} from "../../../lib/security/DCPrevent";
import { Contract, Interface, type ContractRunner } from "ethers";

const _abi = [
  {
    inputs: [],
    name: "BadCall",
    type: "error",
  },
] as const;

export class DCPrevent__factory {
  static readonly abi = _abi;
  static createInterface(): DCPreventInterface {
    return new Interface(_abi) as DCPreventInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): DCPrevent {
    return new Contract(address, _abi, runner) as unknown as DCPrevent;
  }
}
