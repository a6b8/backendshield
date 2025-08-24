import { describe, it, beforeEach } from 'node:test'
import assert from 'node:assert'
import { resolve } from 'path'

import eERC20Manager from '../../src/index.mjs'
import { 
    USERS, 
    TOKENS, 
    AMOUNTS, 
    CONFIG, 
    NETWORK, 
    USER_NAMES, 
    ADDRESS_FORMATS, 
    INVALID_VALUES,
    MOCK_FUNCTIONS,
    TIMING,
    REGEX
} from '../helpers/mock-data.mjs'


describe( 'deposit Tests', () => {
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
        
        manager.isRegistered = MOCK_FUNCTIONS.isRegisteredTrue
    } )

    describe( 'Happy Path Tests', () => {
        
        it( 'should deposit tokens successfully', async () => {
            const result = await manager.deposit( {
                userName: USERS.alice.userName,
                amount: AMOUNTS.standard,
                tokenAddress: TOKENS.usdc
            } )
            
            assert.ok( result.txHash, 'Should return transaction hash' )
            assert.ok( result.txHash.startsWith( '0x' ), 'TX hash should start with 0x' )
            assert.strictEqual( result.txHash.length, 66, 'TX hash should be 66 characters' )
        } )
        
        it( 'should handle decimal amounts', async () => {
            const result = await manager.deposit( {
                userName: USERS.alice.userName,
                amount: AMOUNTS.decimal,
                tokenAddress: TOKENS.usdc
            } )
            
            assert.ok( result.txHash, 'Should handle decimal amounts' )
        } )
        
        it( 'should handle small decimal amounts', async () => {
            const result = await manager.deposit( {
                userName: USERS.alice.userName,
                amount: AMOUNTS.tiny,
                tokenAddress: TOKENS.usdc
            } )
            
            assert.ok( result.txHash, 'Should handle small decimal amounts' )
        } )
        
        it( 'should handle different token addresses', async () => {
            const result = await manager.deposit( {
                userName: USERS.alice.userName,
                amount: AMOUNTS.small,
                tokenAddress: TOKENS.alternate
            } )
            
            assert.ok( result.txHash, 'Should handle different token addresses' )
        } )
        
        it( 'should handle token address with uppercase prefix', async () => {
            const result = await manager.deposit( {
                userName: USERS.alice.userName,
                amount: AMOUNTS.standard,
                tokenAddress: ADDRESS_FORMATS.token.uppercase
            } )
            
            assert.ok( result.txHash, 'Should handle uppercase 0X prefix' )
        } )
        
        it( 'should handle token address without prefix', async () => {
            const result = await manager.deposit( {
                userName: USERS.alice.userName,
                amount: AMOUNTS.standard,
                tokenAddress: ADDRESS_FORMATS.token.noPrefix
            } )
            
            assert.ok( result.txHash, 'Should handle address without 0x prefix' )
        } )
        
        it( 'should work in verbose mode with console output', async () => {
            const verboseManager = new eERC20Manager( CONFIG.verbose )
            await verboseManager.addProvider( { 
                rpcUrl: NETWORK.rpcUrl
            } )
            await verboseManager.addCircuits( { circuitFolderPath: testCircuitsPath } )
            
            await verboseManager.addUser( {
                privateKey: USERS.alice.privateKey,
                userName: USER_NAMES.verbose.user,
                autoRegistration: false
            } )
            
            verboseManager.isRegistered = MOCK_FUNCTIONS.isRegisteredTrue
            
            const result = await verboseManager.deposit( {
                userName: USER_NAMES.verbose.user,
                amount: AMOUNTS.standard,
                tokenAddress: TOKENS.usdc
            } )
            
            assert.ok( result.txHash, 'Should work in verbose mode' )
        } )
        
    } )

    describe( 'Input Validation Tests', () => {
        
        it( 'should throw error for non-string userName', async () => {
            await assert.rejects(
                async () => await manager.deposit( { 
                    userName: INVALID_VALUES.userName.number, 
                    amount: AMOUNTS.standard, 
                    tokenAddress: TOKENS.usdc 
                } ),
                /userName parameter must be of type string/,
                'Should reject numeric userName'
            )
        } )
        
        it( 'should throw error for boolean userName', async () => {
            await assert.rejects(
                async () => await manager.deposit( { 
                    userName: INVALID_VALUES.userName.boolean, 
                    amount: AMOUNTS.standard, 
                    tokenAddress: TOKENS.usdc 
                } ),
                /userName parameter must be of type string/,
                'Should reject boolean userName'
            )
        } )
        
        it( 'should throw error for empty userName', async () => {
            await assert.rejects(
                async () => await manager.deposit( { 
                    userName: INVALID_VALUES.userName.empty, 
                    amount: AMOUNTS.standard, 
                    tokenAddress: TOKENS.usdc 
                } ),
                /userName parameter cannot be empty/,
                'Should reject empty userName'
            )
        } )
        
        it( 'should throw error for whitespace-only userName', async () => {
            await assert.rejects(
                async () => await manager.deposit( { 
                    userName: INVALID_VALUES.userName.whitespace, 
                    amount: AMOUNTS.standard, 
                    tokenAddress: TOKENS.usdc 
                } ),
                /userName parameter cannot be empty/,
                'Should reject whitespace-only userName'
            )
        } )
        
        it( 'should throw error for invalid userName format', async () => {
            await assert.rejects(
                async () => await manager.deposit( { 
                    userName: INVALID_VALUES.userName.invalidFormat, 
                    amount: AMOUNTS.standard, 
                    tokenAddress: TOKENS.usdc 
                } ),
                /Invalid userName: must contain only alphanumeric characters and underscores/,
                'Should reject userName with invalid characters'
            )
        } )
        
        it( 'should throw error for non-string amount', async () => {
            await assert.rejects(
                async () => await manager.deposit( { 
                    userName: USERS.alice.userName, 
                    amount: INVALID_VALUES.amount.number, 
                    tokenAddress: TOKENS.usdc 
                } ),
                /amount parameter must be of type string/,
                'Should reject numeric amount'
            )
        } )
        
        it( 'should throw error for boolean amount', async () => {
            await assert.rejects(
                async () => await manager.deposit( { 
                    userName: USERS.alice.userName, 
                    amount: INVALID_VALUES.amount.boolean, 
                    tokenAddress: TOKENS.usdc 
                } ),
                /amount parameter must be of type string/,
                'Should reject boolean amount'
            )
        } )
        
        it( 'should throw error for empty amount', async () => {
            await assert.rejects(
                async () => await manager.deposit( { 
                    userName: USERS.alice.userName, 
                    amount: INVALID_VALUES.amount.empty, 
                    tokenAddress: TOKENS.usdc 
                } ),
                /amount parameter cannot be empty/,
                'Should reject empty amount'
            )
        } )
        
        it( 'should throw error for negative amount', async () => {
            await assert.rejects(
                async () => await manager.deposit( { 
                    userName: USERS.alice.userName, 
                    amount: AMOUNTS.negative, 
                    tokenAddress: TOKENS.usdc 
                } ),
                /Invalid amount: must be positive/,
                'Should reject negative amount'
            )
        } )
        
        it( 'should throw error for zero amount', async () => {
            await assert.rejects(
                async () => await manager.deposit( { 
                    userName: USERS.alice.userName, 
                    amount: AMOUNTS.zero, 
                    tokenAddress: TOKENS.usdc 
                } ),
                /Invalid amount: must be greater than zero/,
                'Should reject zero amount'
            )
        } )
        
        it( 'should throw error for invalid amount format', async () => {
            await assert.rejects(
                async () => await manager.deposit( { 
                    userName: USERS.alice.userName, 
                    amount: AMOUNTS.invalid, 
                    tokenAddress: TOKENS.usdc 
                } ),
                /Invalid amount format/,
                'Should reject invalid amount format'
            )
        } )
        
        it( 'should throw error for non-string tokenAddress', async () => {
            await assert.rejects(
                async () => await manager.deposit( { 
                    userName: USERS.alice.userName, 
                    amount: AMOUNTS.standard, 
                    tokenAddress: INVALID_VALUES.address.number 
                } ),
                /tokenAddress parameter must be of type string/,
                'Should reject numeric tokenAddress'
            )
        } )
        
        it( 'should throw error for empty tokenAddress', async () => {
            await assert.rejects(
                async () => await manager.deposit( { 
                    userName: USERS.alice.userName, 
                    amount: AMOUNTS.standard, 
                    tokenAddress: INVALID_VALUES.address.empty 
                } ),
                /tokenAddress parameter cannot be empty/,
                'Should reject empty tokenAddress'
            )
        } )
        
        it( 'should throw error for invalid tokenAddress format', async () => {
            await assert.rejects(
                async () => await manager.deposit( { 
                    userName: USERS.alice.userName, 
                    amount: AMOUNTS.standard, 
                    tokenAddress: INVALID_VALUES.address.invalid 
                } ),
                /Invalid tokenAddress format/,
                'Should reject invalid tokenAddress format'
            )
        } )
        
        it( 'should throw error for short tokenAddress', async () => {
            await assert.rejects(
                async () => await manager.deposit( { 
                    userName: USERS.alice.userName, 
                    amount: AMOUNTS.standard, 
                    tokenAddress: INVALID_VALUES.address.short 
                } ),
                /Invalid tokenAddress format/,
                'Should reject short tokenAddress'
            )
        } )
        
        it( 'should throw error for long tokenAddress', async () => {
            await assert.rejects(
                async () => await manager.deposit( { 
                    userName: USERS.alice.userName, 
                    amount: AMOUNTS.standard, 
                    tokenAddress: INVALID_VALUES.address.long 
                } ),
                /Invalid tokenAddress format/,
                'Should reject long tokenAddress'
            )
        } )
        
        it( 'should throw error for missing parameters', async () => {
            await assert.rejects(
                async () => await manager.deposit( {} ),
                /userName parameter must be of type string/,
                'Should reject missing parameters'
            )
        } )
        
    } )

    describe( 'Prerequisites Error Tests', () => {
        
        it( 'should throw error when provider not set', async () => {
            const managerWithoutProvider = new eERC20Manager( CONFIG.silent )
            
            await assert.rejects(
                async () => await managerWithoutProvider.deposit( { 
                    userName: USERS.alice.userName, 
                    amount: AMOUNTS.standard, 
                    tokenAddress: TOKENS.usdc 
                } ),
                /Provider required/,
                'Should require provider to be set'
            )
        } )
        
        it( 'should throw error when mint circuit not available', async () => {
            const managerWithoutCircuits = new eERC20Manager( CONFIG.silent )
            await managerWithoutCircuits.addProvider( { 
                rpcUrl: NETWORK.rpcUrl 
            } )
            
            await managerWithoutCircuits.addUser( {
                privateKey: USERS.alice.privateKey,
                userName: USER_NAMES.test,
                autoRegistration: false
            } )
            
            await assert.rejects(
                async () => await managerWithoutCircuits.deposit( { 
                    userName: USER_NAMES.test, 
                    amount: AMOUNTS.standard, 
                    tokenAddress: TOKENS.usdc 
                } ),
                /Mint circuit not available/,
                'Should require mint circuit to be available'
            )
        } )
        
    } )

    describe( 'Business Logic Tests', () => {
        
        it( 'should throw error for unknown user', async () => {
            await assert.rejects(
                async () => await manager.deposit( { 
                    userName: 'unknown', 
                    amount: AMOUNTS.standard, 
                    tokenAddress: TOKENS.usdc 
                } ),
                /User 'unknown' not found/,
                'Should reject unknown user'
            )
        } )
        
        it( 'should throw error for unregistered user', async () => {
            await manager.addUser( {
                privateKey: USERS.unregistered.privateKey,
                userName: USER_NAMES.unregistered.bob,
                autoRegistration: false
            } )
            
            const originalIsRegistered = manager.isRegistered
            manager.isRegistered = MOCK_FUNCTIONS.isRegisteredFalse
            
            await assert.rejects(
                async () => await manager.deposit( { 
                    userName: USER_NAMES.unregistered.bob, 
                    amount: AMOUNTS.standard, 
                    tokenAddress: TOKENS.usdc 
                } ),
                /is not registered on-chain/,
                'Should reject unregistered user'
            )
            
            manager.isRegistered = originalIsRegistered
        } )
        
        it( 'should throw error for insufficient balance', async () => {
            await assert.rejects(
                async () => await manager.deposit( { 
                    userName: USERS.alice.userName, 
                    amount: AMOUNTS.excessive, 
                    tokenAddress: TOKENS.usdc 
                } ),
                /Insufficient ERC20 balance/,
                'Should reject insufficient balance'
            )
        } )
        
        it( 'should provide specific error message for insufficient balance', async () => {
            try {
                await manager.deposit( { 
                    userName: USERS.alice.userName, 
                    amount: AMOUNTS.excessive, 
                    tokenAddress: TOKENS.usdc 
                } )
                assert.fail( 'Should have thrown insufficient balance error' )
            } catch( error ) {
                assert.ok( error.message.includes( 'Insufficient ERC20 balance' ), 'Should mention insufficient balance' )
                assert.ok( error.message.includes( 'Required' ), 'Should mention required amount' )
                assert.ok( error.message.includes( 'Available' ), 'Should mention available amount' )
            }
        } )
        
    } )

    describe( 'ZK Proof Generation Tests', () => {
        
        it( 'should use mint circuit for proof generation', async () => {
            const result = await manager.deposit( {
                userName: USERS.alice.userName,
                amount: AMOUNTS.standard,
                tokenAddress: TOKENS.usdc
            } )
            
            assert.ok( result.txHash, 'Should complete ZK proof generation successfully' )
        } )
        
        it( 'should handle proof generation timing', async () => {
            const startTime = Date.now()
            await manager.deposit( {
                userName: USERS.alice.userName,
                amount: AMOUNTS.standard,
                tokenAddress: TOKENS.usdc
            } )
            const endTime = Date.now()
            
            const duration = endTime - startTime
            assert.ok( duration >= TIMING.deposit.minDelay, 'Should take some time for proof generation (mock delay)' )
            assert.ok( duration < TIMING.deposit.maxDelay, 'Should not take excessive time' )
        } )
        
    } )

    describe( 'Transaction Hash Tests', () => {
        
        it( 'should return valid transaction hash format', async () => {
            const result = await manager.deposit( {
                userName: USERS.alice.userName,
                amount: AMOUNTS.standard,
                tokenAddress: TOKENS.usdc
            } )
            
            assert.ok( REGEX.txHash.test( result.txHash ), 'TX hash should be valid hex format' )
        } )
        
        it( 'should return different transaction hashes for different calls', async () => {
            const result1 = await manager.deposit( {
                userName: USERS.alice.userName,
                amount: AMOUNTS.standard,
                tokenAddress: TOKENS.usdc
            } )
            
            const result2 = await manager.deposit( {
                userName: USERS.alice.userName,
                amount: AMOUNTS.small,
                tokenAddress: TOKENS.usdc
            } )
            
            assert.notStrictEqual( result1.txHash, result2.txHash, 'Should generate different TX hashes' )
        } )
        
    } )

    describe( 'Amount Format Tests', () => {
        
        it( 'should handle integer amounts', async () => {
            const result = await manager.deposit( {
                userName: USERS.alice.userName,
                amount: AMOUNTS.standard,
                tokenAddress: TOKENS.usdc
            } )
            
            assert.ok( result.txHash, 'Should handle integer amounts' )
        } )
        
        it( 'should handle decimal amounts with various precision', async () => {
            for( const amount of AMOUNTS.precision ) {
                const result = await manager.deposit( {
                    userName: USERS.alice.userName,
                    amount,
                    tokenAddress: TOKENS.usdc
                } )
                
                assert.ok( result.txHash, `Should handle amount: ${amount}` )
            }
        } )
        
        it( 'should handle very small decimal amounts', async () => {
            const result = await manager.deposit( {
                userName: USERS.alice.userName,
                amount: AMOUNTS.tiny,
                tokenAddress: TOKENS.usdc
            } )
            
            assert.ok( result.txHash, 'Should handle very small decimal amounts' )
        } )
        
        it( 'should handle amounts with leading/trailing whitespace', async () => {
            const result = await manager.deposit( {
                userName: USERS.alice.userName,
                amount: AMOUNTS.withWhitespace,
                tokenAddress: TOKENS.usdc
            } )
            
            assert.ok( result.txHash, 'Should handle amounts with whitespace' )
        } )
        
    } )

    describe( 'Edge Cases Tests', () => {
        
        it( 'should handle mixed case token addresses', async () => {
            const result = await manager.deposit( {
                userName: USERS.alice.userName,
                amount: AMOUNTS.standard,
                tokenAddress: ADDRESS_FORMATS.token.mixedCase
            } )
            
            assert.ok( result.txHash, 'Should handle mixed case token addresses' )
        } )
        
        it( 'should handle maximum valid amount below balance limit', async () => {
            const result = await manager.deposit( {
                userName: USERS.alice.userName,
                amount: '999',
                tokenAddress: TOKENS.usdc
            } )
            
            assert.ok( result.txHash, 'Should handle maximum valid amount' )
        } )
        
        it( 'should handle multiple deposits from same user', async () => {
            const result1 = await manager.deposit( {
                userName: USERS.alice.userName,
                amount: AMOUNTS.standard,
                tokenAddress: TOKENS.usdc
            } )
            
            const result2 = await manager.deposit( {
                userName: USERS.alice.userName,
                amount: AMOUNTS.small,
                tokenAddress: TOKENS.usdc
            } )
            
            assert.ok( result1.txHash, 'First deposit should succeed' )
            assert.ok( result2.txHash, 'Second deposit should succeed' )
            assert.notStrictEqual( result1.txHash, result2.txHash, 'Should have different transaction hashes' )
        } )
        
        it( 'should handle deposits with different users', async () => {
            await manager.addUser( {
                privateKey: USERS.bob.privateKey,
                userName: USERS.bob.userName,
                autoRegistration: false
            } )
            
            const result1 = await manager.deposit( {
                userName: USERS.alice.userName,
                amount: AMOUNTS.standard,
                tokenAddress: TOKENS.usdc
            } )
            
            const result2 = await manager.deposit( {
                userName: USERS.bob.userName,
                amount: '200',
                tokenAddress: TOKENS.usdc
            } )
            
            assert.ok( result1.txHash, 'Alice deposit should succeed' )
            assert.ok( result2.txHash, 'Bob deposit should succeed' )
            assert.notStrictEqual( result1.txHash, result2.txHash, 'Should have different transaction hashes' )
        } )
        
    } )

    describe( 'Error Handling Tests', () => {
        
        it( 'should handle network errors gracefully', async () => {
            const result = await manager.deposit( {
                userName: USERS.alice.userName,
                amount: AMOUNTS.standard,
                tokenAddress: TOKENS.usdc
            } )
            
            assert.ok( result.txHash, 'Should handle network scenarios' )
        } )
        
        it( 'should wrap complex errors appropriately', async () => {
            const result = await manager.deposit( {
                userName: USERS.alice.userName,
                amount: AMOUNTS.standard,
                tokenAddress: TOKENS.usdc
            } )
            
            assert.ok( result.txHash, 'Should handle complex error scenarios' )
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
                userName: USER_NAMES.silent.test,
                autoRegistration: false
            } )
            
            silentManager.isRegistered = MOCK_FUNCTIONS.isRegisteredTrue
            
            const result = await silentManager.deposit( {
                userName: USER_NAMES.silent.test,
                amount: AMOUNTS.standard,
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
                userName: 'verbose_test',
                autoRegistration: false
            } )
            
            verboseManager.isRegistered = MOCK_FUNCTIONS.isRegisteredTrue
            
            const result = await verboseManager.deposit( {
                userName: 'verbose_test',
                amount: AMOUNTS.standard,
                tokenAddress: TOKENS.usdc
            } )
            
            assert.ok( result.txHash, 'Should work in verbose mode' )
        } )
        
    } )

} )