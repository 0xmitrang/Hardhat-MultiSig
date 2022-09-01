const hre = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = await getChainId();
    //0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
    log(`Starting deployments...`);
    const [owner, acc1, acc2, acc3] = await ethers.getSigners();
    let args = [[acc1.address, acc2.address, acc3.address], 2];
    // console.log("deployer--> ", deployer); //0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
    // console.log("owner--> ", owner); //0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
    // console.log("acc1--> ", acc1); //0x70997970C51812dc3A010C7d01b50e0d17dc79C8
    // console.log("acc2--> ", acc2); //0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC
    // console.log("acc3--> ", acc3); //0x90F79bf6EB2c4f870365E785982E1f101E93b906

    const multisig = await deploy("Multisig", {
        from: deployer,
        args: args,
        log: true,
    });
    log(`Multisig.sol deployed to : ${multisig.address}`);
};
module.exports.tags = ["multisig"];
