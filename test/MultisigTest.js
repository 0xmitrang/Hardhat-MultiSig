const { deployments, getChainId, ethers } = require("hardhat");
const skipIf = require("mocha-skip-if");
const { expect } = require("chai");
const {
    networkConfig,
    developmentChains,
} = require("../helper-hardhat-config");

skip.if(!developmentChains.includes(network.name)).describe(
    "MultiSig Initial Tests",
    async function () {
        let multisig;
        let contractAddress;

        beforeEach(async () => {
            await deployments.fixture(["multisig"]);
            const Multisig = await deployments.get("Multisig");
            contractAddress = Multisig.address;
            multisig = await ethers.getContractAt("Multisig", contractAddress);
        });

        it("should have the owners set", async () => {
            let ownerCount = await multisig.getOwnerCount();
            const { acc1, acc2, acc3 } = await getNamedAccounts();
            let owners = [];
            for (let i = 0; i < ownerCount; i++) {
                let owner = await multisig.owners(i);
                owners.push(owner);
            }
            let own = [acc1, acc2, acc3];
            expect(JSON.stringify(own) == JSON.stringify(owners)).to.be.true;
        });

        it("should have the required count set", async () => {
            let requiredCount = await multisig.required();
            expect(requiredCount).to.equal(2);
        });

        //send transaction let from yesterday
        it("should receive funds with fallback function", async () => {
            const [deployer] = await ethers.getSigners();

            let tx = {
                // from: deployer.address,
                to: contractAddress,
                value: ethers.utils.parseUnits("1", "ether").toHexString(),
            };
            let sendTx = await deployer.sendTransaction(tx);
            let receipt = await sendTx.wait(1);
            let contractBal = await multisig.getBalance();
            expect(contractBal).to.equal(ethers.utils.parseUnits("1", "ether"));
        });
    }
);
