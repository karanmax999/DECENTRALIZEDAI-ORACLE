// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/**
 * @title IAIOracle
 * @dev Interface for the AI Oracle that provides data to DeFi applications
 */
interface IAIOracle {
    /**
     * @dev Struct to hold AI-generated data submission
     */
    struct DataSubmission {
        address submitter;
        string dataType;
        string dataValue;
        uint256 timestamp;
        uint256 confidence;
        bool verified;
        uint256 votesFor;
        uint256 votesAgainst;
    }
    
    /**
     * @dev Event emitted when new data is submitted
     */
    event DataSubmitted(uint256 indexed submissionId, address indexed submitter, string dataType, uint256 timestamp);
    
    /**
     * @dev Event emitted when a vote is cast on data
     */
    event VoteCast(uint256 indexed submissionId, address indexed voter, bool support);
    
    /**
     * @dev Event emitted when data is verified
     */
    event DataVerified(uint256 indexed submissionId, bool verified);
    
    /**
     * @dev Submits new data to the oracle
     * @param dataType Type of data being submitted (e.g., "ETH_PRICE", "BTC_VOLATILITY")
     * @param dataValue The actual data value, typically JSON formatted
     * @param confidence Confidence score of the AI model (0-100)
     * @return submissionId The ID of the created submission
     */
    function submitData(string calldata dataType, string calldata dataValue, uint256 confidence) external returns (uint256 submissionId);
    
    /**
     * @dev Casts a vote on submitted data
     * @param submissionId The ID of the submission to vote on
     * @param support True for voting in favor, false for voting against
     */
    function castVote(uint256 submissionId, bool support) external;
    
    /**
     * @dev Retrieves the latest verified data for a specific data type
     * @param dataType The type of data to retrieve
     * @return dataValue The data value
     * @return timestamp When the data was submitted
     * @return confidence The confidence score
     */
    function getLatestData(string calldata dataType) external view returns (string memory dataValue, uint256 timestamp, uint256 confidence);
    
    /**
     * @dev Gets detailed information about a specific submission
     * @param submissionId The ID of the submission
     * @return Complete submission data
     */
    function getSubmission(uint256 submissionId) external view returns (DataSubmission memory);
} 