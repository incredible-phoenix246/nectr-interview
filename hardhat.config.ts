import "@nomicfoundation/hardhat-toolbox-viem";
import "@nomicfoundation/hardhat-verify";
import type { HardhatUserConfig } from "hardhat/config";
import hardhatToolboxViemPlugin from "@nomicfoundation/hardhat-toolbox-viem";
import { configVariable } from "hardhat/config";

const PRIVATE_KEY = process.env.PRIVATE_KEY
const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY

const config: HardhatUserConfig = {
  plugins: [hardhatToolboxViemPlugin],
  solidity: {
    profiles: {
      default: {
        version: "0.8.28",
      },
      production: {
        version: "0.8.28",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    },
  },
  networks: {
    mumbai: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      chainId: 80001,
      gasPrice: 20000000000, // 20 gwei
      type: "http"
    },
    polygon: {
      url: "https://polygon-rpc.com",
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      chainId: 137,
      type: "http"
    },
  }
};

export default config;