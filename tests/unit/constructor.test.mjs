import { describe, it } from 'node:test'
import assert from 'node:assert'

import eERC20Manager from '../../src/index.mjs'
import { CONFIG } from '../helpers/mock-data.mjs'


describe( 'eERC20Manager Constructor Tests', () => {

    describe( 'Happy Path Tests', () => {
        
        it( 'should initialize with default parameters', () => {
            const manager = new eERC20Manager( {} )
            const config = manager.getConfig()
            
            assert.strictEqual( config.silent, false, 'Default silent should be false' )
            assert.strictEqual( config.networkAliasName, 'AVALANCHE_FUJI', 'Default network should be AVALANCHE_FUJI' )
            assert.strictEqual( config.chainId, 43113, 'Default chainId should be 43113' )
            assert.strictEqual( config.hasProvider, false, 'Should not have provider initially' )
            assert.strictEqual( config.userCount, 0, 'Should have no users initially' )
            assert.strictEqual( config.hasAuditor, false, 'Should not have auditor initially' )
        } )
        
        it( 'should initialize with AVALANCHE_FUJI network', () => {
            const manager = new eERC20Manager( { ...CONFIG.silent, networkAliasName: 'AVALANCHE_FUJI' } )
            const config = manager.getConfig()
            
            assert.strictEqual( config.networkAliasName, 'AVALANCHE_FUJI' )
            assert.strictEqual( config.chainId, 43113 )
        } )
        
        it( 'should initialize with ETHEREUM_SEPOLIA network', () => {
            const manager = new eERC20Manager( { ...CONFIG.silent, networkAliasName: 'ETHEREUM_SEPOLIA' } )
            const config = manager.getConfig()
            
            assert.strictEqual( config.networkAliasName, 'ETHEREUM_SEPOLIA' )
            assert.strictEqual( config.chainId, 11155111 )
        } )
        
        it( 'should initialize with POLYGON_MUMBAI network', () => {
            const manager = new eERC20Manager( { ...CONFIG.silent, networkAliasName: 'POLYGON_MUMBAI' } )
            const config = manager.getConfig()
            
            assert.strictEqual( config.networkAliasName, 'POLYGON_MUMBAI' )
            assert.strictEqual( config.chainId, 80001 )
        } )
        
        it( 'should initialize with silent mode enabled', () => {
            const manager = new eERC20Manager( { ...CONFIG.silent, networkAliasName: 'AVALANCHE_FUJI' } )
            const config = manager.getConfig()
            
            assert.strictEqual( config.silent, true )
        } )
        
        it( 'should initialize with silent mode disabled', () => {
            const manager = new eERC20Manager( { ...CONFIG.verbose, networkAliasName: 'AVALANCHE_FUJI' } )
            const config = manager.getConfig()
            
            assert.strictEqual( config.silent, false )
        } )
        
    } )

    describe( 'Input Validation Tests', () => {
        
        it( 'should throw error for unknown network alias', () => {
            assert.throws( 
                () => new eERC20Manager( { networkAliasName: 'UNKNOWN_NETWORK' } ),
                /Unknown network alias: UNKNOWN_NETWORK/,
                'Should throw error for unknown network'
            )
        } )
        
        it( 'should throw error for invalid silent type (string)', () => {
            assert.throws(
                () => new eERC20Manager( { silent: 'not_boolean' } ),
                /Invalid silent parameter: must be boolean/,
                'Should throw error for non-boolean silent parameter'
            )
        } )
        
        it( 'should throw error for invalid silent type (number)', () => {
            assert.throws(
                () => new eERC20Manager( { silent: 123 } ),
                /Invalid silent parameter: must be boolean/,
                'Should throw error for numeric silent parameter'
            )
        } )
        
        it( 'should throw error for invalid networkAliasName type (number)', () => {
            assert.throws(
                () => new eERC20Manager( { networkAliasName: 43113 } ),
                /Invalid networkAliasName parameter: must be string/,
                'Should throw error for numeric networkAliasName'
            )
        } )
        
        it( 'should throw error for invalid networkAliasName type (boolean)', () => {
            assert.throws(
                () => new eERC20Manager( { networkAliasName: true } ),
                /Invalid networkAliasName parameter: must be string/,
                'Should throw error for boolean networkAliasName'
            )
        } )
        
        it( 'should throw error for empty string networkAliasName', () => {
            assert.throws(
                () => new eERC20Manager( { networkAliasName: '' } ),
                /Unknown network alias/,
                'Should throw error for empty string networkAliasName'
            )
        } )
        
    } )

    describe( 'Edge Cases Tests', () => {
        
        it( 'should handle undefined silent parameter (uses default)', () => {
            const manager = new eERC20Manager( { silent: undefined, networkAliasName: 'AVALANCHE_FUJI' } )
            const config = manager.getConfig()
            
            assert.strictEqual( config.silent, false, 'Undefined silent should default to false' )
        } )
        
        it( 'should handle undefined networkAliasName parameter (uses default)', () => {
            const manager = new eERC20Manager( { silent: true, networkAliasName: undefined } )
            const config = manager.getConfig()
            
            assert.strictEqual( config.networkAliasName, 'AVALANCHE_FUJI', 'Undefined networkAliasName should default to AVALANCHE_FUJI' )
            assert.strictEqual( config.chainId, 43113 )
        } )
        
        it( 'should handle case-sensitive network names', () => {
            assert.throws(
                () => new eERC20Manager( { networkAliasName: 'avalanche_fuji' } ),
                /Unknown network alias/,
                'Should be case-sensitive for network names'
            )
        } )
        
        it( 'should handle network names with extra spaces', () => {
            assert.throws(
                () => new eERC20Manager( { networkAliasName: ' AVALANCHE_FUJI ' } ),
                /Unknown network alias/,
                'Should not trim network names'
            )
        } )
        
    } )

    describe( 'Internal State Initialization Tests', () => {
        
        it( 'should initialize all internal maps and objects', () => {
            const manager = new eERC20Manager( { silent: true } )
            const config = manager.getConfig()
            
            assert.strictEqual( config.userCount, 0, 'Users map should be empty' )
            assert.strictEqual( config.hasProvider, false, 'Provider should be null' )
            assert.strictEqual( config.hasAuditor, false, 'Auditor should be null' )
        } )
        
    } )

    describe( 'Error Message Validation Tests', () => {
        
        it( 'should provide helpful error message for unknown network with valid options', () => {
            try {
                new eERC20Manager( { networkAliasName: 'INVALID_NET' } )
                assert.fail( 'Should have thrown an error' )
            } catch( error ) {
                assert.ok( error.message.includes( 'AVALANCHE_FUJI' ), 'Error should mention AVALANCHE_FUJI' )
                assert.ok( error.message.includes( 'ETHEREUM_SEPOLIA' ), 'Error should mention ETHEREUM_SEPOLIA' )
                assert.ok( error.message.includes( 'POLYGON_MUMBAI' ), 'Error should mention POLYGON_MUMBAI' )
            }
        } )
        
    } )

} )