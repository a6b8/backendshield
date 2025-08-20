# BackendShield - Privacy-Enhanced x402 Payment System

**Eliminates payment friction with credit-based micropayments while encrypting transaction amounts and Data Provider earnings on-chain**

## Executive Summary

BackendShield integrates eERC-20 (encrypted ERC-20) tokens into MCP servers, enabling privacy-preserving micropayments for AI agent interactions. The implementation combines the x402 payment protocol with zero-knowledge proof technology to create a credit-based payment system that protects user privacy while enabling transparent Data Provider compensation.

## Project Context

### What is MCP?
Model Context Protocol (MCP) enables AI systems to access current information from the internet through standardized server connections. MCP servers are replacing traditional web interactions as AI agents autonomously discover and evaluate information sources.

### What is FlowMCP?
FlowMCP is an aggregator platform that consolidates information from multiple sources into unified MCP servers. Like a craftsman selecting specific tools for each job, FlowMCP allows users to configure their AI toolkit from:
- **70+ Data Providers** with **500+ tools**
- Custom tool combinations for specific tasks
- Simplified API key management

### Current FlowMCP Ecosystem
- **https://www.flowmcp.org** - Configuration tool for self-hosted setups
- **https://api.flowmcp.org** - Managed service platform (in testing)
- **https://community.flowmcp.org** - Experimental MCP servers

## Problem Statement

Current challenges in the MCP ecosystem:
1. **Payment Friction**: Each API call requires individual payment authorization
2. **Privacy Concerns**: Payment amounts and patterns reveal usage behavior
3. **Data Provider Management**: Complex API key management across multiple Data Providers
4. **Resource Allocation**: Different routes have varying computational costs

## Solution Architecture

### Core Innovation: Credit-Based eERC-20 System

Instead of per-request payments (as specified in x402), we implement a credit system:
1. User sends USDC amount via EIP-3009 authorization
2. Server converts to eERC-20 credits (privacy-preserving)
3. User interacts using signed messages (no repeated payments)
4. Server tracks usage metrics privately
5. Data Providers receive automated, privacy-preserving payouts

### Privacy Features
- **Encrypted Balances**: Credit amounts hidden using zero-knowledge proofs
- **Private Metrics**: Usage patterns obscured from external observers
- **Confidential Payouts**: Data Provider compensation amounts encrypted
- **Optional KYC**: Data Providers can claim funds through web portal

## System Architecture

### System Actors

**1. Users (Many)**
- AI developers and applications
- Pay USDC via EIP-3009 for API access credits
- Consume Data Provider services through FlowMCP
- Manage credit balances

**2. FlowMCP Server (One per deployment)**
- Validates EIP-3009 payments independently
- Aggregates multiple Data Providers into unified MCP server
- Polls BackendShield for credit information via routes
- Routes API calls to appropriate Data Providers

**3. BackendShield Server (One)**
- Provides credit management routes for FlowMCP servers
- Converts USDC to eERC-20 credits automatically
- Collects usage metrics from FlowMCP servers
- Handles encrypted settlements to Data Providers

**4. Data Providers (Many)**
- External API services (Weather, News, AI Models, etc.)
- Receive encrypted eERC-20 payouts based on usage
- Register and claim funds via KYC portal

### Integration Pattern

BackendShield provides REST routes that FlowMCP servers can call:
- `POST /credits/issue` - Report new USDC payment received
- `GET /credits/{userId}` - Check available credits
- `POST /metrics/submit` - Submit usage data for settlement

## Technical Components

### A. Proxy Client
**Repository**: Extend `https://github.com/FlowMCP/x402-core`
- Support new x402 credit schema
- EIP-3009 authorization handling
- Signed message authentication
- Integration with existing test client in `tests/client/`

### B. eERC MCP Middleware
**Purpose**: Metrics collection and credit management
- Capture usage metrics via API
- Expose credit balance routes
- Track Data Provider resource consumption
- Maintain privacy during data collection

### C. eERC Server (Core Component)
**Purpose**: Bridge between MCP and blockchain
- Receive metrics from MCP servers
- Convert USDC to eERC-20 credits
- Generate zero-knowledge proofs
- Calculate Data Provider payouts
- Manage encrypted balances
- Handle KYC Data Provider registration

### D. Smart Contract (eERC-20)
**Requirement**: Minimal modifications to preserve audits
- Leverage existing eERC-20 implementation
- Add credit system logic if needed
- Maintain compatibility with standard

## User Journey

### Initial Setup
1. User sends USDC to MCP server via x402 protocol
2. Server converts USDC to eERC-20 credits
3. User receives credit balance confirmation

### Active Usage
1. User makes requests with signed messages (private key)
2. Server deducts credits privately
3. User can check balance via dedicated route
4. Optional: User can withdraw remaining USDC via dedicated route

### Data Provider Compensation
1. Statistics server polls metrics regularly
2. Calculates Data Provider payout distribution
3. Creates transactions with ZK proofs
4. Records on blockchain (encrypted amounts)
5. Data Providers claim via KYC web portal

## Implementation Priorities

### Phase 1: Foundation
- Basic eERC-20 credit system
- Simple proxy client modifications
- Minimal viable middleware

### Phase 2: Enhancement
- Full metrics collection
- Automated payout calculation
- ZK proof generation

### Phase 3: Production
- KYC Data Provider portal
- Credit withdrawal mechanism
- Performance optimization

## Success Metrics

### Technical
- Sub-second payment authorization
- Successful credit conversion
- Working ZK proof generation
- Accurate metrics collection

### Privacy
- No balance leakage
- Hidden usage patterns
- Encrypted Data Provider payouts

### Usability
- Single payment for multiple requests
- Simple credit balance checking
- Easy Data Provider registration

## Deployment Target

The eERC-20 MCP server will be deployed at:
**https://community.flowmcp.org/eerc20**

This allows testing of:
- Credit-based payments
- Privacy features
- Data Provider payout mechanisms
- Integration with existing FlowMCP infrastructure

## Key Innovations

1. **Credit System vs Per-Request**: Reduces transaction overhead
2. **Privacy-First Design**: All amounts and patterns encrypted
3. **Automated Distribution**: Smart payout calculations
4. **Hybrid Model**: Combines on-chain and off-chain efficiently

## Technical Stack

- **Blockchain**: Avalanche CChain
- **Token Standard**: eERC-20 with ZK proofs
- **Payment Protocol**: x402 (modified for credits)
- **Authentication**: EIP-3009 + signed messages
- **Server**: Node.js 22 with ES modules
- **Smart Contracts**: Solidity 0.8.x

## Risk Mitigation

- **Audit Preservation**: Minimal smart contract changes
- **Gradual Rollout**: Test on community servers first
- **Fallback Options**: Support standard x402 if needed
- **Privacy Trade-offs**: Document clearly for users

## Next Steps

1. Review ROADMAP.md for structured task breakdown
2. Set up development environment
3. Begin with proxy client modifications
4. Implement core eERC server
5. Deploy to community.flowmcp.org for testing

## Project Deliverables

For the hack2build hackathon:
- Working eERC-20 credit system
- Modified x402 proxy client
- Core eERC server implementation
- Deployed test server
- Comprehensive documentation
- Clear privacy analysis

This project demonstrates how privacy-preserving payments can enable sustainable MCP server ecosystems while protecting user and Data Provider privacy.