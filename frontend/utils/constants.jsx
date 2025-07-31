/**
 * Contract addresses for the decentralized AI oracle system
 * These are loaded from environment variables
 */
export const CONTRACT_ADDRESSES = {
  AIOracle: process.env.NEXT_PUBLIC_AI_ORACLE_ADDRESS || "0x0000000000000000000000000000000000000000",
  Governance: process.env.NEXT_PUBLIC_GOVERNANCE_ADDRESS || "0x0000000000000000000000000000000000000000",
  RewardToken: process.env.NEXT_PUBLIC_REWARD_TOKEN_ADDRESS || "0x0000000000000000000000000000000000000000",
  Staking: process.env.NEXT_PUBLIC_STAKING_ADDRESS || "0x0000000000000000000000000000000000000000"
};

/**
 * Core blockchain RPC URL
 */
export const CORE_RPC_URL = process.env.NEXT_PUBLIC_CORE_RPC_URL || "https://rpc.coredao.org";

/**
 * Core blockchain chain ID
 */
export const CORE_CHAIN_ID = 1116;

/**
 * Core blockchain explorer URL
 */
export const CORE_EXPLORER_URL = "https://scan.coredao.org";

/**
 * ABI for the AIOracle contract
 */
export const AIOracle_ABI = [
  "function submitData(string dataType, string dataValue, uint256 confidence) external returns (uint256)",
  "function castVote(uint256 submissionId, bool support) external",
  "function getLatestData(string dataType) external view returns (string, uint256, uint256)",
  "function getSubmission(uint256 submissionId) external view returns (tuple(address submitter, string dataType, string dataValue, uint256 timestamp, uint256 confidence, bool verified, uint256 votesFor, uint256 votesAgainst))",
  "event DataSubmitted(uint256 indexed submissionId, address indexed submitter, string dataType, uint256 timestamp)",
  "event VoteCast(uint256 indexed submissionId, address indexed voter, bool support)",
  "event DataVerified(uint256 indexed submissionId, bool verified)"
];

/**
 * ABI for the Governance contract
 */
export const Governance_ABI = [
  "function propose(string description, bytes executionData, address target) external returns (uint256)",
  "function castVote(uint256 proposalId, bool support) external",
  "function executeProposal(uint256 proposalId) external",
  "function getProposal(uint256 proposalId) external view returns (tuple(uint256 id, address proposer, string description, uint256 startBlock, uint256 endBlock, bool executed, uint256 votesFor, uint256 votesAgainst))",
  "function getVotingPower(address account) external view returns (uint256)",
  "event ProposalCreated(uint256 indexed proposalId, address indexed proposer, string description)",
  "event VoteCast(uint256 indexed proposalId, address indexed voter, bool support, uint256 weight)",
  "event ProposalExecuted(uint256 indexed proposalId)"
];

/**
 * ABI for the RewardToken contract
 */
export const RewardToken_ABI = [
  "function balanceOf(address account) external view returns (uint256)",
  "function transfer(address to, uint256 amount) external returns (bool)",
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function mint(address to, uint256 amount) external",
  "function calculateReward(address user, uint256 participationScore) external pure returns (uint256)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)"
];

/**
 * ABI for the Staking contract
 */
export const Staking_ABI = [
  "function stake(uint256 amount) external",
  "function unstake(uint256 amount) external",
  "function claimRewards() external",
  "function getStakeInfo(address user) external view returns (tuple(uint256 amount, uint256 startTime, uint256 lastRewardCalculation, uint256 pendingRewards))",
  "function getVotingPower(address user) external view returns (uint256)",
  "function calculatePendingRewards(address user) external view returns (uint256)",
  "event Staked(address indexed user, uint256 amount)",
  "event Unstaked(address indexed user, uint256 amount)",
  "event RewardsClaimed(address indexed user, uint256 amount)"
];

/**
 * Data types supported by the oracle
 */
export const DATA_TYPES = {
  ASSET_PRICES: "ASSET_PRICES",
  MARKET_METRICS: "MARKET_METRICS",
  WEATHER_DATA: "WEATHER_DATA",
  CUSTOM: "CUSTOM"
};

/**
 * Assets supported for price data
 */
export const SUPPORTED_ASSETS = [
  { symbol: "BTC", name: "Bitcoin" },
  { symbol: "ETH", name: "Ethereum" },
  { symbol: "CORE", name: "Core" },
  { symbol: "BNB", name: "Binance Coin" },
  { symbol: "SOL", name: "Solana" },
  { symbol: "ADA", name: "Cardano" },
  { symbol: "XRP", name: "Ripple" },
  { symbol: "DOT", name: "Polkadot" },
  { symbol: "AVAX", name: "Avalanche" },
  { symbol: "MATIC", name: "Polygon" }
];

/**
 * Oracle data simulation parameters
 */
export const SIMULATION_CONFIG = {
  updateInterval: 60000, // 1 minute
  priceVolatility: {
    BTC: 0.03,
    ETH: 0.045,
    CORE: 0.05,
    BNB: 0.035,
    SOL: 0.06,
    ADA: 0.04,
    XRP: 0.05,
    DOT: 0.055,
    AVAX: 0.065,
    MATIC: 0.07
  },
  confidenceRange: {
    min: 50,
    max: 95
  }
}; 