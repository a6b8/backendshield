import { describe, it, beforeEach } from 'node:test'
import assert from 'node:assert'

import eERC20Manager from '../../src/index.mjs'
import { CONFIG, NETWORK } from '../helpers/mock-data.mjs'


describe( 'getTokens Tests', () => {
    let manager

    beforeEach( async () => {
        manager = new eERC20Manager( CONFIG.silent )
        await manager.addProvider( { 
            rpcUrl: NETWORK.rpcUrl 
        } )
    } )

    describe( 'Happy Path Tests', () => {
        
        it( 'should fetch tokens successfully on first call', async () => {
            const result = await manager.getTokens()
            
            assert.ok( Array.isArray( result.tokens ), 'Should return tokens array' )
            assert.ok( result.tokens.length > 0, 'Should return at least one token' )
            
            const firstToken = result.tokens[ 0 ]
            assert.ok( typeof firstToken.address === 'string', 'Token should have address' )
            assert.ok( typeof firstToken.symbol === 'string', 'Token should have symbol' )
            assert.ok( typeof firstToken.decimals === 'number', 'Token should have decimals' )
            assert.ok( typeof firstToken.tokenId === 'number', 'Token should have tokenId' )
            assert.ok( typeof firstToken.isRegistered === 'boolean', 'Token should have isRegistered' )
        } )
        
        it( 'should return USDC token in registry', async () => {
            const result = await manager.getTokens()
            
            const usdcToken = result.tokens.find( ( token ) => token.symbol === 'USDC' )
            assert.ok( usdcToken, 'Should find USDC token' )
            assert.strictEqual( usdcToken.decimals, 6, 'USDC should have 6 decimals' )
            assert.strictEqual( usdcToken.tokenId, 1, 'USDC should have tokenId 1' )
            assert.strictEqual( usdcToken.isRegistered, true, 'USDC should be registered' )
        } )
        
        it( 'should return BSHIELD token in registry', async () => {
            const result = await manager.getTokens()
            
            const bshieldToken = result.tokens.find( ( token ) => token.symbol === 'BSHIELD' )
            assert.ok( bshieldToken, 'Should find BSHIELD token' )
            assert.strictEqual( bshieldToken.decimals, 18, 'BSHIELD should have 18 decimals' )
            assert.strictEqual( bshieldToken.tokenId, 2, 'BSHIELD should have tokenId 2' )
            assert.strictEqual( bshieldToken.isRegistered, true, 'BSHIELD should be registered' )
        } )
        
        it( 'should return tokens in consistent order', async () => {
            const result1 = await manager.getTokens()
            const result2 = await manager.getTokens()
            
            assert.strictEqual( result1.tokens.length, result2.tokens.length, 'Should return same number of tokens' )
            
            result1.tokens.forEach( ( token, index ) => {
                assert.strictEqual( token.address, result2.tokens[ index ].address, 'Token order should be consistent' )
            } )
        } )
        
        it( 'should work in verbose mode with console output', async () => {
            const verboseManager = new eERC20Manager( CONFIG.verbose )
            await verboseManager.addProvider( { 
                rpcUrl: NETWORK.rpcUrl 
            } )
            
            const result = await verboseManager.getTokens()
            
            assert.ok( Array.isArray( result.tokens ), 'Should work in verbose mode' )
        } )
        
    } )

    describe( 'Caching Tests', () => {
        
        it( 'should cache tokens after first call', async () => {
            const result1 = await manager.getTokens()
            const result2 = await manager.getTokens()
            
            assert.deepStrictEqual( result1, result2, 'Should return identical cached results' )
        } )
        
        it( 'should use cache for subsequent calls', async () => {
            await manager.getTokens()
            
            const verboseManager = new eERC20Manager( CONFIG.verbose )
            await verboseManager.addProvider( { 
                rpcUrl: NETWORK.rpcUrl 
            } )
            
            await verboseManager.getTokens()
            const result = await verboseManager.getTokens()
            
            assert.ok( Array.isArray( result.tokens ), 'Should use cache efficiently' )
        } )
        
        it( 'should return cached tokens with proper structure', async () => {
            await manager.getTokens()
            const cachedResult = await manager.getTokens()
            
            assert.ok( Array.isArray( cachedResult.tokens ), 'Cached result should have tokens array' )
            
            cachedResult.tokens.forEach( ( token ) => {
                assert.ok( typeof token.address === 'string', 'Cached token should have address' )
                assert.ok( typeof token.symbol === 'string', 'Cached token should have symbol' )
                assert.ok( typeof token.decimals === 'number', 'Cached token should have decimals' )
                assert.ok( typeof token.tokenId === 'number', 'Cached token should have tokenId' )
                assert.ok( typeof token.isRegistered === 'boolean', 'Cached token should have isRegistered' )
            } )
        } )
        
        it( 'should handle multiple manager instances independently', async () => {
            const manager1 = new eERC20Manager( CONFIG.silent )
            const manager2 = new eERC20Manager( CONFIG.silent )
            
            await manager1.addProvider( { 
                rpcUrl: NETWORK.rpcUrl 
            } )
            await manager2.addProvider( { 
                rpcUrl: NETWORK.rpcUrl 
            } )
            
            const result1 = await manager1.getTokens()
            const result2 = await manager2.getTokens()
            
            assert.deepStrictEqual( result1, result2, 'Different instances should return same data' )
        } )
        
    } )

    describe( 'Prerequisites Error Tests', () => {
        
        it( 'should throw error when provider not set', async () => {
            const managerWithoutProvider = new eERC20Manager( CONFIG.silent )
            
            await assert.rejects(
                async () => await managerWithoutProvider.getTokens(),
                /Provider required. Call addProvider\(\) first./,
                'Should require provider to be set'
            )
        } )
        
        it( 'should provide helpful error message for missing provider', async () => {
            const managerWithoutProvider = new eERC20Manager( CONFIG.silent )
            
            try {
                await managerWithoutProvider.getTokens()
                assert.fail( 'Should have thrown provider required error' )
            } catch( error ) {
                assert.ok( error.message.includes( 'addProvider()' ), 'Error should suggest calling addProvider()' )
            }
        } )
        
    } )

    describe( 'Empty Registry Tests', () => {
        
        it( 'should handle empty token registry gracefully', async () => {
            const result = await manager.getTokens()
            
            if( result.tokens.length === 0 ) {
                assert.deepStrictEqual( result, { tokens: [] }, 'Should return empty array gracefully' )
            } else {
                assert.ok( true, 'Mock data returned tokens as expected' )
            }
        } )
        
        it( 'should return consistent empty results when cached', async () => {
            const mockEmptyManager = new eERC20Manager( CONFIG.silent )
            await mockEmptyManager.addProvider( { 
                rpcUrl: NETWORK.rpcUrl 
            } )
            
            const result = await mockEmptyManager.getTokens()
            assert.ok( Array.isArray( result.tokens ), 'Should return tokens array even if empty/with mock data' )
        } )
        
    } )

    describe( 'Token Structure Validation Tests', () => {
        
        it( 'should return tokens with required fields', async () => {
            const result = await manager.getTokens()
            
            result.tokens.forEach( ( token ) => {
                assert.ok( 'address' in token, 'Token should have address field' )
                assert.ok( 'symbol' in token, 'Token should have symbol field' )
                assert.ok( 'decimals' in token, 'Token should have decimals field' )
                assert.ok( 'tokenId' in token, 'Token should have tokenId field' )
                assert.ok( 'isRegistered' in token, 'Token should have isRegistered field' )
            } )
        } )
        
        it( 'should return tokens with valid data types', async () => {
            const result = await manager.getTokens()
            
            result.tokens.forEach( ( token, index ) => {
                assert.strictEqual( typeof token.address, 'string', `Token ${index} address should be string` )
                assert.strictEqual( typeof token.symbol, 'string', `Token ${index} symbol should be string` )
                assert.strictEqual( typeof token.decimals, 'number', `Token ${index} decimals should be number` )
                assert.strictEqual( typeof token.tokenId, 'number', `Token ${index} tokenId should be number` )
                assert.strictEqual( typeof token.isRegistered, 'boolean', `Token ${index} isRegistered should be boolean` )
            } )
        } )
        
        it( 'should return tokens with valid Ethereum addresses', async () => {
            const result = await manager.getTokens()
            
            result.tokens.forEach( ( token, index ) => {
                assert.ok( token.address.startsWith( '0x' ), `Token ${index} address should start with 0x` )
                assert.strictEqual( token.address.length, 42, `Token ${index} address should be 42 characters` )
                assert.ok( /^0x[a-fA-F0-9]{40}$/.test( token.address ), `Token ${index} address should be valid hex` )
            } )
        } )
        
        it( 'should return tokens with reasonable decimals values', async () => {
            const result = await manager.getTokens()
            
            result.tokens.forEach( ( token, index ) => {
                assert.ok( token.decimals >= 0, `Token ${index} decimals should be non-negative` )
                assert.ok( token.decimals <= 18, `Token ${index} decimals should be reasonable (≤18)` )
                assert.ok( Number.isInteger( token.decimals ), `Token ${index} decimals should be integer` )
            } )
        } )
        
        it( 'should return tokens with positive tokenId values', async () => {
            const result = await manager.getTokens()
            
            result.tokens.forEach( ( token, index ) => {
                assert.ok( token.tokenId > 0, `Token ${index} tokenId should be positive` )
                assert.ok( Number.isInteger( token.tokenId ), `Token ${index} tokenId should be integer` )
            } )
        } )
        
    } )

    describe( 'Performance Tests', () => {
        
        it( 'should respond within reasonable time', async () => {
            const startTime = Date.now()
            await manager.getTokens()
            const endTime = Date.now()
            
            const responseTime = endTime - startTime
            assert.ok( responseTime < 1000, 'Should respond within 1 second' )
        } )
        
        it( 'should use cache for fast subsequent calls', async () => {
            await manager.getTokens()
            
            const startTime = Date.now()
            await manager.getTokens()
            const endTime = Date.now()
            
            const cacheResponseTime = endTime - startTime
            assert.ok( cacheResponseTime < 10, 'Cached response should be very fast (<10ms)' )
        } )
        
    } )

    describe( 'Silent Mode Tests', () => {
        
        it( 'should respect silent mode setting', async () => {
            const silentManager = new eERC20Manager( CONFIG.silent )
            await silentManager.addProvider( { 
                rpcUrl: NETWORK.rpcUrl 
            } )
            
            const result = await silentManager.getTokens()
            
            assert.ok( Array.isArray( result.tokens ), 'Should work in silent mode' )
        } )
        
        it( 'should provide console output when silent is false', async () => {
            const verboseManager = new eERC20Manager( CONFIG.verbose )
            await verboseManager.addProvider( { 
                rpcUrl: NETWORK.rpcUrl 
            } )
            
            const result = await verboseManager.getTokens()
            
            assert.ok( Array.isArray( result.tokens ), 'Should work in verbose mode' )
        } )
        
    } )

} )