import React, { useState } from 'react';
import Link from 'next/link';
import WalletModal from './WalletModal';

/**
 * Header component with wallet connection button
 */
const Header = ({ account, connect, disconnect, isConnected, isLoading, error }) => {
  // Format the account address for display
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleConnectWallet = async (walletType) => {
    setIsModalOpen(false);
    try {
      // Pass the wallet type to the connect function if it supports it
      await connect(walletType);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      // Reopen modal if connection fails
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary-700">
              AI Oracle
            </Link>
            <nav className="ml-8 hidden md:block">
              <ul className="flex space-x-6">
                <li>
                  <Link href="/" className="text-gray-700 hover:text-primary-600">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="text-gray-700 hover:text-primary-600">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/vote" className="text-gray-700 hover:text-primary-600">
                    DAO
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          <div>
            {isConnected ? (
              <div className="flex items-center">
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-lg mr-3">
                  Connected: {formatAddress(account)}
                </span>
                <button
                  onClick={disconnect}
                  className="btn btn-outline text-red-600 hover:bg-red-50"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsModalOpen(true)}
                className="btn btn-primary"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </header>

      <WalletModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConnect={handleConnectWallet}
        isLoading={isLoading}
        error={error}
      />
    </>
  );
};

export default Header;
