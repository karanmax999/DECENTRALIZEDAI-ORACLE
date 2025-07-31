import React, { useState } from 'react';

/**
 * Component for voting on oracle data submissions
 */
const VotingPanel = ({ submissions, isConnected }) => {
  const [votes, setVotes] = useState({});
  const [loading, setLoading] = useState({});
  const [results, setResults] = useState({});

  const handleVote = async (submissionId, support) => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      setLoading(prev => ({ ...prev, [submissionId]: true }));
      
      // In a real application, this would call the smart contract
      console.log(`Voting ${support ? 'for' : 'against'} submission ${submissionId}`);
      
      // Simulate blockchain confirmation delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state
      setVotes(prev => ({
        ...prev,
        [submissionId]: support
      }));
      
      setResults(prev => ({
        ...prev,
        [submissionId]: { 
          success: true, 
          message: `Successfully voted ${support ? 'for' : 'against'} this submission!`
        }
      }));
      
      setLoading(prev => ({ ...prev, [submissionId]: false }));
    } catch (error) {
      console.error('Error casting vote:', error);
      setResults(prev => ({
        ...prev,
        [submissionId]: { 
          success: false, 
          message: 'Failed to cast vote. Please try again.'
        }
      }));
      setLoading(prev => ({ ...prev, [submissionId]: false }));
    }
  };

  if (!submissions || submissions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No pending submissions found for voting.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Vote on Submissions</h2>
      
      {!isConnected && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
          Please connect your wallet to vote on submissions.
        </div>
      )}
      
      <div className="space-y-6">
        {submissions.map(submission => {
          const hasVoted = votes[submission.id] !== undefined;
          const voteResult = results[submission.id];
          
          return (
            <div key={submission.id} className="card">
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
                  Pending Verification
                </div>
              </div>
              
              <div className="text-sm mb-4">
                <div className="font-semibold">Submitted by:</div>
                <div className="font-mono">{submission.submitter}</div>
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
              
              {voteResult && (
                <div className={`text-sm p-2 mb-4 rounded ${voteResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {voteResult.message}
                </div>
              )}
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => handleVote(submission.id, false)}
                  disabled={hasVoted || loading[submission.id] || !isConnected}
                  className={`btn ${hasVoted && votes[submission.id] === false ? 'bg-red-100 text-red-800 border-red-300' : 'btn-outline text-red-600'}`}
                >
                  {loading[submission.id] ? '...' : 'Vote Against'}
                </button>
                
                <button
                  onClick={() => handleVote(submission.id, true)}
                  disabled={hasVoted || loading[submission.id] || !isConnected}
                  className={`btn ${hasVoted && votes[submission.id] === true ? 'bg-green-100 text-green-800 border-green-300' : 'btn-outline text-green-600'}`}
                >
                  {loading[submission.id] ? '...' : 'Vote For'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VotingPanel; 