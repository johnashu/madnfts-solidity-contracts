import { config } from "dotenv";
import { ethers } from "hardhat";
import { resolve } from "path";
import fs from "fs";
import {
  type BigNumberish,
  type AddressLike,
  type BytesLike,
} from "ethers";

import { verifyContract } from "./verify";

const logStream = fs.createWriteStream("scripts/deploy.log", {
  flags: "a",
});

console.log = function (message: any) {
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp}: ${message}`;
  logStream.write(logMessage + "\n");
  process.stdout.write(logMessage + "\n");
};

config({ path: resolve(__dirname, "./.env") });

const WAIT = 5; // 5 confirmations to verify

const updateSettings = {
  deployErcToken: false,
  deployFactory: false,
  deployRouter: false,
  setRouterAddress: false,
  setFactoryAddress: false,
  setCollectionType721: false,
  setCollectionType1155: false,
  setFactoryFees: false,
  setRouterFees: false,
  deployErc721: false,
  deployErc1155: false,
  createCollectionSplitter: false,
  createCollectionCollection: false,
  verifyCollectionSplitter: true,
  verifyErc721: false,
  verifyErc1155: true,
  verifyErc20: false,
};

const {
  ERC20_TOKEN,
  FACTORY,
  ROUTER,
  feeCreateCollection,
  feeCreateCollectionErc20,
  feeCreateSplitter,
  feeCreateSplitterErc20,
  feeMint,
  feeMintErc20,
  feeBurn,
  feeBurnErc20,
  RECIPIENT,
} = process.env;

const _feeCreateCollection = ethers.parseEther(
  feeCreateCollection,
);
const _feeCreateSplitter = ethers.parseEther(
  feeCreateSplitter,
);
const _feeCreateCollectionErc20 = ethers.parseEther(
  feeCreateCollectionErc20,
);
const _feeCreateSplitterErc20 = ethers.parseEther(
  feeCreateSplitterErc20,
);

const _feeMint = ethers.parseEther(feeMint);
const _feeBurn = ethers.parseEther(feeBurn);
const _feeMintErc20 = ethers.parseEther(feeMintErc20);
const _feeBurnErc20 = ethers.parseEther(feeBurnErc20);

let deployerAddress = RECIPIENT;
let deployedFactoryAddress = FACTORY;
let deployedRouterAddress = ROUTER;
let deployedErc20Address = ethers.ZeroAddress;
let deployedErc721Address = ethers.ZeroAddress;
let deployedErc1155Address = ethers.ZeroAddress;
let deployedSplitterAddress =
  "0x7fff14609d138d8c309ac24932bd10459ba288b8"; //ethers.ZeroAddress;
let deployedFactoryErc721Address =
  "0xeCbAC7d854f059D275Dda4aA337051BCF68959B8"; //ethers.ZeroAddress;
let deployedFactoryErc1155Address =
  "0xeD5cbE4474C898693BdB33abff7dF669c829b0BE"; //ethers.ZeroAddress;

const currentTimeHex = () => {
  let currentTimeHex = Date.now().toString(16);
  currentTimeHex = currentTimeHex.padStart(64, "0");
  return "0x" + currentTimeHex;
};

type CollectionArgsStruct = {
  _name: string;
  _symbol: string;
  _baseURI: string;
  _price: BigNumberish;
  _maxSupply: BigNumberish;
  _splitter: AddressLike;
  _royaltyPercentage: BigNumberish;
  _router: AddressLike;
  _erc20: AddressLike;
  _owner: AddressLike;
};

type CreateCollectionParamsStruct = {
  madFeeTokenAddress: AddressLike;
  tokenType: BigNumberish;
  tokenSalt: BytesLike;
  collectionName: string;
  collectionSymbol: string;
  price: BigNumberish;
  maxSupply: BigNumberish;
  uri: string;
  splitter: AddressLike;
  royalty: BigNumberish;
};
const mockCollectionParams: CreateCollectionParamsStruct = {
  collectionName: "Yoghurt No Images",
  collectionSymbol: "YNI",
  madFeeTokenAddress: ethers.ZeroAddress,
  tokenType: 1, // Assuming token type as 1 for the mock
  tokenSalt: currentTimeHex() as BytesLike,
  price: ethers.parseEther("0.001"),
  maxSupply: 10000,
  uri: "https://mock-collection-params-uri.com/",
  splitter: deployedSplitterAddress as AddressLike,
  royalty: 1000, // 10%
};

const mockArgs: CollectionArgsStruct = {
  _name: mockCollectionParams.collectionName,
  _symbol: mockCollectionParams.collectionSymbol,
  _baseURI: mockCollectionParams.uri,
  _price: mockCollectionParams.price,
  _maxSupply: mockCollectionParams.maxSupply,
  _splitter: mockCollectionParams.splitter,
  _royaltyPercentage: mockCollectionParams.royalty,
  _router: deployedRouterAddress as AddressLike,
  _erc20: ethers.ZeroAddress, //deployedErc20Address as AddressLike,
  _owner: deployerAddress as AddressLike,
};

type CreateSplitterParamsStruct = {
  splitterSalt: BytesLike;
  ambassador: AddressLike;
  project: AddressLike;
  ambassadorShare: BigNumberish;
  projectShare: BigNumberish;
  madFeeTokenAddress: AddressLike;
};

const mockSplitterParams: CreateSplitterParamsStruct = {
  splitterSalt: currentTimeHex() as BytesLike,
  ambassador: ethers.ZeroAddress as AddressLike,
  project: ethers.ZeroAddress as AddressLike,
  ambassadorShare: "0" as BigNumberish, // 10%
  projectShare: "0" as BigNumberish, // 10%
  madFeeTokenAddress: ethers.ZeroAddress as AddressLike,
};

const deployedDisplay = () => {
  console.log(
    `Deployed Factory Address: ${
      deployedFactoryAddress
        ? deployedFactoryAddress
        : FACTORY
    }`,
  );
  console.log(
    `Deployed Router Address: ${
      deployedRouterAddress ? deployedRouterAddress : ROUTER
    }`,
  );
  console.log(
    `Deployed ERC20 Address: ${
      deployedErc20Address
        ? deployedErc20Address
        : ERC20_TOKEN
    }`,
  );
  console.log(
    `Deployed ERC721 Address: ${
      deployedErc721Address
        ? deployedErc721Address
        : ERC20_TOKEN
    }`,
  );
  console.log(
    `Deployed ERC1155 Address: ${
      deployedErc1155Address
        ? deployedErc1155Address
        : ERC20_TOKEN
    }`,
  );
  console.log(
    `Deployed Splitter Address: ${
      deployedSplitterAddress
        ? deployedSplitterAddress
        : ERC20_TOKEN
    }`,
  );
  console.log(
    `Deployed Factory ERC721 Address: ${
      deployedFactoryErc721Address
        ? deployedFactoryErc721Address
        : FACTORY
    }`,
  );
  console.log(
    `Deployed Factory ERC1155 Address: ${
      deployedFactoryErc1155Address
        ? deployedFactoryErc1155Address
        : FACTORY
    }`,
  );
};

const createCollectionSplitter = async factory => {
  console.log(
    `Creating Collection Splitter......with args ${Object.values(
      mockSplitterParams,
    )}`,
  );
  const tx = await factory.createSplitter(
    mockSplitterParams,
    { value: _feeCreateSplitter },
  );
  const receipt = await tx.wait(WAIT);
  const splitterEvent = receipt.events?.find(
    (event: { event: string }) =>
      event.event === "SplitterCreated",
  );
  if (!splitterEvent)
    throw new Error("SplitterCreated event not found");
  const splitterAddress = splitterEvent.args[0];
  return ethers.getContractAt(
    "SplitterContract",
    splitterAddress,
  );
};

const createCollectionCollection = async (
  factory: unknown,
) => {
  console.log(
    `Creating Collection...with args ${Object.values(
      mockCollectionParams,
    )}`,
  );
  const collection = await factory[
    "createCollection((address,uint8,bytes32,string,string,uint256,uint256,string,address,uint96))"
  ](mockCollectionParams, { value: _feeCreateCollection });
  await collection.wait(WAIT);
  return collection;
};

const deployERC721 = async () => {
  console.log(
    `Deploying contract ERC721 with ${deployerAddress}`,
  );
  const args = [mockArgs];
  const erc721 = await ethers.deployContract(
    "ERC721Basic",
    args,
    // ,gasArgs
  );
  console.log("have we deployed?");
  await erc721.deploymentTransaction().wait(WAIT);
  deployedErc721Address = erc721.target;
  await verifyContract(deployedErc721Address, args);
  return erc721;
};

const deployERC1155 = async () => {
  console.log(
    `Deploying contract ERC1155 with ${deployerAddress}`,
  );
  const args = [mockArgs];
  const erc1155 = await ethers.deployContract(
    "ERC1155Basic",
    args,
    // ,gasArgs
  );
  console.log("have we deployed?");
  await erc1155.deploymentTransaction().wait(WAIT);
  deployedErc1155Address = erc1155.target;
  await verifyContract(deployedErc1155Address, args);
  return erc1155;
};

const deployERC20 = async () => {
  console.log(
    `Deploying contract ERC20 with ${deployerAddress}`,
  );
  const args = ["Mad Mock Token", "MAD", 18, 10];
  const erc20 = await ethers.deployContract(
    "MockERC20",
    args,
    // ,gasArgs
  );
  console.log("have we deployed?");
  await erc20.deploymentTransaction().wait(WAIT);
  deployedErc20Address = erc20.target;
  await verifyContract(deployedErc20Address, args);
  return erc20;
};

const deployFactory = async () => {
  console.log(
    `Deploying contracts Factory with ${deployerAddress}`,
  );
  const args = [RECIPIENT];
  const factory = await ethers.deployContract(
    "MADFactory",
    args,
    // gasArgs
  );
  await factory.deploymentTransaction().wait(WAIT);
  deployedFactoryAddress = factory.target;
  await verifyContract(deployedFactoryAddress, args);
  return factory;
};

const deployRouter = async factoryAddress => {
  console.log(
    `Deploying contracts Router with ${deployerAddress}`,
  );
  const args = [factoryAddress, RECIPIENT];
  const router = await ethers.deployContract(
    "MADRouter",
    args,
    // gasArgs
  );
  await router.deploymentTransaction().wait(WAIT);
  deployedRouterAddress = router.target;
  await verifyContract(deployedRouterAddress, args);
  return router;
};

const setRouterAddress = async factory => {
  const routerAddress = await factory.router();
  if (routerAddress != deployedRouterAddress) {
    // Set router address
    const tx = await factory.setRouter(deployedRouterAddress);
    await tx.wait();
    console.log(`[OK] Router Address Set..`);
  } else {
    console.log(`[OK] Router Address Already Set..`);
  }
  // Check router address
  let calledRouterAddress = await factory.router();
  if (calledRouterAddress != deployedRouterAddress) {
    console.log(
      `\n***[ ERROR ]*** setting Router Address..\nExpected Address: ${deployedRouterAddress}\nActual Address:   ${calledRouterAddress}`,
    );
  }
};

const setFactoryFees = async (
  factory,
  erc20Address,
  _feeCreateCollection,
  _feeCreateSplitter,
  _feeCreateCollectionErc20,
  _feeCreateSplitterErc20,
) => {
  console.log(`\nSETTING FACTORY FEES`);

  let tx = await factory["setFees(uint256,uint256)"](
    _feeCreateCollection,
    _feeCreateSplitter,
  );
  await tx.wait();

  let setCreateFees = await factory.feeCreateCollection();
  let setCreateSplitterFees =
    await factory.feeCreateSplitter();

  if (setCreateFees != _feeCreateCollection) {
    console.log(
      `\n***[ ERROR ]*** setting Factory Create Collection Fees NOT Set\nExpected Fee: ${_feeCreateCollection}\nActual Fee:   ${setCreateFees}`,
    );
  } else {
    console.log(
      `[OK] Factory Create Collection Fees Set\nExpected Fee: ${_feeCreateCollection}\nActual Fee:   ${setCreateFees}`,
    );
  }

  if (setCreateSplitterFees != _feeCreateSplitter) {
    console.log(
      `\n***[ ERROR ]*** setting Factory Splitter Fees NOT Set\nExpected Fee: ${_feeCreateSplitter}\nActual Fee:   ${setCreateSplitterFees}`,
    );
  } else {
    console.log(
      `[OK] Factory Splitter Fees Set\nExpected Fee: ${_feeCreateSplitter}\nActual Fee:   ${setCreateSplitterFees}`,
    );
  }

  if (erc20Address != ethers.ZeroAddress) {
    let tx = await factory[
      "setFees(uint256,uint256,address)"
    ](
      _feeCreateCollectionErc20,
      _feeCreateSplitterErc20,
      erc20Address,
    );

    await tx.wait();

    let setCreateFeesErc20 =
      await factory.feeCreateCollectionErc20(erc20Address);
    let setCreateSplitterFeesErc20 =
      await factory.feeCreateSplitterErc20(erc20Address);

    if (setCreateFeesErc20[0] != _feeCreateCollectionErc20) {
      console.log(
        `\n***[ ERROR ]*** setting Factory CreateCollection ERC20 Fees NOT Set\nExpected Fee: ${_feeCreateCollectionErc20}\nActual Fee:   ${setCreateFeesErc20[0]}`,
      );
    } else {
      console.log(
        `[OK] Factory CreateCollection ERC20 Fees Set\nExpected Fee: ${_feeCreateCollectionErc20}\nActual Fee:   ${setCreateFeesErc20[0]}`,
      );
    }
    if (
      setCreateSplitterFeesErc20[0] != _feeCreateSplitterErc20
    ) {
      console.log(
        `\n***[ ERROR ]*** setting Factory Splitter Fees NOT Set\nExpected Fee: ${_feeCreateSplitterErc20}\nActual Fee:   ${setCreateSplitterFeesErc20[0]}`,
      );
    } else {
      console.log(
        `[OK] Factory Splitter ERC20 Fees Set\nExpected Fee: ${_feeCreateSplitterErc20}\nActual Fee:   ${setCreateSplitterFeesErc20[0]}`,
      );
    }
  }
};

const setRouterFees = async (
  router,
  erc20Address,
  _feeMint,
  _feeBurn,
  _feeMintErc20,
  _feeBurnErc20,
) => {
  console.log(`\nSETTING ROUTER FEES`);
  let tx = await router["setFees(uint256,uint256)"](
    _feeMint,
    _feeBurn,
  );
  await tx.wait();

  let setFeesMint = await router.feeMint();
  let setFeesBurn = await router.feeBurn();

  if (setFeesBurn != _feeBurn) {
    console.log(
      `\n***[ ERROR ]*** setting Router Burn Fee NOT Set\nExpected Fee: ${_feeBurn}\nActual Fee:   ${setFeesBurn}`,
    );
  } else {
    console.log(
      `[OK] Router Burn Fee Set\nExpected Fee: ${_feeBurn}\nActual Fee:   ${setFeesBurn}`,
    );
  }
  if (setFeesMint != _feeMint) {
    console.log(
      `\n***[ ERROR ]*** setting Router Mint Fee NOT Set\nExpected Fee: ${_feeMint}\nActual Fee:   ${setFeesMint}`,
    );
  } else {
    console.log(
      `[OK] Router Mint Fee Set\nExpected Fee: ${_feeMint}\nActual Fee:   ${setFeesMint}`,
    );
  }

  if (erc20Address != ethers.ZeroAddress) {
    let tx = await router["setFees(uint256,uint256,address)"](
      _feeMintErc20,
      _feeBurnErc20,
      erc20Address,
    );
    await tx.wait();

    let setFeesMintErc20 =
      await router.feeMintErc20(erc20Address);
    let setFeesBurnErc20 =
      await router.feeBurnErc20(erc20Address);

    if (setFeesBurnErc20[0] != _feeBurnErc20) {
      console.log(
        `\n***[ ERROR ]*** setting Router Burn Fee ERC20 NOT Set\nExpected Fee: ${_feeBurnErc20}\nActual Fee:   ${setFeesBurnErc20[0]}`,
      );
    } else {
      console.log(
        `[OK] Router Burn ERC20 Fee Set\nExpected Fee: ${_feeBurnErc20}\nActual Fee:   ${setFeesBurnErc20[0]}`,
      );
    }
    if (setFeesMintErc20[0] != _feeMintErc20) {
      console.log(
        `\n***[ ERROR ]*** setting Router Mint Fee ERC20 NOT Set\nExpected Fee: ${_feeMintErc20}\nActual Fee:   ${setFeesMintErc20[0]}`,
      );
    } else {
      console.log(
        `[OK] Router Mint ERC20 Fee Set\nExpected Fee: ${_feeMintErc20}\nActual Fee:   ${setFeesMintErc20[0]}`,
      );
    }
  }
};
const setCollectionType = async (
  factory,
  collectionType,
  bytecode,
  name,
) => {
  console.log(`\nSETTING COLLECTION TYPE ${name}`);
  let isDeployed =
    (await factory.collectionTypes(collectionType)) ===
    bytecode;
  if (isDeployed) {
    console.log(
      `[OK] Collection Type ${name} Already Added..`,
    );
  } else {
    const tx = await factory.addCollectionType(
      collectionType,
      bytecode,
    );
    await tx.wait();
    isDeployed =
      (await factory.collectionTypes(collectionType)) ===
      bytecode;
    if (!isDeployed) {
      console.log(
        `\n***[ ERROR ]*** Collection Type ${name} NOT Added..`,
      );
    } else {
      console.log(`[OK] Collection Type ${name} Added..`);
    }
  }
};

const main = async () => {
  const ERC721Basic =
    await ethers.getContractFactory("ERC721Basic");
  const ERC1155Basic =
    await ethers.getContractFactory("ERC1155Basic");

  const [deployer] = await ethers.getSigners();

  deployerAddress = deployer.address;
  let factory;
  let router;

  try {
    // Check token address
    if (updateSettings.deployErcToken) {
      let erc20 = await deployERC20();
      deployedErc20Address = await erc20.getAddress();
    } else if (ERC20_TOKEN) {
      deployedErc20Address = ERC20_TOKEN;
      console.log(`ERC20 address: ${deployedErc20Address}`);
    }

    // verify erc20
    if (updateSettings.verifyErc20) {
      await verifyContract(deployedErc20Address, [
        "Mad Mock Token",
        "MAD",
        18,
        10,
      ]);
    }

    // Deploy Contracts
    if (updateSettings.deployFactory) {
      factory = await deployFactory();
      deployedFactoryAddress = factory.target;
    } else {
      deployedFactoryAddress = FACTORY;
      factory = await ethers.getContractAt(
        "MADFactory",
        FACTORY,
      );
    }

    if (updateSettings.deployRouter) {
      router = await deployRouter(deployedFactoryAddress);
      deployedRouterAddress = router.target;
    } else {
      deployedRouterAddress = ROUTER;
      router = await ethers.getContractAt(
        "MADRouter",
        ROUTER,
      );
    }

    deployedDisplay();

    // Set router address
    if (updateSettings.setRouterAddress) {
      await setRouterAddress(factory);
    }

    // Add Collection Types
    if (updateSettings.setCollectionType721) {
      await setCollectionType(
        factory,
        1,
        ERC721Basic.bytecode,
        "ERC721",
      );
    }
    if (updateSettings.setCollectionType1155) {
      await setCollectionType(
        factory,
        2,
        ERC1155Basic.bytecode,
        "ERC1155",
      );
    }

    // Set fees for Factory
    if (updateSettings.setFactoryFees) {
      await setFactoryFees(
        factory.connect(deployer),
        deployedErc20Address,
        _feeCreateCollection,
        _feeCreateSplitter,
        _feeCreateCollectionErc20,
        _feeCreateSplitterErc20,
      );
    }
    // Set fees for Router
    if (updateSettings.setRouterFees) {
      await setRouterFees(
        router.connect(deployer),
        deployedErc20Address,
        _feeMint,
        _feeBurn,
        _feeMintErc20,
        _feeBurnErc20,
      );
    }

    // deploy and verify ERC721 /1155
    if (updateSettings.deployErc721) {
      await deployERC721();
    }
    if (updateSettings.deployErc1155) {
      await deployERC1155();
    }

    // create and verify collection / splitter
    if (updateSettings.createCollectionSplitter) {
      const splitter =
        await createCollectionSplitter(factory);
      deployedSplitterAddress = splitter.target;
    }

    if (updateSettings.verifyCollectionSplitter) {
      await verifyContract(deployedSplitterAddress, [
        [deployerAddress as AddressLike],
        [10000],
      ]);
    }

    if (updateSettings.createCollectionCollection) {
      const collection =
        await createCollectionCollection(factory);
      deployedCollectionAddress = collection.target;
    }

    if (updateSettings.verifyErc721) {
      mockCollectionParams.splitter = deployedSplitterAddress;
      await verifyContract(deployedFactoryErc721Address, [
        mockArgs,
      ]);
    }

    if (updateSettings.verifyErc1155) {
      mockCollectionParams.splitter = deployedSplitterAddress;
      await verifyContract(deployedFactoryErc1155Address, [
        mockArgs,
      ]);
    }

    deployedDisplay();
    console.log("Deployment completed successfully...\n");
    logStream.end();
    process.exit(0);
  } catch (error) {
    console.error(error);
    logStream.end();
    deployedDisplay();
    process.exit(1);
  }
};

main();
