import '../styles/globals.css';
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

// Web3 context for the application
export const Web3Context = React.createContext({
  account: null,
  provider: null,
  signer: null,
  chainId: null,
  connect: async () => {},
  disconnect: () => {},
  isConnected: false,
});

function MyApp({ Component, pageProps }) {
  const [web3State, setWeb3State] = useState({
    account: null,
    provider: null,
    signer: null,
    chainId: null,
    isConnected: false,
  });
  const [web3Modal, setWeb3Modal] = useState(null);

  // Effect to initialize web3modal and handle connection
  useEffect(() => {
    // Import web3modal dynamically to avoid SSR issues
    const initWeb3Modal = async () => {
      try {
        const Web3Modal = (await import('web3modal')).default;
        const WalletConnectProvider = (await import('@walletconnect/web3-provider')).default;

        const modal = new Web3Modal({
          network: 'mainnet', // Can be changed to match the network
          cacheProvider: true,
          providerOptions: {
            walletconnect: {
              package: WalletConnectProvider,
              options: {
                rpc: {
                  1116: 'https://rpc.coredao.org', // Core blockchain RPC
                },
                chainId: 1116,
              },
            },
          },
        });

        setWeb3Modal(modal);

        // If cached provider exists, try to connect automatically
        if (modal.cachedProvider) {
          try {
            await connectWallet(modal);
          } catch (error) {
            console.error("Failed to connect using cached provider:", error);
          }
        }

        return modal;
      } catch (error) {
        console.error("Failed to initialize Web3Modal:", error);
        return null;
      }
    };

    initWeb3Modal();

    // Cleanup function
    return () => {
      if (web3Modal && web3Modal.clearCachedProvider) {
        web3Modal.clearCachedProvider();
      }
    };
  }, []);

  // Function to handle wallet connection
  const connectWallet = async (modalInstance) => {
    try {
      if (!modalInstance) {
        console.error("Web3Modal is not initialized yet");
        return false;
      }
      
      const instance = await modalInstance.connect();
      
      if (!instance) {
        console.error("Provider is null or undefined");
        return false;
      }
      
      try {
        const provider = new ethers.providers.Web3Provider(instance);
        const signer = provider.getSigner();
        const accounts = await provider.listAccounts();
        const network = await provider.getNetwork();
        
        setWeb3State({
          account: accounts[0],
          provider,
          signer,
          chainId: network.chainId,
          isConnected: true,
        });

        // Setup event listeners for wallet events
        instance.on("accountsChanged", (accounts) => {
          if (accounts.length === 0) {
            // User disconnected their wallet
            disconnectWallet();
          } else {
            // User switched account
            setWeb3State(prev => ({
              ...prev,
              account: accounts[0],
            }));
          }
        });

        instance.on("chainChanged", (chainId) => {
          window.location.reload();
        });
        
        return true;
      } catch (innerError) {
        console.error("Error setting up Web3Provider:", innerError);
        return false;
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      return false;
    }
  };

  // Function to disconnect wallet
  const disconnectWallet = () => {
    try {
      // Check if provider has disconnect method (WalletConnect has it)
      if (web3State.provider?.disconnect) {
        web3State.provider.disconnect();
      }
      
      // Clear the cached provider
      if (web3Modal) {
        web3Modal.clearCachedProvider();
      }
      
      // Reset web3 state
      setWeb3State({
        account: null,
        provider: null,
        signer: null,
        chainId: null,
        isConnected: false,
      });
      
      return true;
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
      return false;
    }
  };

  // Create the context value
  const web3ContextValue = {
    ...web3State,
    connect: async () => {
      try {
        if (web3Modal) {
          return await connectWallet(web3Modal);
        } else {
          console.error("Web3Modal is not initialized yet");
          return false;
        }
      } catch (error) {
        console.error("Error in connect function:", error);
        return false;
      }
    },
    disconnect: () => {
      try {
        return disconnectWallet();
      } catch (error) {
        console.error("Error in disconnect function:", error);
        return false;
      }
    },
  };

  return (
    <Web3Context.Provider value={web3ContextValue}>
      <Component {...pageProps} />
    </Web3Context.Provider>
  );
}

export default MyApp;