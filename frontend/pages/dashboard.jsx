import React, { useContext, useState, useEffect } from 'react';
import { Web3Context } from './_app';
import Head from 'next/head';
import Link from 'next/link';
import Footer from '../components/Footer';
import CustomCursor from '../components/CustomCursor';
import ParticleBackground from '../components/ParticleBackground';
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
    <div className="min-h-screen relative overflow-hidden">
      <Head>
        <title>Dashboard | Decentralized AI Oracle</title>
        <meta name="description" content="View verified oracle data from the decentralized AI oracle" />
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
            <Link href="/vote" className="text-white hover:text-primary-glow transition-colors font-mono text-sm uppercase tracking-wider">Vote</Link>
            <Link href="/dashboard" className="text-primary-glow hover:text-primary-glow transition-colors font-mono text-sm uppercase tracking-wider">Dashboard</Link>
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
            Oracle <span className="text-primary-glow">Dashboard</span>
          </h1>
          <p className="text-xl text-gray-300 font-mono max-w-3xl mx-auto">
            View the latest verified data from the decentralized AI oracle network
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-pulse text-center">
              <div className="h-8 w-32 bg-gradient-to-r from-primary-glow/20 to-secondary-glow/20 rounded mx-auto mb-4"></div>
              <p className="text-gray-300 font-mono">Loading verified data...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-8 text-center animate-slide-up">
              <h2 className="text-3xl font-futuristic font-bold text-primary-glow mb-4">Verified Oracle Data</h2>
              <p className="text-gray-300 font-mono">
                This data has been verified by the community through the DAO voting system
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {verifiedData.map(submission => (
                <div key={submission.id} className="glass-card p-6 hover:shadow-glow-lg transition-all duration-300">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-primary-glow font-mono text-sm uppercase tracking-wider">
                        {submission.dataType}
                      </span>
                      <span className="text-accent-glow font-mono text-sm">
                        {submission.confidence}% Confidence
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      {submission.dataType === 'ASSET_PRICES' && Object.entries(JSON.parse(submission.dataValue).predictions).map(([asset, data]) => (
                        <div key={asset} className="flex items-center justify-between p-3 bg-cyber-surface/30 rounded-lg">
                          <span className="text-white font-mono font-bold">{asset}</span>
                          <div className="text-right">
                            <div className="text-white font-mono">${data.price}</div>
                            <div className={`text-sm font-mono ${data.change >= 0 ? 'text-accent-glow' : 'text-red-400'}`}>
                              {data.change >= 0 ? '+' : ''}{data.change}%
                            </div>
                          </div>
                        </div>
                      ))}
                      {submission.dataType === 'MARKET_METRICS' && Object.entries(JSON.parse(submission.dataValue).metrics).map(([metric, value]) => (
                        <div key={metric} className="flex items-center justify-between p-3 bg-cyber-surface/30 rounded-lg">
                          <span className="text-white font-mono font-bold capitalize">{metric.replace(/_/g, ' ')}</span>
                          <div className="text-white font-mono">
                            {typeof value === 'number' ? (value > 1000000 ? `${(value/1e9).toFixed(2)}B` : value.toFixed(2)) : value}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-400 font-mono">
                      <span>Submitter: {submission.submitter}</span>
                      <span>Votes: {submission.votesFor}/{submission.votesAgainst}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {verifiedData.length === 0 && (
              <div className="text-center py-12 glass-card">
                <p className="text-gray-300 font-mono">No verified data available yet.</p>
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
