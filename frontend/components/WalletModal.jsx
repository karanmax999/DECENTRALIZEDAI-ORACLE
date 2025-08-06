import React, { useEffect, useState } from 'react';

/**
 * Custom Wallet Modal component for better user experience
 */
const WalletModal = ({ isOpen, onClose, onConnect, isLoading, error }) => {
  const [selectedWallet, setSelectedWallet] = useState(null);

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle wallet selection
  const handleWalletSelect = (wallet) => {
    setSelectedWallet(wallet);
    onConnect(wallet);
  };

  // Wallet options
  const walletOptions = [
    { id: 'metamask', name: 'MetaMask', icon: '🦊' },
    { id: 'coinbase', name: 'Coinbase Wallet', icon: '🪙' },
    { id: 'walletconnect', name: 'WalletConnect', icon: '🔗' },
    { id: 'trust', name: 'Trust Wallet', icon: '🛡️' },
    { id: 'phantom', name: 'Phantom', icon: '👻' },
    { id: 'okxwallet', name: 'OKX Wallet', icon: '🚀' },
    { id: 'rainbow', name: 'Rainbow', icon: '🌈' },
    { id: 'argent', name: 'Argent', icon: '⚡' },
  ];

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div 
        className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Connect Wallet</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-3">
            {walletOptions.map((wallet) => (
              <button
                key={wallet.id}
                onClick={() => handleWalletSelect(wallet.id)}
                disabled={isLoading}
                className={`w-full flex items-center p-4 rounded-xl border transition-all ${
                  selectedWallet === wallet.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <span className="text-2xl mr-3">{wallet.icon}</span>
                <div className="flex-1 text-left">
                  <div className="font-medium text-gray-900">{wallet.name}</div>
                  <div className="text-sm text-gray-500">
                    {wallet.id === 'metamask' && 'Connect with browser extension'}
                    {wallet.id === 'coinbase' && 'Connect with Coinbase Wallet app'}
                    {wallet.id === 'walletconnect' && 'Connect with WalletConnect'}
                    {wallet.id === 'trust' && 'Connect with Trust Wallet app'}
                    {wallet.id === 'phantom' && 'Connect with Phantom app'}
                    {wallet.id === 'okxwallet' && 'Connect with OKX Wallet app'}
                    {wallet.id === 'rainbow' && 'Connect with Rainbow app'}
                    {wallet.id === 'argent' && 'Connect with Argent app'}
                  </div>
                </div>
                {selectedWallet === wallet.id && (
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>

          {/* Mobile instructions */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Mobile Users</h3>
            <p className="text-sm text-gray-600">
              If you don't see your wallet, you may need to install it from your app store. 
              For WalletConnect, scan the QR code that appears after selecting it.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalletModal;
