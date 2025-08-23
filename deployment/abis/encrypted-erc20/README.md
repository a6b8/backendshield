# Encrypted ERC-20 Privacy System ABIs

This folder contains all ABIs for the eERC-20 privacy token system contracts deployed on Avalanche Fuji Testnet.

## 📁 Folder Structure

```
encrypted-erc20/
├── README.md                   # This documentation
├── core-contracts/             # Main privacy system contracts
│   ├── EncryptedERC.json      # Privacy token contract
│   ├── Registrar.json         # User registration system
│   └── README.md              # Core contracts documentation
├── verifiers/                  # Zero-knowledge proof verifiers
│   ├── RegistrationVerifier.json
│   ├── MintVerifier.json
│   ├── WithdrawVerifier.json
│   ├── TransferVerifier.json
│   ├── BurnVerifier.json
│   └── README.md              # Verifiers documentation
└── libraries/                  # Cryptographic libraries
    ├── BabyJubJub.json        # Elliptic curve operations
    └── README.md              # Libraries documentation
```

## 🎯 System Overview

The eERC-20 system enables privacy-preserving token transactions through zero-knowledge proofs and homomorphic encryption. All transaction amounts are hidden while maintaining regulatory compliance through auditor capabilities.

### **🔐 Key Components**

| Component | Purpose | Folder |
|-----------|---------|--------|
| **EncryptedERC** | Main privacy token contract | `core-contracts/` |
| **Registrar** | User registration with ZK proofs | `core-contracts/` |
| **ZK Verifiers** | Proof verification contracts | `verifiers/` |
| **BabyJubJub** | Elliptic curve cryptography | `libraries/` |

### **🚀 Privacy Features**

- ✅ **Hidden Amounts**: Transaction values encrypted
- ✅ **Zero-Knowledge**: Validity proofs without data exposure
- ✅ **Regulatory Compliance**: Auditor decryption capability
- ✅ **Multi-Token**: Support for multiple ERC-20 tokens
- ✅ **Homomorphic**: Encrypted arithmetic operations

## 📊 Contract Addresses (Avalanche Fuji)

### Core Privacy Contracts
| Contract | Address |
|----------|---------|
| **EncryptedERC** | `0x10f9f3F9b014aD4776AFb3B63F67bA06CA65c0D8` |
| **Registrar** | `0x8664516a027B96F024C68bF44A8c9D44380510B6` |

### Zero-Knowledge Verifiers
| Verifier | Address | Constraints |
|----------|---------|-------------|
| **Registration** | `0xb460d0B00c0122294D28fbcdCA03625B85d829b9` | 1,797 |
| **Mint** | `0xE4E3C131F6b530Ffc7FD3282aA3476c035C173E2` | 16,709 |
| **Withdraw** | `0x8F8fA911b8Fb5A56D4895dCe199E7B1dEF188994` | 12,276 |
| **Transfer** | `0x78FDdc7D98775Ef378b86e11Ee7eBf72CcF22544` | 26,636 |
| **Burn** | `0xd63ECF5507277A5bA6109Fe90699E638aa1ea352` | 16,380 |

### Cryptographic Libraries
| Library | Address |
|---------|---------|
| **BabyJubJub** | `0xaDfB3606ee2A6cc3cC6435837Ec6e5Fa1DB4afAE` |

## 🛠️ Development Integration

### Complete Privacy System Setup

```javascript
import { ethers } from 'ethers'

// Import all ABIs
import EncryptedERCABI from './core-contracts/EncryptedERC.json'
import RegistrarABI from './core-contracts/Registrar.json'
import MintVerifierABI from './verifiers/MintVerifier.json'
import BabyJubJubABI from './libraries/BabyJubJub.json'

// Connect to Avalanche Fuji
const provider = new ethers.JsonRpcProvider('https://api.avax-test.network/ext/bc/C/rpc')
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider)

// Initialize all contracts
const contracts = {
    encryptedERC: new ethers.Contract(
        '0x10f9f3F9b014aD4776AFb3B63F67bA06CA65c0D8',
        EncryptedERCABI,
        wallet
    ),
    registrar: new ethers.Contract(
        '0x8664516a027B96F024C68bF44A8c9D44380510B6',
        RegistrarABI,
        wallet
    ),
    mintVerifier: new ethers.Contract(
        '0xE4E3C131F6b530Ffc7FD3282aA3476c035C173E2',
        MintVerifierABI,
        provider
    ),
    babyJubJub: new ethers.Contract(
        '0xaDfB3606ee2A6cc3cC6435837Ec6e5Fa1DB4afAE',
        BabyJubJubABI,
        provider
    )
}

console.log('✅ eERC-20 privacy system connected!')
```

### Full Privacy Transaction Flow

```javascript
async function privateTransactionFlow() {
    // 1. Check registration
    const isRegistered = await contracts.registrar.isUserRegistered(wallet.address)
    
    if (!isRegistered) {
        console.log('📝 Registering user...')
        // Generate keys and register
        // const registrationTx = await contracts.registrar.register(pubKeyX, pubKeyY, proof)
    }
    
    // 2. Private deposit
    console.log('🔒 Making private deposit...')
    const depositProof = generateDepositProof(/* ... */)
    const depositTx = await contracts.encryptedERC.deposit(0, amount, depositProof)
    await depositTx.wait()
    
    // 3. Private transfer
    console.log('💸 Private transfer...')
    const transferProof = generateTransferProof(/* ... */)
    const transferTx = await contracts.encryptedERC.transfer(recipient, encAmount, transferProof)
    await transferTx.wait()
    
    // 4. Private withdrawal
    console.log('🏦 Private withdrawal...')
    const withdrawProof = generateWithdrawProof(/* ... */)
    const withdrawTx = await contracts.encryptedERC.withdraw(0, amount, withdrawProof)
    await withdrawTx.wait()
    
    console.log('✅ Complete privacy transaction flow completed!')
}
```

## 🧮 Zero-Knowledge Proof Generation

Each operation requires generating appropriate zero-knowledge proofs:

```javascript
import { groth16 } from 'snarkjs'

// Registration proof
async function generateRegistrationProof(privateKey) {
    const input = { privateKey }
    const { proof, publicSignals } = await groth16.fullProve(
        input,
        'circuits/registration.wasm',
        'circuits/registration_final.zkey'
    )
    return formatProof(proof, publicSignals)
}

// Mint proof  
async function generateMintProof(amount, randomness) {
    const input = { amount, randomness }
    const { proof, publicSignals } = await groth16.fullProve(
        input,
        'circuits/mint.wasm', 
        'circuits/mint_final.zkey'
    )
    return formatProof(proof, publicSignals)
}

function formatProof(proof, publicSignals) {
    return {
        pA: [proof.pi_a[0], proof.pi_a[1]],
        pB: [[proof.pi_b[0][1], proof.pi_b[0][0]], [proof.pi_b[1][1], proof.pi_b[1][0]]],
        pC: [proof.pi_c[0], proof.pi_c[1]],
        publicSignals: publicSignals
    }
}
```

## 🔍 Privacy Analysis

### Information Hidden
- **Transaction amounts** - Completely encrypted
- **User balances** - Homomorphically encrypted  
- **Transfer patterns** - Only participants known
- **Spending behavior** - Amounts remain private

### Information Public
- **Transaction existence** - On-chain transactions visible
- **Participant addresses** - Sender/receiver addresses public
- **Timing** - Transaction timestamps visible
- **Proof validity** - Mathematical verification public

### Auditor Capabilities
- **Selective decryption** - Auditor can decrypt amounts
- **Compliance monitoring** - Regulatory oversight possible
- **Privacy preservation** - User privacy maintained from public

## ⚡ Performance Metrics

| Operation | Proof Gen Time | Gas Cost | Constraints |
|-----------|----------------|----------|-------------|
| Registration | ~0.5s | ~250k | 1,797 |
| Mint | ~2s | ~300k | 16,709 |
| Transfer | ~5s | ~400k | 26,636 |
| Withdraw | ~1.5s | ~280k | 12,276 |
| Burn | ~2s | ~300k | 16,380 |

## 🛡️ Security Considerations

- **Trusted Setup**: Each verifier uses cryptographic ceremony
- **Circuit Auditing**: ZK circuits based on established libraries
- **Key Management**: Secure private key storage essential
- **Proof Verification**: All proofs verified on-chain
- **Network Security**: Avalanche consensus protection

## 📖 Further Documentation

- **Core Contracts**: See `core-contracts/README.md`
- **ZK Verifiers**: See `verifiers/README.md`
- **Cryptographic Libraries**: See `libraries/README.md`
- **Full System Documentation**: See main `PUBLIC-DEPLOYMENT.md`

---

*Privacy-preserving blockchain technology built with zero-knowledge proofs*