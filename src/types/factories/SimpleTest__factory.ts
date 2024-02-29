/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../common";
import type {
  SimpleTest,
  SimpleTestInterface,
  FactoryTypes,
} from "../SimpleTest";

const _abi = [
  {
    inputs: [
      {
        components: [
          {
            internalType: "string",
            name: "_name",
            type: "string",
          },
          {
            internalType: "string",
            name: "_symbol",
            type: "string",
          },
          {
            internalType: "string",
            name: "_baseURI",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "_price",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "_maxSupply",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "_splitter",
            type: "address",
          },
          {
            internalType: "uint96",
            name: "_royaltyPercentage",
            type: "uint96",
          },
          {
            internalType: "address",
            name: "_router",
            type: "address",
          },
          {
            internalType: "address",
            name: "_erc20",
            type: "address",
          },
          {
            internalType: "address",
            name: "_owner",
            type: "address",
          },
        ],
        internalType: "struct FactoryTypes.CollectionArgs",
        name: "args",
        type: "tuple",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
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
    name: "params",
    outputs: [
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
      {
        internalType: "string",
        name: "_symbol",
        type: "string",
      },
      {
        internalType: "string",
        name: "_baseURI",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_price",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_maxSupply",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_splitter",
        type: "address",
      },
      {
        internalType: "uint96",
        name: "_royaltyPercentage",
        type: "uint96",
      },
      {
        internalType: "address",
        name: "_router",
        type: "address",
      },
      {
        internalType: "address",
        name: "_erc20",
        type: "address",
      },
      {
        internalType: "address",
        name: "_owner",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

const _bytecode =
  "0x6040608081523461012b576107cd8038038061001a81610143565b92833981019060208183031261012b5780516001600160401b039182821161012b57019061014092838382031261012b5784519384018481108382111761012f578552825182811161012b5781610072918501610168565b8452602083015182811161012b578161008c918501610168565b60208501528483015191821161012b576100a7918301610168565b8383015260608101516060830152608081015160808301526100cb60a082016101d1565b60a083015260c08101516001600160601b038116810361012b5760c08301526100f660e082016101d1565b60e08301526101006101098183016101d1565b9083015261011b6101208092016101d1565b910152516105e790816101e68239f35b5f80fd5b634e487b7160e01b5f52604160045260245ffd5b6040519190601f01601f191682016001600160401b0381118382101761012f57604052565b919080601f8401121561012b5782516001600160401b03811161012f5760209061019a601f8201601f19168301610143565b9281845282828701011161012b575f5b8181106101be5750825f9394955001015290565b85810183015184820184015282016101aa565b51906001600160a01b038216820361012b5756fe608060409080825260049081361015610016575f80fd5b5f3560e01c90816306fdde031461042d575063cff0ab9614610036575f80fd5b34610429575f7ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc360112610429578151905f925f5460019481861c9086831692831561041f575b60209384841081146103f357838852879291859082156103b857505060011461035d575b6100ad92500385610543565b8151915f86549081881c918881168015610353575b858410811461032757838752869291869082156102ec575050600114610291575b6100ef92500384610543565b8051905f966002549081811c918181168015610287575b868410811461025b5783865290811561021f57506001146101c9575b50506101348261018197980383610543565b6003549454906005549161019a73ffffffffffffffffffffffffffffffffffffffff9283600654169561018d85600754169886600854169a84519e8f9e8f916101408084528301906104e7565b928184039101526104e7565b918b8303908c01526104e7565b9660608901526080880152811660a087015260a01c60c086015260e08501526101008401526101208301520390f35b60025f90815298507f405787fa12a823e0f2b7631cc41b3ba8828b3321ca811111fa75cd3aa3bb5ace5b828a1061020c5750505095810182019561013482610122565b8054858b018701529885019881016101f3565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0016868601525050151560051b82018301965061013482610122565b6022897f4e487b71000000000000000000000000000000000000000000000000000000005f525260245ffd5b92607f1692610106565b5050865f5283837fb10e2d527612073b26eecdfd717e6a320cf44b4afac2b0732d9fcbe2b7fa0cf6895f915b8583106102d35750506100ef93508201016100e3565b80919294505483858a01015201910184908987936102bd565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0016848201526100ef94151560051b84010191506100e39050565b6022887f4e487b71000000000000000000000000000000000000000000000000000000005f525260245ffd5b92607f16926100c2565b50505f805284827f290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563885f915b85831061039f5750506100ad93508201016100a1565b80919294505483858b0101520191018390888893610389565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0016848201526100ad94151560051b84010191506100a19050565b6022877f4e487b71000000000000000000000000000000000000000000000000000000005f525260245ffd5b91607f169161007d565b5f80fd5b90508234610429575f7ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126104295780820182811067ffffffffffffffff8211176104bb576104b793508152601282527f53696d706c6554657374436f6e747261637400000000000000000000000000006020830152519182916020835260208301906104e7565b0390f35b6041847f4e487b71000000000000000000000000000000000000000000000000000000005f525260245ffd5b91908251928382525f5b84811061052f5750507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f845f6020809697860101520116010190565b6020818301810151848301820152016104f1565b90601f7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0910116810190811067ffffffffffffffff82111761058457604052565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52604160045260245ffdfea2646970667358221220598f3c80d3b68c5438827d6ad75c311c86e0c2a766f006ea14d43ec2ded035e464736f6c63430008160033";

type SimpleTestConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: SimpleTestConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class SimpleTest__factory extends ContractFactory {
  constructor(...args: SimpleTestConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    args: FactoryTypes.CollectionArgsStruct,
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(args, overrides || {});
  }
  override deploy(
    args: FactoryTypes.CollectionArgsStruct,
    overrides?: NonPayableOverrides & { from?: string }
  ) {
    return super.deploy(args, overrides || {}) as Promise<
      SimpleTest & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): SimpleTest__factory {
    return super.connect(runner) as SimpleTest__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): SimpleTestInterface {
    return new Interface(_abi) as SimpleTestInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): SimpleTest {
    return new Contract(address, _abi, runner) as unknown as SimpleTest;
  }
}
