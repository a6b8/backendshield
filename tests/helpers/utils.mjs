import { readFileSync } from 'fs'
import { resolve } from 'path'


function getServerParams( { path, selection } ) {
    if( !path ) {
        throw new Error( 'Path parameter is required' )
    }
    const { path: filePath, selection: selectedKeys } = { path, selection }
    
    if( !selectedKeys || !Array.isArray( selectedKeys ) ) {
        throw new Error( 'selection parameter is required and must be an array' )
    }
    
    const struct = {}
    
    try {
        const resolvedPath = resolve( filePath )
        const envContent = readFileSync( resolvedPath, 'utf8' )
        
        const envLines = envContent
            .split( '\n' )
            .filter( ( line ) => line.trim() && !line.startsWith( '#' ) )
        
        const envVars = {}
        envLines
            .forEach( ( line ) => {
                const equalIndex = line.indexOf( '=' )
                if( equalIndex > 0 ) {
                    const key = line.substring( 0, equalIndex ).trim()
                    const value = line.substring( equalIndex + 1 ).trim()
                    envVars[ key ] = value.replace( /^["']|["']$/g, '' )
                }
            } )
        
        selectedKeys
            .forEach( ( [ targetKey, envKey ] ) => {
                if( typeof targetKey !== 'string' || typeof envKey !== 'string' ) {
                    throw new Error( `Invalid selection format: [${targetKey}, ${envKey}]. Both values must be strings.` )
                }
                
                const envValue = envVars[ envKey ]
                if( envValue ) {
                    struct[ targetKey ] = envValue
                } else {
                    console.warn( `⚠️  Environment variable '${envKey}' not found in ${filePath}` )
                    struct[ targetKey ] = null
                }
            } )
        
        return struct
        
    } catch( error ) {
        if( error.code === 'ENOENT' ) {
            throw new Error( `Environment file not found: ${filePath}` )
        }
        throw new Error( `Failed to read environment file: ${error.message}` )
    }
}


export { getServerParams }