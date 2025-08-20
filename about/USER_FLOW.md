# BackendShield Flow Diagrams

## Overview
This document shows the user journey and automated Data Provider settlement process in the BackendShield credit-based payment system.

## User Flow Diagram

### Main Flow
```mermaid
graph TD
    A[User wants to use FlowMCP Server] --> B{Has Credits?}
    
    B -->|No| C[Payment Flow]
    B -->|Yes| D[API Usage Flow]
    
    C --> C1[Connect Wallet]
    C1 --> C2[Pay USDC to FlowMCP via EIP-3009]
    C2 --> C3[FlowMCP validates payment]
    C3 --> C4[FlowMCP notifies BackendShield]
    C4 --> C5[BackendShield converts to eERC-20 credits]
    C5 --> D
    
    D --> D1[Make API request to FlowMCP]
    D1 --> D2[FlowMCP checks credits with BackendShield]
    D2 --> D3[Forward to Data Provider]
    D3 --> D4[Return API response]
    D4 --> D5[FlowMCP submits metrics to BackendShield]
    D5 --> D6{Continue?}
    
    D6 -->|Yes| D1
    D6 -->|Check Balance| F[Query Balance via FlowMCP]
    D6 -->|Withdraw| G[Request Withdrawal]
    D6 -->|No| H[End Session]
    
    F --> D6
    G --> G1[BackendShield converts eERC-20 back to USDC]
    G1 --> H
```

### Data Provider Settlement (Automated Background Process)
```mermaid
graph TD
    A[Timer: Every 24h] --> B[BackendShield aggregates metrics from all FlowMCP servers]
    B --> C[Calculate usage share for each Data Provider]
    C --> D[Calculate payout percentages]
    
    D --> E{Enough volume for settlement?}
    E -->|No| F[Wait for next cycle]
    E -->|Yes| G[Generate ZK proofs for transactions]
    
    G --> H[Create encrypted eERC-20 transfers]
    H --> I[Submit batch to Avalanche blockchain]
    I --> J[Update Data Provider balances privately]
    J --> K[Send notifications to KYC portal]
    
    K --> L[Data Providers can claim their funds]
    F --> A
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

### 4. Data Provider Compensation (Background)
- **Frequency**: Regular automated polling (24h cycles)
- **Privacy**: Payout amounts encrypted via ZK proofs
- **Distribution**: Based on actual usage metrics from FlowMCP servers
- **Claiming**: Data Providers use KYC web portal

## Key Privacy Features

| Component | Visibility | Privacy Level |
|-----------|------------|---------------|
| Initial USDC Payment | Public on blockchain | ❌ No privacy |
| Credit Balance | Server knows, blockchain encrypted | ✅ Private amounts |
| API Usage Patterns | Server tracks, blockchain encrypted | ✅ Private usage |
| Data Provider Payouts | BackendShield knows, blockchain encrypted | ✅ Private earnings |

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

### Data Provider States  
- `serving_requests` → Processing API calls via FlowMCP
- `metrics_collected` → Usage logged by BackendShield for payout
- `payout_calculated` → Ready for encrypted distribution
- `funds_claimable` → Available via KYC portal

This flow ensures maximum privacy while maintaining simplicity for users and fair compensation for Data Providers.