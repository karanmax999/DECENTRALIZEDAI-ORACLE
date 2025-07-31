# Decentralized AI Oracle for Core Blockchain

A transparent, community-audited oracle system that replaces black-box APIs with trustless, autonomous AI agents on the Core blockchain.

## Project Overview

The Decentralized AI Oracle is a DeFi infrastructure project that aims to provide reliable, transparent, and decentralized data feeds for blockchain applications built on the Core blockchain. Unlike traditional oracles that rely on centralized API providers, our system uses AI agents to generate and validate external data.

## Key Features

- **AI-powered Data Simulation**: Generate synthetic data for asset prices and other metrics using advanced AI models
- **DAO-based Governance**: Community voting system for data validation and protocol upgrades
- **On-chain Data Submission and Verification**: Transparent oracle data accessible on the Core blockchain
- **Anomaly Detection**: Sophisticated anomaly detection to identify manipulated or erroneous data
- **LLM-based Decision Agents**: Reasoning agents that validate data submissions using chain-of-thought logic
- **Staking Mechanism**: Token staking for governance participation and rewards
- **Incentive System**: ERC20 reward tokens for accurate data submission and validation

## Tech Stack

- **Smart Contracts**: Solidity, deployable on Core blockchain (EVM compatible)
- **Development**: Hardhat
- **Frontend**: Next.js + Tailwind CSS
- **Blockchain Interaction**: ethers.js
- **Wallet Connection**: WalletConnect
- **AI Oracle Logic**: JavaScript-based simulation models and LLM-powered agents

## System Design

```
decentralized-ai-oracle/
├── contracts/               # Smart contracts
│   ├── interfaces/          # Contract interfaces
│   │   ├── IAIOracle.sol    # Oracle interface
│   │   └── IGovernance.sol  # Governance interface
│   ├── staking/             # Staking contracts
│   │   └── Staking.sol      # Token staking contract
│   ├── mocks/               # Mock contracts for testing
│   ├── AIOracle.sol         # Main oracle contract
│   ├── Governance.sol       # DAO governance contract
│   └── RewardToken.sol      # ERC20 reward token contract
│
├── ai-oracle/               # AI oracle logic
│   ├── models/              # AI prediction models
│   │   ├── BaseModel.js     # Base model class
│   │   └── AssetPriceModel.js # Price prediction model
│   ├── simulators/          # Oracle simulators
│   │   └── OracleSimulator.js # Main simulator
│   ├── agents/              # LLM-based reasoning agents
│   │   └── DecisionAgent.js # Agent for data validation
│   └── anomalies/           # Anomaly detection
│       └── AnomalyDetector.js # Detects data manipulation
│
├── frontend/               # Next.js frontend
│   ├── components/         # React components (.jsx)
│   ├── pages/              # Next.js pages (.jsx)
│   ├── hooks/              # Custom React hooks (.jsx)
│   ├── styles/             # CSS styles with Tailwind
│   └── utils/              # Frontend utilities (.jsx)
│
├── scripts/                # Deployment and utility scripts
│   └── deploy.js           # Contract deployment script
│
└── test/                   # Contract test files
```

## Quick Start

1. Install dependencies:

```bash
# Install main project dependencies
npm install

# Install OpenZeppelin contracts (required for smart contracts)
npm install @openzeppelin/contracts

# Install frontend dependencies
cd frontend
npm install
cd ..
```

2. Set up environment variables by copying the `.env.example` file:

```bash
cp .env.example .env
```

3. Update the `.env` file with your:
   - Core blockchain RPC URL
   - Private key for deployment
   - WalletConnect Project ID

4. Compile the contracts:

```bash
npm run compile
```

5. Deploy to local network for testing:

```bash
npm run deploy:local
```

6. Deploy to Core blockchain:

```bash
npm run deploy
```

7. Update the contract addresses in your `.env` file after deployment.

8. Start the frontend development server:

```bash
npm run dev
```

## Smart Contracts

### AIOracle

The main oracle contract that allows AI-generated data to be submitted on-chain and verified through community voting.

### Governance

DAO-based governance system that enables community members to create and vote on proposals.

### RewardToken

ERC20 token that rewards users for contributing accurate data and participating in governance.

### Staking

Allows users to stake RewardToken for governance participation and earning rewards.

## AI Oracle Components

### Simulation Models

The AI oracle contains models that simulate various data points such as asset prices, volatility metrics, and other DeFi-relevant data. These models can be extended to support additional data types.

### Decision Agents

LLM-based agents that use reasoning to validate data submissions and detect anomalies through chain-of-thought logic.

### Anomaly Detection

Sophisticated statistical and pattern-based anomaly detection to identify manipulated or erroneous data submissions.

## Governance and Staking

The system includes a DAO-based governance mechanism for verifying submitted data and managing protocol parameters. Users can stake tokens to participate in governance and earn rewards.

### Reward System

Users who contribute accurate data or participate in validation receive reward tokens, creating an incentive for honest participation.

## Frontend Application

The frontend is built with Next.js and Tailwind CSS, providing a user-friendly interface for:

- Connecting wallets via WalletConnect
- Submitting oracle data
- Voting on data submissions
- Viewing verified data
- Participating in governance
- Staking tokens

## Development Notes

- Rename any remaining `.js` files in the frontend to `.jsx` for consistency
- Update the deployment script to include RewardToken and Staking contracts
- Replace hardcoded contract addresses with environment variables

## Future Development

- Integration with more sophisticated AI models
- Economic incentives for accurate data submission
- Multi-chain support
- Advanced anomaly detection using deep learning
- Integration with real-world data sources for calibration
- Comprehensive test suite for smart contracts and AI components

## License

MIT 