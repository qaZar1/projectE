import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployNewContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  await deploy("NewContract", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });
};

export default deployNewContract;
deployNewContract.tags = ["NewContract"];
