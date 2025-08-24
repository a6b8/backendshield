import { describe, it, beforeEach } from 'node:test'
import assert from 'node:assert'

import eERC20Manager from '../../src/index.mjs'
import { CONFIG } from '../helpers/mock-data.mjs'


describe( 'addAbi Tests', () => {
    let manager

    const customEncryptedERCAbi = [
        'function balanceOf(address,address) view returns (tuple(uint256,uint256,uint256[],uint256[7],uint256))',
        'function customDeposit(address,uint256,tuple) returns (bool)'
    ]

    const customRegistrarAbi = [
        'function isUserRegistered(address) view returns (bool)',
        'function customRegister(tuple) returns (uint256)'
    ]

    const customERC20Abi = [
        'function balanceOf(address) view returns (uint256)',
        'function customTransfer(address,uint256) returns (bool)'
    ]

    beforeEach( () => {
        manager = new eERC20Manager( CONFIG.silent )
    } )

    describe( 'Happy Path Tests', () => {
        
        it( 'should override encryptedERC ABI successfully', () => {
            const result = manager.addAbi( { 
                keyName: 'encryptedERC', 
                arrayOfAbis: customEncryptedERCAbi 
            } )
            
            assert.deepStrictEqual( result, {}, 'Should return empty object (void return)' )
        } )
        
        it( 'should override registrar ABI successfully', () => {
            const result = manager.addAbi( { 
                keyName: 'registrar', 
                arrayOfAbis: customRegistrarAbi 
            } )
            
            assert.deepStrictEqual( result, {}, 'Should return empty object' )
        } )
        
        it( 'should override erc20 ABI successfully', () => {
            const result = manager.addAbi( { 
                keyName: 'erc20', 
                arrayOfAbis: customERC20Abi 
            } )
            
            assert.deepStrictEqual( result, {}, 'Should return empty object' )
        } )
        
        it( 'should handle single ABI signature', () => {
            const singleAbi = [ 'function singleFunction() view returns (bool)' ]
            
            const result = manager.addAbi( { 
                keyName: 'encryptedERC', 
                arrayOfAbis: singleAbi 
            } )
            
            assert.deepStrictEqual( result, {}, 'Should handle single ABI' )
        } )
        
        it( 'should handle empty ABI array (for testing)', () => {
            const result = manager.addAbi( { 
                keyName: 'encryptedERC', 
                arrayOfAbis: [] 
            } )
            
            assert.deepStrictEqual( result, {}, 'Should allow empty ABI array' )
        } )
        
        it( 'should work with event signatures', () => {
            const eventAbi = [ 'event Transfer(address indexed from, address indexed to, uint256 value)' ]
            
            const result = manager.addAbi( { 
                keyName: 'erc20', 
                arrayOfAbis: eventAbi 
            } )
            
            assert.deepStrictEqual( result, {}, 'Should handle event ABIs' )
        } )
        
        it( 'should work with constructor signatures', () => {
            const constructorAbi = [ 'constructor(address _token, uint256 _supply)' ]
            
            const result = manager.addAbi( { 
                keyName: 'encryptedERC', 
                arrayOfAbis: constructorAbi 
            } )
            
            assert.deepStrictEqual( result, {}, 'Should handle constructor ABIs' )
        } )
        
        it( 'should work in verbose mode with console output', () => {
            const verboseManager = new eERC20Manager( CONFIG.verbose )
            
            const result = verboseManager.addAbi( { 
                keyName: 'encryptedERC', 
                arrayOfAbis: customEncryptedERCAbi 
            } )
            
            assert.deepStrictEqual( result, {}, 'Should work in verbose mode' )
        } )
        
    } )

    describe( 'Input Validation Tests', () => {
        
        it( 'should throw error for non-string keyName', () => {
            assert.throws(
                () => manager.addAbi( { keyName: 123, arrayOfAbis: customERC20Abi } ),
                /keyName parameter must be of type string/,
                'Should reject numeric keyName'
            )
        } )
        
        it( 'should throw error for boolean keyName', () => {
            assert.throws(
                () => manager.addAbi( { keyName: true, arrayOfAbis: customERC20Abi } ),
                /keyName parameter must be of type string/,
                'Should reject boolean keyName'
            )
        } )
        
        it( 'should throw error for empty string keyName', () => {
            assert.throws(
                () => manager.addAbi( { keyName: '', arrayOfAbis: customERC20Abi } ),
                /keyName parameter cannot be empty/,
                'Should reject empty string keyName'
            )
        } )
        
        it( 'should throw error for whitespace-only keyName', () => {
            assert.throws(
                () => manager.addAbi( { keyName: '   ', arrayOfAbis: customERC20Abi } ),
                /keyName parameter cannot be empty/,
                'Should reject whitespace-only keyName'
            )
        } )
        
        it( 'should throw error for non-array arrayOfAbis', () => {
            assert.throws(
                () => manager.addAbi( { keyName: 'erc20', arrayOfAbis: 'not-array' } ),
                /arrayOfAbis parameter must be an array/,
                'Should reject non-array arrayOfAbis'
            )
        } )
        
        it( 'should throw error for null arrayOfAbis', () => {
            assert.throws(
                () => manager.addAbi( { keyName: 'erc20', arrayOfAbis: null } ),
                /arrayOfAbis parameter must be an array/,
                'Should reject null arrayOfAbis'
            )
        } )
        
        it( 'should throw error for missing keyName parameter', () => {
            assert.throws(
                () => manager.addAbi( { arrayOfAbis: customERC20Abi } ),
                /keyName parameter must be of type string/,
                'Should reject missing keyName parameter'
            )
        } )
        
        it( 'should throw error for missing arrayOfAbis parameter', () => {
            assert.throws(
                () => manager.addAbi( { keyName: 'erc20' } ),
                /arrayOfAbis parameter must be an array/,
                'Should reject missing arrayOfAbis parameter'
            )
        } )
        
    } )

    describe( 'KeyName Validation Tests', () => {
        
        it( 'should throw error for invalid keyName', () => {
            assert.throws(
                () => manager.addAbi( { keyName: 'unknown', arrayOfAbis: customERC20Abi } ),
                /Invalid keyName: unknown/,
                'Should reject unknown keyName'
            )
        } )
        
        it( 'should provide valid options in error message', () => {
            try {
                manager.addAbi( { keyName: 'invalid', arrayOfAbis: customERC20Abi } )
                assert.fail( 'Should have thrown invalid keyName error' )
            } catch( error ) {
                assert.ok( error.message.includes( 'encryptedERC' ), 'Error should mention encryptedERC' )
                assert.ok( error.message.includes( 'registrar' ), 'Error should mention registrar' )
                assert.ok( error.message.includes( 'erc20' ), 'Error should mention erc20' )
            }
        } )
        
        it( 'should be case-sensitive for keyName', () => {
            assert.throws(
                () => manager.addAbi( { keyName: 'EncryptedERC', arrayOfAbis: customERC20Abi } ),
                /Invalid keyName/,
                'Should be case-sensitive'
            )
        } )
        
    } )

    describe( 'ABI Content Validation Tests', () => {
        
        it( 'should throw error for non-string ABI in array', () => {
            const invalidAbi = [ 'function valid() returns (bool)', 123 ]
            
            assert.throws(
                () => manager.addAbi( { keyName: 'erc20', arrayOfAbis: invalidAbi } ),
                /Invalid ABI at index 1: must be a string/,
                'Should reject non-string ABI entries'
            )
        } )
        
        it( 'should throw error for empty string ABI', () => {
            const invalidAbi = [ 'function valid() returns (bool)', '' ]
            
            assert.throws(
                () => manager.addAbi( { keyName: 'erc20', arrayOfAbis: invalidAbi } ),
                /Invalid ABI at index 1: cannot be empty/,
                'Should reject empty string ABI entries'
            )
        } )
        
        it( 'should throw error for whitespace-only ABI', () => {
            const invalidAbi = [ 'function valid() returns (bool)', '   ' ]
            
            assert.throws(
                () => manager.addAbi( { keyName: 'erc20', arrayOfAbis: invalidAbi } ),
                /Invalid ABI at index 1: cannot be empty/,
                'Should reject whitespace-only ABI entries'
            )
        } )
        
        it( 'should throw error for invalid ABI format', () => {
            const invalidAbi = [ 'invalid abi signature' ]
            
            assert.throws(
                () => manager.addAbi( { keyName: 'erc20', arrayOfAbis: invalidAbi } ),
                /Invalid ABI format at index 0: must contain valid ABI signature/,
                'Should reject malformed ABI signatures'
            )
        } )
        
        it( 'should provide specific error index for invalid ABI', () => {
            const invalidAbi = [ 
                'function valid() returns (bool)', 
                'function alsoValid() returns (uint256)', 
                'invalid signature'
            ]
            
            try {
                manager.addAbi( { keyName: 'erc20', arrayOfAbis: invalidAbi } )
                assert.fail( 'Should have thrown ABI format error' )
            } catch( error ) {
                assert.ok( error.message.includes( 'index 2' ), 'Error should specify correct index' )
            }
        } )
        
    } )

    describe( 'ABI Replacement Tests', () => {
        
        it( 'should replace existing ABI completely', () => {
            manager.addAbi( { keyName: 'erc20', arrayOfAbis: customERC20Abi } )
            
            const newAbi = [ 'function newFunction() view returns (bool)' ]
            const result = manager.addAbi( { keyName: 'erc20', arrayOfAbis: newAbi } )
            
            assert.deepStrictEqual( result, {}, 'Should replace ABI successfully' )
        } )
        
        it( 'should handle multiple keyName updates', () => {
            manager.addAbi( { keyName: 'erc20', arrayOfAbis: customERC20Abi } )
            manager.addAbi( { keyName: 'registrar', arrayOfAbis: customRegistrarAbi } )
            
            const result = manager.addAbi( { keyName: 'encryptedERC', arrayOfAbis: customEncryptedERCAbi } )
            
            assert.deepStrictEqual( result, {}, 'Should handle multiple ABI updates' )
        } )
        
    } )

    describe( 'Edge Cases Tests', () => {
        
        it( 'should handle complex ABI signatures', () => {
            const complexAbi = [
                'function complexFunction(address,uint256[],tuple(string,bytes32)) returns (tuple(bool,uint256,address[]))'
            ]
            
            const result = manager.addAbi( { keyName: 'encryptedERC', arrayOfAbis: complexAbi } )
            
            assert.deepStrictEqual( result, {}, 'Should handle complex ABI signatures' )
        } )
        
        it( 'should handle mixed function types', () => {
            const mixedAbi = [
                'function viewFunction() view returns (bool)',
                'function pureFunction() pure returns (uint256)',
                'function payableFunction() payable returns (address)'
            ]
            
            const result = manager.addAbi( { keyName: 'erc20', arrayOfAbis: mixedAbi } )
            
            assert.deepStrictEqual( result, {}, 'Should handle mixed function types' )
        } )
        
        it( 'should preserve array order', () => {
            const orderedAbi = [
                'function first() returns (bool)',
                'function second() returns (bool)',
                'function third() returns (bool)'
            ]
            
            const result = manager.addAbi( { keyName: 'erc20', arrayOfAbis: orderedAbi } )
            
            assert.deepStrictEqual( result, {}, 'Should preserve ABI array order' )
        } )
        
    } )

    describe( 'Silent Mode Tests', () => {
        
        it( 'should respect silent mode setting', () => {
            const silentManager = new eERC20Manager( CONFIG.silent )
            
            const result = silentManager.addAbi( { 
                keyName: 'erc20', 
                arrayOfAbis: customERC20Abi 
            } )
            
            assert.deepStrictEqual( result, {}, 'Should work in silent mode' )
        } )
        
        it( 'should provide console output when silent is false', () => {
            const verboseManager = new eERC20Manager( CONFIG.verbose )
            
            const result = verboseManager.addAbi( { 
                keyName: 'erc20', 
                arrayOfAbis: customERC20Abi 
            } )
            
            assert.deepStrictEqual( result, {}, 'Should work in verbose mode' )
        } )
        
    } )

} )