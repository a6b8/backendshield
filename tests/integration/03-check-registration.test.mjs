import { describe, it } from 'node:test'
import assert from 'node:assert'
import { ethers } from 'ethers'

import eERC20Manager from '../../src/index.mjs'
import { getRpcUrl, getPrivateKey1, getContractAddresses } from '../helpers/integration-config.mjs'

describe( 'Check Registration Status Integration Test', () => {
    
    it( 'should check real address registration status on blockchain', async () => {
        const manager = new eERC20Manager( { silent: true } )
        
        const rpcUrl = getRpcUrl()
        const privateKey = getPrivateKey1()
        const contractAddresses = getContractAddresses()
        
        const wallet = new ethers.Wallet( privateKey )
        const address = wallet.address
        
        console.log( '🔍 Testing registration status check' )
        console.log( '   Address:', address )
        console.log( '   RPC:', rpcUrl )
        
        await manager.addProvider( { rpcUrl } )
        await manager.addContracts( { addresses: contractAddresses } )
        
        const result = await manager.isRegistered( { address } )
        
        assert.ok( typeof result.isRegistered === 'boolean', 'Should return registration status as boolean' )
        assert.strictEqual( result.address.toLowerCase(), address.toLowerCase(), 'Should return normalized address' )
        assert.ok( typeof result.checkedAt === 'number', 'Should return timestamp' )
        
        console.log( '   ✅ Registration check completed' )
        console.log( '      Address:', result.address )
        console.log( '      Registration Status:', result.isRegistered )
        console.log( '      Checked At:', new Date( result.checkedAt ).toISOString() )
        
        if( result.isRegistered ) {
            console.log( '   📋 Address is registered on blockchain' )
        } else {
            console.log( '   ⚠️ Address is not yet registered' )
        }
    } )
    
} )