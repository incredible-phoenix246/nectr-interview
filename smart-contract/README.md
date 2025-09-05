# NECTR Smart Contract

## Overview

The NECTR smart contract is an ERC-20 token with advanced staking functionality, built using Foundry framework. This contract enables users to stake NECTR tokens and earn rewards with a 5% APY.

## 🚀 Quick Start

### Prerequisites

- [Foundry](https://book.getfoundry.sh/getting-started/installation)
- Git

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/incredible-phoenix246/nectr-interview.git
   cd nectr-interview/smart-contract
   ```

2. **Install dependencies**:
   ```bash
   forge install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration.

4. **Compile contracts**:
   ```bash
   forge build
   ```

5. **Run tests**:
   ```bash
   forge test
   ```

## 📋 Environment Variables

Create a `.env` file in the smart-contract directory:

```bash
# Deployment
PRIVATE_KEY=your_private_key_here
POLYGONSCAN_API_KEY=your_polygonscan_api_key_here

# Network RPCs
AMOY_RPC_URL=https://rpc-amoy.polygon.technology
POLYGON_RPC_URL=https://polygon-rpc.com
MUMBAI_RPC_URL=https://rpc-mumbai.maticvigil.com
```

## 🛠️ Available Commands

### Development
```bash
forge build                    # Compile contracts
forge test                     # Run all tests
forge test -v                  # Verbose test output  
forge test -vvv                # Very verbose with stack traces
forge test --gas-report        # Run tests with gas reporting
forge coverage                 # Generate coverage report
```

### Deployment
```bash
# Deploy to Amoy testnet
forge script script/Deploy.s.sol --rpc-url $AMOY_RPC_URL --broadcast --verify

# Deploy to other networks
forge script script/Deploy.s.sol --rpc-url $POLYGON_RPC_URL --broadcast --verify
```

### Verification
```bash
forge verify-contract <contract-address> src/NectrToken.sol:NectrToken --chain amoy
```

### Documentation
```bash
forge doc                      # Generate documentation
forge doc --serve              # Serve docs locally
```

## 📊 Contract Features

- **Token Standard**: ERC-20 compliant
- **Total Supply**: 1,000,000 NECTR tokens
- **Staking APY**: 5% annual percentage yield
- **Minimum Stake**: 10 NECTR tokens
- **Security Features**: ReentrancyGuard, Pausable, Access Control

## 🧪 Testing

The contract includes comprehensive tests covering:
- Basic ERC-20 functionality
- Staking and unstaking mechanisms
- Reward calculations
- Security measures
- Edge cases and error conditions

Run specific test files:
```bash
forge test --match-contract NectrTokenTest
forge test --match-test testStaking
```

## 📦 Contract Structure

```
src/
├── NectrToken.sol              # Main token contract
└── interfaces/
    └── INectrToken.sol         # Contract interface

test/
├── NectrToken.t.sol           # Main test suite
└── utils/
    └── TestUtils.sol          # Test utilities

script/
├── Deploy.s.sol               # Deployment script
└── Interact.s.sol             # Interaction script
```

## 🔐 Security Considerations

- **Access Control**: Owner-only functions for critical operations
- **Reentrancy Protection**: Guards against reentrancy attacks
- **Pausable**: Emergency stop functionality
- **Input Validation**: Comprehensive parameter checking
- **Integer Overflow**: Built-in Solidity 0.8+ protections

## 🌐 Deployed Contracts

### Polygon Amoy Testnet
- **Contract Address**: `0xD2afEf4d43a6a82CA129a3Adf4231587503408F6`
- **Explorer**: [View on PolygonScan](https://amoy.polygonscan.com/address/0xD2afEf4d43a6a82CA129a3Adf4231587503408F6)

## Why Foundry Over Hardhat

This project uses **Foundry** as the smart contract development framework instead of Hardhat. Here are the key reasons for this decision:

### 1. **Faster Development Cycle**
- Foundry's Rust-based architecture provides significantly faster compilation times
- Hot reloading and instant feedback during development
- Rapid test execution that scales well with large test suites

### 2. **Superior Testing Capabilities**
- Built-in fuzzing (property-based testing) out of the box
- Advanced debugging tools with detailed stack traces
- Snapshot testing for gas optimization analysis
- Better assertion libraries and testing utilities

### 3. **Dependency Management**
- No Node.js dependency issues or version conflicts
- Native Solidity dependency management without npm/yarn overhead
- Cleaner project structure without complex package.json configurations
- Eliminates common JavaScript ecosystem dependency hell

### 4. **Modern Tooling**
- Native support for latest Solidity versions
- Built-in deployment scripts with better state management
- Integrated gas profiling and optimization tools
- Superior debugging experience with `forge debug`

### 5. **Performance & Reliability**
- Single binary installation - no complex setup
- Memory efficient compilation and testing
- More stable build process with fewer breaking changes
- Better CI/CD integration with consistent environments

### 6. **Developer Experience**
- Cleaner command-line interface
- Better error messages and debugging output
- Integrated documentation generation
- Simplified project configuration

### 7. **Security & Auditing**
- Better integration with static analysis tools
- Native support for formal verification
- More comprehensive test coverage reporting
- Built-in vulnerability detection patterns

### 8. **Ecosystem Benefits**
- Growing adoption in DeFi protocols
- Better compatibility with modern Solidity patterns
- Active community and frequent updates
- Integration with popular security tools like Slither

## Additional Technical Advantages

- **Gas Optimization**: Built-in gas reporting and optimization suggestions
- **Maintenance**: Lower maintenance overhead compared to JavaScript-based toolchains
- **Reproducibility**: More deterministic builds across different environments
- **Scalability**: Better performance with large codebases and extensive test suites

## Project Architecture

This smart contract project follows Foundry's recommended structure:

```
├── src/           # Smart contract source files
├── test/          # Test files with .t.sol extension
├── script/        # Deployment and interaction scripts
├── lib/           # Git submodule dependencies
└── foundry.toml   # Configuration file
```

## Development Workflow

1. **Development**: Write contracts in `src/`
2. **Testing**: Create comprehensive tests in `test/`
3. **Deployment**: Use scripts in `script/` for deployment
4. **Verification**: Leverage Foundry's built-in verification tools

This technical decision ensures a more robust, faster, and maintainable development workflow for smart contract development.