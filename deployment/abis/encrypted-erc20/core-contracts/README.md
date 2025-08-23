# Core Contracts ABIs

This folder contains the ABIs for the core privacy system contracts in the eERC-20 system.

## EncryptedERC

**Contract**: `contracts/EncryptedERC.sol`  
**Address**: `0x10f9f3F9b014aD4776AFb3B63F67bA06CA65c0D8`  
**Purpose**: Main privacy token contract with encrypted balance management

### Key Features

- **Private Deposits**: Convert ERC-20 tokens to encrypted balances
- **Private Transfers**: Transfer encrypted amounts between users
- **Private Withdrawals**: Convert encrypted balances back to ERC-20
- **Auditor Support**: Designated auditor can decrypt amounts for compliance
- **Multi-Token Support**: Support for multiple ERC-20 tokens simultaneously

### Main Functions

```typescript
// Check if user is registered
isUserRegistered(user: address): boolean

// Deposit ERC-20 tokens for privacy (requires ZK proof)
deposit(tokenId: uint256, amount: uint256, proof: ProofData): Transaction

// Private transfer between users (requires ZK proof)  
transfer(to: address, encryptedAmount: EncryptedAmount, proof: ProofData): Transaction

// Withdraw encrypted tokens to ERC-20 (requires ZK proof)
withdraw(tokenId: uint256, amount: uint256, proof: ProofData): Transaction

// Get user's encrypted balance
getEncryptedBalance(user: address): EncryptedBalance

// Get auditor's address
getAuditorAddress(): address
```

## Registrar

**Contract**: `contracts/Registrar.sol`  
**Address**: `0x8664516a027B96F024C68bF44A8c9D44380510B6`  
**Purpose**: User registration system with cryptographic key management

### Key Features

- **Zero-Knowledge Registration**: Register using ZK proof without revealing private keys
- **Public Key Storage**: Store BabyJubJub public keys for encryption
- **Registration Status**: Track which users are registered in the system
- **Cryptographic Validation**: Verify registration proofs on-chain

### Main Functions

```typescript
// Register user with ZK proof of key ownership
register(publicKeyX: uint256, publicKeyY: uint256, proof: ProofData): Transaction

// Check if user is registered
isUserRegistered(user: address): boolean

// Get user's public key for encryption
getUserPublicKey(user: address): [uint256, uint256]

// Get registration timestamp
getUserRegistrationTime(user: address): uint256
```

## Usage Examples

### JavaScript/TypeScript Integration

```javascript
import { ethers } from 'ethers'
import EncryptedERCABI from './EncryptedERC.json'
import RegistrarABI from './Registrar.json'

// Connect to contracts
const provider = new ethers.JsonRpcProvider('https://api.avax-test.network/ext/bc/C/rpc')
const wallet = new ethers.Wallet('YOUR_PRIVATE_KEY', provider)

const encryptedERC = new ethers.Contract(
    '0x10f9f3F9b014aD4776AFb3B63F67bA06CA65c0D8',
    EncryptedERCABI,
    wallet
)

const registrar = new ethers.Contract(
    '0x8664516a027B96F024C68bF44A8c9D44380510B6', 
    RegistrarABI,
    wallet
)

// Check if user needs registration
const isRegistered = await registrar.isUserRegistered(userAddress)
if (!isRegistered) {
    console.log('User must register first')
    // Generate keys and registration proof...
    // await registrar.register(pubKeyX, pubKeyY, proof)
}

// Private deposit flow
const tokenId = 0 // ERC-20 token index
const amount = ethers.parseEther('100')

// Generate ZK proof for deposit...
const depositProof = generateDepositProof(...)

// Execute private deposit
const tx = await encryptedERC.deposit(tokenId, amount, depositProof)
await tx.wait()

console.log('Private deposit completed!')
```

### Event Monitoring

```javascript
// Listen for private transfers
encryptedERC.on('PrivateTransfer', (from, to, encryptedAmount, auditorPCT, auditorAddress, event) => {
    console.log(`Private transfer from ${from} to ${to}`)
    console.log(`Encrypted amount: ${encryptedAmount}`)
    console.log(`Auditor address: ${auditorAddress}`)
})

// Listen for registrations
registrar.on('UserRegistered', (user, publicKeyX, publicKeyY, timestamp, event) => {
    console.log(`New user registered: ${user}`)
    console.log(`Public key: (${publicKeyX}, ${publicKeyY})`)
})
```

## Privacy Considerations

### What is Hidden
- ✅ **Transaction amounts** - Completely encrypted
- ✅ **User balances** - Stored as encrypted ciphertexts
- ✅ **Transfer details** - Amounts are zero-knowledge

### What is Public
- 📊 **Transaction existence** - That transfers occurred
- 👥 **Participant addresses** - Sender and receiver addresses  
- ⏰ **Timestamps** - When transactions happened
- 🔍 **Proof validity** - Mathematical proof verification

### Auditor System
- **Compliance**: Designated auditor can decrypt transaction amounts
- **Selective**: Only auditor has decryption capability
- **Transparent**: Auditor address is public in events

## Network Information

- **Network**: Avalanche Fuji Testnet
- **Chain ID**: 43113
- **Gas Limit**: 500,000+ recommended for ZK operations
- **Confirmation**: Wait for transaction confirmation before proceeding