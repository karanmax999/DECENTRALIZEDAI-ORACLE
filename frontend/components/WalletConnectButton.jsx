import React from 'react';

/**
 * WalletConnectButton - A reusable button for wallet connection
 */
const WalletConnectButton = ({ 
  account, 
  isConnected, 
  isConnecting = false,
  connect, 
  disconnect, 
  className = '',
  showAddress = true
}) => {
  // Format the account address for display
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className={className}>
      {isConnected ? (
        <div className="flex items-center">
          {showAddress && (
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-lg mr-3">
              {formatAddress(account)}
            </span>
          )}
          <button
            onClick={disconnect}
            className="btn btn-outline text-red-600 hover:bg-red-50"
            type="button"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button
          onClick={connect}
          disabled={isConnecting}
          className="btn btn-primary"
          type="button"
        >
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </button>
      )}
    </div>
  );
};

export default WalletConnectButton; 