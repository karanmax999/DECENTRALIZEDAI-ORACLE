import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

/**
 * Custom hook for wallet connection and management
 * @returns {Object} Wallet connection state and functions
 */
export function useWallet() {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize web3modal on component mount
  useEffect(() => {
    let web3Modal;
    
    const initWeb3Modal = async () => {
      try {
        // Import web3modal dynamically to avoid SSR issues
        const Web3Modal = (await import('web3modal')).default;
        const WalletConnectProvider = (await import('@walletconnect/web3-provider')).default;

        web3Modal = new Web3Modal({
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
                // Add QR Code modal options
                qrcodeModalOptions: {
                  mobileLinks: [
                    'metamask',
                    'coinbase',
                    'trust',
                    'rainbow',
                    'argent',
                    'bitpay',
                    'tokenary',
                    'zeal',
                    'xdefi',
                    'phantom',
                    'mathwallet',
                    'okxwallet',
                    'tokenpocket',
                    'atoken',
                    'liquality',
                    'zerion',
                    'frame',
                    'hyperpay',
                    'tp',
                    'alphawallet',
                    'pillar',
                    'ownbit',
                    'imtoken',
                    '1inch',
                    'bitpie',
                    'huobiwallet',
                    'hyperwallet',
                    'walletio',
                    'nifty',
                    'kaikas',
                    'celestia',
                    'rabby',
                    'bifrost',
                    'bitget',
                    'zerion',
                    'bitkeep',
                    'okexwallet',
                    'guarda',
                    'exodus',
                    'trustwallet',
                    'coinomi',
                    'meowwallet',
                    'roninwallet',
                    'gamestop',
                    'bitvavo',
                    'zkwallet',
                    'bchain'
                  ]
                }
              },
            },
          },
        });

        // Auto-connect if cached provider exists
        if (web3Modal.cachedProvider) {
          try {
            await connectWallet(web3Modal);
          } catch (error) {
            console.error("Failed to connect using cached provider:", error);
            setError("Failed to auto-connect wallet");
          }
        }

        return web3Modal;
      } catch (error) {
        console.error("Error initializing web3modal:", error);
        setError("Failed to initialize wallet connection");
        return null;
      }
    };

    initWeb3Modal().then(modal => {
      web3Modal = modal;
    });

    // Add event listeners for modal closing
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        // Reset loading state if modal is closed via escape
        if (isLoading) {
          setIsLoading(false);
          setError(null);
        }
      }
    };

    const handleWindowClick = (event) => {
      // Check if click is outside the modal
      const modal = document.querySelector('.w3m-modal');
      if (modal && !modal.contains(event.target) && isLoading) {
        // Reset loading state if modal is closed by clicking outside
        setIsLoading(false);
        setError(null);
      }
    };

    window.addEventListener('keydown', handleEscapeKey);
    window.addEventListener('click', handleWindowClick);

    // Cleanup function
    return () => {
      if (web3Modal && web3Modal.clearCachedProvider) {
        web3Modal.clearCachedProvider();
      }
      window.removeEventListener('keydown', handleEscapeKey);
      window.removeEventListener('click', handleWindowClick);
    };
  }, [isLoading]);

  /**
   * Connect to wallet
   */
  const connect = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Import web3modal dynamically
      const Web3Modal = (await import('web3modal')).default;
      const WalletConnectProvider = (await import('@walletconnect/web3-provider')).default;

      const web3Modal = new Web3Modal({
        network: 'mainnet',
        cacheProvider: true,
        providerOptions: {
          walletconnect: {
            package: WalletConnectProvider,
            options: {
              rpc: {
                1116: 'https://rpc.coredao.org',
              },
              chainId: 1116,
            },
          },
        },
      });

      await connectWallet(web3Modal);
    } catch (error) {
      // Check if the error is due to user closing the modal
      if (error.message && error.message.includes("User closed modal")) {
        // This is expected behavior when user closes the modal
        // Don't show error message or log as error
        setError(null);
      } else {
        console.error("Error connecting wallet:", error);
        setError("Failed to connect wallet");
      }
      setIsLoading(false);
    }
  };

  /**
   * Internal function to handle wallet connection
   * @param {Object} web3Modal - Web3Modal instance
   */
  const connectWallet = async (web3Modal) => {
    try {
      const instance = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(instance);
      const signer = provider.getSigner();
      const accounts = await provider.listAccounts();
      const network = await provider.getNetwork();
      
      setAccount(accounts[0]);
      setProvider(provider);
      setSigner(signer);
      setChainId(network.chainId);
      setIsConnected(true);
      setIsLoading(false);

      // Setup event listeners for wallet events
      instance.on("accountsChanged", handleAccountsChanged);
      instance.on("chainChanged", handleChainChanged);
      instance.on("disconnect", handleDisconnect);

      return { provider, signer, account: accounts[0], chainId: network.chainId };
    } catch (error) {
      // Check if the error is due to user closing the modal
      if (error.message && error.message.includes("User closed modal")) {
        // This is expected behavior when user closes the modal
        // Don't show error message or log as error
        setError(null);
      } else {
        console.error("Error in connectWallet:", error);
        setError("Failed to connect wallet. Please try again.");
      }
      setIsLoading(false);
      throw error;
    }
  };

  /**
   * Disconnect wallet
   */
  const disconnect = () => {
    setAccount(null);
    setProvider(null);
    setSigner(null);
    setChainId(null);
    setIsConnected(false);

    // Clear cached provider
    if (typeof window !== 'undefined') {
      localStorage.removeItem('walletconnect');
      localStorage.removeItem('WEB3_CONNECT_CACHED_PROVIDER');
    }
  };

  /**
   * Handle accounts changed event
   * @param {Array} accounts - New accounts array
   */
  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      // User disconnected their wallet
      disconnect();
    } else {
      setAccount(accounts[0]);
    }
  };

  /**
   * Handle chain changed event
   */
  const handleChainChanged = () => {
    // Reload the page on chain change
    window.location.reload();
  };

  /**
   * Handle disconnect event
   */
  const handleDisconnect = () => {
    disconnect();
  };

  /**
   * Check if connected to Core blockchain
   * @returns {boolean} Whether connected to Core blockchain
   */
  const isConnectedToCore = () => {
    return chainId === 1116;
  };

  /**
   * Switch to Core blockchain
   */
  const switchToCore = async () => {
    if (!provider) return;
    
    try {
      await provider.send('wallet_switchEthereumChain', [{ chainId: '0x45C' }]); // 1116 in hex
    } catch (error) {
      // If the chain is not added, add it
      if (error.code === 4902) {
        try {
          await provider.send('wallet_addEthereumChain', [
            {
              chainId: '0x45C',
              chainName: 'Core Blockchain',
              nativeCurrency: {
                name: 'CORE',
                symbol: 'CORE',
                decimals: 18,
              },
              rpcUrls: ['https://rpc.coredao.org'],
              blockExplorerUrls: ['https://scan.coredao.org'],
            },
          ]);
        } catch (addError) {
          console.error("Error adding Core blockchain:", addError);
          setError("Failed to add Core blockchain to wallet");
        }
      } else {
        console.error("Error switching to Core blockchain:", error);
        setError("Failed to switch to Core blockchain");
      }
    }
  };

  return {
    account,
    provider,
    signer,
    chainId,
    isConnected,
    isLoading,
    error,
    connect,
    disconnect,
    isConnectedToCore,
    switchToCore,
  };
}
