require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");
require("@nomiclabs/hardhat-ethers");

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
        acc1: {
            default: 1,
        },
        acc2: {
            default: 2,
        },
        acc3: {
            default: 3,
        },
    },
};
