import { useContext, useState, useEffect } from 'react';
import { Web3Context } from './_app';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CustomCursor from '../components/CustomCursor';
import ParticleBackground from '../components/ParticleBackground';

// Mock data for the hackathon
const mockSubmissions = [
  {
    id: 2,
    dataType: 'ASSET_PRICES',
    dataValue: JSON.stringify({
      type: 'ASSET_PRICES',
      timestamp: Date.now() - 240000,
      predictions: {
        BTC: { price: 49985.75, change: -0.3, currency: 'USD' },
        ETH: { price: 3001.22, change: 0.8, currency: 'USD' },
        CORE: { price: 9.95, change: -1.2, currency: 'USD' }
      }
    }),
    confidence: 78,
    submitter: '0xabcd...ef01',
    timestamp: Date.now() - 240000,
    verified: true,
    votesFor: 5,
    votesAgainst: 0
  }
];

export default function Home() {
  const { account, connect, disconnect, isConnected } = useContext(Web3Context);
  
  return (
    <div className="min-h-screen relative overflow-hidden">
      <Head>
        <title>DECENTRALIZED AI ORACLE | Next-Gen Platform</title>
        <meta name="description" content="Revolutionary decentralized AI oracle system designed for developers and innovators. Experience the future of blockchain intelligence." />
        <link rel="icon" href="/favicon.ico" />
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

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Animated Grid Background */}
        <div className="absolute inset-0 cyber-grid opacity-20"></div>
        
        {/* Hero Content */}
        <div className="container mx-auto px-6 py-20 relative z-10">
          <div className="flex items-center justify-start">
            {/* Left Aligned Content */}
            <div className="animate-fade-in max-w-4xl">
              <h1 className="text-6xl md:text-8xl font-futuristic font-bold mb-8 leading-none">
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-glow to-white">
                  NEXT-GEN
                </span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-secondary-glow via-primary-glow to-accent-glow neon-text">
                  AI ORACLE
                </span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white to-primary-glow">
                  PLATFORM
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-lg font-mono leading-relaxed">
                Revolutionary decentralized AI oracle system designed for{' '}
                <span className="text-primary-glow">developers</span> and{' '}
                <span className="text-secondary-glow">innovators</span>.
                Experience the future of blockchain intelligence.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-start">
                <Link href="/dashboard">
                  <button className="btn btn-primary text-lg px-8 py-4">
                    Launch Platform
                  </button>
                </Link>
                <Link href="/submit">
                  <button className="btn btn-secondary text-lg px-8 py-4">
                    View Documentation
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 z-10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-4xl md:text-6xl font-futuristic font-bold mb-6">
              Core <span className="text-primary-glow">Features</span>
            </h2>
            <p className="text-xl text-gray-400 font-mono max-w-3xl mx-auto">
              Cutting-edge technology stack designed for the future of decentralized intelligence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Submit Data Card */}
            <div className="glass-card p-6 tilt-card group hover:shadow-glow-lg transition-all duration-300">
              <Link href="/submit" className="block text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-primary-glow/20 to-primary-glow/40 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300">
                  <svg className="w-8 h-8 text-primary-glow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="text-xl font-futuristic font-bold mb-4 text-primary-glow">Neural Data Submission</h3>
                <p className="text-gray-300 font-mono text-sm leading-relaxed">
                  Submit AI-generated oracle data to the blockchain using advanced neural networks for community verification and validation.
                </p>
              </Link>
            </div>

            {/* Vote Card */}
            <div className="glass-card p-6 tilt-card group hover:shadow-glow-purple transition-all duration-300">
              <Link href="/vote" className="block text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-secondary-glow/20 to-secondary-glow/40 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300">
                  <svg className="w-8 h-8 text-secondary-glow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-futuristic font-bold mb-4 text-secondary-glow">Quantum Governance</h3>
                <p className="text-gray-300 font-mono text-sm leading-relaxed">
                  Participate in the DAO governance system with quantum-safe voting mechanisms to verify and validate oracle data submissions.
                </p>
              </Link>
            </div>

            {/* Dashboard Card */}
            <div className="glass-card p-6 tilt-card group hover:shadow-glow-green transition-all duration-300">
              <Link href="/dashboard" className="block text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-accent-glow/20 to-accent-glow/40 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300">
                  <svg className="w-8 h-8 text-accent-glow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
                <h3 className="text-xl font-futuristic font-bold mb-4 text-accent-glow">Holographic Dashboard</h3>
                <p className="text-gray-300 font-mono text-sm leading-relaxed">
                  Explore real-time verified oracle data from the decentralized network through an immersive holographic interface.
                </p>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Data Section */}
      <section className="relative py-20 z-10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-4xl md:text-6xl font-futuristic font-bold mb-6">
              Live <span className="text-primary-glow">Data Stream</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto mb-12">
            {mockSubmissions.map((submission, index) => (
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
                    {Object.entries(JSON.parse(submission.dataValue).predictions).map(([asset, data]) => (
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
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-400 font-mono">
                    <span>Submitter: {submission.submitter}</span>
                    <span>Votes: {submission.votesFor}/{submission.votesAgainst}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center animate-slide-up">
            <Link href="/dashboard">
              <button className="btn btn-primary text-lg px-8 py-4 hover:scale-105 transition-transform">
                Access Full Data Stream
              </button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
