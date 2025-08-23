# eERC-20 Smart Contract ABIs

This folder contains the Application Binary Interfaces (ABIs) for all deployed contracts in the eERC-20 Privacy Token System on Avalanche Fuji Testnet.

## 📋 **Available ABIs**

### **🔐 Encrypted ERC-20 Privacy System**

| Category | Folder | Description |
|----------|--------|-------------|
| **Privacy Contracts** | `encrypted-erc20/` | Complete zero-knowledge privacy token system |
| **Standard Tokens** | `erc20-tokens/` | ERC-20 test tokens for privacy integration |

#### **Privacy System Components**

| Component | ABI File | Address | Purpose |
|-----------|----------|---------|---------|
| **EncryptedERC** | `encrypted-erc20/core-contracts/EncryptedERC.json` | `0x10f9f3F9b014aD4776AFb3B63F67bA06CA65c0D8` | Main privacy token contract |
| **Registrar** | `encrypted-erc20/core-contracts/Registrar.json` | `0x8664516a027B96F024C68bF44A8c9D44380510B6` | User registration system |
| **ZK Verifiers** | `encrypted-erc20/verifiers/` | Various addresses | Zero-knowledge proof verification |
| **BabyJubJub** | `encrypted-erc20/libraries/BabyJubJub.json` | `0xaDfB3606ee2A6cc3cC6435837Ec6e5Fa1DB4afAE` | Elliptic curve operations |

#### **ERC-20 Test Tokens**

| Token | Symbol | ABI File | Address | Supply |
|-------|--------|----------|---------|--------|
| **AvaxTest** | AVAXTEST | `erc20-tokens/SimpleERC20.json` | `0xE127F315482424aAE644CB10ec156b7574aCF2e1` | 10,000 |
| **backendShield** | BSHIELD | `erc20-tokens/SimpleERC20.json` | `0xeD8186eDB85f63A35e57114bcCaA7Dfb6E5aCdA1` | 1,000,000 |

## 🚀 **Usage Examples**

### **JavaScript/TypeScript (ethers.js)**

```javascript
import { ethers } from 'ethers';
import EncryptedERCABI from './encrypted-erc20/core-contracts/EncryptedERC.json';

// Connect to Avalanche Fuji Testnet
const provider = new ethers.JsonRpcProvider('https://api.avax-test.network/ext/bc/C/rpc');
const wallet = new ethers.Wallet('YOUR_PRIVATE_KEY', provider);

// Create contract instance
const encryptedERC = new ethers.Contract(
  '0x10f9f3F9b014aD4776AFb3B63F67bA06CA65c0D8',
  EncryptedERCABI,
  wallet
);

// Read contract data
const name = await encryptedERC.name();
const symbol = await encryptedERC.symbol();
console.log(`Token: ${name} (${symbol})`);
```

### **Web3.js**

```javascript
import Web3 from 'web3';
import EncryptedERCABI from './encrypted-erc20/core-contracts/EncryptedERC.json';

const web3 = new Web3('https://api.avax-test.network/ext/bc/C/rpc');

const encryptedERC = new web3.eth.Contract(
  EncryptedERCABI,
  '0x10f9f3F9b014aD4776AFb3B63F67bA06CA65c0D8'
);

// Call contract methods
const result = await encryptedERC.methods.name().call();
console.log('Token name:', result);
```

### **Python (web3.py)**

```python
from web3 import Web3
import json

# Load ABI
with open('encrypted-erc20/core-contracts/EncryptedERC.json', 'r') as f:
    contract_abi = json.load(f)

# Connect to network
w3 = Web3(Web3.HTTPProvider('https://api.avax-test.network/ext/bc/C/rpc'))

# Create contract instance
contract = w3.eth.contract(
    address='0x10f9f3F9b014aD4776AFb3B63F67bA06CA65c0D8',
    abi=contract_abi
)

# Read contract data
name = contract.functions.name().call()
print(f"Token name: {name}")
```

## 🔧 **Key Functions**

### **EncryptedERC Main Functions**

```typescript
// Registration check
isUserRegistered(user: string): Promise<boolean>

// Private deposit (ERC20 → Encrypted)
deposit(tokenId: BigNumber, amount: BigNumber, proof: ProofData): Promise<Transaction>

// Private transfer
transfer(to: string, encryptedAmount: EncryptedAmount, proof: ProofData): Promise<Transaction>

// Private withdraw (Encrypted → ERC20)  
withdraw(tokenId: BigNumber, amount: BigNumber, proof: ProofData): Promise<Transaction>

// Get encrypted balance
getEncryptedBalance(user: string): Promise<EncryptedBalance>
```

### **Registrar Functions**

```typescript
// Register user with ZK proof
register(publicKeyX: BigNumber, publicKeyY: BigNumber, proof: ProofData): Promise<Transaction>

// Check registration status
isUserRegistered(user: string): Promise<boolean>

// Get user's public key
getUserPublicKey(user: string): Promise<[BigNumber, BigNumber]>
```

## 📊 **Event Signatures**

### **EncryptedERC Events**

```typescript
// Private transfer event
event PrivateTransfer(
  address indexed from,
  address indexed to, 
  uint256[7] encryptedAmount,
  uint256[7] auditorPCT,
  address indexed auditorAddress
);

// Private deposit event
event PrivateDeposit(
  address indexed user,
  uint256 indexed tokenId,
  uint256 amount,
  uint256[7] auditorPCT,
  address indexed auditorAddress
);

// Private withdraw event
event PrivateWithdraw(
  address indexed user,
  uint256 indexed tokenId, 
  uint256 amount,
  uint256[7] auditorPCT,
  address indexed auditorAddress
);
```

## 🛡️ **Security Notes**

- **Verify Contract Addresses**: Always double-check contract addresses before interactions
- **ABI Integrity**: These ABIs are extracted from verified contracts on Snowtrace
- **Network Configuration**: Ensure you're connected to Avalanche Fuji Testnet (Chain ID: 43113)
- **Gas Estimation**: ZK operations require higher gas limits (300k-500k recommended)

## 🔄 **Updates**

ABIs are generated from the deployed and verified contracts. Any contract upgrades will require new ABI versions.

**Last Updated**: August 23, 2025  
**Contract Version**: v1.0.0  
**Network**: Avalanche Fuji Testnet

---

*For more information, see the main [PUBLIC-DEPLOYMENT.md](../PUBLIC-DEPLOYMENT.md)*