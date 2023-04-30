/* Autogenerated file. Do not edit manually. */

/* tslint:disable */

/* eslint-disable */
import type { PromiseOrValue } from "../../../../common";
import type {
  MockERC20,
  MockERC20Interface,
} from "../../../../lib/test/erc20-mock.sol/MockERC20";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import {
  Signer,
  utils,
  Contract,
  ContractFactory,
  BigNumberish,
  Overrides,
} from "ethers";

const _abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amountToMint",
        type: "uint256",
      },
    ],
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
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
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
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [],
    name: "DOMAIN_SEPARATOR",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
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
    name: "allowance",
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
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
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
    ],
    name: "balanceOf",
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
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "burn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
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
        name: "value",
        type: "uint256",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
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
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "nonces",
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
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "deadline",
        type: "uint256",
      },
      {
        internalType: "uint8",
        name: "v",
        type: "uint8",
      },
      {
        internalType: "bytes32",
        name: "r",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "s",
        type: "bytes32",
      },
    ],
    name: "permit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
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
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
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
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x60e06040818152346200049257816200107b8038038091620000228285620004c9565b8339602093849181010312620004925751815190620000418262000497565b600493848352634d6f636b60e01b81840152835191620000618362000497565b858352634d4f434b60e01b8284015283516001600160401b03949093908585116200047d5760009480620000968754620004ed565b92601f938481116200042c575b508690848311600114620003c4578892620003b8575b50508160011b916000199060031b1c19161785555b815190868211620003a5578190600193620000ea8554620004ed565b82811162000350575b5086918311600114620002ec578792620002e0575b5050600019600383901b1c191690821b1781555b60126080524660a052855184549181866200013785620004ed565b9283835287830195888282169182600014620002c057505060011462000280575b506200016792500382620004c9565b5190208551838101917f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f8352878201527fc89efdaa54c0f20c7adf612882df0950f5a951637e0307cdcb4c672f298b8bc660608201524660808201523060a082015260a0815260c0810195818710908711176200026d5785875251902060c0526002548181018091116200025a57907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef92916002553384526003825285842081815401905584523393a351610b5090816200052b82396080518161062a015260a05181610959015260c051816109800152f35b634e487b7160e01b845260118752602484fd5b634e487b7160e01b855260418852602485fd5b8791508880528189209089915b858310620002a75750506200016793508201013862000158565b805483880185015286945089939092019181016200028d565b60ff191688526200016795151560051b8501019250389150620001589050565b01519050388062000108565b8488528688208594509190601f198416895b898282106200033957505084116200031f575b505050811b0181556200011c565b015160001960f88460031b161c1916905538808062000311565b8385015186558897909501949384019301620002fe565b909192508488528688208380860160051c8201928987106200039b575b91869588929594930160051c01915b8281106200038c575050620000f3565b8a81558695508791016200037c565b925081926200036d565b634e487b7160e01b865260418952602486fd5b015190503880620000b9565b8880528789209250601f198416895b8982821062000415575050908460019594939210620003fb575b505050811b018555620000ce565b015160001960f88460031b161c19169055388080620003ed565b6001859682939686015181550195019301620003d3565b9091508780528688208480850160051c82019289861062000473575b9085949392910160051c01905b818110620004645750620000a3565b89815584935060010162000455565b9250819262000448565b604188634e487b7160e01b6000525260246000fd5b600080fd5b604081019081106001600160401b03821117620004b357604052565b634e487b7160e01b600052604160045260246000fd5b601f909101601f19168101906001600160401b03821190821017620004b357604052565b90600182811c921680156200051f575b60208310146200050957565b634e487b7160e01b600052602260045260246000fd5b91607f1691620004fd56fe6080604081815260048036101561001557600080fd5b600092833560e01c90816306fdde031461079f57508063095ea7b31461073157806318160ddd1461071257806323b872dd1461064e578063313ce567146106105780633644e515146105ec57806340c10f191461057157806370a08231146105395780637ecebe001461050157806395d89b4114610422578381639dc29fac146103c057508063a9059cbb1461034e578063d505accf1461010a5763dd62ed3e146100bf57600080fd5b3461010657816003193601126101065760209282916100dc610900565b6100e461091b565b6001600160a01b03918216845291865283832091168252845220549051908152f35b8280fd5b5091903461034a5760e036600319011261034a57610126610900565b9061012f61091b565b91604435606435926084359260ff84168094036103465742851061030357610155610954565b9560018060a01b038092169586895260209560058752848a209889549960018b01905585519285898501957f6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c987528b89870152169a8b606086015288608086015260a085015260c084015260c0835260e0830167ffffffffffffffff94848210868311176102ef578188528451902061010085019261190160f01b845261010286015261012285015260428152610160840194818610908611176102dc57848752519020835261018082015260a4356101a082015260c4356101c0909101528780528490889060809060015afa156102d25786511696871515806102c9575b156102975786977f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b9259596975283528087208688528352818188205551908152a380f35b83606492519162461bcd60e51b8352820152600e60248201526d24a72b20a624a22fa9a4a3a722a960911b6044820152fd5b50848814610254565b81513d88823e3d90fd5b634e487b7160e01b8c5260418d5260248cfd5b50634e487b7160e01b8c5260418d5260248cfd5b815162461bcd60e51b81526020818a0152601760248201527f5045524d49545f444541444c494e455f455850495245440000000000000000006044820152606490fd5b8680fd5b5080fd5b50503461034a578060031936011261034a5760209161036b610900565b826024359133845260038652818420610385848254610931565b90556001600160a01b031680845260038652922080548201905582519081523390600080516020610afb833981519152908590a35160018152f35b80843461041f578060031936011261041f57600080516020610afb83398151915260206103eb610900565b6024359060018060a01b0316938486526003835280862061040d838254610931565b9055816002540360025551908152a380f35b50fd5b50503461034a578160031936011261034a5780519082600180549161044683610845565b808652928281169081156104d9575060011461047d575b50505061046f8261047994038361087f565b51918291826108b7565b0390f35b94508085527fb10e2d527612073b26eecdfd717e6a320cf44b4afac2b0732d9fcbe2b7fa0cf65b8286106104c15750505061046f826020610479958201019461045d565b805460208787018101919091529095019481016104a4565b61047997508693506020925061046f94915060ff191682840152151560051b8201019461045d565b50503461034a57602036600319011261034a5760209181906001600160a01b03610529610900565b1681526005845220549051908152f35b50503461034a57602036600319011261034a5760209181906001600160a01b03610561610900565b1681526003845220549051908152f35b503461010657816003193601126101065761058a610900565b60243591600254908382018092116105d957506002556001600160a01b0316808452600360209081528385208054840190559251918252918391600080516020610afb8339815191529190a380f35b634e487b7160e01b865260119052602485fd5b50503461034a578160031936011261034a57602090610609610954565b9051908152f35b50503461034a578160031936011261034a576020905160ff7f0000000000000000000000000000000000000000000000000000000000000000168152f35b50913461070f57606036600319011261070f57610669610900565b600080516020610afb83398151915261068061091b565b6001600160a01b03928316808552602087815286862033875281528686205490979194889360443593899385600182016106ec575b505050868852600385528288206106cd858254610931565b9055169586815260038452208181540190558551908152a35160018152f35b6106f591610931565b90888a528652838920338a528652838920553880856106b5565b80fd5b50503461034a578160031936011261034a576020906002549051908152f35b503461010657816003193601126101065760209261074d610900565b918360243592839233825287528181209460018060a01b0316948582528752205582519081527f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925843392a35160018152f35b849084346101065782600319360112610106578280546107be81610845565b808552916001918083169081156104d957506001146107e95750505061046f8261047994038361087f565b80809650527f290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e5635b82861061082d5750505061046f826020610479958201019461045d565b80546020878701810191909152909501948101610810565b90600182811c92168015610875575b602083101461085f57565b634e487b7160e01b600052602260045260246000fd5b91607f1691610854565b90601f8019910116810190811067ffffffffffffffff8211176108a157604052565b634e487b7160e01b600052604160045260246000fd5b6020808252825181830181905290939260005b8281106108ec57505060409293506000838284010152601f8019910116010190565b8181018601518482016040015285016108ca565b600435906001600160a01b038216820361091657565b600080fd5b602435906001600160a01b038216820361091657565b9190820391821161093e57565b634e487b7160e01b600052601160045260246000fd5b6000467f0000000000000000000000000000000000000000000000000000000000000000036109a257507f000000000000000000000000000000000000000000000000000000000000000090565b604051815482916109b282610845565b8082528160209485820194600190878282169182600014610adc575050600114610a83575b506109e49250038261087f565b51902091604051918201927f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f845260408301527fc89efdaa54c0f20c7adf612882df0950f5a951637e0307cdcb4c672f298b8bc660608301524660808301523060a083015260a0825260c082019082821067ffffffffffffffff831117610a6f575060405251902090565b634e487b7160e01b81526041600452602490fd5b87805286915087907f290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e5635b858310610ac45750506109e49350820101386109d7565b80548388018501528694508893909201918101610aad565b60ff191688526109e495151560051b85010192503891506109d7905056feddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3efa2646970667358221220b47da182efb5c7c33edee005063f1b94514d469269f73b224a96f426a6a51a9c64736f6c63430008130033";

type MockERC20ConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: MockERC20ConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class MockERC20__factory extends ContractFactory {
  constructor(...args: MockERC20ConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    amountToMint: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<MockERC20> {
    return super.deploy(amountToMint, overrides || {}) as Promise<MockERC20>;
  }
  override getDeployTransaction(
    amountToMint: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(amountToMint, overrides || {});
  }
  override attach(address: string): MockERC20 {
    return super.attach(address) as MockERC20;
  }
  override connect(signer: Signer): MockERC20__factory {
    return super.connect(signer) as MockERC20__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): MockERC20Interface {
    return new utils.Interface(_abi) as MockERC20Interface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): MockERC20 {
    return new Contract(address, _abi, signerOrProvider) as MockERC20;
  }
}
