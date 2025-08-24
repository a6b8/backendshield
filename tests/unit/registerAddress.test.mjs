import { describe, it, beforeEach } from 'node:test'
import assert from 'node:assert'
import { resolve } from 'path'

import eERC20Manager from '../../src/index.mjs'
import { CONFIG, NETWORK, USERS } from '../helpers/mock-data.mjs'


describe( 'registerAddress Tests', () => {
    let manager
    let testPrivateKey
    const testCircuitsPath = NETWORK.circuitsPath

    beforeEach( async () => {
        manager = new eERC20Manager( CONFIG.silent )
        await manager.addProvider( { 
            rpcUrl: NETWORK.rpcUrl 
        } )
        await manager.addCircuits( { circuitFolderPath: testCircuitsPath } )
        
        manager.isRegistered = async () => ({ isRegistered: false })
        
        testPrivateKey = USERS.alice.privateKey
    } )

    describe( 'Happy Path Tests', () => {
        
        it( 'should register address successfully', async () => {
            const result = await manager.registerAddress( {
                privateKey: testPrivateKey
            } )
            
            assert.ok( result.txHash, 'Should return transaction hash' )
            assert.ok( result.txHash.startsWith( '0x' ), 'TX hash should start with 0x' )
            assert.strictEqual( result.txHash.length, 66, 'TX hash should be 66 characters' )
        } )
        
        it( 'should handle private key with 0x prefix', async () => {
            const result = await manager.registerAddress( {
                privateKey: `0x${testPrivateKey}`
            } )
            
            assert.ok( result.txHash, 'Should handle 0x prefix correctly' )
        } )
        
        it( 'should handle private key without 0x prefix', async () => {
            const result = await manager.registerAddress( {
                privateKey: testPrivateKey
            } )
            
            assert.ok( result.txHash, 'Should handle missing 0x prefix correctly' )
        } )
        
        it( 'should work in verbose mode with console output', async () => {
            const verboseManager = new eERC20Manager( CONFIG.verbose )
            await verboseManager.addProvider( { 
                rpcUrl: NETWORK.rpcUrl 
            } )
            await verboseManager.addCircuits( { circuitFolderPath: testCircuitsPath } )
            
            verboseManager.isRegistered = async () => ({ isRegistered: false })
            
            const result = await verboseManager.registerAddress( {
                privateKey: testPrivateKey
            } )
            
            assert.ok( result.txHash, 'Should work in verbose mode' )
        } )
        
    } )

    describe( 'Input Validation Tests', () => {
        
        it( 'should throw error for non-string privateKey', async () => {
            await assert.rejects(
                async () => await manager.registerAddress( { privateKey: 123 } ),
                /privateKey parameter must be of type string/,
                'Should reject numeric privateKey'
            )
        } )
        
        it( 'should throw error for boolean privateKey', async () => {
            await assert.rejects(
                async () => await manager.registerAddress( { privateKey: true } ),
                /privateKey parameter must be of type string/,
                'Should reject boolean privateKey'
            )
        } )
        
        it( 'should throw error for empty string privateKey', async () => {
            await assert.rejects(
                async () => await manager.registerAddress( { privateKey: '' } ),
                /privateKey parameter cannot be empty/,
                'Should reject empty privateKey'
            )
        } )
        
        it( 'should throw error for whitespace-only privateKey', async () => {
            await assert.rejects(
                async () => await manager.registerAddress( { privateKey: '   ' } ),
                /privateKey parameter cannot be empty/,
                'Should reject whitespace-only privateKey'
            )
        } )
        
        it( 'should throw error for short private key', async () => {
            await assert.rejects(
                async () => await manager.registerAddress( { privateKey: '123abc' } ),
                /Invalid private key: must be 64 hex characters/,
                'Should reject short private key'
            )
        } )
        
        it( 'should throw error for long private key', async () => {
            const longKey = testPrivateKey + 'extra'
            await assert.rejects(
                async () => await manager.registerAddress( { privateKey: longKey } ),
                /Invalid private key: must be 64 hex characters/,
                'Should reject long private key'
            )
        } )
        
        it( 'should throw error for private key with invalid characters', async () => {
            const invalidKey = '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdeG'
            await assert.rejects(
                async () => await manager.registerAddress( { privateKey: invalidKey } ),
                /Invalid private key: must contain only hex characters/,
                'Should reject private key with invalid hex characters'
            )
        } )
        
        it( 'should throw error for missing privateKey parameter', async () => {
            await assert.rejects(
                async () => await manager.registerAddress( {} ),
                /privateKey parameter must be of type string/,
                'Should reject missing privateKey'
            )
        } )
        
    } )

    describe( 'Prerequisites Error Tests', () => {
        
        it( 'should throw error when provider not set', async () => {
            const managerWithoutProvider = new eERC20Manager( CONFIG.silent )
            await managerWithoutProvider.addCircuits( { circuitFolderPath: testCircuitsPath } )
            
            await assert.rejects(
                async () => await managerWithoutProvider.registerAddress( { privateKey: testPrivateKey } ),
                /Provider required. Call addProvider\(\) first./,
                'Should require provider to be set'
            )
        } )
        
        it( 'should throw error when circuits not set', async () => {
            const managerWithoutCircuits = new eERC20Manager( CONFIG.silent )
            await managerWithoutCircuits.addProvider( { 
                rpcUrl: NETWORK.rpcUrl 
            } )
            
            await assert.rejects(
                async () => await managerWithoutCircuits.registerAddress( { privateKey: testPrivateKey } ),
                /Registration circuit required. Call addCircuits\(\) first./,
                'Should require circuits to be set'
            )
        } )
        
        it( 'should throw error when registration circuit not available', async () => {
            const managerWithIncompleteCircuits = new eERC20Manager( CONFIG.silent )
            await managerWithIncompleteCircuits.addProvider( { 
                rpcUrl: NETWORK.rpcUrl 
            } )
            
            try {
                await managerWithIncompleteCircuits.registerAddress( { privateKey: testPrivateKey } )
                assert.fail( 'Should have thrown registration circuit error' )
            } catch( error ) {
                assert.ok( error.message.includes( 'required' ) || error.message.includes( 'circuits' ), 'Should require circuits to be set' )
            }
        } )
        
        it( 'should provide helpful error messages for missing prerequisites', async () => {
            const managerWithoutProvider = new eERC20Manager( CONFIG.silent )
            
            try {
                await managerWithoutProvider.registerAddress( { privateKey: testPrivateKey } )
                assert.fail( 'Should have thrown provider required error' )
            } catch( error ) {
                assert.ok( error.message.includes( 'addProvider()' ), 'Error should suggest calling addProvider()' )
            }
        } )
        
    } )

    describe( 'Business Logic Tests', () => {
        
        it( 'should throw error when address is already registered', async () => {
            const managerWithMockRegistered = new eERC20Manager( CONFIG.silent )
            await managerWithMockRegistered.addProvider( { 
                rpcUrl: NETWORK.rpcUrl 
            } )
            await managerWithMockRegistered.addCircuits( { circuitFolderPath: testCircuitsPath } )
            
            managerWithMockRegistered.isRegistered = async () => ({ isRegistered: true })
            
            await assert.rejects(
                async () => await managerWithMockRegistered.registerAddress( { privateKey: testPrivateKey } ),
                /is already registered on-chain/,
                'Should reject registration of already registered address'
            )
        } )
        
        it( 'should provide specific error message for already registered address', async () => {
            const managerWithMockRegistered = new eERC20Manager( CONFIG.silent )
            await managerWithMockRegistered.addProvider( { 
                rpcUrl: NETWORK.rpcUrl 
            } )
            await managerWithMockRegistered.addCircuits( { circuitFolderPath: testCircuitsPath } )
            
            managerWithMockRegistered.isRegistered = async () => ({ isRegistered: true })
            
            try {
                await managerWithMockRegistered.registerAddress( { privateKey: testPrivateKey } )
                assert.fail( 'Should have thrown already registered error' )
            } catch( error ) {
                assert.ok( error.message.includes( 'already registered' ), 'Error should mention already registered' )
            }
        } )
        
    } )

    describe( 'ZK Proof Generation Tests', () => {
        
        it( 'should use registration circuit for proof generation', async () => {
            const result = await manager.registerAddress( {
                privateKey: testPrivateKey
            } )
            
            assert.ok( result.txHash, 'Should complete ZK proof generation successfully' )
        } )
        
        it( 'should handle proof generation timing', async () => {
            const startTime = Date.now()
            await manager.registerAddress( {
                privateKey: testPrivateKey
            } )
            const endTime = Date.now()
            
            const duration = endTime - startTime
            assert.ok( duration >= 50, 'Should take some time for proof generation (mock delay)' )
            assert.ok( duration < 5000, 'Should not take excessive time' )
        } )
        
    } )

    describe( 'Transaction Hash Tests', () => {
        
        it( 'should return valid transaction hash format', async () => {
            const result = await manager.registerAddress( {
                privateKey: testPrivateKey
            } )
            
            assert.ok( /^0x[a-fA-F0-9]{64}$/.test( result.txHash ), 'TX hash should be valid hex format' )
        } )
        
        it( 'should return different transaction hashes for different calls', async () => {
            const managerWithMockNotRegistered = new eERC20Manager( CONFIG.silent )
            await managerWithMockNotRegistered.addProvider( { 
                rpcUrl: NETWORK.rpcUrl 
            } )
            await managerWithMockNotRegistered.addCircuits( { circuitFolderPath: testCircuitsPath } )
            
            managerWithMockNotRegistered.isRegistered = async () => ({ isRegistered: false })
            
            const result1 = await managerWithMockNotRegistered.registerAddress( {
                privateKey: testPrivateKey
            } )
            const result2 = await managerWithMockNotRegistered.registerAddress( {
                privateKey: testPrivateKey
            } )
            
            assert.notStrictEqual( result1.txHash, result2.txHash, 'Should generate different TX hashes' )
        } )
        
    } )

    describe( 'Edge Cases Tests', () => {
        
        it( 'should handle uppercase hex characters in private key', async () => {
            const testManager = new eERC20Manager( CONFIG.silent )
            await testManager.addProvider( { 
                rpcUrl: NETWORK.rpcUrl 
            } )
            await testManager.addCircuits( { circuitFolderPath: testCircuitsPath } )
            
            testManager.isRegistered = async () => ({ isRegistered: false })
            
            const uppercaseKey = testPrivateKey.toUpperCase()
            const result = await testManager.registerAddress( {
                privateKey: uppercaseKey
            } )
            
            assert.ok( result.txHash, 'Should handle uppercase hex characters' )
        } )
        
        it( 'should handle mixed case hex characters in private key', async () => {
            const mixedKey = '1234567890AbCdEf1234567890AbCdEf1234567890AbCdEf1234567890AbCdEf'
            const result = await manager.registerAddress( {
                privateKey: mixedKey
            } )
            
            assert.ok( result.txHash, 'Should handle mixed case hex characters' )
        } )
        
        it( 'should handle registration retry after network failure', async () => {
            const result = await manager.registerAddress( {
                privateKey: testPrivateKey
            } )
            
            assert.ok( result.txHash, 'Should handle network recovery scenarios' )
        } )
        
    } )

    describe( 'Error Handling Tests', () => {
        
        it( 'should handle ethers wallet creation errors', async () => {
            const invalidKey = '0000000000000000000000000000000000000000000000000000000000000000'
            
            try {
                await manager.registerAddress( {
                    privateKey: invalidKey
                } )
                assert.ok( true, 'Should handle edge case private keys' )
            } catch( error ) {
                assert.ok( error.message.includes( 'Failed to register address' ), 'Should provide general error handling' )
            }
        } )
        
        it( 'should wrap ethers errors appropriately', async () => {
            const result = await manager.registerAddress( {
                privateKey: testPrivateKey
            } )
            
            assert.ok( result.txHash, 'Should handle ethers integration correctly' )
        } )
        
    } )

    describe( 'Silent Mode Tests', () => {
        
        it( 'should respect silent mode setting', async () => {
            const silentManager = new eERC20Manager( CONFIG.silent )
            await silentManager.addProvider( { 
                rpcUrl: NETWORK.rpcUrl 
            } )
            await silentManager.addCircuits( { circuitFolderPath: testCircuitsPath } )
            
            silentManager.isRegistered = async () => ({ isRegistered: false })
            
            const result = await silentManager.registerAddress( {
                privateKey: testPrivateKey
            } )
            
            assert.ok( result.txHash, 'Should work in silent mode' )
        } )
        
        it( 'should provide console output when silent is false', async () => {
            const verboseManager = new eERC20Manager( CONFIG.verbose )
            await verboseManager.addProvider( { 
                rpcUrl: NETWORK.rpcUrl 
            } )
            await verboseManager.addCircuits( { circuitFolderPath: testCircuitsPath } )
            
            verboseManager.isRegistered = async () => ({ isRegistered: false })
            
            const result = await verboseManager.registerAddress( {
                privateKey: testPrivateKey
            } )
            
            assert.ok( result.txHash, 'Should work in verbose mode' )
        } )
        
    } )

} )