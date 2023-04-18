import "@nomicfoundation/hardhat-chai-matchers";
import "@nomiclabs/hardhat-etherscan";
import "@primitivefi/hardhat-dodoc";
import "@typechain/hardhat";
import { config as dotenvConfig } from "dotenv";
import "hardhat-gas-reporter";
import "hardhat-tracer";
import { HardhatUserConfig } from "hardhat/config";
import { NetworkUserConfig } from "hardhat/types";
import { resolve } from "path";
import "solidity-coverage";
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
    ["goerli", "mainnet"].includes(argv.network) &&
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
    chainId: 5, // goerli
    url: "https://goerli.infura.io/v3/" + INFURA_API_KEY,
    accounts: PK
      ? [PK]
      : {
          mnemonic: MNEMONIC || DEFAULT_MNEMONIC,
        },
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
    },
    customChains: [
      {
        network: "harmonyDevnet",
        chainId: 1666900000,
        urls: {
          apiURL:
            "https://ctrver.b.hmny.io/verify?network=devnet",
          browserURL: "https://api.s0.ps.hmny.io",
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
    harmony: getChainConfig(1666600000),
    harmonyDevnet: getChainConfig(1666900000),
    skale: getChainConfig(1564830818),
    skaleDevnet: getChainConfig(344106930),
    goerli: getChainConfig(5),
    ganache: getChainConfig(1337),
    hardhat: {
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
  //   version: "0.8.19",
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
    version: "0.8.19",
    settings: {
      viaIR: true,
      optimizer: {
        enabled: true,
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
    target: "ethers-v5",
  },
  dodoc: {
    runOnCompile: !!(
      process.env.GEN_DOCS && process.env.GEN_DOCS != "false"
    ),
  },
};

export default config;
