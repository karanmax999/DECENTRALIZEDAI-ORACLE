import React from 'react';
import { useContext } from 'react';
import { Web3Context } from './_app';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SubmissionForm from '../components/SubmissionForm';

/**
 * Submit page - For submitting AI-generated oracle data to the blockchain
 */
const SubmitPage = () => {
  const { account, connect, disconnect, isConnected } = useContext(Web3Context);

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>Submit Data | Decentralized AI Oracle</title>
        <meta name="description" content="Submit AI-generated data to the decentralized oracle" />
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
            Submit Oracle Data
          </h1>
          <p className="text-xl text-gray-600 mt-2">
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