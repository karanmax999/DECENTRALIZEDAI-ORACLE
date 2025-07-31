import React, { useContext, useState, useEffect } from 'react';
import { Web3Context } from './_app';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import OracleDataCard from '../components/OracleDataCard';

// Mock verified data for the hackathon
// In a real application, this would be fetched from the blockchain
const mockVerifiedData = [
  {
    id: 2,
    dataType: 'ASSET_PRICES',
    dataValue: JSON.stringify({
      type: 'ASSET_PRICES',
      timestamp: Date.now() - 240000,
      predictions: {
        BTC: { price: 49985.75, change: -0.3, currency: 'USD' },
        ETH: { price: 3001.22, change: 0.8, currency: 'USD' },
        CORE: { price: 9.95, change: -1.2, currency: 'USD' },
        BNB: { price: 398.45, change: 0.5, currency: 'USD' },
        SOL: { price: 102.78, change: 2.3, currency: 'USD' }
      }
    }),
    confidence: 78,
    submitter: '0xabcd...ef01',
    timestamp: Date.now() - 240000,
    verified: true,
    votesFor: 5,
    votesAgainst: 0
  },
  {
    id: 4,
    dataType: 'MARKET_METRICS',
    dataValue: JSON.stringify({
      type: 'MARKET_METRICS',
      timestamp: Date.now() - 300000,
      metrics: {
        totalMarketCap: 1.83e12,
        btcDominance: 42.3,
        ethDominance: 18.5,
        fear_greed_index: 62,
        totalVolume24h: 98.5e9
      }
    }),
    confidence: 82,
    submitter: '0x7890...abcd',
    timestamp: Date.now() - 300000,
    verified: true,
    votesFor: 4,
    votesAgainst: 1
  }
];

/**
 * Dashboard page - Display verified oracle data
 */
const DashboardPage = () => {
  const { account, connect, disconnect, isConnected } = useContext(Web3Context);
  const [verifiedData, setVerifiedData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Effect to load verified data
  useEffect(() => {
    // In a real application, this would fetch from the blockchain
    // For the hackathon, we're using mock data
    setLoading(true);
    
    // Simulate API loading delay
    setTimeout(() => {
      setVerifiedData(mockVerifiedData);
      setLoading(false);
    }, 800);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>Dashboard | Decentralized AI Oracle</title>
        <meta name="description" content="View verified oracle data from the decentralized AI oracle" />
      </Head>

      <Header 
        account={account} 
        connect={connect}
        disconnect={disconnect}
        isConnected={isConnected}
      />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary-800">
            Oracle Dashboard
          </h1>
          <p className="text-xl text-gray-600 mt-2">
            View the latest verified data from the decentralized AI oracle
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-pulse text-center">
              <div className="h-8 w-32 bg-gray-200 rounded mx-auto mb-4"></div>
              <p className="text-gray-500">Loading verified data...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-700">Verified Oracle Data</h2>
              <p className="text-gray-500">
                This data has been verified by the community through the DAO voting system
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {verifiedData.map(submission => (
                <OracleDataCard 
                  key={submission.id}
                  submission={submission}
                />
              ))}
            </div>
            
            {verifiedData.length === 0 && (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No verified data available yet.</p>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default DashboardPage; 