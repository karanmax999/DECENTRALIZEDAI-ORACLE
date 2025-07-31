import React from 'react';

/**
 * Component to display oracle data
 */
const OracleDataCard = ({ submission }) => {
  const parseData = () => {
    try {
      return JSON.parse(submission.dataValue);
    } catch (error) {
      console.error("Failed to parse data:", error);
      return { error: "Invalid data format" };
    }
  };

  const data = parseData();
  
  // Format timestamp to readable date
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  // Special rendering for asset price data
  const renderAssetPrices = (data) => {
    return (
      <div>
        <h3 className="text-lg font-semibold mb-2">Asset Prices</h3>
        <div className="space-y-3">
          {Object.entries(data.predictions).map(([asset, info]) => (
            <div key={asset} className="flex justify-between items-center border-b pb-2">
              <span className="font-medium">{asset}</span>
              <div className="text-right">
                <div className="font-bold">${info.price.toLocaleString()}</div>
                <div className={`text-sm ${info.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {info.change >= 0 ? '+' : ''}{info.change}%
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-xs text-gray-500 mt-3">
          Last updated: {formatDate(data.timestamp)}
        </div>
      </div>
    );
  };

  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded text-sm font-medium">
            {submission.dataType}
          </span>
          <div className="text-sm text-gray-500 mt-1">
            ID: {submission.id}
          </div>
        </div>
        <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
          Confidence: {submission.confidence}%
        </div>
      </div>

      <div className="border-t border-b border-gray-100 py-3 my-3">
        {submission.dataType === 'ASSET_PRICES' && data.predictions ? (
          renderAssetPrices(data)
        ) : (
          <pre className="text-xs overflow-auto max-h-40 bg-gray-50 p-2 rounded">
            {JSON.stringify(data, null, 2)}
          </pre>
        )}
      </div>

      <div className="flex justify-between text-xs text-gray-500">
        <div>Submitted by: {submission.submitter}</div>
        <div>
          {submission.verified ? (
            <span className="text-green-600">✓ Verified</span>
          ) : (
            <span className="text-orange-500">⟳ Pending verification</span>
          )}
        </div>
      </div>

      <div className="mt-3 text-right text-xs text-gray-500">
        Votes: {submission.votesFor} for / {submission.votesAgainst} against
      </div>
    </div>
  );
};

export default OracleDataCard; 