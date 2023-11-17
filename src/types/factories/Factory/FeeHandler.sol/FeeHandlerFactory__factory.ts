/* Autogenerated file. Do not edit manually. */

/* tslint:disable */

/* eslint-disable */
import type {
  FeeHandlerFactory,
  FeeHandlerFactoryInterface,
} from "../../../Factory/FeeHandler.sol/FeeHandlerFactory";
import { Contract, Interface, type ContractRunner } from "ethers";

const _abi = [
  {
    inputs: [],
    name: "AddressNotValid",
    type: "error",
  },
  {
    inputs: [],
    name: "feeCreateCollection",
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
    name: "feeCreateCollectionErc20",
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
    name: "feeCreateSplitter",
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
    name: "feeCreateSplitterErc20",
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
] as const;

export class FeeHandlerFactory__factory {
  static readonly abi = _abi;
  static createInterface(): FeeHandlerFactoryInterface {
    return new Interface(_abi) as FeeHandlerFactoryInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): FeeHandlerFactory {
    return new Contract(address, _abi, runner) as unknown as FeeHandlerFactory;
  }
}
