import { ethers } from 'ethers';
import { 
  CONTRACT_ADDRESSES, 
  AIOracle_ABI, 
  Governance_ABI,
  RewardToken_ABI,
  Staking_ABI 
} from './constants';

/**
 * Get contract instances for interacting with the blockchain
 * @param {ethers.providers.Web3Provider} provider - The web3 provider
 * @param {ethers.Signer} signer - Optional signer for transactions
 * @returns {Object} Contract instances
 */
export const getContracts = (provider, signer) => {
  if (!provider) {
    console.error("Provider is required to get contract instances");
    return null;
  }

  const signerOrProvider = signer || provider;

  try {
    const aiOracle = new ethers.Contract(
      CONTRACT_ADDRESSES.AIOracle,
      AIOracle_ABI,
      signerOrProvider
    );

    const governance = new ethers.Contract(
      CONTRACT_ADDRESSES.Governance,
      Governance_ABI,
      signerOrProvider
    );

    const rewardToken = new ethers.Contract(
      CONTRACT_ADDRESSES.RewardToken,
      RewardToken_ABI,
      signerOrProvider
    );

    const staking = new ethers.Contract(
      CONTRACT_ADDRESSES.Staking,
      Staking_ABI,
      signerOrProvider
    );

    return {
      aiOracle,
      governance,
      rewardToken,
      staking
    };
  } catch (error) {
    console.error("Error creating contract instances:", error);
    return null;
  }
};

/**
 * Submit data to the oracle
 * @param {ethers.Contract} aiOracle - AIOracle contract instance
 * @param {string} dataType - Type of data being submitted
 * @param {string} dataValue - JSON string of data
 * @param {number} confidence - Confidence score (0-100)
 * @returns {Promise<Object>} Transaction receipt
 */
export const submitOracleData = async (aiOracle, dataType, dataValue, confidence) => {
  if (!aiOracle) {
    throw new Error("AIOracle contract instance is required");
  }
  
  try {
    const tx = await aiOracle.submitData(dataType, dataValue, confidence);
    const receipt = await tx.wait();
    return receipt;
  } catch (error) {
    console.error("Error submitting data to oracle:", error);
    throw error;
  }
};

/**
 * Vote on a submission
 * @param {ethers.Contract} aiOracle - AIOracle contract instance
 * @param {number} submissionId - ID of the submission to vote on
 * @param {boolean} support - True for support, false against
 * @returns {Promise<Object>} Transaction receipt
 */
export const castVoteOnSubmission = async (aiOracle, submissionId, support) => {
  if (!aiOracle) {
    throw new Error("AIOracle contract instance is required");
  }
  
  try {
    const tx = await aiOracle.castVote(submissionId, support);
    const receipt = await tx.wait();
    return receipt;
  } catch (error) {
    console.error("Error casting vote on submission:", error);
    throw error;
  }
};

/**
 * Get submission details
 * @param {ethers.Contract} aiOracle - AIOracle contract instance
 * @param {number} submissionId - ID of the submission
 * @returns {Promise<Object>} Submission details
 */
export const getSubmissionDetails = async (aiOracle, submissionId) => {
  if (!aiOracle) {
    throw new Error("AIOracle contract instance is required");
  }
  
  try {
    const submission = await aiOracle.getSubmission(submissionId);
    return {
      submitter: submission[0],
      dataType: submission[1],
      dataValue: submission[2],
      timestamp: submission[3].toNumber(),
      confidence: submission[4].toNumber(),
      verified: submission[5],
      votesFor: submission[6].toNumber(),
      votesAgainst: submission[7].toNumber()
    };
  } catch (error) {
    console.error("Error getting submission details:", error);
    throw error;
  }
};

/**
 * Stake tokens in the staking contract
 * @param {ethers.Contract} rewardToken - RewardToken contract instance
 * @param {ethers.Contract} staking - Staking contract instance
 * @param {number} amount - Amount of tokens to stake
 * @returns {Promise<Object>} Transaction receipt
 */
export const stakeTokens = async (rewardToken, staking, amount) => {
  if (!rewardToken || !staking) {
    throw new Error("RewardToken and Staking contract instances are required");
  }
  
  try {
    // First approve the staking contract to spend tokens
    const approveTx = await rewardToken.approve(staking.address, amount);
    await approveTx.wait();
    
    // Then stake the tokens
    const stakeTx = await staking.stake(amount);
    const receipt = await stakeTx.wait();
    return receipt;
  } catch (error) {
    console.error("Error staking tokens:", error);
    throw error;
  }
};

/**
 * Unstake tokens from the staking contract
 * @param {ethers.Contract} staking - Staking contract instance
 * @param {number} amount - Amount of tokens to unstake
 * @returns {Promise<Object>} Transaction receipt
 */
export const unstakeTokens = async (staking, amount) => {
  if (!staking) {
    throw new Error("Staking contract instance is required");
  }
  
  try {
    const tx = await staking.unstake(amount);
    const receipt = await tx.wait();
    return receipt;
  } catch (error) {
    console.error("Error unstaking tokens:", error);
    throw error;
  }
};

/**
 * Claim staking rewards
 * @param {ethers.Contract} staking - Staking contract instance
 * @returns {Promise<Object>} Transaction receipt
 */
export const claimRewards = async (staking) => {
  if (!staking) {
    throw new Error("Staking contract instance is required");
  }
  
  try {
    const tx = await staking.claimRewards();
    const receipt = await tx.wait();
    return receipt;
  } catch (error) {
    console.error("Error claiming rewards:", error);
    throw error;
  }
}; 