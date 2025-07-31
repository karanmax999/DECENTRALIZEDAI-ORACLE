import React from 'react';

/**
 * Footer component
 */
const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Decentralized AI Oracle</h3>
            <p className="text-gray-300">
              A transparent, community-audited oracle that replaces black-box APIs 
              with trustless, autonomous AI agents on the Core blockchain.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-3">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-white">Documentation</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">GitHub</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">Core Blockchain</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-3">Community</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-white">Discord</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">Twitter</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">Telegram</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>© {new Date().getFullYear()} Decentralized AI Oracle. 
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 