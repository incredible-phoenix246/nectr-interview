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

## 🏗️ Frontend Architecture & Technical Decisions

### Core Framework Choices

**Next.js 15 with TypeScript** was chosen as the foundation for several strategic reasons:

1. **App Router Architecture**: Leveraging Next.js's latest app directory structure for better file-system routing and layout management
2. **Server-Side Rendering (SSR)**: Critical for Web3 applications to handle wallet connection states properly across page loads
3. **Turbopack Integration**: Faster development builds (enabled via `--turbopack` flag in package.json scripts)
4. **TypeScript**: Essential for Web3 development to catch ABI-related type errors and ensure contract interaction safety

### Web3 Integration Strategy

**Reown AppKit (formerly WalletConnect) + Wagmi v2** forms the core Web3 stack:

```typescript
// Custom wagmi configuration with multi-network support
export const wagmiAdapter = new WagmiAdapter({
  ssr: true,
  projectId,
  networks: [amoy, polygonAmoy, polygon],
})
```

**Why This Stack?**
- **Universal Wallet Support**: AppKit provides out-of-the-box support for 350+ wallets
- **SSR Compatibility**: Critical for Next.js applications to avoid hydration mismatches
- **Type Safety**: Wagmi v2 provides full TypeScript support for contract interactions
- **React Query Integration**: Automatic caching and refetching of blockchain data

### State Management Architecture

**React Query + Wagmi Hooks** eliminates the need for traditional state management:

```typescript
// Custom hook for contract interactions
export function useNECTRContract() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  
  // Real-time data fetching with automatic refetch
  const usePendingRewards = (address?: Address) => {
    return useReadContract({
      ...nectrContract,
      functionName: 'getPendingRewards',
      args: address ? [address] : undefined,
      query: {
        enabled: !!address,
        refetchInterval: 10000, // Auto-refresh every 10 seconds
      },
    })
  }
}
```

**Benefits:**
- **Real-time Updates**: Automatic blockchain data synchronization
- **Optimistic Updates**: Immediate UI feedback during transactions
- **Error Handling**: Built-in retry logic and error boundaries
- **Performance**: Intelligent caching reduces unnecessary RPC calls

### Styling System Design

**Tailwind CSS v4 + CSS Variables** approach for maximum flexibility:

```css
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  /* Dynamic theme system */
}
```

**Key Design Decisions:**
1. **Glassmorphism UI**: `backdrop-blur-md` and opacity layers for modern Web3 aesthetic
2. **CSS Variables**: Enable dynamic theme switching without build-time compilation
3. **Mobile-First**: Responsive design using `max-md:` prefixes for optimal mobile experience
4. **Design System**: Custom color palette optimized for dark themes and Web3 interfaces

### Component Architecture

**Custom Hook Pattern** for reusable contract logic:

```typescript
// Centralized contract interactions
const {
  useBalance,
  useStakedBalance,
  usePendingRewards,
  stakeTokens,
  unstakeTokens,
} = useNECTRContract()
```

**Modular Component Design:**
- **Transaction Status**: Real-time transaction monitoring with PolygonScan links
- **Wallet Info**: Dynamic balance display with auto-refresh
- **Contract Stats**: Live TVL and staking metrics
- **Social Integration**: Embedded Twitter feeds and community links

### Performance Optimizations

1. **Code Splitting**: Next.js automatic code splitting reduces initial bundle size
2. **Image Optimization**: Next.js Image component for responsive images
3. **Bundle Analysis**: Prettier + ESLint configured for consistent code quality
4. **Lazy Loading**: Components loaded on-demand to improve initial page load

### Security Implementations

**Type-Safe Contract Interactions:**
```typescript
// ABI-generated types prevent runtime errors
const nectrContract = {
  abi: NECTRTokenABI as const,
  address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
}
```

**Environment Variable Management:**
- Separate build-time and runtime environment handling
- Secure API key management for external services
- Development vs. production URL switching

### Testing Strategy

**Vitest + React Testing Library** for comprehensive testing:

```json
{
  "test": "vitest",
  "test:watch": "vitest --watch", 
  "test:ui": "vitest --ui"
}
```

**Testing Focus Areas:**
- Component rendering with mock wallet states
- Contract interaction hooks with mock blockchain responses
- User interaction flows and error handling
- Responsive design across device sizes

### Development Experience

**Developer Productivity Features:**
- **Hot Reload**: Turbopack-enabled fast refresh during development
- **Type Checking**: Separate `type-check` script for CI/CD integration
- **Linting**: ESLint with Next.js and TypeScript rules
- **Formatting**: Prettier with Tailwind CSS plugin for consistent styling

This architecture prioritizes **type safety**, **performance**, and **user experience** while maintaining **developer productivity** and **code maintainability**. Every technical decision was made to support the core Web3 functionality while providing a seamless user interface for staking operations.

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