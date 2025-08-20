# BackendShield Flow Diagrams

## Overview
This document shows both user journey and server-side processes in the BackendShield credit-based payment system, from initial USDC payment to provider compensation.

## User Flow Diagram

### Main Flow
```mermaid
graph TD
    A[User wants to use MCP Server] --> B{Has Credits?}
    
    B -->|No| C[Payment Flow]
    B -->|Yes| D[API Usage Flow]
    
    C --> C1[Connect Wallet]
    C1 --> C2[Authorize USDC via EIP-3009]
    C2 --> C3[Server converts to eERC-20 credits]
    C3 --> D
    
    D --> D1[Make API request with signed message]
    D1 --> D2[Server validates & deducts credits]
    D2 --> D3[Forward to MCP Provider]
    D3 --> D4[Return API response]
    D4 --> D5{Continue?}
    
    D5 -->|Yes| D1
    D5 -->|Check Balance| F[Query Balance]
    D5 -->|Withdraw| G[Withdraw USDC]
    D5 -->|No| H[End Session]
    
    F --> D5
    G --> G1[Convert eERC-20 back to USDC]
    G1 --> H
```

### Provider Compensation (Background)
```mermaid
graph LR
    A[Usage Metrics] --> B[Statistics Server]
    B --> C[Calculate Payouts] 
    C --> D[Generate ZK Proofs]
    D --> E[Encrypted On-chain Transfers]
    E --> F[KYC Portal Claiming]
```

---

## Server Flow Diagram

### Payment Processing Flow
```mermaid
graph TD
    A[EIP-3009 USDC received] --> B[Validate authorization]
    B --> C[Log payment amount]
    C --> D[Convert to eERC-20 credits]
    D --> E[Encrypt credit balance]
    E --> F[Store in private ledger]
    F --> G[Send confirmation to user]
```

### API Request Processing Flow  
```mermaid
graph TD
    A[API request + signature] --> B[Validate signature]
    B --> C[Check credit balance]
    C -->|Insufficient| D[Return error]
    C -->|Sufficient| E[Deduct credits privately]
    E --> F[Forward to MCP Provider]
    F --> G[Receive provider response]
    G --> H[Log metrics privately]
    H --> I[Return response to user]
```

### Provider Payout Processing
```mermaid
graph TD
    A[Statistics server polls] --> B[Aggregate usage metrics]
    B --> C[Calculate provider shares]
    C --> D[Generate ZK proofs]
    D --> E[Create encrypted transactions]
    E --> F[Submit to blockchain]
    F --> G[Update provider balances]
    G --> H[Notify via KYC portal]
```

### Server State Management
```mermaid
graph LR
    A[User Registry] --> B[Credit Ledger]
    B --> C[Metrics Database]
    C --> D[Provider Registry]
    
    B --> E[eERC-20 Interaction]
    E --> F[Blockchain State]
    
    C --> G[ZK Proof Generator]
    G --> H[Payout Calculator]
```

## Flow Details

### 1. Initial Payment (One-time Setup)
- **Trigger**: User needs credits for first time
- **Process**: Standard EIP-3009 USDC authorization
- **Privacy**: Payment amount visible on blockchain (public)
- **Result**: User has encrypted eERC-20 credits

### 2. API Usage (Core Experience)
- **Trigger**: User makes API request
- **Authentication**: Signed messages (no repeated blockchain transactions)
- **Privacy**: Usage amounts and patterns encrypted
- **Performance**: Near-instant credit deduction

### 3. Credit Management
- **Balance Check**: Dedicated API route
- **Top-up**: Same as initial payment
- **Withdrawal**: Convert remaining eERC-20 back to USDC

### 4. Provider Compensation (Background)
- **Frequency**: Regular automated polling
- **Privacy**: Payout amounts encrypted via ZK proofs
- **Distribution**: Based on actual usage metrics
- **Claiming**: Providers use KYC web portal

## Key Privacy Features

| Component | Visibility | Privacy Level |
|-----------|------------|---------------|
| Initial USDC Payment | Public on blockchain | ❌ No privacy |
| Credit Balance | Server knows, blockchain encrypted | ✅ Private amounts |
| API Usage Patterns | Server tracks, blockchain encrypted | ✅ Private usage |
| Provider Payouts | Server knows, blockchain encrypted | ✅ Private earnings |

## User Experience Benefits

1. **One Payment, Multiple Uses**: Pay once, use credits for many API calls
2. **No Wallet Prompts**: Only sign messages, no blockchain transactions during usage
3. **Transparent Pricing**: Always know credit costs upfront
4. **Privacy by Default**: Usage patterns hidden from external observers
5. **Easy Withdrawal**: Get remaining funds back anytime

## Technical Flow States

### User States
- `no_credits` → Requires payment
- `has_credits` → Can make API calls
- `insufficient_credits` → Needs top-up
- `withdrew_funds` → Session ended

### Server States
- `payment_received` → Converting to eERC-20
- `credits_issued` → Ready for API calls
- `processing_request` → Handling API call
- `logging_metrics` → Recording usage privately

### Provider States  
- `serving_requests` → Processing API calls
- `metrics_collected` → Usage logged for payout
- `payout_calculated` → Ready for distribution
- `funds_claimable` → Available via KYC portal

This flow ensures maximum privacy while maintaining simplicity for users and fair compensation for providers.