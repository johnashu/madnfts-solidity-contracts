import "@nomicfoundation/hardhat-chai-matchers";
import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-ignition-ethers";
import "@typechain/hardhat";
import { config as dotenvConfig } from "dotenv";
import { HardhatUserConfig } from "hardhat/config";
import { NetworkUserConfig } from "hardhat/types";
import { resolve } from "path";
import yargs from "yargs";

import "./tasks/accounts";

// Set script args
const parser = yargs
  .option("network", {
    type: "string",
    default: "hardhat",
  })
  .help(false)
  .version(false);

// Load and validate .env configs
dotenvConfig({ path: resolve(__dirname, "./.env") });

const {
  INFURA_API_KEY,
  MNEMONIC,
  ETHERSCAN_API_KEY,
  PK,
  ALCHEMY_KEY,
} = process.env;

const DEFAULT_MNEMONIC =
  "candy maple cake sugar pudding cream honey rich smooth crumble sweet treat";
(async () => {
  const argv = await parser.argv;
  if (
    ["goerli", "mainnet", "sepolia"].includes(argv.network) &&
    INFURA_API_KEY === undefined
  ) {
    throw new Error(
      `Could not find Infura key in env, unable to connect to network ${argv.network}`,
    );
  }
})();

// Set chain configs
const chains: Array<NetworkUserConfig> = [
  {
    chainId: 8453, //base
    url: "https://mainnet.base.org",
    gasPrice: 1000000000,
    accounts: PK
      ? [PK]
      : {
          mnemonic: MNEMONIC || DEFAULT_MNEMONIC,
        },
  },
  // for testnet
  {
    chainId: 84532, //baseSepolia
    url: "https://sepolia.base.org",
    gasPrice: 1000000000,
    accounts: PK
      ? [PK]
      : {
          mnemonic: MNEMONIC || DEFAULT_MNEMONIC,
        },
  },
  {
    chainId: 1666600000, // harmony
    url: "https://api.s0.t.hmny.io",
    accounts: PK
      ? [PK]
      : {
          mnemonic: MNEMONIC || DEFAULT_MNEMONIC,
        },
  },
  {
    chainId: 1666900000, // harmonyDevnet
    url: "https://api.s0.ps.hmny.io",
    accounts: PK
      ? [PK]
      : {
          mnemonic: MNEMONIC || DEFAULT_MNEMONIC,
        },
  },
  {
    chainId: 137, // Polygon
    url: "https://polygon-rpc.com/",
    accounts: PK
      ? [PK]
      : {
          mnemonic: MNEMONIC || DEFAULT_MNEMONIC,
        },
  },
  {
    chainId: 43970, // SERV
    url: "https://rpc-testnet.serv.services",
    accounts: PK
      ? [PK]
      : {
          mnemonic: MNEMONIC || DEFAULT_MNEMONIC,
        },
  },
  {
    chainId: 1564830818, // skale
    url: "https://mainnet.skalenodes.com/v1/honorable-steel-rasalhague",
    accounts: PK
      ? [PK]
      : {
          mnemonic: MNEMONIC || DEFAULT_MNEMONIC,
        },
  },
  {
    chainId: 344106930, // skaleDevnet
    url: "https://staging-v3.skalenodes.com/v1/staging-utter-unripe-menkar",
    accounts: PK
      ? [PK]
      : {
          mnemonic: MNEMONIC || DEFAULT_MNEMONIC,
        },
  },
  {
    chainId: 1351057110, // skale CHAOS
    url: "https://staging-v3.skalenodes.com/v1/staging-fast-active-bellatrix",
    accounts: PK
      ? [PK]
      : {
          mnemonic: MNEMONIC || DEFAULT_MNEMONIC,
        },
  },
  {
    chainId: 5, // goerli
    url: "https://goerli.infura.io/v3/" + INFURA_API_KEY,
    accounts: PK
      ? [PK]
      : {
          mnemonic: MNEMONIC || DEFAULT_MNEMONIC,
        },
  },
  {
    chainId: 11155111, // sepolia
    // url: "https://sepolia.infura.io/v3/" + INFURA_API_KEY,

    url:
      "https://eth-sepolia.g.alchemy.com/v2/" + ALCHEMY_KEY,
    accounts: PK
      ? [PK]
      : {
          mnemonic: MNEMONIC || DEFAULT_MNEMONIC,
        },
  },
  {
    chainId: 296, // Hedera testnet
    url: "https://testnet.hashio.io/api/",
    accounts: PK
      ? [PK]
      : {
          mnemonic: MNEMONIC || DEFAULT_MNEMONIC,
        },
    timeout: 200000,

    allowUnlimitedContractSize: true,
  },
  {
    chainId: 1337, // ganache
    url: "http://localhost:7545",
    accounts: PK
      ? [PK]
      : {
          mnemonic: MNEMONIC || DEFAULT_MNEMONIC,
        },
  },
];

function getChainConfig(id: number) {
  return chains.find(a => a.chainId === id);
}

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  etherscan: {
    apiKey: {
      mainnet: ETHERSCAN_API_KEY || "",
      goerli: ETHERSCAN_API_KEY || "",
      sepolia: ETHERSCAN_API_KEY || "",
      base: ETHERSCAN_API_KEY,
      baseSepolia: ETHERSCAN_API_KEY,
    },
    customChains: [
      {
        network: "base",
        chainId: 8453,
        urls: {
          apiURL: "https://api.basescan.org/api",
          browserURL: "https://basescan.org",
        },
      },
      {
        network: "baseSepolia",
        chainId: 84532,
        urls: {
          apiURL: "https://api-sepolia.basescan.org/api",
          browserURL: "https://sepolia.basescan.org",
        },
      },
      {
        network: "harmonyDevnet",
        chainId: 1666900000,
        urls: {
          apiURL:
            "https://ctrver.b.hmny.io/verify?network=devnet",
          browserURL: "https://api.s0.ps.hmny.io",
        },
      },
      {
        network: "SERV",
        chainId: 43970,
        urls: {
          apiURL: "https://rpc-testnet.serv.services",
          browserURL:
            "https://tserv-explorer.tryethernal.com/",
        },
      },
      {
        network: "hedera",
        chainId: 296, // Hedera
        urls: {
          apiURL: "https://testnet.hashio.io/api/",
          browserURL: "https://server-verify.hashscan.io", // "https://hashscan.io/testnet"
        },
      },
    ],
  },
  gasReporter: {
    enabled: !!(
      process.env.REPORT_GAS &&
      process.env.REPORT_GAS != "false"
    ),
    showTimeSpent: true,
    showMethodSig: true,
    token: "ONE",
    currency: "USD",
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    excludeContracts: [],
    src: "./contracts",
  },
  networks: {
    base: getChainConfig(8453),
    baseSepolia: getChainConfig(84532),
    harmony: getChainConfig(1666600000),
    harmonyDevnet: getChainConfig(1666900000),
    serv: getChainConfig(43970),
    hedera: getChainConfig(296),
    polygon: getChainConfig(137),
    skale: getChainConfig(1564830818),
    skaleDevnet: getChainConfig(344106930),
    skaleChaos: getChainConfig(1351057110),
    goerli: getChainConfig(5),
    sepolia: getChainConfig(11155111),
    ganache: getChainConfig(1337),
    hardhat: {
      allowUnlimitedContractSize: true,
      forking: {
        url: `https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
        blockNumber: 39835000,
      },
    },
  },
  paths: {
    artifacts: "./artifacts",
    cache: "./cache",
    sources: "./contracts",
    tests: "./test",
  },

  // solidity: {
  //   version: "0.8.22",
  //   settings: {
  //     metadata: {
  //       bytecodeHash: "none",
  //     },
  //     optimizer: {
  //       enabled: true,
  //       runs: 800,
  //     },
  //   },
  // },
  solidity: {
    version: "0.8.23",
    settings: {
      viaIR: true,
      evmVersion: "shanghai",
      optimizer: {
        enabled: true,
        runs: 20_000,
        details: {
          yul: true,
          yulDetails: {
            stackAllocation: true,
          },
        },
      },
    },
  },
  typechain: {
    outDir: "src/types",
    target: "ethers-v6",
  },
  // dodoc: {
  //   runOnCompile: !!(
  //     process.env.GEN_DOCS && process.env.GEN_DOCS != "false"
  //   ),
  // },
};

export default config;
