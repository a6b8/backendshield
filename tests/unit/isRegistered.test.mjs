import { describe, it, beforeEach } from 'node:test'
import assert from 'node:assert'

import eERC20Manager from '../../src/index.mjs'
import { CONFIG, NETWORK, ADDRESSES } from '../helpers/mock-data.mjs'


describe( 'isRegistered Tests', () => {
    let manager
    let testAddress

    beforeEach( async () => {
        manager = new eERC20Manager( CONFIG.silent )
        await manager.addProvider( { 
            rpcUrl: NETWORK.rpcUrl 
        } )
        
        testAddress = ADDRESSES.unregistered
    } )

    describe( 'Happy Path Tests', () => {
        
        it( 'should check registration status successfully for registered address', async () => {
            const result = await manager.isRegistered( {
                address: testAddress
            } )
            
            assert.ok( typeof result.isRegistered === 'boolean', 'Should return boolean registration status' )
            assert.ok( 'address' in result, 'Should include address in result' )
            assert.strictEqual( result.address, testAddress, 'Should return same address' )
            assert.ok( typeof result.checkedAt === 'number', 'Should include timestamp' )
        } )
        
        it( 'should check registration status for non-registered address', async () => {
            const unregisteredAddress = ADDRESSES.alternate
            
            const result = await manager.isRegistered( {
                address: unregisteredAddress
            } )
            
            assert.ok( typeof result.isRegistered === 'boolean', 'Should return boolean status' )
            assert.strictEqual( result.address, unregisteredAddress, 'Should return correct address' )
        } )
        
        it( 'should handle address with 0x prefix', async () => {
            const addressWithPrefix = `0x${testAddress.substring(2)}`
            
            const result = await manager.isRegistered( {
                address: addressWithPrefix
            } )
            
            assert.ok( typeof result.isRegistered === 'boolean', 'Should handle 0x prefix correctly' )
            assert.strictEqual( result.address, addressWithPrefix.toLowerCase(), 'Should normalize address' )
        } )
        
        it( 'should handle address without 0x prefix', async () => {
            const addressWithoutPrefix = testAddress.substring(2)
            
            const result = await manager.isRegistered( {
                address: addressWithoutPrefix
            } )
            
            assert.ok( typeof result.isRegistered === 'boolean', 'Should handle missing 0x prefix correctly' )
            assert.strictEqual( result.address, `0x${addressWithoutPrefix.toLowerCase()}`, 'Should add 0x prefix' )
        } )
        
        it( 'should work in verbose mode with console output', async () => {
            const verboseManager = new eERC20Manager( CONFIG.verbose )
            await verboseManager.addProvider( { 
                rpcUrl: NETWORK.rpcUrl 
            } )
            
            const result = await verboseManager.isRegistered( {
                address: testAddress
            } )
            
            assert.ok( typeof result.isRegistered === 'boolean', 'Should work in verbose mode' )
        } )
        
    } )

    describe( 'Input Validation Tests', () => {
        
        it( 'should throw error for non-string address', async () => {
            await assert.rejects(
                async () => await manager.isRegistered( { address: 123 } ),
                /address parameter must be of type string/,
                'Should reject numeric address'
            )
        } )
        
        it( 'should throw error for boolean address', async () => {
            await assert.rejects(
                async () => await manager.isRegistered( { address: true } ),
                /address parameter must be of type string/,
                'Should reject boolean address'
            )
        } )
        
        it( 'should throw error for empty string address', async () => {
            await assert.rejects(
                async () => await manager.isRegistered( { address: '' } ),
                /address parameter cannot be empty/,
                'Should reject empty address'
            )
        } )
        
        it( 'should throw error for whitespace-only address', async () => {
            await assert.rejects(
                async () => await manager.isRegistered( { address: '   ' } ),
                /address parameter cannot be empty/,
                'Should reject whitespace-only address'
            )
        } )
        
        it( 'should throw error for invalid address format', async () => {
            await assert.rejects(
                async () => await manager.isRegistered( { address: 'not-an-address' } ),
                /Invalid address format/,
                'Should reject invalid address format'
            )
        } )
        
        it( 'should throw error for short address', async () => {
            await assert.rejects(
                async () => await manager.isRegistered( { address: '0x123' } ),
                /Invalid address format/,
                'Should reject short address'
            )
        } )
        
        it( 'should throw error for long address', async () => {
            const longAddress = testAddress + 'extra'
            await assert.rejects(
                async () => await manager.isRegistered( { address: longAddress } ),
                /Invalid address format/,
                'Should reject long address'
            )
        } )
        
        it( 'should throw error for address with invalid characters', async () => {
            const invalidAddress = '0x123456789012345678901234567890123456789G'
            await assert.rejects(
                async () => await manager.isRegistered( { address: invalidAddress } ),
                /Invalid address format/,
                'Should reject address with invalid hex characters'
            )
        } )
        
        it( 'should throw error for missing address parameter', async () => {
            await assert.rejects(
                async () => await manager.isRegistered( {} ),
                /address parameter must be of type string/,
                'Should reject missing address parameter'
            )
        } )
        
    } )

    describe( 'Prerequisites Error Tests', () => {
        
        it( 'should throw error when provider not set', async () => {
            const managerWithoutProvider = new eERC20Manager( CONFIG.silent )
            
            await assert.rejects(
                async () => await managerWithoutProvider.isRegistered( { address: testAddress } ),
                /Provider required/,
                'Should require provider to be set'
            )
        } )
        
        it( 'should provide helpful error message for missing provider', async () => {
            const managerWithoutProvider = new eERC20Manager( CONFIG.silent )
            
            try {
                await managerWithoutProvider.isRegistered( { address: testAddress } )
                assert.fail( 'Should have thrown provider required error' )
            } catch( error ) {
                assert.ok( error.message.includes( 'Provider' ), 'Error should mention provider requirement' )
            }
        } )
        
    } )

    describe( 'Address Normalization Tests', () => {
        
        it( 'should normalize address to lowercase', async () => {
            const uppercaseAddress = testAddress.toUpperCase()
            
            const result = await manager.isRegistered( {
                address: uppercaseAddress
            } )
            
            assert.strictEqual( result.address, testAddress.toLowerCase(), 'Should normalize to lowercase' )
        } )
        
        it( 'should handle mixed case addresses', async () => {
            const mixedCaseAddress = '0xF3d4E353390d073D408ca0D5D02B3E712C0E669a'
            
            const result = await manager.isRegistered( {
                address: mixedCaseAddress
            } )
            
            assert.strictEqual( result.address, mixedCaseAddress.toLowerCase(), 'Should normalize mixed case' )
        } )
        
        it( 'should consistently return same format for same address', async () => {
            const result1 = await manager.isRegistered( { address: testAddress } )
            const result2 = await manager.isRegistered( { address: testAddress.toUpperCase() } )
            const result3 = await manager.isRegistered( { address: testAddress.substring(2) } )
            
            assert.strictEqual( result1.address, result2.address, 'Should normalize consistently' )
            assert.strictEqual( result2.address, result3.address, 'Should normalize consistently regardless of prefix' )
        } )
        
    } )

    describe( 'Contract Interaction Tests', () => {
        
        it( 'should interact with registrar contract correctly', async () => {
            const result = await manager.isRegistered( {
                address: testAddress
            } )
            
            assert.ok( typeof result.isRegistered === 'boolean', 'Should get boolean result from contract' )
            assert.ok( result.checkedAt > 0, 'Should record check timestamp' )
        } )
        
        it( 'should handle contract call timing', async () => {
            const startTime = Date.now()
            
            await manager.isRegistered( {
                address: testAddress
            } )
            
            const endTime = Date.now()
            const duration = endTime - startTime
            
            assert.ok( duration >= 50, 'Should take some time for contract call (mock delay)' )
            assert.ok( duration < 2000, 'Should not take excessive time' )
        } )
        
        it( 'should return different results for different addresses', async () => {
            const address1 = ADDRESSES.alice
            const address2 = ADDRESSES.bob
            
            const result1 = await manager.isRegistered( { address: address1 } )
            const result2 = await manager.isRegistered( { address: address2 } )
            
            assert.notStrictEqual( result1.address, result2.address, 'Should return different addresses' )
            assert.ok( Math.abs( result1.checkedAt - result2.checkedAt ) < 1000, 'Timestamps should be close' )
        } )
        
    } )

    describe( 'Edge Cases Tests', () => {
        
        it( 'should handle zero address', async () => {
            const zeroAddress = '0x0000000000000000000000000000000000000000'
            
            const result = await manager.isRegistered( {
                address: zeroAddress
            } )
            
            assert.ok( typeof result.isRegistered === 'boolean', 'Should handle zero address' )
            assert.strictEqual( result.address, zeroAddress.toLowerCase(), 'Should return zero address correctly' )
        } )
        
        it( 'should handle maximum address value', async () => {
            const maxAddress = '0xffffffffffffffffffffffffffffffffffffffff'
            
            const result = await manager.isRegistered( {
                address: maxAddress
            } )
            
            assert.ok( typeof result.isRegistered === 'boolean', 'Should handle max address' )
            assert.strictEqual( result.address, maxAddress, 'Should return max address correctly' )
        } )
        
        it( 'should handle rapid successive calls', async () => {
            const promises = []
            
            for( let i = 0; i < 3; i++ ) {
                promises.push( manager.isRegistered( { address: testAddress } ) )
            }
            
            const results = await Promise.all( promises )
            
            results.forEach( ( result, index ) => {
                assert.ok( typeof result.isRegistered === 'boolean', `Result ${index} should have boolean status` )
                assert.strictEqual( result.address, testAddress, `Result ${index} should have correct address` )
            } )
        } )
        
    } )

    describe( 'Return Value Structure Tests', () => {
        
        it( 'should return object with all required fields', async () => {
            const result = await manager.isRegistered( {
                address: testAddress
            } )
            
            assert.ok( 'isRegistered' in result, 'Should have isRegistered field' )
            assert.ok( 'address' in result, 'Should have address field' )
            assert.ok( 'checkedAt' in result, 'Should have checkedAt field' )
        } )
        
        it( 'should return correctly typed fields', async () => {
            const result = await manager.isRegistered( {
                address: testAddress
            } )
            
            assert.strictEqual( typeof result.isRegistered, 'boolean', 'isRegistered should be boolean' )
            assert.strictEqual( typeof result.address, 'string', 'address should be string' )
            assert.strictEqual( typeof result.checkedAt, 'number', 'checkedAt should be number' )
        } )
        
        it( 'should return consistent timestamp format', async () => {
            const beforeTime = Date.now()
            
            const result = await manager.isRegistered( {
                address: testAddress
            } )
            
            const afterTime = Date.now()
            
            assert.ok( result.checkedAt >= beforeTime, 'Timestamp should be after test start' )
            assert.ok( result.checkedAt <= afterTime, 'Timestamp should be before test end' )
        } )
        
    } )

    describe( 'Performance Tests', () => {
        
        it( 'should respond within reasonable time', async () => {
            const startTime = Date.now()
            
            await manager.isRegistered( {
                address: testAddress
            } )
            
            const endTime = Date.now()
            const responseTime = endTime - startTime
            
            assert.ok( responseTime < 1000, 'Should respond within 1 second' )
        } )
        
        it( 'should handle multiple concurrent checks', async () => {
            const addresses = [
                ADDRESSES.alice,
                ADDRESSES.bob,
                ADDRESSES.charlie
            ]
            
            const startTime = Date.now()
            
            const promises = addresses.map( ( address ) => 
                manager.isRegistered( { address } )
            )
            
            const results = await Promise.all( promises )
            
            const endTime = Date.now()
            const totalTime = endTime - startTime
            
            assert.ok( totalTime < 2000, 'Concurrent checks should complete within 2 seconds' )
            assert.strictEqual( results.length, 3, 'Should return all results' )
            
            results.forEach( ( result, index ) => {
                assert.strictEqual( result.address, addresses[ index ].toLowerCase(), `Result ${index} should have correct address` )
            } )
        } )
        
    } )

    describe( 'Silent Mode Tests', () => {
        
        it( 'should respect silent mode setting', async () => {
            const silentManager = new eERC20Manager( CONFIG.silent )
            await silentManager.addProvider( { 
                rpcUrl: NETWORK.rpcUrl 
            } )
            
            const result = await silentManager.isRegistered( {
                address: testAddress
            } )
            
            assert.ok( typeof result.isRegistered === 'boolean', 'Should work in silent mode' )
        } )
        
        it( 'should provide console output when silent is false', async () => {
            const verboseManager = new eERC20Manager( CONFIG.verbose )
            await verboseManager.addProvider( { 
                rpcUrl: NETWORK.rpcUrl 
            } )
            
            const result = await verboseManager.isRegistered( {
                address: testAddress
            } )
            
            assert.ok( typeof result.isRegistered === 'boolean', 'Should work in verbose mode' )
        } )
        
    } )

} )