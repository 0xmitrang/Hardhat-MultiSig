const { deployments, getChainId, ethers } = require("hardhat");
const skipIf = require("mocha-skip-if");
const { expect } = require("chai");
// const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const {
    networkConfig,
    developmentChains,
} = require("../helper-hardhat-config");

skip.if(!developmentChains.includes(network.name)).describe(
    "MultiSig Unit Tests",
    async function () {
        let multisig;
        let contractAddress;
        // let multisigAcc1, multisigAcc2, multisigAcc3;

        beforeEach(async () => {
            await deployments.fixture(["multisig"]);
            const Multisig = await deployments.get("Multisig");
            contractAddress = Multisig.address;
            multisig = await ethers.getContractAt("Multisig", contractAddress);
        });

        // it("should not accept wrong constructor arguments", async () => {});

        it("should have the owners set", async () => {
            let ownerCount = await multisig.getOwnerCount();
            expect(ownerCount).to.be.equal(3);

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

        it("should receive funds with fallback function and emit the event", async () => {
            const [deployer] = await ethers.getSigners();

            let tx = {
                // from: deployer.address,
                to: contractAddress,
                value: ethers.utils.parseUnits("10000", "wei").toHexString(),
            };
            let sendTx = await deployer.sendTransaction(tx);
            let receipt = await sendTx.wait(1);
            let contractBal = await multisig.getBalance();
            expect(contractBal).to.equal(
                ethers.utils.parseUnits("10000", "wei")
            );
        });

        it("should emit the deposit event", async () => {
            const [deployer] = await ethers.getSigners();

            let tx = {
                // from: deployer.address,
                to: contractAddress,
                value: ethers.utils.parseUnits("10000", "wei").toHexString(),
            };
            await expect(await deployer.sendTransaction(tx))
                .to.emit(multisig, "Deposit")
                .withArgs(deployer.address, tx.value);
        });

        describe("Submit Tx to Contract", async function () {
            beforeEach(async () => {
                await deployments.fixture(["multisig"]);
                const Multisig = await deployments.get("Multisig");
                contractAddress = Multisig.address;
                multisig = await ethers.getContractAt(
                    "Multisig",
                    contractAddress
                );
            });

            it("should not submit tx, revert with onlyOwner ", async () => {
                const accounts = await ethers.getSigners();
                let tx = [
                    accounts[4].address,
                    ethers.utils.parseUnits("10000", "wei"),
                    "0x",
                ];
                await expect(
                    multisig.submit(tx[0], tx[1], tx[2])
                ).to.be.revertedWith("onlyOwner");
            });

            it("should submit Tx", async () => {
                const accounts = await ethers.getSigners();
                let multisigAcc1 = await multisig.connect(accounts[1]);
                let tx = [
                    accounts[4].address,
                    ethers.utils.parseUnits("10000", "wei"),
                    "0x",
                ];
                let submitTx = await multisigAcc1.submit(tx[0], tx[1], tx[2]);
                await submitTx.wait(1);
                let retrieveTx = await multisig.transactions(0);
                expect(tx.toString() + ",false" == retrieveTx.toString()).to.be
                    .true;
            });
        });

        describe("Tx approve, revoke and submit", async function () {
            beforeEach(async () => {
                //getting contract
                await deployments.fixture(["multisig"]);
                const Multisig = await deployments.get("Multisig");
                contractAddress = Multisig.address;
                multisig = await ethers.getContractAt(
                    "Multisig",
                    contractAddress
                );

                //submitting tx to contract
                const accounts = await ethers.getSigners();
                let multisigAcc1 = await multisig.connect(accounts[1]);
                let tx = [
                    accounts[4].address,
                    ethers.utils.parseUnits("10000", "wei"),
                    "0x",
                ];
                let submitTx = await multisigAcc1.submit(tx[0], tx[1], tx[2]);
                await submitTx.wait(1);

                //funding the contract
                let fundTx = {
                    // from: deployer.address,
                    to: contractAddress,
                    value: ethers.utils
                        .parseUnits("10000", "wei")
                        .toHexString(),
                };
                let sendTx = await accounts[0].sendTransaction(fundTx);
                await sendTx.wait(1);
            });

            it("approve fail with onlyOwner", async () => {
                await expect(multisig.approve(0)).to.be.revertedWith(
                    "onlyOwner"
                );
            });

            it("approve fail with txExists", async () => {
                const accounts = await ethers.getSigners();
                let multisigAcc1 = await multisig.connect(accounts[1]);
                await expect(multisigAcc1.approve(5)).to.be.revertedWith(
                    "tx does not exists"
                );
            });

            //ToDo: tests for failing tx with notApproved and notExcuted left

            it("should execute whole smart contract functionality", async () => {
                const accounts = await ethers.getSigners();
                let multisigAcc1 = await multisig.connect(accounts[1]);
                let multisigAcc2 = await multisig.connect(accounts[2]);
                let multisigAcc3 = await multisig.connect(accounts[3]);

                //approve from owner 1
                let approveTx = await multisigAcc1.approve(0);
                await approveTx.wait(1);
                let checkApprove = await multisig.approved(
                    0,
                    accounts[1].address
                );
                expect(checkApprove === true).to.be.true;

                //approve from owner 2
                let approveTx2 = await multisigAcc2.approve(0);
                await approveTx2.wait(1);
                let checkApprove2 = await multisig.approved(
                    0,
                    accounts[2].address
                );
                expect(checkApprove2 === true).to.be.true;

                //approve from owner 3
                let approveTx3 = await multisigAcc3.approve(0);
                await approveTx3.wait(1);
                let checkApprove3 = await multisig.approved(
                    0,
                    accounts[3].address
                );
                expect(checkApprove3 === true).to.be.true;

                //revoke from owner3
                let revokeTx3 = await multisigAcc3.revoke(0);
                await revokeTx3.wait(1);
                let checkRevoke3 = await multisig.approved(
                    0,
                    accounts[3].address
                );
                expect(checkRevoke3 === false).to.be.true;

                //execute function
                await expect(() =>
                    multisigAcc1.execute(0)
                ).to.changeEtherBalance(
                    accounts[4],
                    ethers.utils.parseUnits("10000", "wei")
                );
            });
        });
    }
);
