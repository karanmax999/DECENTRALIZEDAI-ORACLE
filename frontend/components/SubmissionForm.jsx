import React, { useState } from 'react';

/**
 * Component for submitting new oracle data
 */
const SubmissionForm = ({ isConnected }) => {
  const [formData, setFormData] = useState({
    dataType: 'ASSET_PRICES',
    dataValue: '',
    confidence: 80
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'confidence' ? parseInt(value, 10) : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isConnected) {
      setError('Please connect your wallet first');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // Generate example data for the form
      let formattedData;
      
      if (formData.dataType === 'ASSET_PRICES') {
        formattedData = {
          type: 'ASSET_PRICES',
          timestamp: Date.now(),
          predictions: {
            BTC: { price: 50243.12, change: 1.2, currency: 'USD' },
            ETH: { price: 2985.43, change: -0.5, currency: 'USD' },
            CORE: { price: 10.25, change: 3.4, currency: 'USD' }
          }
        };
      } else {
        // Handle custom data
        try {
          formattedData = JSON.parse(formData.dataValue);
        } catch (err) {
          setError('Invalid JSON format');
          setLoading(false);
          return;
        }
      }
      
      // In a real app, we'd submit to the blockchain here
      console.log('Would submit to blockchain:', {
        dataType: formData.dataType,
        dataValue: JSON.stringify(formattedData),
        confidence: formData.confidence
      });
      
      // For hackathon purposes, just simulate a successful submission
      setTimeout(() => {
        setSuccess(true);
        setLoading(false);
        
        // Reset form after a while
        setTimeout(() => {
          setSuccess(false);
          setFormData({
            dataType: 'ASSET_PRICES',
            dataValue: '',
            confidence: 80
          });
        }, 3000);
      }, 1500);
      
    } catch (err) {
      console.error('Error submitting data:', err);
      setError('Failed to submit data. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="card max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Submit Oracle Data</h2>
      
      {!isConnected && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
          Please connect your wallet to submit data to the oracle.
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">
          Data successfully submitted to the oracle!
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Data Type
          </label>
          <select
            name="dataType"
            value={formData.dataType}
            onChange={handleChange}
            className="input w-full"
            disabled={loading || !isConnected}
          >
            <option value="ASSET_PRICES">Asset Prices</option>
            <option value="MARKET_METRICS">Market Metrics</option>
            <option value="CUSTOM">Custom Data</option>
          </select>
        </div>
        
        {formData.dataType === 'CUSTOM' && (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Data Value (JSON format)
            </label>
            <textarea
              name="dataValue"
              value={formData.dataValue}
              onChange={handleChange}
              className="input w-full h-32 font-mono text-sm"
              placeholder='{"key": "value"}'
              disabled={loading || !isConnected}
            />
          </div>
        )}
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            AI Model Confidence: {formData.confidence}%
          </label>
          <input
            type="range"
            name="confidence"
            min="1"
            max="100"
            value={formData.confidence}
            onChange={handleChange}
            className="w-full"
            disabled={loading || !isConnected}
          />
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || !isConnected}
          >
            {loading ? 'Submitting...' : 'Submit to Oracle'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SubmissionForm; 