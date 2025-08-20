# RESOURCES.md - Project Resource Documentation

## Overview

This document provides a comprehensive overview of all research materials and reference implementations available for the x402-eERC20 integration project. These resources are organized in the `research/` directory and serve as the foundation for implementing privacy-preserving micropayments between AI agents and MCP servers.

## Research Directory Structure

### 0-hack2build/
**Purpose**: Hackathon documentation and requirements

Contains official documentation for the hack2build Privacy Edition hackathon, including:
- Hackathon timeline and milestones
- Submission requirements and deliverables
- Evaluation criteria
- Technical constraints and guidelines

**When to use**: Reference for project scope, deadlines, and deliverable requirements.

### 1-eerc20-documentation/
**Purpose**: Official eERC-20 (Encrypted ERC-20) documentation

Key file: `eerc20-complete-doc.md`
- Complete architectural overview of eERC-20 tokens
- Zero-knowledge proof implementation details
- Privacy features and cryptographic mechanisms
- Integration patterns and best practices

**Official Documentation:**
- **[AvaCloud eERC-20 Gitbook](https://avacloud.gitbook.io/encrypted-erc)** - Complete official documentation

**When to use**: Understanding eERC-20 architecture, privacy features, and implementation requirements.

### 1-eerc20--repo-code/
**Purpose**: eERC-20 SDK and implementation examples

Key files:
- `avalabs-eerc20.txt`: Avalabs eERC-20 SDK source code
- `eerc-backend-converter-repo.txt`: Backend converter repository example

**Official Repositories:**
- **[Avalabs eERC-20 SDK](https://github.com/ava-labs/ac-eerc-sdk)** - Official SDK by Avalabs
- **[eERC Backend Converter](https://github.com/alejandro99so/eerc-backend-converter)** - Backend converter implementation example

Contains practical implementation code for:
- eERC-20 token interactions
- Proof generation and verification
- Backend integration patterns
- Example implementations for reference

**When to use**: Programming questions, implementation details, code patterns, and SDK usage.

### 2-mcp/
**Purpose**: Model Context Protocol (MCP) documentation

Key file: `mcp-docs.txt`
- MCP architecture and concepts
- Server and client implementation guidelines
- Tool and resource definitions
- Communication patterns between agents

**When to use**: MCP-related technical questions, protocol understanding, and integration requirements.

### 3-flowmcp--repo-code/
**Purpose**: FlowMCP implementation reference

Key files:
- `flowmcp-flowmcp-core-8a5edab282632443.txt`: Core module for provider/tool aggregation
- `flowmcp-flowmcp-servers-8a5edab282632443.txt`: Server publication and management

Contains:
- MCP server implementation patterns
- Provider aggregation mechanisms
- Tool integration examples
- Server discovery and publication methods

**When to use**: Understanding MCP server architecture, provider aggregation, and practical MCP implementation.

### 4-x402/
**Purpose**: x402 Payment Protocol resources

Key files:
- `x402-whitepaper.txt`: Protocol architecture and design principles
- `flowmcp-x402-core-8a5edab282632443.txt`: Core x402 functionality implementation
- `flowmcp-x402-mcp-middleware-8a5edab282632443.txt`: MCP middleware for x402
- `eip-3009.html`: Related EIP standard reference

Contains:
- x402 protocol specification and architecture
- Payment flow implementations
- Express middleware examples
- Core payment functionality modules

**When to use**: Understanding x402 payment flows, implementing payment endpoints, and middleware integration.

### 5-ai-conversations/
**Purpose**: AI-generated recommendations and design documents

Key files:
- `entscheidungsdokument_option_1_e_erc_reserve_x_402.md`: Decision document for Option 1 implementation
- `prd_x_402_schema_eerc_20_usdc_credit_shielded_credits_e_erc_20.md`: Product Requirements Document

**IMPORTANT NOTE**: These are AI-generated recommendations and suggestions only. They are NOT fixed requirements or mandatory implementation guidelines. Use them as inspiration and reference, but make implementation decisions based on actual project needs.

## Quick Reference Guide

### For Privacy Implementation
� Check `1-eerc20-documentation/` and `1-eerc20--repo-code/`

### For Payment Protocol
� Reference `4-x402/` for protocol details and implementation

### For MCP Integration
� Use `2-mcp/` for protocol docs and `3-flowmcp--repo-code/` for examples

### For Project Requirements
� Consult `0-hack2build/` for hackathon specifications

### For Architecture Ideas
� Review `5-ai-conversations/` (remember: suggestions only)

## Key Integration Points

1. **eERC-20 + x402**: Combining encrypted tokens with payment protocol
2. **x402 + MCP**: Integrating payments into agent communication
3. **Privacy + Performance**: Balancing ZK proofs with response times
4. **Agent Discovery**: Enabling privacy-preserving service discovery

## Development Workflow

1. **Research Phase**: Study relevant documentation in folders 1-4
2. **Design Phase**: Reference AI conversations for ideas (folder 5)
3. **Implementation Phase**: Use repo code examples as reference
4. **Integration Phase**: Combine components following architecture docs
5. **Testing Phase**: Validate privacy guarantees and performance

## Important Reminders

- All files in `research/` are READ-ONLY reference materials
- Development work happens in the main project directories
- Focus on MVP functionality for hackathon timeline
- Document all privacy trade-offs clearly
- Prioritize working implementation over perfect architecture

## Technical Stack References

- **Blockchain**: Base L2 (Ethereum-compatible)
- **Privacy**: eERC-20 with zero-knowledge proofs
- **Payments**: x402 HTTP payment protocol
- **Communication**: Model Context Protocol (MCP)
- **Languages**: Node.js 22 (ES modules), Solidity 0.8.x

## AI Assistants & Tools

### Custom GPTs Created

#### Encrypted ERC20 Expert
**URL**: https://chatgpt.com/g/g-689e7948af8081919c3d911eb0e38663-encrypted-erc20-expert
**Purpose**: General-purpose assistant specialized in eERC-20 technology
**Scope**: Shared with all hackathon participants for community benefit
**Use Cases**: 
- Understanding eERC-20 architecture
- Zero-knowledge proof implementations
- Privacy features and cryptographic mechanisms

#### Hack2Build Assistant  
**URL**: https://chatgpt.com/g/g-68a48d8614a881918a4042ee5fc8bf6f-hack2build-assistant
**Purpose**: Project-specific assistant with deep knowledge of this implementation
**Scope**: Tailored for x402-eERC20 FlowMCP integration
**Use Cases**:
- Project architecture questions
- Implementation guidance
- Integration strategy support

## Next Steps

1. Review hackathon requirements in `0-hack2build/`
2. Study eERC-20 documentation for privacy implementation
3. Understand x402 payment flows from whitepaper
4. Reference implementation examples when coding
5. Use AI suggestions as inspiration, not requirements