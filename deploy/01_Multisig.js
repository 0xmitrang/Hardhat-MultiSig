const hre = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = await getChainId();
    //0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
    log(`Starting deployments...`);
    const [owner, acc1, acc2, acc3] = await ethers.getSigners();
    let args = [[acc1.address, acc2.address, acc3.address], 2];
    // console.log("deployer--> ", deployer);
    // console.log("owner--> ", owner);
    // console.log("acc1--> ", acc1);
    // console.log("acc2--> ", acc2);
    // console.log("acc3--> ", acc3);

    const multisig = await deploy("Multisig", {
        from: deployer,
        args: args,
        log: true,
    });
    log(`Multisig.sol deployed to : ${multisig.address}`);
};
module.exports.tags = ["multisig"];
