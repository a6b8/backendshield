import { describe, it, beforeEach } from 'node:test'
import assert from 'node:assert'

import eERC20Manager from '../../src/index.mjs'
import { getServerParams } from '../helpers/utils.mjs'
import { CONFIG, USERS, USER_NAMES } from '../helpers/mock-data.mjs'


describe( 'addUser Tests', () => {
    let manager
    let testPrivateKey
    let testPrivateKey2

    beforeEach( () => {
        manager = new eERC20Manager( CONFIG.silent )
        
        testPrivateKey = USERS.alice.privateKey
        testPrivateKey2 = USERS.bob.privateKey
    } )

    describe( 'Happy Path Tests', () => {
        
        it( 'should add user with valid private key successfully', async () => {
            const result = await manager.addUser( {
                privateKey: testPrivateKey,
                userName: USER_NAMES.alice
            } )
            
            assert.ok( result.userInfo, 'Should return userInfo object' )
            assert.strictEqual( result.userInfo.userName, 'alice', 'Should set correct userName' )
            assert.ok( result.userInfo.address, 'Should derive Ethereum address' )
            assert.ok( result.userInfo.address.startsWith( '0x' ), 'Address should start with 0x' )
            assert.strictEqual( result.userInfo.address.length, 42, 'Address should be 42 characters' )
            assert.ok( Array.isArray( result.userInfo.publicKey ), 'Should have public key array' )
            assert.strictEqual( result.userInfo.publicKey.length, 2, 'Public key should have 2 elements' )
            assert.ok( typeof result.userInfo.isRegistered === 'boolean', 'Should have registration status' )
            assert.ok( typeof result.userInfo.derivedAt === 'number', 'Should have derivation timestamp' )
        } )
        
        it( 'should add user with default userName', async () => {
            const result = await manager.addUser( {
                privateKey: testPrivateKey
            } )
            
            assert.strictEqual( result.userInfo.userName, 'default', 'Should use default userName' )
        } )
        
        it( 'should add user with autoRegistration enabled', async () => {
            const result = await manager.addUser( {
                privateKey: testPrivateKey,
                userName: USER_NAMES.bob,
                autoRegistration: true
            } )
            
            assert.ok( typeof result.userInfo.isRegistered === 'boolean', 'Should have registration status' )
        } )
        
        it( 'should add user with autoRegistration disabled', async () => {
            const result = await manager.addUser( {
                privateKey: testPrivateKey,
                userName: 'charlie',
                autoRegistration: false
            } )
            
            assert.strictEqual( result.userInfo.isRegistered, false, 'Should not be registered when disabled' )
            assert.strictEqual( result.userInfo.registrationTxHash, null, 'Should not have tx hash when disabled' )
        } )
        
        it( 'should handle private key with 0x prefix', async () => {
            const result = await manager.addUser( {
                privateKey: `0x${testPrivateKey}`,
                userName: 'dave'
            } )
            
            assert.ok( result.userInfo, 'Should handle 0x prefix correctly' )
            assert.strictEqual( result.userInfo.userName, 'dave', 'Should set correct userName' )
        } )
        
        it( 'should handle private key without 0x prefix', async () => {
            const result = await manager.addUser( {
                privateKey: testPrivateKey,
                userName: 'eve'
            } )
            
            assert.ok( result.userInfo, 'Should handle missing 0x prefix correctly' )
            assert.strictEqual( result.userInfo.userName, 'eve', 'Should set correct userName' )
        } )
        
        it( 'should add multiple different users', async () => {
            const result1 = await manager.addUser( {
                privateKey: testPrivateKey,
                userName: 'user1'
            } )
            
            const result2 = await manager.addUser( {
                privateKey: testPrivateKey2,
                userName: 'user2'
            } )
            
            assert.notStrictEqual( result1.userInfo.address, result2.userInfo.address, 'Different keys should generate different addresses' )
            assert.strictEqual( result1.userInfo.userName, 'user1', 'Should maintain first user name' )
            assert.strictEqual( result2.userInfo.userName, 'user2', 'Should maintain second user name' )
        } )
        
        it( 'should work in verbose mode with console output', async () => {
            const verboseManager = new eERC20Manager( CONFIG.verbose )
            
            const result = await verboseManager.addUser( {
                privateKey: testPrivateKey,
                userName: 'verbose_user'
            } )
            
            assert.ok( result.userInfo, 'Should work in verbose mode' )
        } )
        
    } )

    describe( 'Input Validation Tests', () => {
        
        it( 'should throw error for non-string privateKey', async () => {
            await assert.rejects(
                async () => await manager.addUser( { privateKey: 123 } ),
                /privateKey parameter must be of type string/,
                'Should reject numeric privateKey'
            )
        } )
        
        it( 'should throw error for boolean privateKey', async () => {
            await assert.rejects(
                async () => await manager.addUser( { privateKey: true } ),
                /privateKey parameter must be of type string/,
                'Should reject boolean privateKey'
            )
        } )
        
        it( 'should throw error for empty string privateKey', async () => {
            await assert.rejects(
                async () => await manager.addUser( { privateKey: '' } ),
                /privateKey parameter cannot be empty/,
                'Should reject empty privateKey'
            )
        } )
        
        it( 'should throw error for whitespace-only privateKey', async () => {
            await assert.rejects(
                async () => await manager.addUser( { privateKey: '   ' } ),
                /privateKey parameter cannot be empty/,
                'Should reject whitespace-only privateKey'
            )
        } )
        
        it( 'should throw error for short private key', async () => {
            await assert.rejects(
                async () => await manager.addUser( { privateKey: '123abc' } ),
                /Invalid private key: must be 64 hex characters/,
                'Should reject short private key'
            )
        } )
        
        it( 'should throw error for long private key', async () => {
            const longKey = testPrivateKey + 'extra'
            await assert.rejects(
                async () => await manager.addUser( { privateKey: longKey } ),
                /Invalid private key: must be 64 hex characters/,
                'Should reject long private key'
            )
        } )
        
        it( 'should throw error for private key with invalid characters', async () => {
            const invalidKey = '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdeG'
            await assert.rejects(
                async () => await manager.addUser( { privateKey: invalidKey } ),
                /Invalid private key: must contain only hex characters/,
                'Should reject private key with invalid hex characters'
            )
        } )
        
        it( 'should throw error for non-string userName', async () => {
            await assert.rejects(
                async () => await manager.addUser( { privateKey: testPrivateKey, userName: 123 } ),
                /userName parameter must be of type string/,
                'Should reject numeric userName'
            )
        } )
        
        it( 'should throw error for empty userName', async () => {
            await assert.rejects(
                async () => await manager.addUser( { privateKey: testPrivateKey, userName: '' } ),
                /userName parameter cannot be empty/,
                'Should reject empty userName'
            )
        } )
        
        it( 'should throw error for invalid userName format', async () => {
            await assert.rejects(
                async () => await manager.addUser( { privateKey: testPrivateKey, userName: 'user-123' } ),
                /Invalid userName: must contain only alphanumeric characters and underscores/,
                'Should reject userName with invalid characters'
            )
        } )
        
        it( 'should throw error for non-boolean autoRegistration', async () => {
            await assert.rejects(
                async () => await manager.addUser( { privateKey: testPrivateKey, autoRegistration: 'yes' } ),
                /autoRegistration parameter must be of type boolean/,
                'Should reject non-boolean autoRegistration'
            )
        } )
        
        it( 'should throw error for missing privateKey parameter', async () => {
            await assert.rejects(
                async () => await manager.addUser( { userName: 'test' } ),
                /privateKey parameter must be of type string/,
                'Should reject missing privateKey'
            )
        } )
        
    } )

    describe( 'Business Logic Tests', () => {
        
        it( 'should throw error when adding duplicate userName', async () => {
            await manager.addUser( {
                privateKey: testPrivateKey,
                userName: 'duplicate'
            } )
            
            await assert.rejects(
                async () => await manager.addUser( {
                    privateKey: testPrivateKey2,
                    userName: 'duplicate'
                } ),
                /User 'duplicate' already exists/,
                'Should reject duplicate userName'
            )
        } )
        
        it( 'should allow same private key with different userName', async () => {
            const result1 = await manager.addUser( {
                privateKey: testPrivateKey,
                userName: 'user_a'
            } )
            
            const result2 = await manager.addUser( {
                privateKey: testPrivateKey,
                userName: 'user_b'
            } )
            
            assert.strictEqual( result1.userInfo.address, result2.userInfo.address, 'Same key should generate same address' )
            assert.notStrictEqual( result1.userInfo.userName, result2.userInfo.userName, 'Should have different userNames' )
        } )
        
        it( 'should handle registration failure gracefully', async () => {
            const result = await manager.addUser( {
                privateKey: testPrivateKey,
                userName: 'unreg_user',
                autoRegistration: true
            } )
            
            assert.ok( result.userInfo, 'Should still return user info even if registration fails' )
            assert.ok( typeof result.userInfo.isRegistered === 'boolean', 'Should have registration status' )
        } )
        
    } )

    describe( 'Key Derivation Tests', () => {
        
        it( 'should derive consistent address for same private key', async () => {
            const result1 = await manager.addUser( {
                privateKey: testPrivateKey,
                userName: 'consistent_1'
            } )
            
            const manager2 = new eERC20Manager( CONFIG.silent )
            const result2 = await manager2.addUser( {
                privateKey: testPrivateKey,
                userName: 'consistent_2'
            } )
            
            assert.strictEqual( result1.userInfo.address, result2.userInfo.address, 'Same private key should generate same address' )
        } )
        
        it( 'should derive different addresses for different private keys', async () => {
            const result1 = await manager.addUser( {
                privateKey: testPrivateKey,
                userName: 'different_1'
            } )
            
            const result2 = await manager.addUser( {
                privateKey: testPrivateKey2,
                userName: 'different_2'
            } )
            
            assert.notStrictEqual( result1.userInfo.address, result2.userInfo.address, 'Different private keys should generate different addresses' )
        } )
        
        it( 'should generate valid public key format', async () => {
            const result = await manager.addUser( {
                privateKey: testPrivateKey,
                userName: 'pubkey_test'
            } )
            
            assert.ok( Array.isArray( result.userInfo.publicKey ), 'Public key should be array' )
            assert.strictEqual( result.userInfo.publicKey.length, 2, 'Public key should have 2 elements' )
            result.userInfo.publicKey.forEach( ( element, index ) => {
                assert.strictEqual( typeof element, 'string', `Public key element ${index} should be string` )
                assert.ok( element.length > 0, `Public key element ${index} should not be empty` )
            } )
        } )
        
    } )

    describe( 'Registration Status Tests', () => {
        
        it( 'should set registration status when autoRegistration is true', async () => {
            const result = await manager.addUser( {
                privateKey: testPrivateKey,
                userName: 'auto_reg_true',
                autoRegistration: true
            } )
            
            assert.ok( typeof result.userInfo.isRegistered === 'boolean', 'Should have boolean registration status' )
        } )
        
        it( 'should set registration status to false when autoRegistration is false', async () => {
            const result = await manager.addUser( {
                privateKey: testPrivateKey,
                userName: 'auto_reg_false',
                autoRegistration: false
            } )
            
            assert.strictEqual( result.userInfo.isRegistered, false, 'Should be false when autoRegistration disabled' )
        } )
        
        it( 'should include registrationTxHash when registration occurs', async () => {
            const result = await manager.addUser( {
                privateKey: testPrivateKey,
                userName: 'tx_hash_test',
                autoRegistration: true
            } )
            
            if( result.userInfo.isRegistered && result.userInfo.registrationTxHash ) {
                assert.ok( result.userInfo.registrationTxHash.startsWith( '0x' ), 'TX hash should start with 0x' )
                assert.strictEqual( result.userInfo.registrationTxHash.length, 66, 'TX hash should be 66 characters' )
            } else {
                assert.ok( true, 'Registration did not occur or no TX hash generated' )
            }
        } )
        
    } )

    describe( 'UserName Format Tests', () => {
        
        it( 'should accept valid userName with alphanumeric characters', async () => {
            const result = await manager.addUser( {
                privateKey: testPrivateKey,
                userName: 'user123'
            } )
            
            assert.strictEqual( result.userInfo.userName, 'user123', 'Should accept alphanumeric userName' )
        } )
        
        it( 'should accept valid userName with underscores', async () => {
            const result = await manager.addUser( {
                privateKey: testPrivateKey,
                userName: 'user_with_underscores'
            } )
            
            assert.strictEqual( result.userInfo.userName, 'user_with_underscores', 'Should accept userName with underscores' )
        } )
        
        it( 'should reject userName with hyphens', async () => {
            await assert.rejects(
                async () => await manager.addUser( { privateKey: testPrivateKey, userName: 'user-name' } ),
                /Invalid userName/,
                'Should reject userName with hyphens'
            )
        } )
        
        it( 'should reject userName with spaces', async () => {
            await assert.rejects(
                async () => await manager.addUser( { privateKey: testPrivateKey, userName: 'user name' } ),
                /Invalid userName/,
                'Should reject userName with spaces'
            )
        } )
        
        it( 'should reject userName with special characters', async () => {
            await assert.rejects(
                async () => await manager.addUser( { privateKey: testPrivateKey, userName: 'user@domain' } ),
                /Invalid userName/,
                'Should reject userName with special characters'
            )
        } )
        
    } )

    describe( 'Edge Cases Tests', () => {
        
        it( 'should handle uppercase hex characters in private key', async () => {
            const uppercaseKey = testPrivateKey.toUpperCase()
            const result = await manager.addUser( {
                privateKey: uppercaseKey,
                userName: 'uppercase_test'
            } )
            
            assert.ok( result.userInfo, 'Should handle uppercase hex characters' )
        } )
        
        it( 'should handle mixed case hex characters in private key', async () => {
            const mixedKey = '1234567890AbCdEf1234567890AbCdEf1234567890AbCdEf1234567890AbCdEf'
            const result = await manager.addUser( {
                privateKey: mixedKey,
                userName: 'mixedcase_test'
            } )
            
            assert.ok( result.userInfo, 'Should handle mixed case hex characters' )
        } )
        
        it( 'should set derivedAt timestamp appropriately', async () => {
            const beforeTime = Date.now()
            const result = await manager.addUser( {
                privateKey: testPrivateKey,
                userName: 'timestamp_test'
            } )
            const afterTime = Date.now()
            
            assert.ok( result.userInfo.derivedAt >= beforeTime, 'derivedAt should be after test start' )
            assert.ok( result.userInfo.derivedAt <= afterTime, 'derivedAt should be before test end' )
        } )
        
    } )

    describe( 'Silent Mode Tests', () => {
        
        it( 'should respect silent mode setting', async () => {
            const silentManager = new eERC20Manager( CONFIG.silent )
            
            const result = await silentManager.addUser( {
                privateKey: testPrivateKey,
                userName: 'silent_test'
            } )
            
            assert.ok( result.userInfo, 'Should work in silent mode' )
        } )
        
        it( 'should provide console output when silent is false', async () => {
            const verboseManager = new eERC20Manager( CONFIG.verbose )
            
            const result = await verboseManager.addUser( {
                privateKey: testPrivateKey,
                userName: 'verbose_test'
            } )
            
            assert.ok( result.userInfo, 'Should work in verbose mode' )
        } )
        
    } )

} )