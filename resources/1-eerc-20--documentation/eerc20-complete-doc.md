# Encrypted ERC-20 (eERC-20) Complete Documentation

## Table of Contents
1. [Executive Summary](#executive-summary)
2. [Core Concepts](#core-concepts)
3. [Protocol Architecture](#protocol-architecture)
4. [Operation Modes](#operation-modes)
5. [Key Operations](#key-operations)
6. [SDK Integration](#sdk-integration)
7. [Technical Implementation](#technical-implementation)
8. [Security & Compliance](#security-compliance)
9. [Performance Metrics](#performance-metrics)

---

## Executive Summary

### What is Encrypted ERC-20?
Encrypted ERC-20 (eERC) is a privacy-preserving token standard developed by AvaCloud that enables confidential transactions on EVM-compatible blockchains. It leverages zero-knowledge proofs (zk-SNARKs) and partially homomorphic encryption to keep transaction amounts and user balances private while maintaining verifiability.

### Key Features
- **Confidential Transactions**: Balances and transaction amounts remain completely hidden
- **Large Integer Support**: Handles token amounts up to 251 bits (2^251)
- **Client-Side Privacy**: Users control encryption/decryption on their devices
- **Fully On-chain**: No relayers or off-chain intermediaries required
- **Built-in Compliance**: Supports auditor keys for regulatory requirements
- **Dual-Mode Operation**: Create new private tokens or convert existing ERC-20s
- **Zero-Knowledge Proofs**: Efficient zk-SNARKs validate without revealing data
- **Chain Agnostic**: Deployable on any EVM-compatible blockchain
- **Encrypted Metadata**: Send arbitrary-length encrypted metadata with transactions

### Problem Solved
Encrypted ERC bridges the fundamental tension between blockchain transparency and privacy needs. While transparency ensures security and verification, it exposes sensitive financial information. eERC maintains verifiability while keeping transactions confidential, with optional auditor access for compliance.

---

## Core Concepts

### Privacy vs Transparency
Traditional ERC-20 tokens expose all balances and transfers publicly on the blockchain. Encrypted ERC uses cryptographic techniques to hide these details while allowing verification of transaction validity.

### Cryptographic Foundation
- **BabyJubJub Curve**: Elliptic curve for cryptographic operations
- **ElGamal Encryption**: Homomorphic encryption for balance privacy
- **Poseidon Hash**: Efficient hash function for zero-knowledge circuits
- **zk-SNARKs**: Zero-knowledge proofs for transaction validation

### Compliance Framework
Designated auditors can access transaction details through auditor keys, balancing privacy with regulatory requirements. This enables:
- Regulatory oversight when required
- User privacy from general public
- Selective disclosure mechanisms

---

## Protocol Architecture

### Core Contracts

#### EncryptedERC (Main Contract)
- Implements privacy-preserving ERC-20 functionality
- Handles private token operations (mint, burn, transfer)
- Manages encrypted balance storage
- Integrates with other protocol components

#### Registrar
- Manages user registration and public key association
- Validates user identities
- Stores registration proofs
- Handles public key management

#### EncryptedUserBalances
- Stores encrypted balances
- Manages balance updates in encrypted form
- Ensures balance privacy
- Handles encrypted balance verification

#### TokenTracker
- Tracks registered tokens (Converter mode)
- Manages token metadata
- Handles token blacklisting
- Assigns unique token IDs

#### AuditorManager
- Manages auditor permissions
- Stores auditor public keys
- Provides compliance functionality

### Zero-Knowledge Circuits

#### Registration Circuit
```solidity
type RegistrationCircuit struct {
    Sender RegistrationSender
}
```
- Validates user registration
- Verifies public key derivation
- Checks registration hash (Poseidon Hash of chain ID, private key, address)

#### Mint Circuit
```solidity
type MintCircuit struct {
    Receiver      Receiver
    Auditor       Auditor
    MintNullifier MintNullifier
    ValueToMint   frontend.Variable
}
```
- Verifies minting operations
- Ensures proper encryption for receiver and auditor
- Prevents double-spending with nullifiers

#### Transfer Circuit
```solidity
type TransferCircuit struct {
    Sender          Sender
    Receiver        Receiver
    Auditor         Auditor
    ValueToTransfer frontend.Variable
}
```
- Validates private transfers
- Verifies sender balance sufficiency
- Creates encrypted records for all parties

#### Withdraw Circuit
```solidity
type WithdrawCircuit struct {
    Sender      WithdrawSender
    Auditor     Auditor
    ValueToBurn frontend.Variable `gnark:",public"`
}
```
- Verifies withdrawal operations
- Validates balance sufficiency
- Creates auditor records

---

## Operation Modes

### Standalone Mode
Creates entirely new private ERC-20 tokens with built-in privacy:
- **Private Minting**: Create tokens privately, total supply remains hidden
- **Private Burning**: Remove tokens from circulation privately
- **Better Privacy**: Total supply always remains private
- **Use Case**: New tokens requiring complete privacy from inception

### Converter Mode
Adds privacy features to existing ERC-20 tokens:
- **Deposit**: Convert public ERC-20 to private version
- **Withdraw**: Convert private tokens back to public
- **Token Tracking**: Manages multiple ERC-20 tokens with unique IDs
- **Compatibility**: Maintains original token properties
- **Use Case**: Existing tokens needing optional privacy

---

## Key Operations

### Registration
Before participating in encrypted operations, users must register:
1. Generate unique keypair (encryption key stored on-chain, decryption key kept private)
2. Keys are independent of blockchain account keys
3. Registration validated through zero-knowledge proof
4. One registration per L1 blockchain required

### Encrypted Balance Management

#### Balance Structure
```solidity
struct EncryptedBalance {
    EGCT eGCT;                                    // ElGamal Ciphertext
    mapping(uint256 => BalanceHistory) balanceList;
    uint256 nonce;                                // Invalidates old states
    uint256 transactionIndex;                     // Current balance state
    uint256[7] balancePCT;                        // Poseidon Ciphertext
    AmountPCT[] amountPCTs;                       // Transaction history
}
```

#### Balance Tracking System
- **balanceList**: Validates if ciphertext in proof is current
- **nonce**: O(1) invalidation of old balance states
- **transactionIndex**: Precise tracking of per-deposit records
- **Hash Computation**: `hash = keccak256(eGCT ‖ nonce)`

### Deposit (Converter Mode Only)
No zero-knowledge proof required - converting public to private:
1. Check if token is registered (auto-register if new)
2. Handle decimal adjustments between tokens
3. Create encrypted balance using ElGamal encryption
4. Use homomorphic addition for subsequent deposits
5. Track and return dust amounts

#### Decimal Adjustment
```solidity
if (tokenDecimals > decimals) {
    uint256 scalingFactor = 10 ** (tokenDecimals - decimals);
    value = _amount / scalingFactor;
    dust = _amount % scalingFactor;
} else if (tokenDecimals < decimals) {
    uint256 scalingFactor = 10 ** (decimals - tokenDecimals);
    value = _amount * scalingFactor;
    dust = 0;
}
```

### Private Mint (Standalone Mode Only)
Owner-only operation for creating new encrypted tokens:
1. Generate zero-knowledge proof with mint circuit
2. Validate receiver's encrypted value
3. Check mint nullifier (prevents double-spending)
4. Homomorphically add to receiver's balance
5. Update balancePCT and create audit trail

### Private Transfer
Confidential token transfers between users:
1. Prove sender has sufficient balance (without revealing amount)
2. Verify sender identity via key pair
3. Create encrypted values (negative for sender, positive for receiver)
4. Update both parties' encrypted balances
5. Generate AmountPCT for receiver
6. Create encrypted audit summary

### Withdrawal (Converter Mode)
Convert private tokens back to public ERC-20:
1. Generate proof of sufficient balance
2. Update encrypted balance (subtract amount)
3. Handle decimal conversions
4. Transfer public ERC-20 tokens to user
5. Amount becomes public (marked in circuit)

### Private Burn (Standalone Mode)
Remove tokens from circulation privately:
1. Prove balance sufficiency
2. Update encrypted balance
3. Maintain privacy of burn amount
4. Create audit record

---

## SDK Integration

### Installation
```bash
npm install @avalabs/eerc-sdk
# or
pnpm install @avalabs/eerc-sdk
# or
yarn add @avalabs/eerc-sdk
```

### Core Hooks

#### useEERC Hook
Main entry point for SDK initialization:

```javascript
const {
    // State
    isInitialized,
    isAllDataFetched,
    isRegistered,
    isConverter,
    publicKey,
    auditorAddress,
    owner,
    auditorPublicKey,
    isAuditorKeySet,
    name,
    symbol,
    isDecryptionKeySet,
    areYouAuditor,
    hasBeenAuditor,

    // Actions
    generateDecryptionKey,
    register,
    auditorDecrypt,
    isAddressRegistered,
    useEncryptedBalance,
    refetchEercUser,
    refetchAuditor,
    setContractAuditorPublicKey,
} = useEERC(
    publicClient,
    walletClient,
    contractAddress,
    circuitURLs,
    decryptionKey // optional
);
```

##### Circuit URLs Structure
```javascript
{
  register: { wasm: string, zkey: string },
  transfer: { wasm: string, zkey: string },
  mint: { wasm: string, zkey: string },
  withdraw: { wasm: string, zkey: string },
  burn: { wasm: string, zkey: string }
}
```

#### useEncryptedBalance Hook
Manages encrypted token balances:

```javascript
const {
    // State
    decryptedBalance,
    parsedDecryptedBalance,
    encryptedBalance,
    auditorPublicKey,
    decimals,
    
    // Functions
    privateMint,
    privateBurn,
    privateTransfer,
    withdraw,
    deposit,
    decryptMessage,
    decryptTransaction,
    refetchBalance
} = useEncryptedBalance(tokenAddress?) // tokenAddress required for converter mode
```

### Key Methods

#### Registration & Setup
- `generateDecryptionKey()`: Generate user's decryption key
- `register()`: Register user with protocol (returns key & txHash)
- `setContractAuditorPublicKey(address)`: Set auditor (owner only)

#### Token Operations
- `privateMint(recipient, amount, message?)`: Mint encrypted tokens
- `privateTransfer(to, amount, message?)`: Transfer privately
- `privateBurn(amount, message?)`: Burn tokens privately
- `deposit(amount, message?)`: Convert public to private (converter)
- `withdraw(amount, message?)`: Convert private to public (converter)

#### Decryption & Auditing
- `decryptMessage(txHash)`: Decrypt transaction message
- `decryptTransaction(txHash)`: Decrypt transaction details
- `auditorDecrypt()`: Decrypt as auditor (auditor only)

### Important Notes
- Decryption key requires deterministic wallet (seed-based)
- WASM files need correct URL formatting (local: `/path`, remote: full URL)
- One registration per L1 blockchain
- Standalone mode supported in official transfer app

---

## Technical Implementation

### File Structure
```
contracts/
├── EncryptedERC.sol          # Main contract
├── Registrar.sol             # User registration
├── EncryptedUserBalances.sol # Balance handling
├── tokens/TokenTracker.sol   # Token management
├── auditor/AuditorManager.sol # Auditor functionality
├── libraries/BabyJubJub.sol  # Cryptographic operations
├── types/Types.sol           # Data structures
├── interfaces/               # Contract interfaces
└── verifiers/                # ZK proof verifiers

circom/                       # Zero-knowledge circuits
scripts/                      # Deployment scripts
src/                         # TypeScript utilities
tests/                       # Test suites
```

### Setup Requirements
- NodeJS >= v22.x
- Circom >= 2.1.9

### Installation & Compilation
```bash
# Clone repository
git clone https://github.com/ava-labs/EncryptedERC.git

# Install dependencies
npm install

# Compile contracts
npx hardhat compile

# Compile circuits
npx hardhat zkit make --force
npx hardhat zkit verifiers
```

### Deployment

#### Standalone Mode
```bash
npx hardhat node
npx hardhat run scripts/deploy-standalone.ts --network localhost
```

#### Converter Mode
```bash
npx hardhat node
npx hardhat run scripts/deploy-converter.ts --network localhost
```

### Testing
```bash
# Run tests
npx hardhat test

# Coverage report
npx hardhat coverage
```

---

## Security & Compliance

### Security Audits
1. **Circom Audit** (March 2025)
   - Scope: Zero-knowledge circuits
   - Report: avacloud-eerc-circom-audit.pdf

2. **Gnark Audit** (March 2025)
   - Scope: Core protocol and Gnark circuits
   - Report: avacloud-eerc-audit.pdf

### Security Features
- **Auditor Integration**: Built-in compliance functionality
- **Blacklisting**: Optional security blacklisting
- **Nullifier System**: Prevents double-spending
- **Nonce Mechanism**: Prevents replay attacks

### Production Considerations
- Set `isProd = true` for production verifiers
- Use secure trusted setups from zkevm
- Verify zkey files with snarkjs tool:
  ```bash
  snarkjs zkey verify <circuit_name>.r1cs powersOfTau28_hez_final_<Size>.ptau <circuit_name>.zkey
  ```
  - Transfer/Mint: powersOfTau28_hez_final_15.ptau
  - Withdraw: powersOfTau28_hez_final_14.ptau
  - Registration: powersOfTau28_hez_final_11.ptau

---

## Performance Metrics

### Gas Costs (Avalanche C-Chain Mainnet)
| Operation | Min Gas | Max Gas | Avg Gas | USD (avg) |
|-----------|---------|---------|---------|-----------|
| Deposit | 71,680 | 841,771 | 564,892 | △ |
| Private Burn | 890,507 | 1,227,920 | 1,028,678 | △ |
| Private Mint | 712,316 | 760,624 | 722,016 | △ |
| Set Auditor Key | - | - | 103,851 | △ |
| Token Blacklist | - | - | 46,443 | △ |
| Transfer | 947,295 | 947,331 | 947,313 | △ |
| Withdraw | 775,186 | 828,341 | 796,263 | △ |
| Register | 322,114 | 322,150 | 322,143 | △ |

### Contract Deployment Costs
| Contract | Gas Cost | % of Block Limit |
|----------|----------|------------------|
| EncryptedERC | 3,717,222 | 12.4% |
| MintCircuitVerifier | 1,690,470 | 5.6% |
| TransferCircuitVerifier | 2,052,092 | 6.8% |
| WithdrawCircuitVerifier | 1,319,158 | 4.4% |
| RegistrationVerifier | 810,848 | 2.7% |
| Registrar | 508,067 | 1.7% |
| BabyJubJub | 447,616 | 1.5% |

---

## Resources & Links

### Official Resources
- [GitHub Repository](https://github.com/ava-labs/EncryptedERC)
- [NPM Package](https://www.npmjs.com/package/@avalabs/eerc-sdk)
- [AvaCloud Documentation](https://avacloud.io/)
- [Case Studies](https://avacloud.io/case-studies)
- [Schedule Demo](https://avacloud.io/demo)

### Example Implementations
- [3dent GitHub](https://github.com/BeratOz01/3dent)
- [3dent Live Demo](https://www.3dent.xyz/)
- [eERC Transfer App](https://eerc.avacloud.io) (Standalone only)

### License
Ecosystem License - see LICENSE file for details

---

## Quick Reference for LLM Queries

### Common Tasks
1. **Create new private token**: Deploy in Standalone mode
2. **Add privacy to existing token**: Deploy in Converter mode
3. **Register user**: Call `register()` once per L1
4. **Transfer privately**: Use `privateTransfer()` with ZK proof
5. **Convert public to private**: Use `deposit()` (Converter only)
6. **Convert private to public**: Use `withdraw()` (Converter only)
7. **Mint new tokens**: Use `privateMint()` (Standalone, owner only)
8. **Check balance**: Use `decryptedBalance` from SDK

### Key Differentiators
- **vs Standard ERC-20**: Complete transaction privacy
- **vs Mixers**: Fully on-chain, no intermediaries
- **vs L2 Privacy**: Works on any EVM chain
- **vs Other Privacy Tokens**: Built-in compliance, auditor support

### Integration Checklist
- [ ] Choose mode: Standalone or Converter
- [ ] Deploy contracts with appropriate scripts
- [ ] Set up auditor public key (for compliance)
- [ ] Install SDK (`@avalabs/eerc-sdk`)
- [ ] Configure circuit URLs (WASM/zkey files)
- [ ] Implement useEERC and useEncryptedBalance hooks
- [ ] Handle user registration flow
- [ ] Implement token operations as needed

### Troubleshooting
- **Registration fails**: Ensure deterministic wallet (seed-based)
- **Proof generation slow**: Check circuit file URLs are correct
- **Balance not updating**: Call `refetchBalance()` after operations
- **Decimal issues**: Check token decimal handling in converter mode
- **Gas too high**: Batch operations where possible