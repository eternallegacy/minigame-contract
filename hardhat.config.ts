import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@openzeppelin/hardhat-upgrades";

require("hardhat-abi-exporter");

const config: HardhatUserConfig = {
  networks: {
    hardhat: {
      chainId: 31337, // 本地 Hardhat 网络 ID，通常为 31337
    },
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/9dOawif4UpGz4XQT6C6RUHCJbx8PHTYm", // Goerli 测试网节点 URL
      accounts: [""], // 部署合约时使用的私钥
    },
  },
  solidity: "0.8.27",
};

export default config;
