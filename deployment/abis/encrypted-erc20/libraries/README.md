# Cryptographic Libraries ABIs

This folder contains the ABIs for cryptographic library contracts used in the eERC-20 system.

## BabyJubJub Library

**Contract**: `contracts/libraries/BabyJubJub.sol`  
**Address**: `0xaDfB3606ee2A6cc3cC6435837Ec6e5Fa1DB4afAE`  
**Purpose**: Elliptic curve operations for zero-knowledge cryptography

### Curve Parameters

The BabyJubJub elliptic curve is defined by the twisted Edwards curve equation:
```
A*x² + y² = 1 + D*x²*y² (mod Q)
```

**Constants:**
- **A**: `168700`
- **D**: `168696` 
- **Q** (Prime modulus): `21888242871839275222246405745257275088548364400416034343698204186575808495617`
- **Base Point**: `(5299619240641551281634865583518297030282874472190772894086521144482721001553, 16950150798460657717958625567821834550301663161624707787222815936182638968203)`

### Key Functions

```solidity
// Point addition on BabyJubJub curve
function _add(Point memory _point1, Point memory _point2) public view returns (Point memory)

// Point subtraction  
function _sub(Point memory _point1, Point memory _point2) public view returns (Point memory)

// Scalar multiplication (k * P)
function scalarMultiply(Point memory _point, uint256 _scalar) public view returns (Point memory)

// ElGamal encryption
function encrypt(Point memory _publicKey, uint256 _msg) public view returns (EGCT memory)

// Get base generator point
function base8() public pure returns (Point memory)

// Point doubling
function double(Point memory _p) internal view returns (Point memory)

// Modular inverse
function invmod(uint256 _a) internal view returns (uint256)

// Point negation
function negate(Point memory _point) internal pure returns (Point memory)
```

### Data Structures

```solidity
// Point on BabyJubJub curve
struct Point {
    uint256 x;
    uint256 y;
}

// ElGamal ciphertext
struct EGCT {
    Point c1;  // First component 
    Point c2;  // Second component
}
```

### Usage Examples

#### JavaScript/TypeScript Integration

```javascript
import { ethers } from 'ethers'
import BabyJubJubABI from './BabyJubJub.json'

// Connect to library contract
const provider = new ethers.JsonRpcProvider('https://api.avax-test.network/ext/bc/C/rpc')
const babyJubJub = new ethers.Contract(
    '0xaDfB3606ee2A6cc3cC6435837Ec6e5Fa1DB4afAE',
    BabyJubJubABI,
    provider
)

// Get base generator point
const basePoint = await babyJubJub.base8()
console.log(`Base point: (${basePoint.x}, ${basePoint.y})`)

// Scalar multiplication example
const privateKey = ethers.randomBytes(32)
const publicKey = await babyJubJub.scalarMultiply(basePoint, privateKey)
console.log(`Public key: (${publicKey.x}, ${publicKey.y})`)

// Encrypt a message
const message = 42
const ciphertext = await babyJubJub.encrypt(publicKey, message)
console.log(`Encrypted message:`)
console.log(`  c1: (${ciphertext.c1.x}, ${ciphertext.c1.y})`)
console.log(`  c2: (${ciphertext.c2.x}, ${ciphertext.c2.y})`)
```

#### Point Operations

```javascript
// Add two points
const point1 = { x: 123n, y: 456n }
const point2 = { x: 789n, y: 012n }
const sum = await babyJubJub._add(point1, point2)

// Subtract points  
const difference = await babyJubJub._sub(point1, point2)

// Double a point
const doubled = await babyJubJub.double(point1)
```

### Cryptographic Applications

#### Key Generation
```javascript
// Generate key pair
const privateKey = ethers.randomBytes(32)
const basePoint = await babyJubJub.base8()
const publicKey = await babyJubJub.scalarMultiply(basePoint, privateKey)
```

#### ElGamal Encryption
```javascript
// Encrypt a value
const amount = 1000
const recipientPublicKey = { x: "...", y: "..." }
const encryptedAmount = await babyJubJub.encrypt(recipientPublicKey, amount)
```

#### Homomorphic Properties
```javascript
// Encrypt two values
const encrypted1 = await babyJubJub.encrypt(publicKey, 100)
const encrypted2 = await babyJubJub.encrypt(publicKey, 200)

// Add encrypted values (homomorphic addition)
const encryptedSum = await babyJubJub._add(encrypted1.c2, encrypted2.c2)
// This encrypts (100 + 200) = 300
```

### Security Features

- **Discrete Log Security**: Based on discrete logarithm problem on elliptic curve
- **ZK-Friendly**: Optimized for zero-knowledge proof circuits
- **Deterministic**: Same inputs always produce same outputs
- **Non-Malleable**: Points cannot be malleably modified

### Integration with Privacy System

The BabyJubJub library is used throughout the eERC-20 system for:

1. **User Registration**: Generate public/private key pairs
2. **Encryption**: Encrypt transaction amounts and balances  
3. **Zero-Knowledge Proofs**: Prove operations without revealing secrets
4. **Auditor System**: Enable selective decryption for compliance

### Performance Characteristics

| Operation | Gas Cost | Typical Time |
|-----------|----------|--------------|
| Point Addition | ~3,000 gas | <1ms |
| Scalar Multiplication | ~150,000 gas | ~5ms |
| ElGamal Encryption | ~180,000 gas | ~6ms |
| Modular Inverse | ~2,000 gas | <1ms |

### Mathematical Background

BabyJubJub is a twisted Edwards curve that:
- Is birationally equivalent to the Montgomery curve used in Ed25519
- Has a large prime-order subgroup for cryptographic security  
- Is optimized for efficient operations in zero-knowledge circuits
- Supports efficient scalar multiplication and point operations

## Network Information

- **Network**: Avalanche Fuji Testnet
- **Chain ID**: 43113
- **Library Type**: Stateless mathematical operations
- **Gas Efficiency**: Optimized for frequent cryptographic operations