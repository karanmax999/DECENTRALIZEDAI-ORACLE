import { useContext, useState } from 'react';
import { Web3Context } from './_app';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import OracleDataCard from '../components/OracleDataCard';

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
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>Decentralized AI Oracle | Core Blockchain</title>
        <meta name="description" content="Decentralized AI Oracle powered DeFi dApp on Core blockchain" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header 
        account={account} 
        connect={connect}
        disconnect={disconnect}
        isConnected={isConnected}
      />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-primary-800 mb-4">
            Decentralized AI Oracle
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A transparent, community-audited oracle system powered by AI on Core blockchain.
            Replace black-box APIs with trustless, autonomous AI agents.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="card hover:shadow-lg transition-all transform hover:-translate-y-1">
            <Link href="/submit" className="p-6 text-center block">
              <div className="w-16 h-16 bg-primary-100 text-primary-600 flex items-center justify-center rounded-full mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h2 className="text-xl font-bold mb-2">Submit Data</h2>
              <p className="text-gray-600">
                Submit AI-generated oracle data to the blockchain for community verification
              </p>
            </Link>
          </div>

          <div className="card hover:shadow-lg transition-all transform hover:-translate-y-1">
            <Link href="/vote" className="p-6 text-center block">
              <div className="w-16 h-16 bg-secondary-100 text-secondary-600 flex items-center justify-center rounded-full mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold mb-2">Vote on Data</h2>
              <p className="text-gray-600">
                Participate in the DAO governance system to verify oracle data submissions
              </p>
            </Link>
          </div>

          <div className="card hover:shadow-lg transition-all transform hover:-translate-y-1">
            <Link href="/dashboard" className="p-6 text-center block">
              <div className="w-16 h-16 bg-accent-100 text-accent-600 flex items-center justify-center rounded-full mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold mb-2">View Dashboard</h2>
              <p className="text-gray-600">
                Explore the latest verified oracle data from the decentralized network
              </p>
            </Link>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-6">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card p-6">
              <div className="text-primary-600 font-bold text-xl mb-2">1. AI Data Generation</div>
              <p className="text-gray-600">
                Our system uses AI models to generate and simulate external data without relying on centralized APIs.
              </p>
            </div>
            <div className="card p-6">
              <div className="text-primary-600 font-bold text-xl mb-2">2. Community Voting</div>
              <p className="text-gray-600">
                DAO members vote to verify the accuracy of submitted data using a decentralized governance system.
              </p>
            </div>
            <div className="card p-6">
              <div className="text-primary-600 font-bold text-xl mb-2">3. Verified Oracle Data</div>
              <p className="text-gray-600">
                Once verified, the data becomes available for DeFi applications on the Core blockchain.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-center mb-6">Latest Verified Data</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {mockSubmissions.map(submission => (
              <OracleDataCard 
                key={submission.id}
                submission={submission}
              />
            ))}
          </div>
          <div className="text-center mt-6">
            <Link href="/dashboard" className="btn btn-primary" legacyBehavior={false}>
              View All Verified Data
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}