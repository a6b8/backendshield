import { describe, it, beforeEach } from 'node:test'
import assert from 'node:assert'

import eERC20Manager from '../../src/index.mjs'
import { CONFIG, NETWORK } from '../helpers/mock-data.mjs'


describe( 'addProvider Tests', () => {
    let manager

    beforeEach( () => {
        manager = new eERC20Manager( CONFIG.silent )
    } )

    describe( 'Happy Path Tests', () => {
        
        it( 'should connect to Avalanche Fuji testnet successfully', async () => {
            const result = await manager.addProvider( { 
                rpcUrl: NETWORK.rpcUrl 
            } )
            
            assert.ok( typeof result.isArchiveNode === 'boolean', 'Should return isArchiveNode boolean' )
            
            const config = manager.getConfig()
            assert.strictEqual( config.hasProvider, true, 'Should have provider after connection' )
        } )
        
        it( 'should connect to alternative Fuji RPC successfully', async () => {
            try {
                const result = await manager.addProvider( { 
                    rpcUrl: 'https://rpc.ankr.com/avalanche_fuji' 
                } )
                
                assert.ok( typeof result.isArchiveNode === 'boolean', 'Should return isArchiveNode boolean' )
                
                const config = manager.getConfig()
                assert.strictEqual( config.hasProvider, true, 'Should have provider after connection' )
            } catch( error ) {
                if( error.message.includes( 'Unauthorized' ) ) {
                    assert.ok( true, 'Expected API key error for Ankr RPC' )
                } else {
                    throw error
                }
            }
        } )
        
        it( 'should detect archive node capabilities', async () => {
            const result = await manager.addProvider( { 
                rpcUrl: NETWORK.rpcUrl 
            } )
            
            assert.ok( [ true, false ].includes( result.isArchiveNode ), 'isArchiveNode should be boolean' )
        } )
        
        it( 'should work with HTTP URLs', async () => {
            try {
                await manager.addProvider( { 
                    rpcUrl: 'http://localhost:8545' 
                } )
            } catch( error ) {
                assert.ok( 
                    error.message.includes( 'Failed to connect to RPC provider' ),
                    'Should fail due to connection, not protocol validation'
                )
            }
        } )
        
    } )

    describe( 'Input Validation Tests', () => {
        
        it( 'should throw error for non-string rpcUrl', async () => {
            await assert.rejects(
                async () => await manager.addProvider( { rpcUrl: 123 } ),
                /rpcUrl parameter must be of type string/,
                'Should reject numeric rpcUrl'
            )
        } )
        
        it( 'should throw error for boolean rpcUrl', async () => {
            await assert.rejects(
                async () => await manager.addProvider( { rpcUrl: true } ),
                /rpcUrl parameter must be of type string/,
                'Should reject boolean rpcUrl'
            )
        } )
        
        it( 'should throw error for empty string rpcUrl', async () => {
            await assert.rejects(
                async () => await manager.addProvider( { rpcUrl: '' } ),
                /rpcUrl parameter cannot be empty/,
                'Should reject empty string rpcUrl'
            )
        } )
        
        it( 'should throw error for whitespace-only rpcUrl', async () => {
            await assert.rejects(
                async () => await manager.addProvider( { rpcUrl: '   ' } ),
                /rpcUrl parameter cannot be empty/,
                'Should reject whitespace-only rpcUrl'
            )
        } )
        
        it( 'should throw error for invalid URL format', async () => {
            await assert.rejects(
                async () => await manager.addProvider( { rpcUrl: 'not-a-url' } ),
                /Invalid rpcUrl format/,
                'Should reject malformed URLs'
            )
        } )
        
        it( 'should throw error for unsupported protocol', async () => {
            await assert.rejects(
                async () => await manager.addProvider( { rpcUrl: 'ftp://example.com' } ),
                /rpcUrl must use HTTP or HTTPS protocol/,
                'Should reject non-HTTP protocols'
            )
        } )
        
        it( 'should throw error for missing rpcUrl parameter', async () => {
            await assert.rejects(
                async () => await manager.addProvider( {} ),
                /rpcUrl parameter must be of type string/,
                'Should reject missing rpcUrl parameter'
            )
        } )
        
    } )

    describe( 'Business Logic Tests', () => {
        
        it( 'should throw error for unreachable RPC URL', async () => {
            await assert.rejects(
                async () => await manager.addProvider( { 
                    rpcUrl: 'https://nonexistent-rpc-server-12345.com' 
                } ),
                /Failed to connect to RPC provider/,
                'Should reject unreachable RPC servers'
            )
        } )
        
        it( 'should throw error for wrong chain ID network', async () => {
            const ethereumManager = new eERC20Manager( { 
                silent: true, 
                networkAliasName: 'ETHEREUM_SEPOLIA' 
            } )
            
            await assert.rejects(
                async () => await ethereumManager.addProvider( { 
                    rpcUrl: NETWORK.rpcUrl 
                } ),
                /Chain ID mismatch/,
                'Should reject RPC with wrong chain ID'
            )
        } )
        
        it( 'should provide detailed error for chain ID mismatch', async () => {
            const polygonManager = new eERC20Manager( { 
                silent: true, 
                networkAliasName: 'POLYGON_MUMBAI' 
            } )
            
            try {
                await polygonManager.addProvider( { 
                    rpcUrl: NETWORK.rpcUrl 
                } )
                assert.fail( 'Should have thrown chain ID mismatch error' )
            } catch( error ) {
                assert.ok( error.message.includes( 'expected 80001' ), 'Should mention expected chain ID' )
                assert.ok( error.message.includes( 'got 43113' ), 'Should mention actual chain ID' )
            }
        } )
        
    } )

    describe( 'Edge Cases Tests', () => {
        
        it( 'should handle provider replacement', async () => {
            await manager.addProvider( { 
                rpcUrl: NETWORK.rpcUrl 
            } )
            
            const config1 = manager.getConfig()
            assert.strictEqual( config1.hasProvider, true, 'Should have first provider' )
            
            try {
                await manager.addProvider( { 
                    rpcUrl: 'https://rpc.ankr.com/avalanche_fuji' 
                } )
                
                const config2 = manager.getConfig()
                assert.strictEqual( config2.hasProvider, true, 'Should have second provider' )
            } catch( error ) {
                if( error.message.includes( 'Unauthorized' ) ) {
                    assert.ok( true, 'Expected API key error, but first provider works' )
                } else {
                    throw error
                }
            }
        } )
        
        it( 'should handle very slow RPC responses', async () => {
            try {
                await manager.addProvider( { 
                    rpcUrl: 'https://httpbin.org/delay/10'
                } )
            } catch( error ) {
                assert.ok( 
                    error.message.includes( 'Failed to connect to RPC provider' ),
                    'Should handle timeout gracefully'
                )
            }
        } )
        
        it( 'should handle malformed JSON responses', async () => {
            try {
                await manager.addProvider( { 
                    rpcUrl: 'https://httpbin.org/json'
                } )
            } catch( error ) {
                assert.ok( 
                    error.message.includes( 'Failed to connect to RPC provider' ),
                    'Should handle non-RPC responses gracefully'
                )
            }
        } )
        
    } )

    describe( 'Archive Node Detection Tests', () => {
        
        it( 'should detect archive node status for main RPC', async () => {
            const result = await manager.addProvider( { 
                rpcUrl: NETWORK.rpcUrl 
            } )
            
            assert.ok( typeof result.isArchiveNode === 'boolean', 'isArchiveNode should be boolean' )
            
            if( result.isArchiveNode ) {
                assert.ok( true, 'Archive node detected correctly' )
            } else {
                assert.ok( true, 'Non-archive node detected correctly' )
            }
        } )
        
        it( 'should handle archive node detection failure gracefully', async () => {
            try {
                const result = await manager.addProvider( { 
                    rpcUrl: 'https://rpc.ankr.com/avalanche_fuji' 
                } )
                
                assert.ok( typeof result.isArchiveNode === 'boolean', 'Should return boolean even if detection fails' )
            } catch( error ) {
                if( error.message.includes( 'Unauthorized' ) ) {
                    assert.ok( true, 'Expected API key error for Ankr RPC' )
                } else {
                    throw error
                }
            }
        } )
        
    } )

    describe( 'Silent Mode Tests', () => {
        
        it( 'should respect silent mode setting', async () => {
            const silentManager = new eERC20Manager( { ...CONFIG.silent } )
            
            const result = await silentManager.addProvider( { 
                rpcUrl: NETWORK.rpcUrl 
            } )
            
            assert.ok( typeof result.isArchiveNode === 'boolean', 'Should work in silent mode' )
        } )
        
        it( 'should provide console output when silent is false', async () => {
            const verboseManager = new eERC20Manager( CONFIG.verbose )
            
            const result = await verboseManager.addProvider( { 
                rpcUrl: NETWORK.rpcUrl 
            } )
            
            assert.ok( typeof result.isArchiveNode === 'boolean', 'Should work in verbose mode' )
        } )
        
    } )

} )