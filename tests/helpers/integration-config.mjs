import { getServerParams } from './utils.mjs'
import fs from 'fs'
import { resolve as pathResolve } from 'path'


const path = './../../.encrypted-erc.env'

function getRpcUrl() {
    const params = getServerParams( {
        path,
        selection: [
            [ 'rpcUrl', 'RPC_URL' ]
        ]
    } )
    
    if( !params.rpcUrl ) {
        throw new Error( 'RPC_URL not found in environment file' )
    }
    
    return params.rpcUrl
}


function getPrivateKey1() {
    const params = getServerParams( {
        path,
        selection: [
            [ 'privateKey1', 'PRIVATE_KEY' ]
        ]
    } )
    
    if( !params.privateKey1 ) {
        throw new Error( 'PRIVATE_KEY not found in environment file' )
    }
    
    return params.privateKey1
}


function getPrivateKey2() {
    const params = getServerParams( {
        path,
        selection: [
            [ 'privateKey2', 'PRIVATE_KEY_2' ]
        ]
    } )
    
    if( !params.privateKey2 ) {
        throw new Error( 'PRIVATE_KEY_2 not found in environment file' )
    }
    
    return params.privateKey2
}


function getContractAddresses() {
    try {
        const deploymentFilePath = pathResolve( '.', '../../..//1-desktop/4-eerc-backend-converter/deployments/converter/latest-converter.json' )
        
        if( !fs.existsSync( deploymentFilePath ) ) {
            throw new Error( 'Deployment file not found at: ' + deploymentFilePath )
        }
        
        const deploymentData = JSON.parse( fs.readFileSync( deploymentFilePath, 'utf8' ) )
        
        if( !deploymentData.contracts ) {
            throw new Error( 'No contracts found in deployment file' )
        }
        
        const contracts = deploymentData.contracts
        
        return {
            registrationVerifier: contracts.registrationVerifier,
            mintVerifier: contracts.mintVerifier,
            withdrawVerifier: contracts.withdrawVerifier,
            transferVerifier: contracts.transferVerifier,
            burnVerifier: contracts.burnVerifier,
            babyJubJub: contracts.babyJubJub,
            registrar: contracts.registrar,
            encryptedERC: contracts.encryptedERC,
            testERC20: contracts.testERC20
        }
    } catch( error ) {
        throw new Error( `Failed to load contract addresses: ${error.message}` )
    }
}


function getTestTokenAddress() {
    const contracts = getContractAddresses()
    return contracts.testERC20
}


function getIntegrationConfig() {
    return {
        rpcUrl: getRpcUrl(),
        privateKey1: getPrivateKey1(),
        privateKey2: getPrivateKey2(),
        contractAddresses: getContractAddresses(),
        testTokenAddress: getTestTokenAddress()
    }
}


export { 
    getRpcUrl, 
    getPrivateKey1, 
    getPrivateKey2, 
    getContractAddresses,
    getTestTokenAddress,
    getIntegrationConfig 
}