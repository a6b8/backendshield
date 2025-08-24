import { describe, it } from 'node:test'
import assert from 'node:assert'

import eERC20Manager from '../../src/index.mjs'
import { getRpcUrl } from '../helpers/integration-config.mjs'

describe( 'Provider Connection Integration Test', () => {
    
    it( 'should connect to real RPC URL from environment', async () => {
        const manager = new eERC20Manager( { silent: true } )
        
        const rpcUrl = getRpcUrl()
        console.log( '🔗 Testing provider connection' )
        console.log( '   RPC URL:', rpcUrl )
        
        const result = await manager.addProvider( { rpcUrl } )
        
        assert.ok( typeof result.isArchiveNode === 'boolean', 'Should return isArchiveNode status' )
        console.log( '   ✅ Connected successfully' )
        console.log( '      Archive Node:', result.isArchiveNode )
        
        const config = manager.getConfig()
        assert.strictEqual( config.hasProvider, true, 'Manager should have provider after connection' )
        assert.strictEqual( config.chainId, 43113, 'Should connect to Avalanche Fuji (chainId 43113)' )
        
        console.log( '   📊 Network Details:' )
        console.log( '      Network:', config.networkAliasName )
        console.log( '      Chain ID:', config.chainId )
    } )
    
} )