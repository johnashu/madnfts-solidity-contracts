/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  ERC721LazyEventsAndErrors,
  ERC721LazyEventsAndErrorsInterface,
} from "../../../../../../../lib/tokens/ERC721/Base/interfaces/ERC721EventAndErrors.sol/ERC721LazyEventsAndErrors";

const _abi = [
  {
    inputs: [],
    name: "InvalidSigner",
    type: "error",
  },
  {
    inputs: [],
    name: "NotMintedYet",
    type: "error",
  },
  {
    inputs: [],
    name: "UriLocked",
    type: "error",
  },
  {
    inputs: [],
    name: "UsedVoucher",
    type: "error",
  },
  {
    inputs: [],
    name: "WrongPrice",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "string",
        name: "baseURI",
        type: "string",
      },
    ],
    name: "BaseURILocked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "string",
        name: "newBaseURI",
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
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "newSigner",
        type: "address",
      },
    ],
    name: "SignerUpdated",
    type: "event",
  },
];

export class ERC721LazyEventsAndErrors__factory {
  static readonly abi = _abi;
  static createInterface(): ERC721LazyEventsAndErrorsInterface {
    return new utils.Interface(_abi) as ERC721LazyEventsAndErrorsInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ERC721LazyEventsAndErrors {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as ERC721LazyEventsAndErrors;
  }
}
