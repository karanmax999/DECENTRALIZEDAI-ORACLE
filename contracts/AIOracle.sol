// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./interfaces/IAIOracle.sol";

/**
 * @title AIOracle
 * @dev Implementation of the AI Oracle that provides data to DeFi applications
 */
contract AIOracle is IAIOracle {
    // Governance contract address that can control parameters
    address public governance;
    
    // Counter for submission IDs
    uint256 private _submissionCounter;
    
    // Threshold for minimum votes required to verify data
    uint256 public minVotesRequired;
    
    // Percentage of votes needed for verification (out of 100)
    uint256 public verificationThreshold;
    
    // Mapping of submissionId to submission data
    mapping(uint256 => DataSubmission) private _submissions;
    
    // Mapping of dataType to latest verified submissionId
    mapping(string => uint256) private _latestVerifiedSubmissions;
    
    // Mapping to track if an address has voted on a submission
    mapping(uint256 => mapping(address => bool)) private _hasVoted;
    
    // Modifier to restrict certain functions to governance only
    modifier onlyGovernance() {
        require(msg.sender == governance, "AIOracle: caller is not governance");
        _;
    }
    
    /**
     * @dev Constructor to initialize the contract
     * @param _governance Address of the governance contract
     * @param _minVotesRequired Minimum votes needed for verification
     * @param _verificationThreshold Percentage threshold for verification
     */
    constructor(address _governance, uint256 _minVotesRequired, uint256 _verificationThreshold) {
        require(_governance != address(0), "AIOracle: governance cannot be zero address");
        governance = _governance;
        minVotesRequired = _minVotesRequired;
        verificationThreshold = _verificationThreshold;
    }
    
    /**
     * @dev Submits new data to the oracle
     * @param dataType Type of data being submitted (e.g., "ETH_PRICE", "BTC_VOLATILITY")
     * @param dataValue The actual data value, typically JSON formatted
     * @param confidence Confidence score of the AI model (0-100)
     * @return submissionId The ID of the created submission
     */
    function submitData(string calldata dataType, string calldata dataValue, uint256 confidence) 
        external 
        override 
        returns (uint256 submissionId) 
    {
        require(confidence <= 100, "AIOracle: confidence must be between 0-100");
        
        // Create new submission ID
        submissionId = _submissionCounter++;
        
        // Create and store the submission
        _submissions[submissionId] = DataSubmission({
            submitter: msg.sender,
            dataType: dataType,
            dataValue: dataValue,
            timestamp: block.timestamp,
            confidence: confidence,
            verified: false,
            votesFor: 0,
            votesAgainst: 0
        });
        
        emit DataSubmitted(submissionId, msg.sender, dataType, block.timestamp);
        
        return submissionId;
    }
    
    /**
     * @dev Casts a vote on submitted data
     * @param submissionId The ID of the submission to vote on
     * @param support True for voting in favor, false for voting against
     */
    function castVote(uint256 submissionId, bool support) external override {
        DataSubmission storage submission = _submissions[submissionId];
        
        require(submission.submitter != address(0), "AIOracle: submission does not exist");
        require(!submission.verified, "AIOracle: submission already verified");
        require(!_hasVoted[submissionId][msg.sender], "AIOracle: already voted");
        
        // Mark that this address has voted
        _hasVoted[submissionId][msg.sender] = true;
        
        // Update vote counts
        if (support) {
            submission.votesFor += 1;
        } else {
            submission.votesAgainst += 1;
        }
        
        emit VoteCast(submissionId, msg.sender, support);
        
        // Check if we can verify the submission now
        _checkVerification(submissionId);
    }
    
    /**
     * @dev Internal function to check if a submission can be verified
     * @param submissionId The ID of the submission to check
     */
    function _checkVerification(uint256 submissionId) internal {
        DataSubmission storage submission = _submissions[submissionId];
        
        // Skip if already verified or not enough total votes
        if (submission.verified || (submission.votesFor + submission.votesAgainst) < minVotesRequired) {
            return;
        }
        
        // Calculate percentage of "for" votes
        uint256 totalVotes = submission.votesFor + submission.votesAgainst;
        uint256 forPercentage = (submission.votesFor * 100) / totalVotes;
        
        // Verify if percentage meets or exceeds threshold
        if (forPercentage >= verificationThreshold) {
            submission.verified = true;
            
            // Update latest verified submission for this data type
            _latestVerifiedSubmissions[submission.dataType] = submissionId;
            
            emit DataVerified(submissionId, true);
        }
    }
    
    /**
     * @dev Retrieves the latest verified data for a specific data type
     * @param dataType The type of data to retrieve
     * @return dataValue The data value
     * @return timestamp When the data was submitted
     * @return confidence The confidence score
     */
    function getLatestData(string calldata dataType) 
        external 
        view 
        override 
        returns (string memory dataValue, uint256 timestamp, uint256 confidence) 
    {
        uint256 submissionId = _latestVerifiedSubmissions[dataType];
        require(submissionId > 0, "AIOracle: no verified data for this type");
        
        DataSubmission storage submission = _submissions[submissionId];
        return (submission.dataValue, submission.timestamp, submission.confidence);
    }
    
    /**
     * @dev Gets detailed information about a specific submission
     * @param submissionId The ID of the submission
     * @return Complete submission data
     */
    function getSubmission(uint256 submissionId) 
        external 
        view 
        override 
        returns (DataSubmission memory) 
    {
        return _submissions[submissionId];
    }
    
    /**
     * @dev Updates the governance address
     * @param _governance New governance address
     */
    function updateGovernance(address _governance) external onlyGovernance {
        require(_governance != address(0), "AIOracle: governance cannot be zero address");
        governance = _governance;
    }
    
    /**
     * @dev Updates the minimum votes required
     * @param _minVotesRequired New minimum votes
     */
    function updateMinVotesRequired(uint256 _minVotesRequired) external onlyGovernance {
        minVotesRequired = _minVotesRequired;
    }
    
    /**
     * @dev Updates the verification threshold percentage
     * @param _verificationThreshold New threshold (0-100)
     */
    function updateVerificationThreshold(uint256 _verificationThreshold) external onlyGovernance {
        require(_verificationThreshold <= 100, "AIOracle: threshold must be between 0-100");
        verificationThreshold = _verificationThreshold;
    }
} 