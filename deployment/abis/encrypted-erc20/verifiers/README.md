# Zero-Knowledge Proof Verifiers ABIs

This folder contains the ABIs for all zero-knowledge proof verifier contracts in the eERC-20 system.

## Verifier Contracts

| Circuit | ABI File | Address | Constraints | Purpose |
|---------|----------|---------|-------------|---------|
| **Registration** | `RegistrationVerifier.json` | `0xb460d0B00c0122294D28fbcdCA03625B85d829b9` | 1,797 | User identity verification |
| **Mint** | `MintVerifier.json` | `0xE4E3C131F6b530Ffc7FD3282aA3476c035C173E2` | 16,709 | Private token creation |
| **Withdraw** | `WithdrawVerifier.json` | `0x8F8fA911b8Fb5A56D4895dCe199E7B1dEF188994` | 12,276 | Converting encrypted → public tokens |
| **Transfer** | `TransferVerifier.json` | `0x78FDdc7D98775Ef378b86e11Ee7eBf72CcF22544` | 26,636 | Private transfers between users |
| **Burn** | `BurnVerifier.json` | `0xd63ECF5507277A5bA6109Fe90699E638aa1ea352` | 16,380 | Private token destruction |

## Verification Technology

All verifiers use **Groth16 zero-knowledge proving system** with:
- **Elliptic Curve**: BabyJubJub (circom-compatible)
- **Hash Function**: Poseidon (ZK-friendly)
- **Trusted Setup**: Generated during deployment
- **Security Level**: 128-bit security

## Common Verifier Interface

All verifiers implement the standard Groth16 verification interface:

```solidity
function verifyProof(
    uint[2] calldata _pA,
    uint[2][2] calldata _pB,
    uint[2] calldata _pC,
    uint[1] calldata publicSignals
) external view returns (bool);
```

## Usage Examples

### JavaScript/TypeScript Integration

```javascript
import { ethers } from 'ethers'
import RegistrationVerifierABI from './RegistrationVerifier.json'

// Connect to verifier contract
const provider = new ethers.JsonRpcProvider('https://api.avax-test.network/ext/bc/C/rpc')
const registrationVerifier = new ethers.Contract(
    '0xb460d0B00c0122294D28fbcdCA03625B85d829b9',
    RegistrationVerifierABI,
    provider
)

// Verify a zero-knowledge proof
const isValidProof = await registrationVerifier.verifyProof(
    proof.pA,      // Proof point A
    proof.pB,      // Proof point B  
    proof.pC,      // Proof point C
    publicSignals  // Public inputs
)

if (isValidProof) {
    console.log('✅ Zero-knowledge proof is valid!')
} else {
    console.log('❌ Invalid proof')
}
```

### Proof Generation (Off-chain)

```javascript
import { groth16 } from 'snarkjs'

// Generate proof for registration circuit
async function generateRegistrationProof(privateKey, publicKeyX, publicKeyY) {
    const input = {
        privateKey: privateKey,
        publicKeyX: publicKeyX,
        publicKeyY: publicKeyY
    }
    
    // Generate proof using circuit files
    const { proof, publicSignals } = await groth16.fullProve(
        input,
        'circuits/registration.wasm',
        'circuits/registration_final.zkey'
    )
    
    return {
        pA: [proof.pi_a[0], proof.pi_a[1]],
        pB: [[proof.pi_b[0][1], proof.pi_b[0][0]], [proof.pi_b[1][1], proof.pi_b[1][0]]],
        pC: [proof.pi_c[0], proof.pi_c[1]],
        publicSignals: publicSignals
    }
}
```

## Circuit Specifications

### RegistrationVerifier
- **Purpose**: Proves knowledge of private key without revealing it
- **Public Inputs**: BabyJubJub public key coordinates
- **Private Inputs**: Private key
- **Constraint Count**: 1,797

### MintVerifier  
- **Purpose**: Proves validity of encrypted token creation
- **Public Inputs**: Encrypted amount, recipient public key
- **Private Inputs**: Amount, randomness
- **Constraint Count**: 16,709

### TransferVerifier
- **Purpose**: Proves valid encrypted transfer between users
- **Public Inputs**: Encrypted amounts, public keys
- **Private Inputs**: Transfer amount, balances, randomness  
- **Constraint Count**: 26,636 (most complex)

### WithdrawVerifier
- **Purpose**: Proves decryption of encrypted balance
- **Public Inputs**: Decrypted amount, encrypted balance
- **Private Inputs**: Private key, randomness
- **Constraint Count**: 12,276

### BurnVerifier
- **Purpose**: Proves destruction of encrypted tokens
- **Public Inputs**: Burned amount, updated balance
- **Private Inputs**: Private key, original balance
- **Constraint Count**: 16,380

## Performance Considerations

| Operation | Proof Generation Time | Gas Cost | Verification Time |
|-----------|---------------------|----------|------------------|
| Registration | ~0.5s | ~250k gas | ~5ms |
| Mint | ~2s | ~300k gas | ~8ms |
| Transfer | ~5s | ~400k gas | ~12ms |
| Withdraw | ~1.5s | ~280k gas | ~7ms |
| Burn | ~2s | ~300k gas | ~8ms |

## Security Notes

- **Trusted Setup**: Each verifier uses a trusted setup ceremony
- **Circuit Security**: Based on established circom libraries
- **Proof Malleability**: Groth16 proofs are non-malleable
- **Setup Keys**: Verification keys are embedded in contract bytecode

## Network Information

- **Network**: Avalanche Fuji Testnet
- **Chain ID**: 43113
- **Confirmation**: Wait for transaction confirmation
- **Gas Limits**: Set higher gas limits (300k-500k) for proof verification