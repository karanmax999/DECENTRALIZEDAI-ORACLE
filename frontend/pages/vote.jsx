import React, { useContext, useState, useEffect } from 'react';
import { Web3Context } from './_app';
import Head from 'next/head';
import Link from 'next/link';
import Footer from '../components/Footer';
import CustomCursor from '../components/CustomCursor';
import ParticleBackground from '../components/ParticleBackground';
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
    <div className="min-h-screen relative overflow-hidden">
      <Head>
        <title>Vote on Submissions | Decentralized AI Oracle</title>
        <meta name="description" content="Vote on oracle data submissions to verify their accuracy" />
      </Head>

      {/* Custom Cursor */}
      <CustomCursor />
      
      {/* Particle Background */}
      <ParticleBackground />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-cyber-bg/20 border-b border-cyber-border/30">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-glow to-secondary-glow rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-cyber-bg rounded-sm"></div>
            </div>
            <div>
              <div className="text-primary-glow font-futuristic font-bold text-lg">DECENTRALIZED</div>
              <div className="text-secondary-glow font-futuristic text-xs tracking-wider">AI ORACLE</div>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-white hover:text-primary-glow transition-colors font-mono text-sm uppercase tracking-wider">Home</Link>
            <Link href="/submit" className="text-white hover:text-primary-glow transition-colors font-mono text-sm uppercase tracking-wider">Submit</Link>
            <Link href="/vote" className="text-primary-glow hover:text-primary-glow transition-colors font-mono text-sm uppercase tracking-wider">Vote</Link>
            <Link href="/dashboard" className="text-white hover:text-primary-glow transition-colors font-mono text-sm uppercase tracking-wider">Dashboard</Link>
          </div>
          
          <div>
            {isConnected ? (
              <button 
                onClick={disconnect}
                className="btn btn-secondary text-xs px-4 py-2"
              >
                {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Connected'}
              </button>
            ) : (
              <button 
                onClick={connect}
                className="btn btn-primary text-xs px-4 py-2"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-grow container mx-auto px-6 py-8 pt-24 relative z-10">
        <div className="text-center mb-12 animate-slide-up">
          <h1 className="text-4xl md:text-6xl font-futuristic font-bold mb-6">
            Vote on <span className="text-primary-glow">Submissions</span>
          </h1>
          <p className="text-xl text-gray-300 font-mono max-w-3xl mx-auto">
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
