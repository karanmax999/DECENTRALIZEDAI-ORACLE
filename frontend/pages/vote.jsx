import React, { useContext, useState, useEffect } from 'react';
import { Web3Context } from './_app';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import VotingPanel from '../components/VotingPanel';

// Mock data for the hackathon
// In a real application, this would be fetched from the blockchain
const mockSubmissions = [
  {
    id: 1,
    dataType: 'ASSET_PRICES',
    dataValue: JSON.stringify({
      type: 'ASSET_PRICES',
      timestamp: Date.now() - 120000,
      predictions: {
        BTC: { price: 50243.12, change: 1.2, currency: 'USD' },
        ETH: { price: 2985.43, change: -0.5, currency: 'USD' },
        CORE: { price: 10.25, change: 3.4, currency: 'USD' }
      }
    }),
    confidence: 85,
    submitter: '0x1234...5678',
    timestamp: Date.now() - 120000,
    verified: false,
    votesFor: 2,
    votesAgainst: 1
  },
  {
    id: 3,
    dataType: 'MARKET_METRICS',
    dataValue: JSON.stringify({
      type: 'MARKET_METRICS',
      timestamp: Date.now() - 180000,
      metrics: {
        totalMarketCap: 1.85e12,
        btcDominance: 42.5,
        ethDominance: 18.2,
        fear_greed_index: 65
      }
    }),
    confidence: 72,
    submitter: '0xdef0...1234',
    timestamp: Date.now() - 180000,
    verified: false,
    votesFor: 1,
    votesAgainst: 0
  }
];

/**
 * Vote page - For voting on oracle data submissions
 */
const VotePage = () => {
  const { account, connect, disconnect, isConnected } = useContext(Web3Context);
  const [pendingSubmissions, setPendingSubmissions] = useState([]);
  
  // Effect to load pending submissions
  useEffect(() => {
    // In a real application, this would fetch from the blockchain
    // For the hackathon, we're using mock data
    setPendingSubmissions(mockSubmissions);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>Vote on Submissions | Decentralized AI Oracle</title>
        <meta name="description" content="Vote on oracle data submissions to verify their accuracy" />
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
            Vote on Submissions
          </h1>
          <p className="text-xl text-gray-600 mt-2">
            Help verify the accuracy of AI-generated oracle data through community voting
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <VotingPanel 
            submissions={pendingSubmissions} 
            isConnected={isConnected}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default VotePage; 