import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { 
  CONTRACT_ADDRESSES, 
  AIOracle_ABI, 
  Governance_ABI,
  RewardToken_ABI,
  Staking_ABI 
} from '../utils/constants';

/**
 * Custom hook for smart contract interactions
 * @param {Object} provider - Ethers provider
 * @param {Object} signer - Ethers signer (optional, for write operations)
 * @returns {Object} Contract instances and interaction methods
 */
export function useContract(provider, signer) {
  const [contracts, setContracts] = useState({
    aiOracle: null,
    governance: null,
    rewardToken: null,
    staking: null
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize contract instances when provider/signer changes
  useEffect(() => {
    if (!provider) {
      setIsLoading(false);
      return;
    }

    const initContracts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const signerOrProvider = signer || provider;

        // Initialize AIOracle contract
        const aiOracle = new ethers.Contract(
          CONTRACT_ADDRESSES.AIOracle,
          AIOracle_ABI,
          signerOrProvider
        );

        // Initialize Governance contract
        const governance = new ethers.Contract(
          CONTRACT_ADDRESSES.Governance,
          Governance_ABI,
          signerOrProvider
        );

        // Initialize RewardToken contract
        const rewardToken = new ethers.Contract(
          CONTRACT_ADDRESSES.RewardToken,
          RewardToken_ABI,
          signerOrProvider
        );

        // Initialize Staking contract
        const staking = new ethers.Contract(
          CONTRACT_ADDRESSES.Staking,
          Staking_ABI,
          signerOrProvider
        );

        setContracts({
          aiOracle,
          governance,
          rewardToken,
          staking
        });
      } catch (err) {
        console.error("Error initializing contracts:", err);
        setError("Failed to initialize contracts");
      } finally {
        setIsLoading(false);
      }
    };

    initContracts();
  }, [provider, signer]);

  /**
   * Submit data to the oracle
   * @param {string} dataType - Type of data being submitted
   * @param {string} dataValue - JSON string of data
   * @param {number} confidence - Confidence score (0-100)
   * @returns {Promise<Object>} Transaction receipt
   */
  const submitOracleData = async (dataType, dataValue, confidence) => {
    if (!contracts.aiOracle || !signer) {
      throw new Error("Contract or signer not available");
    }
    
    try {
      const tx = await contracts.aiOracle.submitData(dataType, dataValue, confidence);
      const receipt = await tx.wait();
      return receipt;
    } catch (err) {
      console.error("Error submitting data to oracle:", err);
      throw err;
    }
  };

  /**
   * Vote on a submission
   * @param {number} submissionId - ID of the submission to vote on
   * @param {boolean} support - True for support, false against
   * @returns {Promise<Object>} Transaction receipt
   */
  const castVoteOnSubmission = async (submissionId, support) => {
    if (!contracts.aiOracle || !signer) {
      throw new Error("Contract or signer not available");
    }
    
    try {
      const tx = await contracts.aiOracle.castVote(submissionId, support);
      const receipt = await tx.wait();
      return receipt;
    } catch (err) {
      console.error("Error casting vote on submission:", err);
      throw err;
    }
  };

  /**
   * Get submission details
   * @param {number} submissionId - ID of the submission
   * @returns {Promise<Object>} Submission details
   */
  const getSubmissionDetails = async (submissionId) => {
    if (!contracts.aiOracle) {
      throw new Error("Contract not available");
    }
    
    try {
      const submission = await contracts.aiOracle.getSubmission(submissionId);
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
    } catch (err) {
      console.error("Error getting submission details:", err);
      throw err;
    }
  };

  /**
   * Get the latest verified data for a specific data type
   * @param {string} dataType - The type of data to retrieve
   * @returns {Promise<Object>} Latest verified data
   */
  const getLatestData = async (dataType) => {
    if (!contracts.aiOracle) {
      throw new Error("Contract not available");
    }
    
    try {
      const [dataValue, timestamp, confidence] = await contracts.aiOracle.getLatestData(dataType);
      return {
        dataType,
        dataValue,
        timestamp: timestamp.toNumber(),
        confidence: confidence.toNumber()
      };
    } catch (err) {
      console.error("Error getting latest data:", err);
      throw err;
    }
  };

  /**
   * Create a governance proposal
   * @param {string} description - Description of the proposal
   * @param {string} executionData - The calldata to execute if the proposal passes
   * @param {string} target - The address to call with the executionData
   * @returns {Promise<Object>} Transaction receipt
   */
  const createProposal = async (description, executionData, target) => {
    if (!contracts.governance || !signer) {
      throw new Error("Contract or signer not available");
    }
    
    try {
      const tx = await contracts.governance.propose(description, executionData, target);
      const receipt = await tx.wait();
      return receipt;
    } catch (err) {
      console.error("Error creating proposal:", err);
      throw err;
    }
  };

  /**
   * Vote on a governance proposal
   * @param {number} proposalId - ID of the proposal to vote on
   * @param {boolean} support - True for support, false against
   * @returns {Promise<Object>} Transaction receipt
   */
  const castVoteOnProposal = async (proposalId, support) => {
    if (!contracts.governance || !signer) {
      throw new Error("Contract or signer not available");
    }
    
    try {
      const tx = await contracts.governance.castVote(proposalId, support);
      const receipt = await tx.wait();
      return receipt;
    } catch (err) {
      console.error("Error casting vote on proposal:", err);
      throw err;
    }
  };

  /**
   * Get proposal details
   * @param {number} proposalId - ID of the proposal
   * @returns {Promise<Object>} Proposal details
   */
  const getProposalDetails = async (proposalId) => {
    if (!contracts.governance) {
      throw new Error("Contract not available");
    }
    
    try {
      const proposal = await contracts.governance.getProposal(proposalId);
      return {
        id: proposal.id.toNumber(),
        proposer: proposal.proposer,
        description: proposal.description,
        startBlock: proposal.startBlock.toNumber(),
        endBlock: proposal.endBlock.toNumber(),
        executed: proposal.executed,
        votesFor: proposal.votesFor.toNumber(),
        votesAgainst: proposal.votesAgainst.toNumber()
      };
    } catch (err) {
      console.error("Error getting proposal details:", err);
      throw err;
    }
  };

  /**
   * Stake tokens in the staking contract
   * @param {string} amount - Amount of tokens to stake (in wei)
   * @returns {Promise<Object>} Transaction receipt
   */
  const stakeTokens = async (amount) => {
    if (!contracts.rewardToken || !contracts.staking || !signer) {
      throw new Error("Contracts or signer not available");
    }
    
    try {
      // First approve the staking contract to spend tokens
      const approveTx = await contracts.rewardToken.approve(contracts.staking.address, amount);
      await approveTx.wait();
      
      // Then stake the tokens
      const stakeTx = await contracts.staking.stake(amount);
      const receipt = await stakeTx.wait();
      return receipt;
    } catch (err) {
      console.error("Error staking tokens:", err);
      throw err;
    }
  };

  /**
   * Unstake tokens from the staking contract
   * @param {string} amount - Amount of tokens to unstake (in wei)
   * @returns {Promise<Object>} Transaction receipt
   */
  const unstakeTokens = async (amount) => {
    if (!contracts.staking || !signer) {
      throw new Error("Contract or signer not available");
    }
    
    try {
      const tx = await contracts.staking.unstake(amount);
      const receipt = await tx.wait();
      return receipt;
    } catch (err) {
      console.error("Error unstaking tokens:", err);
      throw err;
    }
  };

  /**
   * Claim staking rewards
   * @returns {Promise<Object>} Transaction receipt
   */
  const claimRewards = async () => {
    if (!contracts.staking || !signer) {
      throw new Error("Contract or signer not available");
    }
    
    try {
      const tx = await contracts.staking.claimRewards();
      const receipt = await tx.wait();
      return receipt;
    } catch (err) {
      console.error("Error claiming rewards:", err);
      throw err;
    }
  };

  /**
   * Get staking info for a user
   * @param {string} address - User address (defaults to connected wallet)
   * @returns {Promise<Object>} Staking info
   */
  const getStakeInfo = async (address) => {
    if (!contracts.staking) {
      throw new Error("Contract not available");
    }
    
    const userAddress = address || (signer ? await signer.getAddress() : null);
    if (!userAddress) {
      throw new Error("No address provided");
    }
    
    try {
      const stakeInfo = await contracts.staking.getStakeInfo(userAddress);
      return {
        amount: stakeInfo[0],
        startTime: stakeInfo[1].toNumber(),
        lastRewardCalculation: stakeInfo[2].toNumber(),
        pendingRewards: stakeInfo[3]
      };
    } catch (err) {
      console.error("Error getting stake info:", err);
      throw err;
    }
  };

  return {
    contracts,
    isLoading,
    error,
    submitOracleData,
    castVoteOnSubmission,
    getSubmissionDetails,
    getLatestData,
    createProposal,
    castVoteOnProposal,
    getProposalDetails,
    stakeTokens,
    unstakeTokens,
    claimRewards,
    getStakeInfo
  };
} 