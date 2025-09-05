# NECTR dApp Demo

## 🌐 Overview

A full-stack decentralized application featuring ERC-20 token staking, real-time portfolio insights, social media integration, and dynamic news feeds — built with modern Web3 and frontend frameworks.

## 🚀 Live Demo

* **Demo URL**: [nectre.fynix.dev](https://nectre.fynix.dev/)
* **Contract**: [0xD2afEf4d43a6a82CA129a3Adf4231587503408F6](https://amoy.polygonscan.com/address/0xD2afEf4d43a6a82CA129a3Adf4231587503408F6)
* **Network**: Polygon Amoy Testnet

## ✨ Features

### Core Requirements

* ✅ ERC-20 NECTR token with advanced staking functionality
* ✅ Modern wallet integration (Reown AppKit)
* ✅ Real-time staking interface with validation
* ✅ Social media integration (Twitter feed + community links)
* ✅ News module with category filtering

### Advanced Features

* ✅ Real-time staking duration + portfolio tracking
* ✅ Daily reward estimation with live APY
* ✅ Type-safe smart contract interactions
* ✅ Transaction tracking with PolygonScan links
* ✅ Responsive glassmorphism UI design
* ✅ Mobile-first optimization

## 🛠️ Tech Stack

### Smart Contracts

* **Solidity**: ^0.8.28
* **Foundry**: Development, testing & deployment
* **OpenZeppelin**: Security libraries
* **Network**: Polygon Amoy (Chain ID: 80002)

### Frontend

* **Next.js 15** with **TypeScript**
* **Reown AppKit** for wallet connectivity
* **Wagmi v2** for contract interactions
* **Tailwind CSS** for responsive styling
* **Lucide React** for icons

### Key Contract Features

* 5% APY staking mechanism
* Real-time reward calculations
* Built-in safeguards (ReentrancyGuard, Pausable)
* Comprehensive getter functions
* Owner controls for parameters

## 🎯 How to Use

1. **Connect Wallet**: Use MetaMask or another supported wallet
2. **Switch Network**: Ensure Polygon Amoy Testnet is selected
3. **Request Test Tokens**: Contact demo presenter for NECTR tokens
4. **Stake & Unstake**: Interact with the staking interface
5. **Explore Features**: Browse news feeds and community integrations

## 📊 Contract Stats

* **Total Supply**: 1,000,000 NECTR
* **APY**: 5%
* **Minimum Stake**: 10 NECTR
* **TVL**: Displayed live in dApp

## 🚀 Getting Started

### Prerequisites

* **Node.js** 18+ and **pnpm**
* **Git** for cloning the repository
* **MetaMask** or another Web3 wallet
* **Foundry** (for smart contract development)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/incredible-phoenix246/nectr-interview.git
   cd nectr-interview
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your configuration (see Environment Variables section below).

4. **Run the development server**:
   ```bash
   pnpm dev
   ```

5. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

### Smart Contract Setup (Optional)

If you want to deploy your own contract:

1. **Install Foundry**:
   ```bash
   curl -L https://foundry.paradigm.xyz | bash
   foundryup
   ```

2. **Navigate to smart contract directory**:
   ```bash
   cd smart-contract
   ```

3. **Install dependencies**:
   ```bash
   forge install
   ```

4. **Compile contracts**:
   ```bash
   forge build
   ```

5. **Run tests**:
   ```bash
   forge test
   ```

6. **Deploy to Amoy testnet**:
   ```bash
   forge script script/Deploy.s.sol --rpc-url amoy --broadcast --verify
   ```

## 📋 Environment Variables

Create a `.env.local` file in the root directory with these variables:

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | WalletConnect/Reown project ID | ✅ |
| `NEXT_PUBLIC_CONTRACT_ADDRESS` | NECTR token contract address | ✅ |
| `NEXT_PUBLIC_APP_URL` | Your app's URL (for production) | ✅ |
| `PRIVATE_KEY` | Wallet private key (for deployment only) | 🔧 |
| `POLYGONSCAN_API_KEY` | PolygonScan API key (for verification) | 🔧 |
| `AUTH_SECRET` | Secret for authentication (generate random) | 🔧 |

**Legend**: ✅ Required for frontend | 🔧 Required for smart contract deployment

### Getting API Keys

1. **WalletConnect Project ID**: 
   - Visit [WalletConnect Cloud](https://cloud.walletconnect.com/)
   - Create a new project
   - Copy the Project ID

2. **PolygonScan API Key**:
   - Visit [PolygonScan](https://polygonscan.com/apis)
   - Create a free account
   - Generate an API key

## 🛠️ Available Scripts

### Frontend
- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Fix ESLint issues
- `pnpm test` - Run tests with Vitest
- `pnpm test:watch` - Run tests in watch mode
- `pnpm test:ui` - Run tests with UI
- `pnpm type-check` - Run TypeScript type checking

### Smart Contract
- `forge build` - Compile contracts
- `forge test` - Run contract tests
- `forge coverage` - Generate test coverage
- `forge fmt` - Format Solidity code
- `forge doc` - Generate documentation

## 🔧 Development Workflow

1. **Make changes** to the codebase
2. **Run tests** to ensure everything works:
   ```bash
   pnpm test
   forge test  # for smart contracts
   ```
3. **Check code quality**:
   ```bash
   pnpm lint
   pnpm type-check
   ```
4. **Build for production**:
   ```bash
   pnpm build
   ```

## 🔗 Resources

* **Live App**: [nectre.fynix.dev](https://nectre.fynix.dev/)
* **Smart Contract**: [PolygonScan Link](https://amoy.polygonscan.com/address/0xD2afEf4d43a6a82CA129a3Adf4231587503408F6)
* **GitHub Repository**: [https://github.com/incredible-phoenix246/nectr-interview](https://github.com/incredible-phoenix246/nectr-interview)

## 🏆 Highlights

* Verified and deployed smart contract
* Professional-grade UI/UX with glassmorphism
* Real-time on-chain + off-chain data integration
* Full mobile responsiveness
* Robust error handling throughout

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---