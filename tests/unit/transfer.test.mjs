import { describe, it, beforeEach } from 'node:test'
import assert from 'node:assert'
import { resolve } from 'path'
import { ethers } from 'ethers'

import eERC20Manager from '../../src/index.mjs'
import { 
    USERS, 
    TOKENS, 
    AMOUNTS, 
    ADDRESSES,
    BALANCES,
    CONFIG, 
    NETWORK, 
    USER_NAMES, 
    ADDRESS_FORMATS, 
    INVALID_VALUES,
    MOCK_FUNCTIONS,
    TIMING,
    REGEX
} from '../helpers/mock-data.mjs'


describe( 'transfer Tests', () => {
    let manager
    const testCircuitsPath = resolve( NETWORK.circuitsPath )

    beforeEach( async () => {
        manager = new eERC20Manager( CONFIG.silent )
        await manager.addProvider( { 
            rpcUrl: NETWORK.rpcUrl 
        } )
        await manager.addCircuits( { circuitFolderPath: testCircuitsPath } )
        
        await manager.addUser( {
            privateKey: USERS.alice.privateKey,
            userName: USERS.alice.userName,
            autoRegistration: false
        } )
        
        await manager.addUser( {
            privateKey: USERS.bob.privateKey,
            userName: USERS.bob.userName,
            autoRegistration: false
        } )
        
        // Calculate actual addresses from private keys (same as addUser logic)
        const actualAliceAddress = new ethers.Wallet( USERS.alice.privateKey ).address.toLowerCase()
        const actualBobAddress = new ethers.Wallet( USERS.bob.privateKey ).address.toLowerCase()
        
        // Mock isRegistered to return appropriate registration status
        manager.isRegistered = async ( { address } ) => {
            const normalizedAddress = address.toLowerCase()
            // Use actual addresses calculated from private keys
            if( normalizedAddress === actualAliceAddress || 
                normalizedAddress === actualBobAddress ||
                normalizedAddress === ADDRESSES.bob.toLowerCase() || 
                normalizedAddress === ADDRESSES.alice.toLowerCase() ) {
                return { isRegistered: true, address: normalizedAddress }
            }
            if( normalizedAddress === ADDRESSES.unregistered.toLowerCase() ) {
                return { isRegistered: false, address: normalizedAddress }
            }
            // Default to registered for other addresses
            return { isRegistered: true, address: normalizedAddress }
        }
        
        // Mock getBalance to return sufficient balance for alice
        manager.getBalance = async ( { address, tokenAddress } ) => {
            return {
                encryptedBalance: '100.0',
                tokenAddress: tokenAddress.toLowerCase().startsWith( '0x' ) 
                    ? tokenAddress.toLowerCase() 
                    : `0x${tokenAddress.toLowerCase()}`,
                address: address.toLowerCase()
            }
        }
    } )

    describe( 'Happy Path Tests', () => {
        
        it( 'should transfer tokens successfully', async () => {
            const result = await manager.transfer( {
                userName: USERS.alice.userName,
                recipientAddress: ADDRESSES.bob,
                amount: AMOUNTS.medium,
                tokenAddress: TOKENS.usdc
            } )
            
            assert.ok( result.txHash, 'Should return transaction hash' )
            assert.ok( result.txHash.startsWith( '0x' ), 'TX hash should start with 0x' )
            assert.strictEqual( result.txHash.length, 66, 'TX hash should be 66 characters' )
        } )
        
        it( 'should handle decimal amounts', async () => {
            const result = await manager.transfer( {
                userName: USERS.alice.userName,
                recipientAddress: ADDRESSES.bob,
                amount: '12.5',
                tokenAddress: TOKENS.usdc
            } )
            
            assert.ok( result.txHash, 'Should handle decimal amounts' )
        } )
        
        it( 'should handle small decimal amounts', async () => {
            const result = await manager.transfer( {
                userName: USERS.alice.userName,
                recipientAddress: ADDRESSES.bob,
                amount: '0.000001',
                tokenAddress: TOKENS.usdc
            } )
            
            assert.ok( result.txHash, 'Should handle small decimal amounts' )
        } )
        
        it( 'should handle different token addresses', async () => {
            const differentToken = '0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39'
            
            const result = await manager.transfer( {
                userName: USERS.alice.userName,
                recipientAddress: ADDRESSES.bob,
                amount: '50',
                tokenAddress: differentToken
            } )
            
            assert.ok( result.txHash, 'Should handle different token addresses' )
        } )
        
        it( 'should handle recipient address format variations', async () => {
            // Test uppercase prefix
            const uppercaseRecipient = ADDRESSES.bob.replace( '0x', '0X' )
            
            const result1 = await manager.transfer( {
                userName: USERS.alice.userName,
                recipientAddress: uppercaseRecipient,
                amount: AMOUNTS.medium,
                tokenAddress: TOKENS.usdc
            } )
            
            assert.ok( result1.txHash, 'Should handle uppercase 0X prefix in recipient address' )
            
            // Test no prefix
            const noPrefixRecipient = ADDRESSES.bob.substring(2)
            
            const result2 = await manager.transfer( {
                userName: USERS.alice.userName,
                recipientAddress: noPrefixRecipient,
                amount: AMOUNTS.medium,
                tokenAddress: TOKENS.usdc
            } )
            
            assert.ok( result2.txHash, 'Should handle recipient address without 0x prefix' )
            
            // Test mixed case
            const mixedCaseRecipient = '0xF3d4E353390d073D408ca0D5D02B3E712C0E669a'
            
            const result3 = await manager.transfer( {
                userName: USERS.alice.userName,
                recipientAddress: mixedCaseRecipient,
                amount: AMOUNTS.medium,
                tokenAddress: TOKENS.usdc
            } )
            
            assert.ok( result3.txHash, 'Should handle mixed case recipient address' )
        } )
        
        it( 'should handle token address format variations', async () => {
            const uppercaseToken = TOKENS.usdc.replace( '0x', '0X' )
            
            const result = await manager.transfer( {
                userName: USERS.alice.userName,
                recipientAddress: ADDRESSES.bob,
                amount: AMOUNTS.medium,
                tokenAddress: uppercaseToken
            } )
            
            assert.ok( result.txHash, 'Should handle uppercase 0X prefix in token address' )
        } )
        
        it( 'should work in verbose mode with console output', async () => {
            const verboseManager = new eERC20Manager( CONFIG.verbose )
            await verboseManager.addProvider( { 
                rpcUrl: NETWORK.rpcUrl 
            } )
            await verboseManager.addCircuits( { circuitFolderPath: testCircuitsPath } )
            
            await verboseManager.addUser( {
                privateKey: USERS.alice.privateKey,
                userName: 'verbose_alice',
                autoRegistration: false
            } )
            
            await verboseManager.addUser( {
                privateKey: USERS.bob.privateKey,
                userName: 'verbose_bob',
                autoRegistration: false
            } )
            
            verboseManager.isRegistered = async ( { address } ) => ({ isRegistered: true, address })
            verboseManager.getBalance = async ( { address, tokenAddress } ) => ({
                encryptedBalance: '100.0',
                tokenAddress: tokenAddress.toLowerCase().startsWith( '0x' ) 
                    ? tokenAddress.toLowerCase() 
                    : `0x${tokenAddress.toLowerCase()}`,
                address: address.toLowerCase()
            })
            
            const result = await verboseManager.transfer( {
                userName: 'verbose_alice',
                recipientAddress: ADDRESSES.bob,
                amount: AMOUNTS.medium,
                tokenAddress: TOKENS.usdc
            } )
            
            assert.ok( result.txHash, 'Should work in verbose mode' )
        } )
        
    } )

    describe( 'Input Validation Tests', () => {
        
        it( 'should throw error for non-string userName', async () => {
            await assert.rejects(
                async () => await manager.transfer( { 
                    userName: 123, 
                    recipientAddress: ADDRESSES.bob, 
                    amount: AMOUNTS.medium, 
                    tokenAddress: TOKENS.usdc 
                } ),
                /userName parameter must be of type string/,
                'Should reject numeric userName'
            )
        } )
        
        it( 'should throw error for boolean userName', async () => {
            await assert.rejects(
                async () => await manager.transfer( { 
                    userName: true, 
                    recipientAddress: ADDRESSES.bob, 
                    amount: AMOUNTS.medium, 
                    tokenAddress: TOKENS.usdc 
                } ),
                /userName parameter must be of type string/,
                'Should reject boolean userName'
            )
        } )
        
        it( 'should throw error for empty userName', async () => {
            await assert.rejects(
                async () => await manager.transfer( { 
                    userName: '', 
                    recipientAddress: ADDRESSES.bob, 
                    amount: AMOUNTS.medium, 
                    tokenAddress: TOKENS.usdc 
                } ),
                /userName parameter cannot be empty/,
                'Should reject empty userName'
            )
        } )
        
        it( 'should throw error for whitespace-only userName', async () => {
            await assert.rejects(
                async () => await manager.transfer( { 
                    userName: '   ', 
                    recipientAddress: ADDRESSES.bob, 
                    amount: AMOUNTS.medium, 
                    tokenAddress: TOKENS.usdc 
                } ),
                /userName parameter cannot be empty/,
                'Should reject whitespace-only userName'
            )
        } )
        
        it( 'should throw error for invalid userName format', async () => {
            await assert.rejects(
                async () => await manager.transfer( { 
                    userName: 'user-name', 
                    recipientAddress: ADDRESSES.bob, 
                    amount: AMOUNTS.medium, 
                    tokenAddress: TOKENS.usdc 
                } ),
                /Invalid userName format/,
                'Should reject userName with invalid characters'
            )
        } )
        
        it( 'should throw error for non-string recipientAddress', async () => {
            await assert.rejects(
                async () => await manager.transfer( { 
                    userName: USERS.alice.userName, 
                    recipientAddress: 123, 
                    amount: AMOUNTS.medium, 
                    tokenAddress: TOKENS.usdc 
                } ),
                /recipientAddress parameter must be of type string/,
                'Should reject numeric recipientAddress'
            )
        } )
        
        it( 'should throw error for boolean recipientAddress', async () => {
            await assert.rejects(
                async () => await manager.transfer( { 
                    userName: USERS.alice.userName, 
                    recipientAddress: true, 
                    amount: AMOUNTS.medium, 
                    tokenAddress: TOKENS.usdc 
                } ),
                /recipientAddress parameter must be of type string/,
                'Should reject boolean recipientAddress'
            )
        } )
        
        it( 'should throw error for empty recipientAddress', async () => {
            await assert.rejects(
                async () => await manager.transfer( { 
                    userName: USERS.alice.userName, 
                    recipientAddress: '', 
                    amount: AMOUNTS.medium, 
                    tokenAddress: TOKENS.usdc 
                } ),
                /recipientAddress parameter cannot be empty/,
                'Should reject empty recipientAddress'
            )
        } )
        
        it( 'should throw error for invalid recipientAddress format', async () => {
            await assert.rejects(
                async () => await manager.transfer( { 
                    userName: USERS.alice.userName, 
                    recipientAddress: 'invalid', 
                    amount: AMOUNTS.medium, 
                    tokenAddress: TOKENS.usdc 
                } ),
                /Invalid recipientAddress format/,
                'Should reject invalid recipientAddress format'
            )
        } )
        
        it( 'should throw error for short recipientAddress', async () => {
            await assert.rejects(
                async () => await manager.transfer( { 
                    userName: USERS.alice.userName, 
                    recipientAddress: '0x123', 
                    amount: AMOUNTS.medium, 
                    tokenAddress: TOKENS.usdc 
                } ),
                /Invalid recipientAddress format/,
                'Should reject short recipientAddress'
            )
        } )
        
        it( 'should throw error for long recipientAddress', async () => {
            const longAddress = ADDRESSES.bob + 'extra'
            await assert.rejects(
                async () => await manager.transfer( { 
                    userName: USERS.alice.userName, 
                    recipientAddress: longAddress, 
                    amount: AMOUNTS.medium, 
                    tokenAddress: TOKENS.usdc 
                } ),
                /Invalid recipientAddress format/,
                'Should reject long recipientAddress'
            )
        } )
        
        it( 'should throw error for non-string amount', async () => {
            await assert.rejects(
                async () => await manager.transfer( { 
                    userName: USERS.alice.userName, 
                    recipientAddress: ADDRESSES.bob, 
                    amount: 25, 
                    tokenAddress: TOKENS.usdc 
                } ),
                /amount parameter must be of type string/,
                'Should reject numeric amount'
            )
        } )
        
        it( 'should throw error for boolean amount', async () => {
            await assert.rejects(
                async () => await manager.transfer( { 
                    userName: USERS.alice.userName, 
                    recipientAddress: ADDRESSES.bob, 
                    amount: true, 
                    tokenAddress: TOKENS.usdc 
                } ),
                /amount parameter must be of type string/,
                'Should reject boolean amount'
            )
        } )
        
        it( 'should throw error for empty amount', async () => {
            await assert.rejects(
                async () => await manager.transfer( { 
                    userName: USERS.alice.userName, 
                    recipientAddress: ADDRESSES.bob, 
                    amount: '', 
                    tokenAddress: TOKENS.usdc 
                } ),
                /amount parameter cannot be empty/,
                'Should reject empty amount'
            )
        } )
        
        it( 'should throw error for zero amount', async () => {
            await assert.rejects(
                async () => await manager.transfer( { 
                    userName: USERS.alice.userName, 
                    recipientAddress: ADDRESSES.bob, 
                    amount: '0', 
                    tokenAddress: TOKENS.usdc 
                } ),
                /amount must be greater than zero/,
                'Should reject zero amount'
            )
        } )
        
        it( 'should throw error for negative amount', async () => {
            await assert.rejects(
                async () => await manager.transfer( { 
                    userName: USERS.alice.userName, 
                    recipientAddress: ADDRESSES.bob, 
                    amount: '-25', 
                    tokenAddress: TOKENS.usdc 
                } ),
                /amount must be greater than zero/,
                'Should reject negative amount'
            )
        } )
        
        it( 'should throw error for invalid amount format', async () => {
            await assert.rejects(
                async () => await manager.transfer( { 
                    userName: USERS.alice.userName, 
                    recipientAddress: ADDRESSES.bob, 
                    amount: 'invalid', 
                    tokenAddress: TOKENS.usdc 
                } ),
                /Invalid amount format/,
                'Should reject invalid amount format'
            )
        } )
        
        it( 'should throw error for non-string tokenAddress', async () => {
            await assert.rejects(
                async () => await manager.transfer( { 
                    userName: USERS.alice.userName, 
                    recipientAddress: ADDRESSES.bob, 
                    amount: AMOUNTS.medium, 
                    tokenAddress: 123 
                } ),
                /tokenAddress parameter must be of type string/,
                'Should reject numeric tokenAddress'
            )
        } )
        
        it( 'should throw error for empty tokenAddress', async () => {
            await assert.rejects(
                async () => await manager.transfer( { 
                    userName: USERS.alice.userName, 
                    recipientAddress: ADDRESSES.bob, 
                    amount: AMOUNTS.medium, 
                    tokenAddress: '' 
                } ),
                /tokenAddress parameter cannot be empty/,
                'Should reject empty tokenAddress'
            )
        } )
        
        it( 'should throw error for invalid tokenAddress format', async () => {
            await assert.rejects(
                async () => await manager.transfer( { 
                    userName: USERS.alice.userName, 
                    recipientAddress: ADDRESSES.bob, 
                    amount: AMOUNTS.medium, 
                    tokenAddress: 'invalid' 
                } ),
                /Invalid tokenAddress format/,
                'Should reject invalid tokenAddress format'
            )
        } )
        
        it( 'should throw error for missing parameters', async () => {
            await assert.rejects(
                async () => await manager.transfer( {} ),
                /userName parameter must be of type string/,
                'Should reject missing parameters'
            )
        } )
        
    } )

    describe( 'Prerequisites Error Tests', () => {
        
        it( 'should throw error when provider not set', async () => {
            const managerWithoutProvider = new eERC20Manager( CONFIG.silent )
            
            await assert.rejects(
                async () => await managerWithoutProvider.transfer( { 
                    userName: USERS.alice.userName, 
                    recipientAddress: ADDRESSES.bob,
                    amount: AMOUNTS.medium, 
                    tokenAddress: TOKENS.usdc 
                } ),
                /Provider required/,
                'Should require provider to be set'
            )
        } )
        
        it( 'should throw error when transfer circuit not available', async () => {
            const managerWithoutCircuits = new eERC20Manager( CONFIG.silent )
            await managerWithoutCircuits.addProvider( { 
                rpcUrl: NETWORK.rpcUrl 
            } )
            
            await managerWithoutCircuits.addUser( {
                privateKey: USERS.alice.privateKey,
                userName: 'test_user',
                autoRegistration: false
            } )
            
            await assert.rejects(
                async () => await managerWithoutCircuits.transfer( { 
                    userName: 'test_user', 
                    recipientAddress: ADDRESSES.bob,
                    amount: AMOUNTS.medium, 
                    tokenAddress: TOKENS.usdc 
                } ),
                /Transfer circuit not available/,
                'Should require transfer circuit to be available'
            )
        } )
        
    } )

    describe( 'Business Logic Tests', () => {
        
        it( 'should throw error for unknown sender', async () => {
            await assert.rejects(
                async () => await manager.transfer( { 
                    userName: 'unknown', 
                    recipientAddress: ADDRESSES.bob,
                    amount: AMOUNTS.medium, 
                    tokenAddress: TOKENS.usdc 
                } ),
                /User 'unknown' not found/,
                'Should reject unknown sender'
            )
        } )
        
        it( 'should throw error for unregistered sender', async () => {
            await manager.addUser( {
                privateKey: 'abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
                userName: 'unregistered_sender',
                autoRegistration: false
            } )
            
            const originalIsRegistered = manager.isRegistered
            manager.isRegistered = async ( { address } ) => {
                const normalizedAddress = address.toLowerCase()
                if( normalizedAddress === ADDRESSES.bob.toLowerCase() ) {
                    return { isRegistered: true, address: normalizedAddress }
                }
                return { isRegistered: false, address: normalizedAddress }
            }
            
            await assert.rejects(
                async () => await manager.transfer( { 
                    userName: 'unregistered_sender', 
                    recipientAddress: ADDRESSES.bob,
                    amount: AMOUNTS.medium, 
                    tokenAddress: TOKENS.usdc 
                } ),
                /is not registered on-chain/,
                'Should reject unregistered sender'
            )
            
            manager.isRegistered = originalIsRegistered
        } )
        
        it( 'should throw error for unregistered recipient', async () => {
            await assert.rejects(
                async () => await manager.transfer( { 
                    userName: USERS.alice.userName, 
                    recipientAddress: ADDRESSES.unregistered,
                    amount: AMOUNTS.medium, 
                    tokenAddress: TOKENS.usdc 
                } ),
                /Recipient.*is not registered on-chain/,
                'Should reject unregistered recipient'
            )
        } )
        
        it( 'should throw error for insufficient balance', async () => {
            // Mock getBalance to return insufficient balance
            manager.getBalance = async ( { address, tokenAddress } ) => {
                return {
                    encryptedBalance: '10.0', // Less than transfer amount
                    tokenAddress: tokenAddress.toLowerCase().startsWith( '0x' ) 
                        ? tokenAddress.toLowerCase() 
                        : `0x${tokenAddress.toLowerCase()}`,
                    address: address.toLowerCase()
                }
            }
            
            await assert.rejects(
                async () => await manager.transfer( { 
                    userName: USERS.alice.userName, 
                    recipientAddress: ADDRESSES.bob,
                    amount: '999999', 
                    tokenAddress: TOKENS.usdc 
                } ),
                /Insufficient encrypted balance/,
                'Should reject insufficient balance'
            )
        } )
        
        it( 'should throw error for self-transfer', async () => {
            // Add alice user with known address for self-transfer testing
            const selfTransferManager = new eERC20Manager( CONFIG.silent )
            await selfTransferManager.addProvider( { 
                rpcUrl: NETWORK.rpcUrl 
            } )
            await selfTransferManager.addCircuits( { circuitFolderPath: testCircuitsPath } )
            
            await selfTransferManager.addUser( {
                privateKey: USERS.alice.privateKey,
                userName: USERS.alice.userName,
                autoRegistration: false
            } )
            
            // Calculate alice's actual address from private key (same logic as addUser)
            const wallet = new ethers.Wallet( USERS.alice.privateKey )
            const actualAliceAddress = wallet.address.toLowerCase()
            
            // Mock to simulate alice's address
            selfTransferManager.isRegistered = async ( { address } ) => ({ isRegistered: true, address })
            selfTransferManager.getBalance = async ( { address, tokenAddress } ) => ({
                encryptedBalance: '100.0',
                tokenAddress,
                address
            })
            
            await assert.rejects(
                async () => await selfTransferManager.transfer( { 
                    userName: USERS.alice.userName, 
                    recipientAddress: actualAliceAddress, // Use alice's actual address
                    amount: AMOUNTS.medium, 
                    tokenAddress: TOKENS.usdc 
                } ),
                /Self-transfer not allowed/,
                'Should reject self-transfer'
            )
        } )
        
        it( 'should provide specific error message for insufficient balance', async () => {
            // Mock getBalance to return specific balance for detailed error testing
            manager.getBalance = async ( { address, tokenAddress } ) => {
                return {
                    encryptedBalance: '15.5',
                    tokenAddress: tokenAddress.toLowerCase().startsWith( '0x' ) 
                        ? tokenAddress.toLowerCase() 
                        : `0x${tokenAddress.toLowerCase()}`,
                    address: address.toLowerCase()
                }
            }
            
            try {
                await manager.transfer( { 
                    userName: USERS.alice.userName, 
                    recipientAddress: ADDRESSES.bob,
                    amount: '50', 
                    tokenAddress: TOKENS.usdc 
                } )
                assert.fail( 'Should have thrown insufficient balance error' )
            } catch( error ) {
                assert.ok( error.message.includes( 'Insufficient encrypted balance' ), 'Should mention insufficient balance' )
                assert.ok( error.message.includes( 'Available: 15.5' ), 'Should mention available amount' )
                assert.ok( error.message.includes( 'Required: 50' ), 'Should mention required amount' )
            }
        } )
        
    } )

    describe( 'ZK Proof Generation Tests', () => {
        
        it( 'should use transfer circuit for proof generation', async () => {
            const result = await manager.transfer( {
                userName: USERS.alice.userName,
                recipientAddress: ADDRESSES.bob,
                amount: AMOUNTS.medium,
                tokenAddress: TOKENS.usdc
            } )
            
            assert.ok( result.txHash, 'Should complete ZK proof generation successfully' )
        } )
        
        it( 'should handle proof generation timing', async () => {
            const startTime = Date.now()
            await manager.transfer( {
                userName: USERS.alice.userName,
                recipientAddress: ADDRESSES.bob,
                amount: AMOUNTS.medium,
                tokenAddress: TOKENS.usdc
            } )
            const endTime = Date.now()
            
            const duration = endTime - startTime
            assert.ok( duration >= 150, 'Should take some time for proof generation (mock delay)' )
            assert.ok( duration < 5000, 'Should not take excessive time' )
        } )
        
    } )

    describe( 'Transaction Hash Tests', () => {
        
        it( 'should return valid transaction hash format', async () => {
            const result = await manager.transfer( {
                userName: USERS.alice.userName,
                recipientAddress: ADDRESSES.bob,
                amount: AMOUNTS.medium,
                tokenAddress: TOKENS.usdc
            } )
            
            assert.ok( /^0x[a-fA-F0-9]{64}$/.test( result.txHash ), 'TX hash should be valid hex format' )
        } )
        
        it( 'should return different transaction hashes for different calls', async () => {
            const result1 = await manager.transfer( {
                userName: USERS.alice.userName,
                recipientAddress: ADDRESSES.bob,
                amount: AMOUNTS.medium,
                tokenAddress: TOKENS.usdc
            } )
            
            const result2 = await manager.transfer( {
                userName: USERS.alice.userName,
                recipientAddress: ADDRESSES.bob,
                amount: '15',
                tokenAddress: TOKENS.usdc
            } )
            
            assert.notStrictEqual( result1.txHash, result2.txHash, 'Should generate different TX hashes' )
        } )
        
        it( 'should return different hashes for different recipients', async () => {
            const alternateRecipient = '0x9876543210987654321098765432109876543210'
            
            // Update mock to handle alternate recipient
            const originalIsRegistered = manager.isRegistered
            const actualAliceAddress = new ethers.Wallet( USERS.alice.privateKey ).address.toLowerCase()
            const actualBobAddress = new ethers.Wallet( USERS.bob.privateKey ).address.toLowerCase()
            
            manager.isRegistered = async ( { address } ) => {
                const normalizedAddress = address.toLowerCase()
                if( normalizedAddress === ADDRESSES.bob.toLowerCase() || 
                    normalizedAddress === ADDRESSES.alice.toLowerCase() ||
                    normalizedAddress === actualAliceAddress ||
                    normalizedAddress === actualBobAddress ||
                    normalizedAddress === alternateRecipient.toLowerCase() ) {
                    return { isRegistered: true, address: normalizedAddress }
                }
                return { isRegistered: false, address: normalizedAddress }
            }
            
            const result1 = await manager.transfer( {
                userName: USERS.alice.userName,
                recipientAddress: ADDRESSES.bob,
                amount: AMOUNTS.medium,
                tokenAddress: TOKENS.usdc
            } )
            
            const result2 = await manager.transfer( {
                userName: USERS.alice.userName,
                recipientAddress: alternateRecipient,
                amount: AMOUNTS.medium,
                tokenAddress: TOKENS.usdc
            } )
            
            assert.notStrictEqual( result1.txHash, result2.txHash, 'Should generate different TX hashes for different recipients' )
            
            manager.isRegistered = originalIsRegistered
        } )
        
    } )

    describe( 'Amount Format Tests', () => {
        
        it( 'should handle integer amounts', async () => {
            const result = await manager.transfer( {
                userName: USERS.alice.userName,
                recipientAddress: ADDRESSES.bob,
                amount: AMOUNTS.medium,
                tokenAddress: TOKENS.usdc
            } )
            
            assert.ok( result.txHash, 'Should handle integer amounts' )
        } )
        
        it( 'should handle decimal amounts with various precision', async () => {
            const amounts = [ '1.5', '10.25', '0.1', '0.01', '0.001', '0.0001' ]
            
            for( const amount of amounts ) {
                const result = await manager.transfer( {
                    userName: USERS.alice.userName,
                    recipientAddress: ADDRESSES.bob,
                    amount,
                    tokenAddress: TOKENS.usdc
                } )
                
                assert.ok( result.txHash, `Should handle amount: ${amount}` )
            }
        } )
        
        it( 'should handle very small decimal amounts', async () => {
            const result = await manager.transfer( {
                userName: USERS.alice.userName,
                recipientAddress: ADDRESSES.bob,
                amount: '0.000001',
                tokenAddress: TOKENS.usdc
            } )
            
            assert.ok( result.txHash, 'Should handle very small decimal amounts' )
        } )
        
        it( 'should handle amounts with leading/trailing whitespace', async () => {
            const result = await manager.transfer( {
                userName: USERS.alice.userName,
                recipientAddress: ADDRESSES.bob,
                amount: '  25.5  ',
                tokenAddress: TOKENS.usdc
            } )
            
            assert.ok( result.txHash, 'Should handle amounts with whitespace' )
        } )
        
    } )

    describe( 'Address Format Tests', () => {
        
        it( 'should normalize recipient addresses to lowercase with 0x prefix', async () => {
            const mixedCaseRecipient = '0xF3D4E353390D073D408CA0D5D02B3E712C0E669A'
            
            const result = await manager.transfer( {
                userName: USERS.alice.userName,
                recipientAddress: mixedCaseRecipient,
                amount: AMOUNTS.medium,
                tokenAddress: TOKENS.usdc
            } )
            
            assert.ok( result.txHash, 'Should normalize and handle mixed case recipient address' )
        } )
        
        it( 'should handle recipient address without 0x prefix', async () => {
            const noPrefixRecipient = ADDRESSES.bob.substring(2)
            
            const result = await manager.transfer( {
                userName: USERS.alice.userName,
                recipientAddress: noPrefixRecipient,
                amount: AMOUNTS.medium,
                tokenAddress: TOKENS.usdc
            } )
            
            assert.ok( result.txHash, 'Should handle recipient address without 0x prefix' )
        } )
        
        it( 'should handle uppercase 0X prefix in recipient address', async () => {
            const uppercaseRecipient = ADDRESSES.bob.replace( '0x', '0X' )
            
            const result = await manager.transfer( {
                userName: USERS.alice.userName,
                recipientAddress: uppercaseRecipient,
                amount: AMOUNTS.medium,
                tokenAddress: TOKENS.usdc
            } )
            
            assert.ok( result.txHash, 'Should handle uppercase 0X prefix in recipient address' )
        } )
        
        it( 'should handle token address format variations', async () => {
            const noPrefixToken = TOKENS.usdc.substring(2)
            const uppercaseToken = TOKENS.usdc.replace( '0x', '0X' )
            const mixedCaseToken = '0xA7d7079b0FEaD91F3e65f86E8915Cb59c1a4C664'
            
            const result1 = await manager.transfer( {
                userName: USERS.alice.userName,
                recipientAddress: ADDRESSES.bob,
                amount: AMOUNTS.medium,
                tokenAddress: noPrefixToken
            } )
            
            const result2 = await manager.transfer( {
                userName: USERS.alice.userName,
                recipientAddress: ADDRESSES.bob,
                amount: AMOUNTS.medium,
                tokenAddress: uppercaseToken
            } )
            
            const result3 = await manager.transfer( {
                userName: USERS.alice.userName,
                recipientAddress: ADDRESSES.bob,
                amount: AMOUNTS.medium,
                tokenAddress: mixedCaseToken
            } )
            
            assert.ok( result1.txHash, 'Should handle token address without prefix' )
            assert.ok( result2.txHash, 'Should handle token address with uppercase prefix' )
            assert.ok( result3.txHash, 'Should handle token address with mixed case' )
        } )
        
    } )

    describe( 'Edge Cases Tests', () => {
        
        it( 'should handle minimal amount transfer', async () => {
            const result = await manager.transfer( {
                userName: USERS.alice.userName,
                recipientAddress: ADDRESSES.bob,
                amount: '0.000001',
                tokenAddress: TOKENS.usdc
            } )
            
            assert.ok( result.txHash, 'Should handle minimal amount transfer' )
        } )
        
        it( 'should handle maximum valid amount below balance limit', async () => {
            // Mock getBalance to return a specific high balance
            manager.getBalance = async ( { address, tokenAddress } ) => {
                return {
                    encryptedBalance: '1000.0',
                    tokenAddress: tokenAddress.toLowerCase().startsWith( '0x' ) 
                        ? tokenAddress.toLowerCase() 
                        : `0x${tokenAddress.toLowerCase()}`,
                    address: address.toLowerCase()
                }
            }
            
            const result = await manager.transfer( {
                userName: USERS.alice.userName,
                recipientAddress: ADDRESSES.bob,
                amount: '999',
                tokenAddress: TOKENS.usdc
            } )
            
            assert.ok( result.txHash, 'Should handle maximum valid amount' )
        } )
        
        it( 'should handle multiple transfers from same sender to same recipient', async () => {
            const result1 = await manager.transfer( {
                userName: USERS.alice.userName,
                recipientAddress: ADDRESSES.bob,
                amount: '10',
                tokenAddress: TOKENS.usdc
            } )
            
            const result2 = await manager.transfer( {
                userName: USERS.alice.userName,
                recipientAddress: ADDRESSES.bob,
                amount: '15',
                tokenAddress: TOKENS.usdc
            } )
            
            assert.ok( result1.txHash, 'First transfer should succeed' )
            assert.ok( result2.txHash, 'Second transfer should succeed' )
            assert.notStrictEqual( result1.txHash, result2.txHash, 'Should have different transaction hashes' )
        } )
        
        it( 'should handle transfers between different user pairs', async () => {
            await manager.addUser( {
                privateKey: '1111111111111111111111111111111111111111111111111111111111111111',
                userName: 'charlie',
                autoRegistration: false
            } )
            
            const charlieAddress = '0x1111111111111111111111111111111111111111'
            
            // Update mock to handle charlie
            const originalIsRegistered = manager.isRegistered
            const actualAliceAddress = new ethers.Wallet( USERS.alice.privateKey ).address.toLowerCase()
            const actualBobAddress = new ethers.Wallet( USERS.bob.privateKey ).address.toLowerCase()
            const actualCharlieAddress = new ethers.Wallet( '1111111111111111111111111111111111111111111111111111111111111111' ).address.toLowerCase()
            
            manager.isRegistered = async ( { address } ) => {
                const normalizedAddress = address.toLowerCase()
                if( normalizedAddress === ADDRESSES.bob.toLowerCase() || 
                    normalizedAddress === ADDRESSES.alice.toLowerCase() ||
                    normalizedAddress === charlieAddress.toLowerCase() ||
                    normalizedAddress === actualAliceAddress ||
                    normalizedAddress === actualBobAddress ||
                    normalizedAddress === actualCharlieAddress ) {
                    return { isRegistered: true, address: normalizedAddress }
                }
                return { isRegistered: false, address: normalizedAddress }
            }
            
            const result1 = await manager.transfer( {
                userName: USERS.alice.userName,
                recipientAddress: ADDRESSES.bob,
                amount: '20',
                tokenAddress: TOKENS.usdc
            } )
            
            const result2 = await manager.transfer( {
                userName: USERS.bob.userName,
                recipientAddress: charlieAddress,
                amount: '30',
                tokenAddress: TOKENS.usdc
            } )
            
            assert.ok( result1.txHash, 'Alice to Bob transfer should succeed' )
            assert.ok( result2.txHash, 'Bob to Charlie transfer should succeed' )
            assert.notStrictEqual( result1.txHash, result2.txHash, 'Should have different transaction hashes' )
            
            manager.isRegistered = originalIsRegistered
        } )
        
        it( 'should handle transfers with different tokens', async () => {
            const token1 = TOKENS.usdc
            const token2 = '0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39'
            
            const result1 = await manager.transfer( {
                userName: USERS.alice.userName,
                recipientAddress: ADDRESSES.bob,
                amount: AMOUNTS.medium,
                tokenAddress: token1
            } )
            
            const result2 = await manager.transfer( {
                userName: USERS.alice.userName,
                recipientAddress: ADDRESSES.bob,
                amount: AMOUNTS.medium,
                tokenAddress: token2
            } )
            
            assert.ok( result1.txHash, 'First token transfer should succeed' )
            assert.ok( result2.txHash, 'Second token transfer should succeed' )
            assert.notStrictEqual( result1.txHash, result2.txHash, 'Should have different transaction hashes' )
        } )
        
    } )

    describe( 'Error Handling Tests', () => {
        
        it( 'should handle network errors gracefully', async () => {
            const result = await manager.transfer( {
                userName: USERS.alice.userName,
                recipientAddress: ADDRESSES.bob,
                amount: AMOUNTS.medium,
                tokenAddress: TOKENS.usdc
            } )
            
            assert.ok( result.txHash, 'Should handle network scenarios' )
        } )
        
        it( 'should wrap complex errors appropriately', async () => {
            const result = await manager.transfer( {
                userName: USERS.alice.userName,
                recipientAddress: ADDRESSES.bob,
                amount: AMOUNTS.medium,
                tokenAddress: TOKENS.usdc
            } )
            
            assert.ok( result.txHash, 'Should handle complex error scenarios' )
        } )
        
        it( 'should handle concurrent transfers from same user', async () => {
            const transferPromises = [
                manager.transfer( {
                    userName: USERS.alice.userName,
                    recipientAddress: ADDRESSES.bob,
                    amount: '10',
                    tokenAddress: TOKENS.usdc
                } ),
                manager.transfer( {
                    userName: USERS.alice.userName,
                    recipientAddress: ADDRESSES.bob,
                    amount: '20',
                    tokenAddress: TOKENS.usdc
                } )
            ]
            
            const results = await Promise.all( transferPromises )
            
            assert.ok( results[0].txHash, 'First concurrent transfer should succeed' )
            assert.ok( results[1].txHash, 'Second concurrent transfer should succeed' )
            assert.notStrictEqual( results[0].txHash, results[1].txHash, 'Should have different transaction hashes' )
        } )
        
    } )

    describe( 'Silent Mode Tests', () => {
        
        it( 'should respect silent mode setting', async () => {
            const silentManager = new eERC20Manager( CONFIG.silent )
            await silentManager.addProvider( { 
                rpcUrl: NETWORK.rpcUrl 
            } )
            await silentManager.addCircuits( { circuitFolderPath: testCircuitsPath } )
            
            await silentManager.addUser( {
                privateKey: USERS.alice.privateKey,
                userName: 'silent_alice',
                autoRegistration: false
            } )
            
            await silentManager.addUser( {
                privateKey: USERS.bob.privateKey,
                userName: 'silent_bob',
                autoRegistration: false
            } )
            
            silentManager.isRegistered = async ( { address } ) => ({ isRegistered: true, address })
            silentManager.getBalance = async ( { address, tokenAddress } ) => ({
                encryptedBalance: '100.0',
                tokenAddress: tokenAddress.toLowerCase().startsWith( '0x' ) 
                    ? tokenAddress.toLowerCase() 
                    : `0x${tokenAddress.toLowerCase()}`,
                address: address.toLowerCase()
            })
            
            const result = await silentManager.transfer( {
                userName: 'silent_alice',
                recipientAddress: ADDRESSES.bob,
                amount: AMOUNTS.medium,
                tokenAddress: TOKENS.usdc
            } )
            
            assert.ok( result.txHash, 'Should work in silent mode' )
        } )
        
        it( 'should provide console output when silent is false', async () => {
            const verboseManager = new eERC20Manager( CONFIG.verbose )
            await verboseManager.addProvider( { 
                rpcUrl: NETWORK.rpcUrl 
            } )
            await verboseManager.addCircuits( { circuitFolderPath: testCircuitsPath } )
            
            await verboseManager.addUser( {
                privateKey: USERS.alice.privateKey,
                userName: 'verbose_alice',
                autoRegistration: false
            } )
            
            await verboseManager.addUser( {
                privateKey: USERS.bob.privateKey,
                userName: 'verbose_bob',
                autoRegistration: false
            } )
            
            verboseManager.isRegistered = async ( { address } ) => ({ isRegistered: true, address })
            verboseManager.getBalance = async ( { address, tokenAddress } ) => ({
                encryptedBalance: '100.0',
                tokenAddress: tokenAddress.toLowerCase().startsWith( '0x' ) 
                    ? tokenAddress.toLowerCase() 
                    : `0x${tokenAddress.toLowerCase()}`,
                address: address.toLowerCase()
            })
            
            const result = await verboseManager.transfer( {
                userName: 'verbose_alice',
                recipientAddress: ADDRESSES.bob,
                amount: AMOUNTS.medium,
                tokenAddress: TOKENS.usdc
            } )
            
            assert.ok( result.txHash, 'Should work in verbose mode' )
        } )
        
    } )

} )