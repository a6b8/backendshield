# eERC-20 Privacy Token System - Public Deployment

[![Avalanche Fuji Testnet](https://img.shields.io/badge/Network-Avalanche%20Fuji%20Testnet-red)](https://testnet.snowtrace.io/)
[![Contract Verified](https://img.shields.io/badge/Contract-Verified-green)](https://testnet.snowtrace.io/address/0x10f9f3F9b014aD4776AFb3B63F67bA06CA65c0D8#code)
[![Zero Knowledge](https://img.shields.io/badge/ZK-Groth16%20Proofs-blue)](#zero-knowledge-technology)
[![Privacy First](https://img.shields.io/badge/Privacy-First-purple)](#privacy-features)

**Deployed on**: August 23, 2025  
**Network**: Avalanche Fuji Testnet (Chain ID: 43113)  
**Technology**: Zero-Knowledge Privacy Token System with homomorphic encryption

---

## 🎯 **System Overview**

This is a production-ready **eERC-20 (Encrypted ERC-20)** privacy token system that enables private transactions while maintaining regulatory compliance through auditor capabilities. The system uses advanced zero-knowledge proofs (Groth16) and homomorphic encryption to hide transaction amounts while preserving transaction validity.

### **🔐 Key Features**
- **Private Transactions**: Transaction amounts hidden from public view
- **Zero-Knowledge Proofs**: Cryptographic validity without revealing details  
- **Regulatory Compliance**: Auditor can decrypt transactions when needed
- **ERC-20 Compatibility**: Seamless integration with existing token infrastructure
- **Converter Mode**: Wrap existing ERC-20 tokens with privacy features

---

## 📍 **Contract Addresses (Avalanche Fuji Testnet)**

### **🏦 Core System Contracts**

| Contract | Address | Snowtrace Link | Purpose |
|----------|---------|----------------|---------|
| **EncryptedERC** | `0x10f9f3F9b014aD4776AFb3B63F67bA06CA65c0D8` | [Contract Read](https://testnet.snowtrace.io/address/0x10f9f3F9b014aD4776AFb3B63F67bA06CA65c0D8#readContract) | Main privacy token contract |
| **Registrar** | `0x8664516a027B96F024C68bF44A8c9D44380510B6` | [Contract Read](https://testnet.snowtrace.io/address/0x8664516a027B96F024C68bF44A8c9D44380510B6#readContract) | User registration system |

### **🪙 ERC-20 Test Tokens**

| Token | Symbol | Address | Supply | Snowtrace Link |
|-------|--------|---------|---------|----------------|
| **AvaxTest** | AVAXTEST | `0xE127F315482424aAE644CB10ec156b7574aCF2e1` | 10,000 | [Contract Read](https://testnet.snowtrace.io/address/0xE127F315482424aAE644CB10ec156b7574aCF2e1#readContract) |
| **backendShield** | BSHIELD | `0xeD8186eDB85f63A35e57114bcCaA7Dfb6E5aCdA1` | 1,000,000 | [Contract Read](https://testnet.snowtrace.io/address/0xeD8186eDB85f63A35e57114bcCaA7Dfb6E5aCdA1#readContract) |

### **🔐 Zero-Knowledge Proof Verifiers**

| Verifier | Address | Snowtrace Link | Operations |
|----------|---------|----------------|------------|
| **Registration** | `0xb460d0B00c0122294D28fbcdCA03625B85d829b9` | [Contract Read](https://testnet.snowtrace.io/address/0xb460d0B00c0122294D28fbcdCA03625B85d829b9#readContract) | User identity proofs |
| **Mint** | `0xE4E3C131F6b530Ffc7FD3282aA3476c035C173E2` | [Contract Read](https://testnet.snowtrace.io/address/0xE4E3C131F6b530Ffc7FD3282aA3476c035C173E2#readContract) | Private token creation |
| **Withdraw** | `0x8F8fA911b8Fb5A56D4895dCe199E7B1dEF188994` | [Contract Read](https://testnet.snowtrace.io/address/0x8F8fA911b8Fb5A56D4895dCe199E7B1dEF188994#readContract) | Private → Public conversion |
| **Transfer** | `0x78FDdc7D98775Ef378b86e11Ee7eBf72CcF22544` | [Contract Read](https://testnet.snowtrace.io/address/0x78FDdc7D98775Ef378b86e11Ee7eBf72CcF22544#readContract) | Private transfers |
| **Burn** | `0xd63ECF5507277A5bA6109Fe90699E638aa1ea352` | [Contract Read](https://testnet.snowtrace.io/address/0xd63ECF5507277A5bA6109Fe90699E638aa1ea352#readContract) | Private token destruction |

### **📚 Cryptographic Libraries**

| Library | Address | Snowtrace Link | Purpose |
|---------|---------|----------------|---------|
| **BabyJubJub** | `0xaDfB3606ee2A6cc3cC6435837Ec6e5Fa1DB4afAE` | [Contract Read](https://testnet.snowtrace.io/address/0xaDfB3606ee2A6cc3cC6435837Ec6e5Fa1DB4afAE#readContract) | Elliptic curve operations |

---

## 🛠️ **Technical Architecture**

### **Zero-Knowledge Technology**

The system implements **Groth16 zero-knowledge proofs** with the following circuit constraints:

| Circuit | Constraints | Purpose |
|---------|-------------|---------|
| **BurnCircuit** | 16,380 | Private token burning |
| **MintCircuit** | 16,709 | Private token minting |
| **RegistrationCircuit** | 1,797 | User identity verification |
| **TransferCircuit** | 26,636 | Private transfers between users |
| **WithdrawCircuit** | 12,276 | Converting encrypted → public tokens |

### **Cryptographic Specifications**

- **Proving System**: Groth16 with trusted setup
- **Elliptic Curve**: BabyJubJub (compatible with circom)
- **Hash Function**: Poseidon (ZK-friendly)
- **Encryption**: Homomorphic ElGamal on elliptic curve
- **Key Derivation**: Deterministic from user signatures

---

## 🔒 **Privacy Features**

### **What is Hidden**
- ✅ **Transaction Amounts**: Completely encrypted and hidden
- ✅ **Balance Information**: User balances are encrypted
- ✅ **Transfer Details**: Amount transfers are private

### **What is Public**
- 📊 **Transaction Existence**: That a transaction occurred
- 👥 **Participant Addresses**: Sender and receiver addresses
- ⏰ **Timestamps**: When transactions were executed
- 🔍 **Proof Validity**: Mathematical proof of transaction correctness

### **Regulatory Compliance**
- **Auditor System**: Designated auditor can decrypt transaction amounts
- **Audit Trail**: Complete transaction history for compliance
- **Selective Disclosure**: Auditor access without compromising user privacy

---

## 👥 **System Roles & Demo Accounts**

The deployed system includes configured accounts for testing and demonstration:

### **🔍 Auditor Account**
- **Address**: `0x7E11f1Ad5b3176BC27049FC74e1725E941C1A457`
- **Role**: System auditor with decryption capabilities
- **Permissions**: Can decrypt transaction amounts for compliance
- **Explorer**: [View on Snowtrace](https://testnet.snowtrace.io/address/0x7E11f1Ad5b3176BC27049FC74e1725E941C1A457)

### **👤 Demo User Account**
- **Address**: `0xf3d4E353390d073D408ca0D5D02B3E712C0E669a`
- **Role**: Registered system user
- **Permissions**: Can perform private transactions
- **Explorer**: [View on Snowtrace](https://testnet.snowtrace.io/address/0xf3d4E353390d073D408ca0D5D02B3E712C0E669a)

### **🔑 Account Status**
Both accounts are **fully registered** in the system with:
- ✅ Cryptographic key pairs generated
- ✅ Zero-knowledge registration proofs submitted
- ✅ On-chain registration completed
- ✅ Ready for private transactions

> **Note**: These are demonstration accounts on testnet. For production use, generate your own secure key pairs and register new accounts.

---

## 💡 **Use Cases**

### **🏦 Financial Applications**
- Private salary payments
- Confidential business transactions
- Regulated financial instruments with privacy

### **🎮 Gaming & NFTs**
- Private in-game economies
- Hidden auction bidding
- Confidential marketplace transactions

### **🏢 Enterprise Solutions**
- Private inter-company payments
- Confidential supply chain payments
- Privacy-preserving loyalty programs

---

## 🚀 **Getting Started**

### **Interacting with the System**

#### **1. Registration**
Users must register their cryptographic public keys:
```solidity
// Register user with zero-knowledge proof
registrar.register(publicKeyX, publicKeyY, proof)
```

#### **2. Deposit (ERC-20 → Private)**
Convert public ERC-20 tokens to private encrypted tokens:
```solidity
// Approve and deposit tokens
erc20.approve(encryptedERC, amount)
encryptedERC.deposit(tokenId, amount, proof)
```

#### **3. Private Transfer**
Transfer encrypted tokens between users:
```solidity
// Private transfer with zero-knowledge proof
encryptedERC.transfer(to, encryptedAmount, proof)
```

#### **4. Withdraw (Private → ERC-20)**
Convert private tokens back to public ERC-20:
```solidity
// Withdraw with zero-knowledge proof
encryptedERC.withdraw(tokenId, amount, proof)
```

### **Network Configuration**

```javascript
// Avalanche Fuji Testnet
const network = {
  chainId: 43113,
  rpcUrl: "https://api.avax-test.network/ext/bc/C/rpc",
  explorer: "https://testnet.snowtrace.io/"
}
```

---

## 🛡️ **Security Information**

### **Audit Status**
- **Code Verification**: ✅ All contracts verified on Snowtrace
- **Zero-Knowledge Circuits**: ✅ Implemented with established circom libraries
- **Cryptographic Libraries**: ✅ Using battle-tested BabyJubJub and Poseidon

### **Known Limitations**
- **Testnet Only**: This deployment is for testing and development
- **Performance**: ZK proof generation takes 1-5 seconds per transaction
- **Gas Costs**: Higher gas costs due to cryptographic operations

### **Security Best Practices**
- Never share private keys or signatures
- Verify all contract addresses before interaction
- Use hardware wallets for production systems
- Validate zero-knowledge proofs independently

---

## 📊 **System Statistics**

- **Total Deployment Time**: ~8 minutes
- **ZK Circuit Compilation**: ~6 minutes
- **Trusted Setup Size**: ~42 MB of cryptographic keys
- **Contract Verification**: ✅ 100% verified on Snowtrace

---

## 🔗 **Links & Resources**

### **🔍 Block Explorer**
- **Snowtrace (Fuji Testnet)**: https://testnet.snowtrace.io/
- **Main Contract on Explorer**: https://testnet.snowtrace.io/address/0x10f9f3F9b014aD4776AFb3B63F67bA06CA65c0D8

### **🚰 Development Tools**
- **Avalanche Fuji Faucet**: https://faucet.avax.network/
- **Circom Documentation**: https://docs.circom.io/
- **eERC-20 Specification**: Based on Avalanche's eERC proposal

### **📊 Quick Explorer Links**

#### **🏦 EncryptedERC System**
- **Contract Read Functions**: https://testnet.snowtrace.io/address/0x10f9f3F9b014aD4776AFb3B63F67bA06CA65c0D8#readContract
- **Contract Write Functions**: https://testnet.snowtrace.io/address/0x10f9f3F9b014aD4776AFb3B63F67bA06CA65c0D8#writeContract
- **All Transactions**: https://testnet.snowtrace.io/address/0x10f9f3F9b014aD4776AFb3B63F67bA06CA65c0D8#transactions
- **Event Logs**: https://testnet.snowtrace.io/address/0x10f9f3F9b014aD4776AFb3B63F67bA06CA65c0D8#events

#### **🪙 ERC-20 Tokens**
- **AvaxTest (AVAXTEST)**: https://testnet.snowtrace.io/address/0xE127F315482424aAE644CB10ec156b7574aCF2e1#readContract
- **backendShield (BSHIELD)**: https://testnet.snowtrace.io/address/0xeD8186eDB85f63A35e57114bcCaA7Dfb6E5aCdA1#readContract

---

## 📦 **Developer Resources**

### **🔧 Smart Contract ABIs**

Complete ABI package for developers is available in the `public-abis/` folder:

```
public-abis/
├── README.md                    # Complete ABI documentation
├── encrypted-erc20/            # Privacy system ABIs
│   ├── core-contracts/         # EncryptedERC, Registrar
│   ├── verifiers/             # All ZK proof verifiers
│   ├── libraries/             # BabyJubJub cryptography
│   └── README.md              # Privacy system guide
└── erc20-tokens/              # Standard ERC-20 ABIs
    ├── SimpleERC20.json       # Test token ABI
    └── README.md              # Token integration guide
```

### **📚 Quick Integration**

**JavaScript/TypeScript Integration:**
```javascript
import { ethers } from 'ethers'

// Privacy system contracts
import EncryptedERCABI from './public-abis/encrypted-erc20/core-contracts/EncryptedERC.json'
import RegistrarABI from './public-abis/encrypted-erc20/core-contracts/Registrar.json'

// ERC-20 tokens
import SimpleERC20ABI from './public-abis/erc20-tokens/SimpleERC20.json'

// Connect to Avalanche Fuji Testnet
const provider = new ethers.JsonRpcProvider('https://api.avax-test.network/ext/bc/C/rpc')
const wallet = new ethers.Wallet('YOUR_PRIVATE_KEY', provider)

// Initialize contracts
const encryptedERC = new ethers.Contract(
    '0x10f9f3F9b014aD4776AFb3B63F67bA06CA65c0D8',
    EncryptedERCABI,
    wallet
)

const backendShieldToken = new ethers.Contract(
    '0xeD8186eDB85f63A35e57114bcCaA7Dfb6E5aCdA1',
    SimpleERC20ABI,
    wallet
)

console.log('✅ Privacy token system ready!')
```

**Python Integration:**
```python
from web3 import Web3
import json

# Load ABIs
with open('public-abis/encrypted-erc20/core-contracts/EncryptedERC.json') as f:
    encrypted_erc_abi = json.load(f)

with open('public-abis/erc20-tokens/SimpleERC20.json') as f:
    erc20_abi = json.load(f)

# Connect to network
w3 = Web3(Web3.HTTPProvider('https://api.avax-test.network/ext/bc/C/rpc'))

# Create contract instances
encrypted_erc = w3.eth.contract(
    address='0x10f9f3F9b014aD4776AFb3B63F67bA06CA65c0D8',
    abi=encrypted_erc_abi
)

backend_shield = w3.eth.contract(
    address='0xeD8186eDB85f63A35e57114bcCaA7Dfb6E5aCdA1', 
    abi=erc20_abi
)
```

### **🚀 Getting Started**

1. **Clone ABIs**: Download the `public-abis/` folder
2. **Review Documentation**: Read `public-abis/README.md` for complete integration guide
3. **Network Setup**: Configure Avalanche Fuji Testnet (Chain ID: 43113)
4. **Test Integration**: Start with ERC-20 tokens before privacy features
5. **Generate ZK Proofs**: Use circom circuits for privacy operations

### **📖 Detailed Documentation**

| Resource | Location | Description |
|----------|----------|-------------|
| **Complete ABI Guide** | `public-abis/README.md` | All contract ABIs with examples |
| **Privacy System** | `public-abis/encrypted-erc20/` | Zero-knowledge privacy contracts |
| **Token Integration** | `public-abis/erc20-tokens/` | Standard ERC-20 token ABIs |
| **ZK Verifiers** | `public-abis/encrypted-erc20/verifiers/` | Proof verification contracts |
| **Cryptography** | `public-abis/encrypted-erc20/libraries/` | BabyJubJub elliptic curve |

---

## ⚠️ **Disclaimer**

This is a **testnet deployment** for research and development purposes. Do not use with real funds or in production environments without proper security audits. The system is provided "as-is" for educational and development purposes.

**Deployed by**: Privacy-focused blockchain development team  
**License**: Educational use only  
**Support**: Community-driven development

---

*Built with ❤️ for privacy-preserving blockchain technology*