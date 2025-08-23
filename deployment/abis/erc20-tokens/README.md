# ERC-20 Token ABIs

This folder contains the ABI (Application Binary Interface) for SimpleERC20 tokens used in the eERC-20 privacy system.

## SimpleERC20

**Contract**: `contracts/tokens/SimpleERC20.sol`  
**Purpose**: Standard ERC-20 token with faucet functionality for testing

### Deployed Instances

| Token | Symbol | Address | Supply | Explorer |
|-------|--------|---------|--------|----------|
| **AvaxTest** | AVAXTEST | `0xE127F315482424aAE644CB10ec156b7574aCF2e1` | 10,000 | [View on Snowtrace](https://testnet.snowtrace.io/address/0xE127F315482424aAE644CB10ec156b7574aCF2e1#readContract) |
| **backendShield** | BSHIELD | `0xeD8186eDB85f63A35e57114bcCaA7Dfb6E5aCdA1` | 1,000,000 | [View on Snowtrace](https://testnet.snowtrace.io/address/0xeD8186eDB85f63A35e57114bcCaA7Dfb6E5aCdA1#readContract) |

### Key Features

- **Standard ERC-20**: Full compatibility with ERC-20 standard
- **Mintable**: Owner can mint new tokens
- **Faucet System**: Users can claim tokens with cooldown period
- **Test-Friendly**: Designed for development and testing

### Faucet Constants

- **FAUCET_AMOUNT**: `1000000000000000000000` (1,000 tokens)
- **FAUCET_COOLDOWN**: `86400` (24 hours in seconds)

### Usage Example

```javascript
import { ethers } from 'ethers'
import SimpleERC20ABI from './SimpleERC20.json'

// Connect to token contract
const tokenContract = new ethers.Contract(
    '0xE127F315482424aAE644CB10ec156b7574aCF2e1', // AvaxTest address
    SimpleERC20ABI,
    signer
)

// Check if user can claim from faucet
const canClaim = await tokenContract.canClaimFromFaucet(userAddress)

// Claim tokens from faucet
if (canClaim) {
    const tx = await tokenContract.claimFromFaucet()
    await tx.wait()
}

// Check token balance
const balance = await tokenContract.balanceOf(userAddress)
console.log(`Balance: ${ethers.formatEther(balance)} tokens`)
```

### Privacy Integration

These ERC-20 tokens can be wrapped with privacy features using the EncryptedERC system:

```javascript
// 1. Approve tokens for deposit
await tokenContract.approve(encryptedERCAddress, amount)

// 2. Deposit to privacy system
await encryptedERC.deposit(tokenId, amount, zkProof)

// Now tokens are private and encrypted!
```

## Network Information

- **Network**: Avalanche Fuji Testnet
- **Chain ID**: 43113
- **RPC**: https://api.avax-test.network/ext/bc/C/rpc
- **Explorer**: https://testnet.snowtrace.io/