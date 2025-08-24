# PrivateShare

[![Deployment Status](https://img.shields.io/badge/Status-Live%20on%20Fuji-green)](https://testnet.snowtrace.io/address/0x10f9f3F9b014aD4776AFb3B63F67bA06CA65c0D8)
[![Contract Verified](https://img.shields.io/badge/Contract-Verified-blue)](https://testnet.snowtrace.io/address/0x10f9f3F9b014aD4776AFb3B63F67bA06CA65c0D8#code)
[![Avalanche Fuji](https://img.shields.io/badge/Network-Avalanche%20Fuji-red)](https://testnet.snowtrace.io/)

**Private Revenue Distribution for API Provider Ecosystems**

*On-chain privacy solution for transparent yet confidential revenue sharing with API providers - enabling micro-precision payouts while keeping competitor earnings invisible*

## 🚀 **Live Deployment Status**

✅ **Revenue Distribution System is LIVE** on Avalanche Fuji Testnet with private provider payouts ready for deployment!

## 📋 Quick Navigation

### About PrivateShare
- **[📖 Project Overview](about/PROJECT.md)** - PrivateShare Provider Revenue Distribution System
- **[🗺️ Development Roadmap](about/ROADMAP.md)** - Three-stage hackathon timeline and progress  
- **[📊 Flow Diagrams](about/USER_FLOW.md)** - Provider registration and automated payout flows

### Resources & References
- **[📚 Research Documentation](resources/RESOURCES.md)** - All technical references and guides
- **[🤖 AI Assistants](resources/RESOURCES.md#ai-assistants--tools)** - Custom GPTs for development

### Live URLs & Deployed System
- **[🔗 Main Contract](https://testnet.snowtrace.io/address/0x10f9f3F9b014aD4776AFb3B63F67bA06CA65c0D8)** - EncryptedERC for Private Provider Payouts
- **[📊 System Details](deployment/DEPLOYMENT.md)** - Complete provider revenue distribution deployment
- **[🏠 FlowMCP Platform](https://www.flowmcp.org)** - API Provider ecosystem and configurator  
- **[🧪 Community Servers](https://community.flowmcp.org)** - Provider integration testing environment

### Key Repositories
- **[📦 Avalabs eERC-20 SDK](https://github.com/ava-labs/ac-eerc-sdk)** - Official eERC-20 SDK
- **[🔄 eERC Backend Converter](https://github.com/alejandro99so/eerc-backend-converter)** - Backend converter implementation
- **[📖 eERC-20 Documentation](https://avacloud.gitbook.io/encrypted-erc)** - Official AvaCloud docs
- **[🎨 3dent Frontend](https://github.com/BeratOz01/3dent)** - Example front-end application for eERC ([Live Demo](https://www.3dent.xyz))

## 🛠️ Technical Stack

- **Blockchain**: Avalanche C-Chain (Fuji Testnet - Chain ID: 43113)
- **Privacy**: eERC-20 with Groth16 zero-knowledge proofs for confidential payouts
- **Integration**: FlowMCP provider ecosystem with usage-based revenue distribution
- **Precision**: USDC 6-decimal micro-payments (down to 0.000001 USDC)
- **Compatibility**: Universal API provider integration

## 📍 **Key Contract Addresses**

| Contract | Address | Purpose | Verified |
|----------|---------|---------|----------|
| **[EncryptedERC](https://testnet.snowtrace.io/address/0x10f9f3F9b014aD4776AFb3B63F67bA06CA65c0D8#readContract)** | `0x10f9f3F9b014aD4776AFb3B63F67bA06CA65c0D8` | Private provider payout system | ✅ [Code](https://testnet.snowtrace.io/address/0x10f9f3F9b014aD4776AFb3B63F67bA06CA65c0D8#code) |
| **[Registrar](https://testnet.snowtrace.io/address/0x8664516a027B96F024C68bF44A8c9D44380510B6#readContract)** | `0x8664516a027B96F024C68bF44A8c9D44380510B6` | Provider registration & key management | ✅ [Code](https://testnet.snowtrace.io/address/0x8664516a027B96F024C68bF44A8c9D44380510B6#code) |
| **[PrivateShare Token](https://testnet.snowtrace.io/address/0xeD8186eDB85f63A35e57114bcCaA7Dfb6E5aCdA1#readContract)** | `0xeD8186eDB85f63A35e57114bcCaA7Dfb6E5aCdA1` | PSHARE revenue distribution token | ✅ [Code](https://testnet.snowtrace.io/address/0xeD8186eDB85f63A35e57114bcCaA7Dfb6E5aCdA1#code) |
| **[Demo Provider](https://testnet.snowtrace.io/address/0xf3d4E353390d073D408ca0D5D02B3E712C0E669a)** | `0xf3d4E353390d073D408ca0D5D02B3E712C0E669a` | Registered API provider for testing | 👤 EOA |
| **[Revenue Auditor](https://testnet.snowtrace.io/address/0x7E11f1Ad5b3176BC27049FC74e1725E941C1A457)** | `0x7E11f1Ad5b3176BC27049FC74e1725E941C1A457` | Revenue transparency & compliance | 👤 EOA |

> 💡 **Tip**: Click contract names for read functions, "Code" links for verified source code

## 📁 Repository Structure

```
├── README.md              # This navigation hub  
├── about/                 # Project documentation
│   ├── PROJECT.md         # FlowMCP provider revenue distribution system
│   └── ROADMAP.md         # Development timeline and progress
├── deployment/            # 🚀 LIVE PROVIDER PAYOUT SYSTEM
│   ├── DEPLOYMENT.md      # Complete provider revenue system deployment
│   └── abis/              # Smart contract ABIs for provider integration  
├── resources/             # Research materials and references
│   ├── RESOURCES.md       # Resource guide and AI assistants
│   └── [research folders] # eERC-20, FlowMCP, MCP documentation
└── [implementation]       # PrivateShare implementation for provider revenue distribution
```

## ⚡ **Quick Start for API Providers**

**1. Connect to Avalanche Fuji Testnet**
- Network: `https://api.avax-test.network/ext/bc/C/rpc`
- Chain ID: `43113`  
- Get testnet AVAX: [Avalanche Faucet](https://faucet.avax.network/)

**2. Register as API Provider**
- View registration contract: [Registrar on Snowtrace](https://testnet.snowtrace.io/address/0x8664516a027B96F024C68bF44A8c9D44380510B6#readContract)
- Generate provider keys for private payouts
- Join FlowMCP provider ecosystem

**3. Receive Private Revenue**
- Encrypted payouts via: [EncryptedERC Contract](https://testnet.snowtrace.io/address/0x10f9f3F9b014aD4776AFb3B63F67bA06CA65c0D8#readContract)
- Micro-precision payments (0.000001 USDC minimum)
- Competitor-blind earnings (only you see your revenue)
- Pull-model: claim anytime on-chain

**4. Developer Integration**
- ABIs available in `deployment/abis/` folder
- Provider integration guide: [DEPLOYMENT.md](deployment/DEPLOYMENT.md)
- FlowMCP backend integration APIs

## 🏆 Hackathon Context

**hack2build Privacy Edition** - ✅ Stage 1 COMPLETED (August 23, 2025)

**Current Status**: PrivateShare Revenue Distribution System deployed and ready for API ecosystem integration!

## 💡 **Key Innovations**

### 🎯 **Micro-Precision Revenue Sharing**
- **USDC 6-decimal precision**: Down to 0.000001 USDC payouts
- **Fair distribution**: Even smallest API calls generate provider revenue
- **No minimum thresholds**: Every provider gets compensated fairly

### 🔒 **Competitor-Blind Earnings**  
- **Private payouts**: Competitors cannot see your revenue
- **Strategic advantage**: Business intelligence protection via eERC-20 encryption
- **Selective transparency**: Only auditor can verify totals for compliance

### ⚡ **Modern On-Chain Pull Model**
- **Always ready**: Encrypted earnings wait on-chain for provider pickup
- **No backend dependency**: Claim anytime, even if backend is offline  
- **Decentralized**: Fully on-chain revenue distribution system

---

*For complete PrivateShare provider integration details, start with [Project Overview](about/PROJECT.md)*