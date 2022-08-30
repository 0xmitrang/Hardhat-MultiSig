require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {},
  },
  solidity: "0.8.10",
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
};
