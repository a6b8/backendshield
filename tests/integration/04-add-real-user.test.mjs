import { describe, it } from 'node:test'
import assert from 'node:assert'
import { ethers } from 'ethers'

import eERC20Manager from '../../src/index.mjs'
import { getRpcUrl, getPrivateKey1 } from '../helpers/integration-config.mjs'

describe( 'Add Real User Integration Test', () => {
    
    it( 'should add real user with private key to manager', async () => {
        const manager = new eERC20Manager( { silent: true } )
        
        const rpcUrl = getRpcUrl()
        const privateKey = getPrivateKey1()
        
        const wallet = new ethers.Wallet( privateKey )
        const expectedAddress = wallet.address
        
        console.log( '👤 Testing real user addition' )
        console.log( '   Address:', expectedAddress )
        console.log( '   RPC:', rpcUrl )
        
        await manager.addProvider( { rpcUrl } )
        
        const result = await manager.addUser( { 
            privateKey,
            userName: 'alice_real',
            autoRegistration: false
        } )
        
        assert.ok( result.userInfo, 'Should return userInfo object' )
        assert.ok( typeof result.userInfo.address === 'string', 'Should return user address' )
        assert.strictEqual( result.userInfo.address, expectedAddress, 'Should return correct address for private key' )
        assert.strictEqual( result.userInfo.userName, 'alice_real', 'Should return correct user name' )
        assert.ok( typeof result.userInfo.derivedAt === 'number', 'Should return derivation timestamp' )
        
        console.log( '   ✅ User added successfully' )
        console.log( '      User Name:', result.userInfo.userName )
        console.log( '      Address:', result.userInfo.address )
        console.log( '      Derived At:', new Date( result.userInfo.derivedAt ).toISOString() )
        
        const config = manager.getConfig()
        assert.strictEqual( config.userCount, 1, 'Manager should have 1 user' )
        
        console.log( '   📊 Manager Status:' )
        console.log( '      Total users in manager:', config.userCount )
    } )
    
} )