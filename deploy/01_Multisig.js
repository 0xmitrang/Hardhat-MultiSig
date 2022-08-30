module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();

  log(`Starting deployments...`);
  const Multisig = await deploy("Multisig", { deployer, log: true });
  log(`Multisig.sol deployed to : ${Multisig.address}`);
};
