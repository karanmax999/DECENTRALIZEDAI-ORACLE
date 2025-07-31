// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "../RewardToken.sol";

/**
 * @title Staking
 * @dev Contract for staking reward tokens and participating in governance
 */
contract Staking is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // Token being staked
    RewardToken public rewardToken;
    
    // Governance contract address
    address public governanceContract;
    
    // Minimum staking period (in seconds)
    uint256 public minimumStakingPeriod;
    
    // Annual percentage yield (APY) in basis points (1% = 100)
    uint256 public apy;
    
    // Staking information for each user
    struct StakeInfo {
        uint256 amount;
        uint256 startTime;
        uint256 lastRewardCalculation;
        uint256 pendingRewards;
    }
    
    // Mapping of user address to staking info
    mapping(address => StakeInfo) public stakes;
    
    // Total staked amount
    uint256 public totalStaked;
    
    // Events
    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    event RewardsClaimed(address indexed user, uint256 amount);
    event APYUpdated(uint256 oldApy, uint256 newApy);
    event MinimumStakingPeriodUpdated(uint256 oldPeriod, uint256 newPeriod);
    event GovernanceContractUpdated(address oldContract, address newContract);
    
    /**
     * @dev Constructor to initialize the staking contract
     * @param _rewardToken Address of the reward token
     * @param _governanceContract Address of the governance contract
     * @param _minimumStakingPeriod Minimum staking period in seconds
     * @param _apy Annual percentage yield in basis points
     */
    constructor(
        address _rewardToken,
        address _governanceContract,
        uint256 _minimumStakingPeriod,
        uint256 _apy
    ) {
        require(_rewardToken != address(0), "Reward token cannot be zero address");
        rewardToken = RewardToken(_rewardToken);
        governanceContract = _governanceContract;
        minimumStakingPeriod = _minimumStakingPeriod;
        apy = _apy;
    }
    
    /**
     * @dev Stake tokens
     * @param amount Amount of tokens to stake
     */
    function stake(uint256 amount) external nonReentrant {
        require(amount > 0, "Cannot stake 0 tokens");
        
        // Calculate pending rewards if user already has a stake
        if (stakes[msg.sender].amount > 0) {
            _calculateRewards(msg.sender);
        } else {
            // Initialize stake
            stakes[msg.sender].startTime = block.timestamp;
            stakes[msg.sender].lastRewardCalculation = block.timestamp;
        }
        
        // Transfer tokens from user to this contract
        rewardToken.transferFrom(msg.sender, address(this), amount);
        
        // Update stake amount
        stakes[msg.sender].amount += amount;
        totalStaked += amount;
        
        emit Staked(msg.sender, amount);
    }
    
    /**
     * @dev Unstake tokens
     * @param amount Amount of tokens to unstake
     */
    function unstake(uint256 amount) external nonReentrant {
        StakeInfo storage userStake = stakes[msg.sender];
        
        require(userStake.amount >= amount, "Insufficient staked amount");
        require(
            block.timestamp >= userStake.startTime + minimumStakingPeriod,
            "Minimum staking period not met"
        );
        
        // Calculate pending rewards
        _calculateRewards(msg.sender);
        
        // Update stake amount
        userStake.amount -= amount;
        totalStaked -= amount;
        
        // Transfer tokens back to user
        rewardToken.transfer(msg.sender, amount);
        
        emit Unstaked(msg.sender, amount);
    }
    
    /**
     * @dev Claim pending rewards
     */
    function claimRewards() external nonReentrant {
        // Calculate pending rewards
        _calculateRewards(msg.sender);
        
        uint256 rewards = stakes[msg.sender].pendingRewards;
        require(rewards > 0, "No rewards to claim");
        
        // Reset pending rewards
        stakes[msg.sender].pendingRewards = 0;
        
        // Mint rewards to user
        rewardToken.mint(msg.sender, rewards);
        
        emit RewardsClaimed(msg.sender, rewards);
    }
    
    /**
     * @dev Get staking info for a user
     * @param user Address of the user
     * @return Staking information
     */
    function getStakeInfo(address user) external view returns (StakeInfo memory) {
        return stakes[user];
    }
    
    /**
     * @dev Get current voting power for a user
     * @param user Address of the user
     * @return Voting power (proportional to stake amount)
     */
    function getVotingPower(address user) external view returns (uint256) {
        return stakes[user].amount;
    }
    
    /**
     * @dev Calculate pending rewards for a user
     * @param user Address of the user
     * @return Pending rewards
     */
    function calculatePendingRewards(address user) external view returns (uint256) {
        if (stakes[user].amount == 0) {
            return stakes[user].pendingRewards;
        }
        
        uint256 timeElapsed = block.timestamp - stakes[user].lastRewardCalculation;
        uint256 newRewards = (stakes[user].amount * apy * timeElapsed) / (365 days * 10000);
        
        return stakes[user].pendingRewards + newRewards;
    }
    
    /**
     * @dev Internal function to calculate and update rewards
     * @param user Address of the user
     */
    function _calculateRewards(address user) internal {
        if (stakes[user].amount == 0) {
            return;
        }
        
        uint256 timeElapsed = block.timestamp - stakes[user].lastRewardCalculation;
        if (timeElapsed > 0) {
            uint256 newRewards = (stakes[user].amount * apy * timeElapsed) / (365 days * 10000);
            stakes[user].pendingRewards += newRewards;
            stakes[user].lastRewardCalculation = block.timestamp;
        }
    }
    
    /**
     * @dev Update the APY
     * @param _apy New APY in basis points
     */
    function updateAPY(uint256 _apy) external onlyOwner {
        emit APYUpdated(apy, _apy);
        apy = _apy;
    }
    
    /**
     * @dev Update the minimum staking period
     * @param _minimumStakingPeriod New minimum staking period in seconds
     */
    function updateMinimumStakingPeriod(uint256 _minimumStakingPeriod) external onlyOwner {
        emit MinimumStakingPeriodUpdated(minimumStakingPeriod, _minimumStakingPeriod);
        minimumStakingPeriod = _minimumStakingPeriod;
    }
    
    /**
     * @dev Update the governance contract address
     * @param _governanceContract New governance contract address
     */
    function updateGovernanceContract(address _governanceContract) external onlyOwner {
        require(_governanceContract != address(0), "Governance contract cannot be zero address");
        emit GovernanceContractUpdated(governanceContract, _governanceContract);
        governanceContract = _governanceContract;
    }
} 