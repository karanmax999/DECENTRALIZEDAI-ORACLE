import React, { useState } from 'react';

/**
 * VoteCard - A reusable component for voting on oracle submissions
 */
const VoteCard = ({ 
  submission, 
  isConnected,
  onVote,
  className = '' 
}) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [voteChoice, setVoteChoice] = useState(null);

  // Parse submission data
  const parseData = () => {
    try {
      return typeof submission.dataValue === 'string' 
        ? JSON.parse(submission.dataValue) 
        : submission.dataValue;
    } catch (error) {
      console.error("Failed to parse data:", error);
      return { error: "Invalid data format" };
    }
  };

  const data = parseData();

  // Handle vote
  const handleVote = async (support) => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      setLoading(true);
      
      // Call the onVote callback if provided
      if (onVote) {
        await onVote(submission.id, support);
      }
      
      // Update local state
      setHasVoted(true);
      setVoteChoice(support);
      setResult({ 
        success: true, 
        message: `Successfully voted ${support ? 'for' : 'against'} this submission!`
      });
    } catch (error) {
      console.error('Error casting vote:', error);
      setResult({ 
        success: false, 
        message: 'Failed to cast vote. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`card ${className}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded text-sm font-medium">
            {submission.dataType}
          </span>
          <div className="text-sm text-gray-500 mt-1">
            ID: {submission.id}
          </div>
        </div>
        <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">
          Confidence: {submission.confidence}%
        </div>
      </div>
      
      <div className="text-sm mb-4">
        <div className="font-semibold">Submitted by:</div>
        <div className="font-mono">{submission.submitter}</div>
      </div>
      
      <div className="border-t border-b border-gray-100 py-3 my-3">
        <pre className="text-xs overflow-auto max-h-40 bg-gray-50 p-2 rounded">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
      
      <div className="text-sm mb-4">
        <div className="font-semibold">Current Votes:</div>
        <div className="flex space-x-4 mt-1">
          <div className="text-green-600">
            For: {submission.votesFor}
          </div>
          <div className="text-red-600">
            Against: {submission.votesAgainst}
          </div>
        </div>
      </div>
      
      {result && (
        <div className={`text-sm p-2 mb-4 rounded ${result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {result.message}
        </div>
      )}
      
      <div className="flex justify-end space-x-3">
        <button
          onClick={() => handleVote(false)}
          disabled={hasVoted || loading || !isConnected}
          className={`btn ${hasVoted && voteChoice === false ? 'bg-red-100 text-red-800 border-red-300' : 'btn-outline text-red-600'}`}
        >
          {loading ? '...' : 'Vote Against'}
        </button>
        
        <button
          onClick={() => handleVote(true)}
          disabled={hasVoted || loading || !isConnected}
          className={`btn ${hasVoted && voteChoice === true ? 'bg-green-100 text-green-800 border-green-300' : 'btn-outline text-green-600'}`}
        >
          {loading ? '...' : 'Vote For'}
        </button>
      </div>
    </div>
  );
};

export default VoteCard; 