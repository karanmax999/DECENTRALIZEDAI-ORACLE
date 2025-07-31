// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./interfaces/IGovernance.sol";

/**
 * @title Governance
 * @dev Implementation of the DAO governance system that manages the AI Oracle
 */
contract Governance is IGovernance {
    // Token used for governance voting power
    address public governanceToken;
    
    // Counter for proposal IDs
    uint256 private _proposalCounter;
    
    // Duration of voting in blocks
    uint256 public votingPeriod;
    
    // Percentage of votes needed for proposal success (out of 100)
    uint256 public proposalThreshold;
    
    // Mapping of proposalId to proposal data
    mapping(uint256 => Proposal) private _proposals;
    
    // Mapping to track if an address has voted on a proposal
    mapping(uint256 => mapping(address => bool)) private _hasVoted;
    
    /**
     * @dev Constructor to initialize the contract
     * @param _governanceToken Address of the governance token contract
     * @param _votingPeriod Number of blocks voting period lasts
     * @param _proposalThreshold Percentage threshold for proposal success
     */
    constructor(address _governanceToken, uint256 _votingPeriod, uint256 _proposalThreshold) {
        require(_governanceToken != address(0), "Governance: token cannot be zero address");
        require(_proposalThreshold <= 100, "Governance: threshold must be between 0-100");
        
        governanceToken = _governanceToken;
        votingPeriod = _votingPeriod;
        proposalThreshold = _proposalThreshold;
    }
    
    /**
     * @dev Creates a new governance proposal
     * @param description Description of the proposal
     * @param executionData The calldata to execute if the proposal passes
     * @param target The address to call with the executionData
     * @return proposalId The ID of the created proposal
     */
    function propose(string calldata description, bytes calldata executionData, address target) 
        external 
        override 
        returns (uint256 proposalId) 
    {
        require(target != address(0), "Governance: target cannot be zero address");
        require(bytes(description).length > 0, "Governance: description cannot be empty");
        
        uint256 startBlock = block.number;
        uint256 endBlock = startBlock + votingPeriod;
        
        // Create new proposal ID
        proposalId = _proposalCounter++;
        
        // Store proposal
        _proposals[proposalId] = Proposal({
            id: proposalId,
            proposer: msg.sender,
            description: description,
            startBlock: startBlock,
            endBlock: endBlock,
            executed: false,
            votesFor: 0,
            votesAgainst: 0
        });
        
        // NOTE: In a real implementation, we would store executionData and target
        // We're omitting that here for simplicity, as it would require more complex code
        
        emit ProposalCreated(proposalId, msg.sender, description);
        
        return proposalId;
    }
    
    /**
     * @dev Casts a vote on a proposal
     * @param proposalId The ID of the proposal to vote on
     * @param support True for voting in favor, false for voting against
     */
    function castVote(uint256 proposalId, bool support) external override {
        Proposal storage proposal = _proposals[proposalId];
        
        require(proposal.proposer != address(0), "Governance: proposal does not exist");
        require(block.number >= proposal.startBlock, "Governance: voting not started");
        require(block.number <= proposal.endBlock, "Governance: voting ended");
        require(!proposal.executed, "Governance: proposal already executed");
        require(!_hasVoted[proposalId][msg.sender], "Governance: already voted");
        
        // Mark that this address has voted
        _hasVoted[proposalId][msg.sender] = true;
        
        // Get voting power - in a real implementation, this would query the token contract
        uint256 votingPower = getVotingPower(msg.sender);
        require(votingPower > 0, "Governance: no voting power");
        
        // Update vote counts
        if (support) {
            proposal.votesFor += votingPower;
        } else {
            proposal.votesAgainst += votingPower;
        }
        
        emit VoteCast(proposalId, msg.sender, support, votingPower);
    }
    
    /**
     * @dev Executes a successful proposal
     * @param proposalId The ID of the proposal to execute
     */
    function executeProposal(uint256 proposalId) external override {
        Proposal storage proposal = _proposals[proposalId];
        
        require(proposal.proposer != address(0), "Governance: proposal does not exist");
        require(block.number > proposal.endBlock, "Governance: voting not ended");
        require(!proposal.executed, "Governance: proposal already executed");
        
        // Check if proposal succeeded
        uint256 totalVotes = proposal.votesFor + proposal.votesAgainst;
        require(totalVotes > 0, "Governance: no votes cast");
        
        uint256 forPercentage = (proposal.votesFor * 100) / totalVotes;
        require(forPercentage >= proposalThreshold, "Governance: proposal did not pass");
        
        // Mark proposal as executed
        proposal.executed = true;
        
        // NOTE: In a real implementation, we would execute the stored calldata on the target
        // We're omitting that here for simplicity
        
        emit ProposalExecuted(proposalId);
    }
    
    /**
     * @dev Gets the detailed information about a specific proposal
     * @param proposalId The ID of the proposal
     * @return Complete proposal data
     */
    function getProposal(uint256 proposalId) external view override returns (Proposal memory) {
        return _proposals[proposalId];
    }
    
    /**
     * @dev Gets the voting power of an address
     * @param account The address to check
     * @return The voting power as a uint256
     */
    function getVotingPower(address account) public view override returns (uint256) {
        // NOTE: In a real implementation, this would query the governance token contract
        // For hackathon purposes, just returning a placeholder value of 1
        // This would be replaced with actual token balance or staking amount
        return 1;
    }
    
    /**
     * @dev Updates the governance token address
     * @param _governanceToken New token address
     */
    function updateGovernanceToken(address _governanceToken) external {
        // NOTE: In a real implementation, this would be restricted to admin or governance
        require(_governanceToken != address(0), "Governance: token cannot be zero address");
        governanceToken = _governanceToken;
    }
    
    /**
     * @dev Updates the voting period
     * @param _votingPeriod New voting period in blocks
     */
    function updateVotingPeriod(uint256 _votingPeriod) external {
        // NOTE: In a real implementation, this would be restricted to admin or governance
        votingPeriod = _votingPeriod;
    }
    
    /**
     * @dev Updates the proposal threshold percentage
     * @param _proposalThreshold New threshold (0-100)
     */
    function updateProposalThreshold(uint256 _proposalThreshold) external {
        // NOTE: In a real implementation, this would be restricted to admin or governance
        require(_proposalThreshold <= 100, "Governance: threshold must be between 0-100");
        proposalThreshold = _proposalThreshold;
    }
} 