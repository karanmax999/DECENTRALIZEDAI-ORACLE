import React from 'react';

/**
 * DataCard - A reusable component for displaying oracle data
 */
const DataCard = ({ title, data, timestamp, confidence, className = '' }) => {
  // Format timestamp to readable date
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown';
    return new Date(timestamp).toLocaleString();
  };

  // Format confidence score with color
  const getConfidenceColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className={`card hover:shadow-lg transition-shadow ${className}`}>
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className={`px-2 py-1 rounded text-sm font-medium ${getConfidenceColor(confidence)}`}>
          Confidence: {confidence}%
        </div>
      </div>

      <div className="border-t border-b border-gray-100 py-3 my-3">
        {typeof data === 'object' ? (
          <pre className="text-xs overflow-auto max-h-40 bg-gray-50 p-2 rounded">
            {JSON.stringify(data, null, 2)}
          </pre>
        ) : (
          <p className="text-gray-700">{data}</p>
        )}
      </div>

      <div className="text-xs text-gray-500 text-right">
        Last updated: {formatDate(timestamp)}
      </div>
    </div>
  );
};

export default DataCard; 