// Script to deploy AI Oracle contracts to the Core blockchain

const hre = require("hardhat");

async function main() {
  console.log("Starting deployment of AI Oracle contracts...");

  // Get the contract factories
  const RewardToken = await hre.ethers.getContractFactory("RewardToken");
  const Governance = await hre.ethers.getContractFactory("Governance");
  const AIOracle = await hre.ethers.getContractFactory("AIOracle");
  const Staking = await hre.ethers.getContractFactory("Staking");

  // Deploy RewardToken first
  console.log("Deploying RewardToken contract...");
  const tokenName = "AI Oracle Token";
  const tokenSymbol = "AIOT";
  const maxSupply = hre.ethers.utils.parseEther("1000000"); // 1 million tokens
  const initialSupply = hre.ethers.utils.parseEther("100000"); // 100,000 tokens initially
  
  const rewardToken = await RewardToken.deploy(
    tokenName,
    tokenSymbol,
    maxSupply,
    initialSupply
  );
  await rewardToken.deployed();
  console.log(`RewardToken contract deployed to: ${rewardToken.address}`);
  
  // Governance parameters
  const votingPeriod = 5760; // ~24 hours on Core (assuming 15 sec block time)
  const proposalThreshold = 51; // 51% of votes needed

  console.log("Deploying Governance contract...");
  const governance = await Governance.deploy(
    rewardToken.address, // Use the actual token instead of a mock
    votingPeriod,
    proposalThreshold
  );
  await governance.deployed();
  console.log(`Governance contract deployed to: ${governance.address}`);

  // Oracle parameters
  const minVotesRequired = 3; // At least 3 votes needed to verify data
  const verificationThreshold = 66; // 66% of votes needed to verify data

  console.log("Deploying AIOracle contract...");
  const aiOracle = await AIOracle.deploy(
    governance.address,
    minVotesRequired,
    verificationThreshold
  );
  await aiOracle.deployed();
  console.log(`AIOracle contract deployed to: ${aiOracle.address}`);
  
  // Staking parameters
  const minimumStakingPeriod = 86400; // 1 day in seconds
  const apy = 500; // 5% APY (in basis points)
  
  console.log("Deploying Staking contract...");
  const staking = await Staking.deploy(
    rewardToken.address,
    governance.address,
    minimumStakingPeriod,
    apy
  );
  await staking.deployed();
  console.log(`Staking contract deployed to: ${staking.address}`);
  
  // Set up permissions
  console.log("Setting up contract permissions...");
  
  // Add Staking contract as a minter for RewardToken
  const addMinterTx = await rewardToken.addMinter(staking.address);
  await addMinterTx.wait();
  console.log(`Added Staking contract as a minter for RewardToken`);
  
  // Add AIOracle contract as a minter for RewardToken
  const addOracleMinterTx = await rewardToken.addMinter(aiOracle.address);
  await addOracleMinterTx.wait();
  console.log(`Added AIOracle contract as a minter for RewardToken`);

  console.log("All contracts deployed successfully!");
  console.log("\nDeployment Summary:");
  console.log("===================");
  console.log(`RewardToken: ${rewardToken.address}`);
  console.log(`Governance: ${governance.address}`);
  console.log(`AIOracle: ${aiOracle.address}`);
  console.log(`Staking: ${staking.address}`);
  
  console.log("\nVerification commands:");
  console.log(`npx hardhat verify --network core ${rewardToken.address} "${tokenName}" "${tokenSymbol}" ${maxSupply} ${initialSupply}`);
  console.log(`npx hardhat verify --network core ${governance.address} ${rewardToken.address} ${votingPeriod} ${proposalThreshold}`);
  console.log(`npx hardhat verify --network core ${aiOracle.address} ${governance.address} ${minVotesRequired} ${verificationThreshold}`);
  console.log(`npx hardhat verify --network core ${staking.address} ${rewardToken.address} ${governance.address} ${minimumStakingPeriod} ${apy}`);
  
  console.log("\nEnvironment Variables for Frontend:");
  console.log(`NEXT_PUBLIC_REWARD_TOKEN_ADDRESS=${rewardToken.address}`);
  console.log(`NEXT_PUBLIC_GOVERNANCE_ADDRESS=${governance.address}`);
  console.log(`NEXT_PUBLIC_AI_ORACLE_ADDRESS=${aiOracle.address}`);
  console.log(`NEXT_PUBLIC_STAKING_ADDRESS=${staking.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 