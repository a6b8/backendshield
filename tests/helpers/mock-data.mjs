/**
 * Centralized Mock Data for eERC20Manager Tests
 * 
 * This file contains all mock data used across test suites to ensure consistency
 * and provide a single source of truth for test values.
 */

import { ethers } from 'ethers'


/**
 * User Mock Data
 * Contains private keys, user names, and calculated addresses
 */
export const USERS = {
    alice: {
        privateKey: '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
        userName: 'alice',
        get address() {
            return new ethers.Wallet( this.privateKey ).address
        }
    },
    
    bob: {
        privateKey: 'fedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321',
        userName: 'bob', 
        get address() {
            return new ethers.Wallet( this.privateKey ).address
        }
    },
    
    charlie: {
        privateKey: '1111111111111111111111111111111111111111111111111111111111111111',
        userName: 'charlie',
        get address() {
            return new ethers.Wallet( this.privateKey ).address
        }
    },
    
    unregistered: {
        privateKey: 'abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
        userName: 'unregistered_bob',
        get address() {
            return new ethers.Wallet( this.privateKey ).address
        }
    }
}


/**
 * Static Test Addresses 
 * Used for recipient testing and address format validation
 */
export const ADDRESSES = {
    bob: '0xf3d4E353390d073D408ca0D5D02B3E712C0E669a',
    alice: '0x742d35Cc5e5c7073c4b9E6d7BA5Cc7072C8B2A53',
    charlie: '0x1111111111111111111111111111111111111111',
    unregistered: '0x1234567890123456789012345678901234567890',
    alternate: '0x9876543210987654321098765432109876543210'
}


/**
 * Token Mock Data
 * ERC20 token addresses for testing different scenarios
 */
export const TOKENS = {
    usdc: '0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664', // Primary USDC token
    alternate: '0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39', // Alternative token
    mixedCase: '0xA7d7079b0FEaD91F3e65f86E8915Cb59c1a4C664', // Mixed case variant
    unregistered: '0x1234567890123456789012345678901234567890' // Unregistered token
}


/**
 * Test Amounts
 * Various amount values for different test scenarios
 */
export const AMOUNTS = {
    standard: '100',
    small: '50',
    medium: '25',
    tiny: '0.000001',
    decimal: '0.5',
    precision: [ '1.5', '10.25', '0.1', '0.01', '0.001', '0.0001' ],
    excessive: '999999',
    max: 'max',
    zero: '0',
    negative: '-100',
    withWhitespace: '  100.5  ',
    invalid: 'invalid'
}


/**
 * Mock Balances
 * Different balance scenarios for testing
 */
export const BALANCES = {
    sufficient: '100.0',
    insufficient: '10.0',
    specific: '25.5',
    transferTest: '15.5',
    maxTest: '75.5',
    zero: '0.0',
    high: '1000.0'
}


/**
 * Configuration Objects
 * Manager configuration for different test modes
 */
export const CONFIG = {
    silent: { silent: true },
    verbose: { silent: false }
}


/**
 * Network Configuration
 * RPC endpoints and network settings
 */
export const NETWORK = {
    rpcUrl: 'https://api.avax-test.network/ext/bc/C/rpc',
    circuitsPath: './tests/fixtures/test-circuits'
}


/**
 * User Name Variations
 * Different user names for various test scenarios
 */
export const USER_NAMES = {
    // Standard users
    alice: 'alice',
    bob: 'bob',
    charlie: 'charlie',
    
    // Mode-specific users
    verbose: {
        alice: 'verbose_alice',
        bob: 'verbose_bob',
        user: 'verbose_user'
    },
    
    silent: {
        alice: 'silent_alice',
        bob: 'silent_bob',
        test: 'silent_test'
    },
    
    // Special scenario users
    unregistered: {
        bob: 'unregistered_bob',
        sender: 'unregistered_sender'
    },
    
    test: 'test_user'
}


/**
 * Address Format Variations
 * Different address formats for validation testing
 */
export const ADDRESS_FORMATS = {
    // Format variations of bob's address
    bob: {
        standard: ADDRESSES.bob,
        uppercase: ADDRESSES.bob.replace( '0x', '0X' ),
        noPrefix: ADDRESSES.bob.substring(2),
        mixedCase: '0xF3d4E353390d073D408ca0D5D02B3E712C0E669a',
        long: ADDRESSES.bob + 'extra'
    },
    
    // Format variations for tokens
    token: {
        standard: TOKENS.usdc,
        uppercase: TOKENS.usdc.replace( '0x', '0X' ),
        noPrefix: TOKENS.usdc.substring(2),
        mixedCase: TOKENS.mixedCase
    }
}


/**
 * Error Test Values
 * Invalid values for error testing scenarios
 */
export const INVALID_VALUES = {
    userName: {
        number: 123,
        boolean: true,
        empty: '',
        whitespace: '   ',
        invalidFormat: 'user-name'
    },
    
    amount: {
        number: 123,
        boolean: true,
        empty: '',
        zero: '0',
        negative: '-100',
        invalid: 'invalid'
    },
    
    address: {
        number: 123,
        boolean: true,
        empty: '',
        invalid: 'invalid',
        short: '0x123',
        long: ADDRESSES.bob + 'extra'
    }
}


/**
 * Mock Functions Factory
 * Creates commonly used mock functions for tests
 */
export const MOCK_FUNCTIONS = {
    // Always returns registered
    isRegisteredTrue: async () => ({ isRegistered: true }),
    
    // Always returns unregistered
    isRegisteredFalse: async ( { address } ) => ({ 
        isRegistered: false, 
        address, 
        checkedAt: Date.now() 
    }),
    
    // Returns sufficient balance
    getBalanceSufficient: async ( { address, tokenAddress } ) => ({
        encryptedBalance: BALANCES.sufficient,
        tokenAddress: tokenAddress.toLowerCase().startsWith( '0x' ) 
            ? tokenAddress.toLowerCase() 
            : `0x${tokenAddress.toLowerCase()}`,
        address: address.toLowerCase()
    }),
    
    // Returns insufficient balance
    getBalanceInsufficient: async ( { address, tokenAddress } ) => ({
        encryptedBalance: BALANCES.insufficient,
        tokenAddress: tokenAddress.toLowerCase().startsWith( '0x' ) 
            ? tokenAddress.toLowerCase() 
            : `0x${tokenAddress.toLowerCase()}`,
        address: address.toLowerCase()
    }),
    
    // Returns zero balance
    getBalanceZero: async ( { address, tokenAddress } ) => ({
        encryptedBalance: BALANCES.zero,
        tokenAddress: tokenAddress.toLowerCase().startsWith( '0x' ) 
            ? tokenAddress.toLowerCase() 
            : `0x${tokenAddress.toLowerCase()}`,
        address: address.toLowerCase()
    })
}


/**
 * Test Timing Configuration
 * Expected timing values for performance tests
 */
export const TIMING = {
    deposit: {
        minDelay: 100,  // Minimum expected delay for deposit proof generation
        maxDelay: 5000  // Maximum acceptable delay
    },
    
    withdraw: {
        minDelay: 200,  // Minimum expected delay for withdraw proof generation
        maxDelay: 5000  // Maximum acceptable delay
    },
    
    transfer: {
        minDelay: 150,  // Minimum expected delay for transfer proof generation
        maxDelay: 5000  // Maximum acceptable delay
    }
}


/**
 * Regular Expressions
 * Common regex patterns used in tests
 */
export const REGEX = {
    txHash: /^0x[a-fA-F0-9]{64}$/,
    address: /^0x[a-fA-F0-9]{40}$/
}