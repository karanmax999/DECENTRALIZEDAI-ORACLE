import React from 'react';
import { useContext } from 'react';
import { Web3Context } from './_app';
import Head from 'next/head';
import Link from 'next/link';
import Footer from '../components/Footer';
import CustomCursor from '../components/CustomCursor';
import ParticleBackground from '../components/ParticleBackground';
import SubmissionForm from '../components/SubmissionForm';

/**
 * Submit page - For submitting AI-generated oracle data to the blockchain
 */
const SubmitPage = () => {
  const { account, connect, disconnect, isConnected } = useContext(Web3Context);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Head>
        <title>Submit Data | Decentralized AI Oracle</title>
        <meta name="description" content="Submit AI-generated data to the decentralized oracle" />
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
            <Link href="/submit" className="text-primary-glow hover:text-primary-glow transition-colors font-mono text-sm uppercase tracking-wider">Submit</Link>
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

      <main className="flex-grow container mx-auto px-6 py-8 pt-24 relative z-10">
        <div className="text-center mb-12 animate-slide-up">
          <h1 className="text-4xl md:text-6xl font-futuristic font-bold mb-6">
            Submit <span className="text-primary-glow">Oracle Data</span>
          </h1>
          <p className="text-xl text-gray-300 font-mono max-w-3xl mx-auto">
            Submit AI-generated data to the decentralized oracle for community verification
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <SubmissionForm isConnected={isConnected} />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SubmitPage;
