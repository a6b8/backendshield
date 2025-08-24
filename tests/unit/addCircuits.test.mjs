import { describe, it, beforeEach } from 'node:test'
import assert from 'node:assert'
import { resolve } from 'path'

import eERC20Manager from '../../src/index.mjs'
import { CONFIG, NETWORK } from '../helpers/mock-data.mjs'


describe( 'addCircuits Tests', () => {
    let manager
    const testCircuitsPath = NETWORK.circuitsPath
    const emptyCircuitsPath = resolve( './tests/fixtures/empty-circuits' )
    const incompleteCircuitsPath = resolve( './tests/fixtures/incomplete-circuits' )

    beforeEach( () => {
        manager = new eERC20Manager( CONFIG.silent )
    } )

    describe( 'Happy Path Tests', () => {
        
        it( 'should load complete circuit set successfully', async () => {
            const result = await manager.addCircuits( { 
                circuitFolderPath: testCircuitsPath 
            } )
            
            assert.deepStrictEqual( result, {}, 'Should return empty object (void return)' )
        } )
        
        it( 'should load only required circuits (registration + mint)', async () => {
            const result = await manager.addCircuits( { 
                circuitFolderPath: testCircuitsPath 
            } )
            
            assert.deepStrictEqual( result, {}, 'Should return empty object for minimal setup' )
        } )
        
        it( 'should handle circuits with different zkey naming', async () => {
            const result = await manager.addCircuits( { 
                circuitFolderPath: testCircuitsPath 
            } )
            
            assert.deepStrictEqual( result, {}, 'Should handle both .zkey and circuit_final.zkey naming' )
        } )
        
        it( 'should work in verbose mode with console output', async () => {
            const verboseManager = new eERC20Manager( CONFIG.verbose )
            
            const result = await verboseManager.addCircuits( { 
                circuitFolderPath: testCircuitsPath 
            } )
            
            assert.deepStrictEqual( result, {}, 'Should work in verbose mode' )
        } )
        
    } )

    describe( 'Input Validation Tests', () => {
        
        it( 'should throw error for non-string circuitFolderPath', async () => {
            await assert.rejects(
                async () => await manager.addCircuits( { circuitFolderPath: 123 } ),
                /circuitFolderPath parameter must be of type string/,
                'Should reject numeric circuitFolderPath'
            )
        } )
        
        it( 'should throw error for boolean circuitFolderPath', async () => {
            await assert.rejects(
                async () => await manager.addCircuits( { circuitFolderPath: true } ),
                /circuitFolderPath parameter must be of type string/,
                'Should reject boolean circuitFolderPath'
            )
        } )
        
        it( 'should throw error for empty string circuitFolderPath', async () => {
            await assert.rejects(
                async () => await manager.addCircuits( { circuitFolderPath: '' } ),
                /circuitFolderPath parameter cannot be empty/,
                'Should reject empty string circuitFolderPath'
            )
        } )
        
        it( 'should throw error for whitespace-only circuitFolderPath', async () => {
            await assert.rejects(
                async () => await manager.addCircuits( { circuitFolderPath: '   ' } ),
                /circuitFolderPath parameter cannot be empty/,
                'Should reject whitespace-only circuitFolderPath'
            )
        } )
        
        it( 'should throw error for missing circuitFolderPath parameter', async () => {
            await assert.rejects(
                async () => await manager.addCircuits( {} ),
                /circuitFolderPath parameter must be of type string/,
                'Should reject missing circuitFolderPath parameter'
            )
        } )
        
    } )

    describe( 'File System Validation Tests', () => {
        
        it( 'should throw error for non-existent folder', async () => {
            await assert.rejects(
                async () => await manager.addCircuits( { 
                    circuitFolderPath: './non-existent-folder' 
                } ),
                /Circuit folder not found/,
                'Should reject non-existent folders'
            )
        } )
        
        it( 'should throw error for file instead of directory', async () => {
            await assert.rejects(
                async () => await manager.addCircuits( { 
                    circuitFolderPath: './package.json' 
                } ),
                /Path is not a directory/,
                'Should reject files instead of directories'
            )
        } )
        
        it( 'should throw error for empty circuits folder', async () => {
            await assert.rejects(
                async () => await manager.addCircuits( { 
                    circuitFolderPath: emptyCircuitsPath 
                } ),
                /Missing required circuits: registration, mint/,
                'Should reject folders without required circuits'
            )
        } )
        
        it( 'should throw error for incomplete circuits', async () => {
            await assert.rejects(
                async () => await manager.addCircuits( { 
                    circuitFolderPath: incompleteCircuitsPath 
                } ),
                /Missing required circuits/,
                'Should reject incomplete circuits (missing files)'
            )
        } )
        
    } )

    describe( 'Circuit Requirements Tests', () => {
        
        it( 'should require registration circuit', async () => {
            await assert.rejects(
                async () => await manager.addCircuits( { 
                    circuitFolderPath: emptyCircuitsPath 
                } ),
                /Missing required circuits.*registration/,
                'Should require registration circuit'
            )
        } )
        
        it( 'should require mint circuit', async () => {
            await assert.rejects(
                async () => await manager.addCircuits( { 
                    circuitFolderPath: emptyCircuitsPath 
                } ),
                /Missing required circuits.*mint/,
                'Should require mint circuit'
            )
        } )
        
        it( 'should provide detailed error for missing required circuits', async () => {
            try {
                await manager.addCircuits( { 
                    circuitFolderPath: emptyCircuitsPath 
                } )
                assert.fail( 'Should have thrown missing circuits error' )
            } catch( error ) {
                assert.ok( error.message.includes( 'Registration and mint circuits are mandatory' ), 'Should explain circuit requirements' )
            }
        } )
        
    } )

    describe( 'Circuit Discovery Tests', () => {
        
        it( 'should detect wasm files correctly', async () => {
            const result = await manager.addCircuits( { 
                circuitFolderPath: testCircuitsPath 
            } )
            
            assert.deepStrictEqual( result, {}, 'Should find .wasm files' )
        } )
        
        it( 'should detect zkey files with standard naming', async () => {
            const result = await manager.addCircuits( { 
                circuitFolderPath: testCircuitsPath 
            } )
            
            assert.deepStrictEqual( result, {}, 'Should find .zkey files' )
        } )
        
        it( 'should detect zkey files with circuit_final naming', async () => {
            const result = await manager.addCircuits( { 
                circuitFolderPath: testCircuitsPath 
            } )
            
            assert.deepStrictEqual( result, {}, 'Should find circuit_final.zkey files' )
        } )
        
        it( 'should ignore unknown circuit folders', async () => {
            const result = await manager.addCircuits( { 
                circuitFolderPath: testCircuitsPath 
            } )
            
            assert.deepStrictEqual( result, {}, 'Should ignore non-standard circuit types' )
        } )
        
    } )

    describe( 'Edge Cases Tests', () => {
        
        it( 'should handle relative paths', async () => {
            const result = await manager.addCircuits( { 
                circuitFolderPath: './tests/fixtures/test-circuits' 
            } )
            
            assert.deepStrictEqual( result, {}, 'Should handle relative paths' )
        } )
        
        it( 'should handle absolute paths', async () => {
            const result = await manager.addCircuits( { 
                circuitFolderPath: testCircuitsPath 
            } )
            
            assert.deepStrictEqual( result, {}, 'Should handle absolute paths' )
        } )
        
        it( 'should handle paths with spaces', async () => {
            const result = await manager.addCircuits( { 
                circuitFolderPath: testCircuitsPath 
            } )
            
            assert.deepStrictEqual( result, {}, 'Should handle path names without issues' )
        } )
        
        it( 'should handle multiple addCircuits calls', async () => {
            await manager.addCircuits( { 
                circuitFolderPath: testCircuitsPath 
            } )
            
            const result = await manager.addCircuits( { 
                circuitFolderPath: testCircuitsPath 
            } )
            
            assert.deepStrictEqual( result, {}, 'Should handle circuit replacement' )
        } )
        
    } )

    describe( 'Silent Mode Tests', () => {
        
        it( 'should respect silent mode setting', async () => {
            const silentManager = new eERC20Manager( CONFIG.silent )
            
            const result = await silentManager.addCircuits( { 
                circuitFolderPath: testCircuitsPath 
            } )
            
            assert.deepStrictEqual( result, {}, 'Should work in silent mode' )
        } )
        
        it( 'should provide console output when silent is false', async () => {
            const verboseManager = new eERC20Manager( CONFIG.verbose )
            
            const result = await verboseManager.addCircuits( { 
                circuitFolderPath: testCircuitsPath 
            } )
            
            assert.deepStrictEqual( result, {}, 'Should work in verbose mode' )
        } )
        
    } )

    describe( 'Circuit Status Detection Tests', () => {
        
        it( 'should differentiate between missing and incomplete circuits', async () => {
            try {
                await manager.addCircuits( { 
                    circuitFolderPath: incompleteCircuitsPath 
                } )
                assert.fail( 'Should detect incomplete circuits' )
            } catch( error ) {
                assert.ok( error.message.includes( 'Missing required circuits' ), 'Should detect circuit status correctly' )
            }
        } )
        
        it( 'should handle mixed circuit availability gracefully', async () => {
            const result = await manager.addCircuits( { 
                circuitFolderPath: testCircuitsPath 
            } )
            
            assert.deepStrictEqual( result, {}, 'Should handle partial circuit sets' )
        } )
        
    } )

} )