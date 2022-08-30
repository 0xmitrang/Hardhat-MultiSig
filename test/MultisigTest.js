const { deployments, getChainId } = require("hardhat");
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

        this.beforeEach(async () => {
            await deployments.fixture(["multisig"]);
            const Multisig = await deployments.get("Multisig");
            multisig = await ethers.getContractAt("Multisig", Multisig.address);
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
    }
);
