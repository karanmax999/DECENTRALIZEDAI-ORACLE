// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/**
 * @title IGovernance
 * @dev Interface for the DAO governance system that manages the AI Oracle
 */
interface IGovernance {
    /**
     * @dev Struct for proposal information
     */
    struct Proposal {
        uint256 id;
        address proposer;
        string description;
        uint256 startBlock;
        uint256 endBlock;
        bool executed;
        uint256 votesFor;
        uint256 votesAgainst;
    }
    
    /**
     * @dev Event emitted when a new proposal is created
     */
    event ProposalCreated(uint256 indexed proposalId, address indexed proposer, string description);
    
    /**
     * @dev Event emitted when a vote is cast on a proposal
     */
    event VoteCast(uint256 indexed proposalId, address indexed voter, bool support, uint256 weight);
    
    /**
     * @dev Event emitted when a proposal is executed
     */
    event ProposalExecuted(uint256 indexed proposalId);
    
    /**
     * @dev Creates a new governance proposal
     * @param description Description of the proposal
     * @param executionData The calldata to execute if the proposal passes
     * @param target The address to call with the executionData
     * @return proposalId The ID of the created proposal
     */
    function propose(string calldata description, bytes calldata executionData, address target) external returns (uint256 proposalId);
    
    /**
     * @dev Casts a vote on a proposal
     * @param proposalId The ID of the proposal to vote on
     * @param support True for voting in favor, false for voting against
     */
    function castVote(uint256 proposalId, bool support) external;
    
    /**
     * @dev Executes a successful proposal
     * @param proposalId The ID of the proposal to execute
     */
    function executeProposal(uint256 proposalId) external;
    
    /**
     * @dev Gets the detailed information about a specific proposal
     * @param proposalId The ID of the proposal
     * @return Complete proposal data
     */
    function getProposal(uint256 proposalId) external view returns (Proposal memory);
    
    /**
     * @dev Gets the voting power of an address
     * @param account The address to check
     * @return The voting power as a uint256
     */
    function getVotingPower(address account) external view returns (uint256);
} 