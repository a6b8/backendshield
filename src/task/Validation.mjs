class Validation {
    static isReady( { provider=false, circuits=false, contracts=false } ) {
        const struct = { status: false, messages: [] }

        if( provider !== false ) { struct['messages'].push( 'Provider required. Call addProvider() first.' ) }
        if( circuits !== false ) { struct['messages'].push( 'Circuits required. Call addCircuits() first.' ) }
        if( contracts !== false ) { struct['messages'].push( 'Contracts required. Call addContracts() first.' ) }

        struct['status'] = struct['messages'].length === 0
        return struct
    }



    static validationConstructor( { silent, networkAliasName, supportedNetworks } ) {
        const struct = { status: false, messages: [] }
        
        if( silent !== undefined && typeof silent !== 'boolean' ) {
            struct['messages'].push( 'silent: Must be a boolean' )
        }
        
        if( networkAliasName !== undefined ) {
            if( typeof networkAliasName !== 'string' ) {
                struct['messages'].push( 'networkAliasName: Must be a string' )
            } else if( !networkAliasName.trim() ) {
                struct['messages'].push( 'networkAliasName: Cannot be empty' )
            } else if( supportedNetworks && !supportedNetworks.includes( networkAliasName ) ) {
                struct['messages'].push( `networkAliasName: Invalid value "${networkAliasName}". Allowed are ${supportedNetworks.join(', ')}` )
            }
        }
        
        struct['status'] = struct['messages'].length === 0
        return struct
    }


    static validationGetConfig( { } ) {
        const struct = { status: false, messages: [] }
        
        struct['status'] = true
        return struct
    }


    static validationAddProvider( { rpcUrl } ) {
        const struct = { status: false, messages: [] }
        
        if( rpcUrl === undefined ) {
            struct['messages'].push( 'rpcUrl: Missing value' )
        } else if( typeof rpcUrl !== 'string' ) {
            struct['messages'].push( 'rpcUrl: Must be a string' )
        } else if( !rpcUrl.trim() ) {
            struct['messages'].push( 'rpcUrl: Cannot be empty' )
        } else {
            try {
                const url = new URL( rpcUrl )
                if( ![ 'http:', 'https:' ].includes( url.protocol ) ) {
                    struct['messages'].push( 'rpcUrl: Must use HTTP or HTTPS protocol' )
                }
            } catch( error ) {
                struct['messages'].push( `rpcUrl: Invalid URL format - ${error.message}` )
            }
        }
        
        if( struct['messages'].length > 0 ) {
            return struct
        }
        
        struct['status'] = true
        return struct
    }


    static validationAddContracts( { addresses } ) {
        const struct = { status: false, messages: [] }
        
        if( addresses === undefined ) {
            struct['messages'].push( 'addresses: Missing value' )
        } else if( typeof addresses !== 'object' || addresses === null || Array.isArray( addresses ) ) {
            struct['messages'].push( 'addresses: Must be an object' )
        } else {
            const requiredContracts = [
                'registrationVerifier',
                'mintVerifier', 
                'withdrawVerifier',
                'transferVerifier',
                'burnVerifier',
                'babyJubJub',
                'registrar',
                'encryptedERC',
                'testERC20'
            ]
            
            requiredContracts.forEach( ( contractName ) => {
                const address = addresses[ contractName ]
                if( address === undefined ) {
                    struct['messages'].push( `addresses.${contractName}: Missing contract address` )
                } else if( typeof address !== 'string' ) {
                    struct['messages'].push( `addresses.${contractName}: Must be a string` )
                } else if( !address.trim() ) {
                    struct['messages'].push( `addresses.${contractName}: Cannot be empty` )
                } else {
                    const normalizedAddress = address.trim().toLowerCase()
                    if( !normalizedAddress.match( /^0x[a-f0-9]{40}$/ ) ) {
                        struct['messages'].push( `addresses.${contractName}: Invalid Ethereum address format` )
                    }
                }
            } )
        }
        
        if( struct['messages'].length > 0 ) {
            return struct
        }
        
        struct['status'] = true
        return struct
    }


    static validationAddCircuits( { circuitFolderPath } ) {
        const struct = { status: false, messages: [] }
        
        if( circuitFolderPath === undefined ) {
            struct['messages'].push( 'circuitFolderPath: Missing value' )
        } else if( typeof circuitFolderPath !== 'string' ) {
            struct['messages'].push( 'circuitFolderPath: Must be a string' )
        } else if( !circuitFolderPath.trim() ) {
            struct['messages'].push( 'circuitFolderPath: Cannot be empty' )
        }
        
        struct['status'] = true
        return struct
    }


    static validationAddAbi( { keyName, arrayOfAbis } ) {
        const struct = { status: false, messages: [] }
        
        const validKeys = [ 'encryptedERC', 'registrar', 'erc20' ]
        
        if( keyName === undefined ) {
            struct['messages'].push( 'keyName: Missing value' )
        } else if( typeof keyName !== 'string' ) {
            struct['messages'].push( 'keyName: Must be a string' )
        } else if( !keyName.trim() ) {
            struct['messages'].push( 'keyName: Cannot be empty' )
        } else if( !validKeys.includes( keyName ) ) {
            struct['messages'].push( `keyName: Invalid value "${keyName}". Allowed are ${validKeys.join(', ')}` )
        }
        
        if( arrayOfAbis === undefined ) {
            struct['messages'].push( 'arrayOfAbis: Missing value' )
        } else if( !Array.isArray( arrayOfAbis ) ) {
            struct['messages'].push( 'arrayOfAbis: Must be an array' )
        } else {
            arrayOfAbis.forEach( ( abi, index ) => {
                if( typeof abi !== 'string' ) {
                    struct['messages'].push( `arrayOfAbis[${index}]: Must be a string` )
                } else if( !abi.trim() ) {
                    struct['messages'].push( `arrayOfAbis[${index}]: Cannot be empty` )
                } else if( !abi.includes( 'function' ) && !abi.includes( 'event' ) && !abi.includes( 'constructor' ) ) {
                    struct['messages'].push( `arrayOfAbis[${index}]: Invalid ABI format - must contain valid ABI signature` )
                }
            } )
        }
        
        struct['status'] = true
        return struct
    }


    static validationGetTokens( { } ) {
        const struct = { status: false, messages: [] }
        
        struct['status'] = true
        return struct
    }


    static validationAddUser( { privateKey, userName, autoRegistration } ) {
        const struct = { status: false, messages: [] }
        
        if( privateKey === undefined ) {
            struct['messages'].push( 'privateKey: Missing value' )
        } else if( typeof privateKey !== 'string' ) {
            struct['messages'].push( 'privateKey: Must be a string' )
        } else if( !privateKey.trim() ) {
            struct['messages'].push( 'privateKey: Cannot be empty' )
        } else {
            let normalizedKey = privateKey.trim()
            if( normalizedKey.startsWith( '0x' ) ) {
                normalizedKey = normalizedKey.slice( 2 )
            }
            if( normalizedKey.length !== 64 ) {
                struct['messages'].push( 'privateKey: Must be 64 hex characters' )
            } else if( !/^[a-fA-F0-9]{64}$/.test( normalizedKey ) ) {
                struct['messages'].push( 'privateKey: Must contain only hex characters' )
            }
        }
        
        if( userName === undefined ) {
            struct['messages'].push( 'userName: Missing value' )
        } else if( typeof userName !== 'string' ) {
            struct['messages'].push( 'userName: Must be a string' )
        } else if( !userName.trim() ) {
            struct['messages'].push( 'userName: Cannot be empty' )
        } else if( !/^[a-zA-Z0-9_]+$/.test( userName.trim() ) ) {
            struct['messages'].push( 'userName: Must contain only alphanumeric characters and underscores' )
        }
        
        if( autoRegistration !== undefined && typeof autoRegistration !== 'boolean' ) {
            struct['messages'].push( 'autoRegistration: Must be a boolean' )
        }
        
        struct['status'] = true
        return struct
    }


    static validationRegisterAddress( { privateKey } ) {
        const struct = { status: false, messages: [] }
        
        if( privateKey === undefined ) {
            struct['messages'].push( 'privateKey: Missing value' )
        } else if( typeof privateKey !== 'string' ) {
            struct['messages'].push( 'privateKey: Must be a string' )
        } else if( !privateKey.trim() ) {
            struct['messages'].push( 'privateKey: Cannot be empty' )
        } else {
            let normalizedKey = privateKey.trim()
            if( normalizedKey.startsWith( '0x' ) ) {
                normalizedKey = normalizedKey.slice( 2 )
            }
            if( normalizedKey.length !== 64 ) {
                struct['messages'].push( 'privateKey: Must be 64 hex characters' )
            } else if( !/^[a-fA-F0-9]{64}$/.test( normalizedKey ) ) {
                struct['messages'].push( 'privateKey: Must contain only hex characters' )
            }
        }
        
        struct['status'] = true
        return struct
    }


    static validationIsRegistered( { address } ) {
        const struct = { status: false, messages: [] }
        
        if( address === undefined ) {
            struct['messages'].push( 'address: Missing value' )
        } else if( typeof address !== 'string' ) {
            struct['messages'].push( 'address: Must be a string' )
        } else if( !address.trim() ) {
            struct['messages'].push( 'address: Cannot be empty' )
        } else {
            let normalizedAddress = address.trim()
            if( !normalizedAddress.toLowerCase().startsWith( '0x' ) ) {
                normalizedAddress = `0x${normalizedAddress}`
            }
            if( normalizedAddress.length !== 42 ) {
                struct['messages'].push( 'address: Must be 42 character hex string starting with 0x' )
            } else if( !/^0x[a-fA-F0-9]{40}$/i.test( normalizedAddress ) ) {
                struct['messages'].push( 'address: Must contain only hex characters' )
            }
        }
        
        struct['status'] = true
        return struct
    }


    static validationDeposit( { userName, amount, tokenAddress } ) {
        const struct = { status: false, messages: [] }
        
        if( userName === undefined ) {
            struct['messages'].push( 'userName: Missing value' )
        } else if( typeof userName !== 'string' ) {
            struct['messages'].push( 'userName: Must be a string' )
        } else if( !userName.trim() ) {
            struct['messages'].push( 'userName: Cannot be empty' )
        } else if( !/^[a-zA-Z0-9_]+$/.test( userName.trim() ) ) {
            struct['messages'].push( 'userName: Must contain only alphanumeric characters and underscores' )
        }
        
        if( amount === undefined ) {
            struct['messages'].push( 'amount: Missing value' )
        } else if( typeof amount !== 'string' ) {
            struct['messages'].push( 'amount: Must be a string' )
        } else if( !amount.trim() ) {
            struct['messages'].push( 'amount: Cannot be empty' )
        } else {
            const trimmedAmount = amount.trim()
            if( trimmedAmount.startsWith( '-' ) ) {
                struct['messages'].push( 'amount: Must be positive' )
            } else if( isNaN( parseFloat( trimmedAmount ) ) ) {
                struct['messages'].push( 'amount: Must be a valid number' )
            } else if( parseFloat( trimmedAmount ) <= 0 ) {
                struct['messages'].push( 'amount: Must be greater than zero' )
            }
        }
        
        if( tokenAddress === undefined ) {
            struct['messages'].push( 'tokenAddress: Missing value' )
        } else if( typeof tokenAddress !== 'string' ) {
            struct['messages'].push( 'tokenAddress: Must be a string' )
        } else if( !tokenAddress.trim() ) {
            struct['messages'].push( 'tokenAddress: Cannot be empty' )
        } else {
            let normalizedAddress = tokenAddress.trim()
            if( !normalizedAddress.toLowerCase().startsWith( '0x' ) ) {
                normalizedAddress = `0x${normalizedAddress}`
            }
            if( normalizedAddress.length !== 42 ) {
                struct['messages'].push( 'tokenAddress: Must be 42 character hex string starting with 0x' )
            } else if( !/^0x[a-fA-F0-9]{40}$/i.test( normalizedAddress ) ) {
                struct['messages'].push( 'tokenAddress: Must contain only hex characters' )
            }
        }
        
        struct['status'] = true
        return struct
    }


    static validationGetBalance( { address, tokenAddress } ) {
        const struct = { status: false, messages: [] }
        
        if( address === undefined ) {
            struct['messages'].push( 'address: Missing value' )
        } else if( typeof address !== 'string' ) {
            struct['messages'].push( 'address: Must be a string' )
        } else if( !address.trim() ) {
            struct['messages'].push( 'address: Cannot be empty' )
        } else {
            let normalizedAddress = address.trim()
            if( !normalizedAddress.toLowerCase().startsWith( '0x' ) ) {
                normalizedAddress = `0x${normalizedAddress}`
            }
            if( normalizedAddress.length !== 42 ) {
                struct['messages'].push( 'address: Must be 42 character hex string starting with 0x' )
            } else if( !/^0x[a-fA-F0-9]{40}$/i.test( normalizedAddress ) ) {
                struct['messages'].push( 'address: Must contain only hex characters' )
            }
        }
        
        if( tokenAddress === undefined ) {
            struct['messages'].push( 'tokenAddress: Missing value' )
        } else if( typeof tokenAddress !== 'string' ) {
            struct['messages'].push( 'tokenAddress: Must be a string' )
        } else if( !tokenAddress.trim() ) {
            struct['messages'].push( 'tokenAddress: Cannot be empty' )
        } else {
            let normalizedAddress = tokenAddress.trim()
            if( !normalizedAddress.toLowerCase().startsWith( '0x' ) ) {
                normalizedAddress = `0x${normalizedAddress}`
            }
            if( normalizedAddress.length !== 42 ) {
                struct['messages'].push( 'tokenAddress: Must be 42 character hex string starting with 0x' )
            } else if( !/^0x[a-fA-F0-9]{40}$/i.test( normalizedAddress ) ) {
                struct['messages'].push( 'tokenAddress: Must contain only hex characters' )
            }
        }
        
        struct['status'] = true
        return struct
    }


    static validationWithdraw( { userName, amount, tokenAddress } ) {
        const struct = { status: false, messages: [] }
        
        if( userName === undefined ) {
            struct['messages'].push( 'userName: Missing value' )
        } else if( typeof userName !== 'string' ) {
            struct['messages'].push( 'userName: Must be a string' )
        } else if( !userName.trim() ) {
            struct['messages'].push( 'userName: Cannot be empty' )
        } else if( !/^[a-zA-Z0-9_]+$/.test( userName.trim() ) ) {
            struct['messages'].push( 'userName: Must contain only alphanumeric characters and underscores' )
        }
        
        if( amount === undefined ) {
            struct['messages'].push( 'amount: Missing value' )
        } else if( typeof amount !== 'string' ) {
            struct['messages'].push( 'amount: Must be a string' )
        } else if( !amount.trim() ) {
            struct['messages'].push( 'amount: Cannot be empty' )
        } else {
            const trimmedAmount = amount.trim()
            if( trimmedAmount.startsWith( '-' ) ) {
                struct['messages'].push( 'amount: Must be positive' )
            } else if( isNaN( parseFloat( trimmedAmount ) ) ) {
                struct['messages'].push( 'amount: Must be a valid number' )
            } else if( parseFloat( trimmedAmount ) <= 0 ) {
                struct['messages'].push( 'amount: Must be greater than zero' )
            }
        }
        
        if( tokenAddress === undefined ) {
            struct['messages'].push( 'tokenAddress: Missing value' )
        } else if( typeof tokenAddress !== 'string' ) {
            struct['messages'].push( 'tokenAddress: Must be a string' )
        } else if( !tokenAddress.trim() ) {
            struct['messages'].push( 'tokenAddress: Cannot be empty' )
        } else {
            let normalizedAddress = tokenAddress.trim()
            if( !normalizedAddress.toLowerCase().startsWith( '0x' ) ) {
                normalizedAddress = `0x${normalizedAddress}`
            }
            if( normalizedAddress.length !== 42 ) {
                struct['messages'].push( 'tokenAddress: Must be 42 character hex string starting with 0x' )
            } else if( !/^0x[a-fA-F0-9]{40}$/i.test( normalizedAddress ) ) {
                struct['messages'].push( 'tokenAddress: Must contain only hex characters' )
            }
        }
        
        struct['status'] = true
        return struct
    }


    static validationTransfer( { userName, recipientAddress, amount, tokenAddress } ) {
        const struct = { status: false, messages: [] }
        
        if( userName === undefined ) {
            struct['messages'].push( 'userName: Missing value' )
        } else if( typeof userName !== 'string' ) {
            struct['messages'].push( 'userName: Must be a string' )
        } else if( !userName.trim() ) {
            struct['messages'].push( 'userName: Cannot be empty' )
        } else if( !/^[a-zA-Z0-9_]+$/.test( userName.trim() ) ) {
            struct['messages'].push( 'userName: Must contain only alphanumeric characters and underscores' )
        }
        
        if( recipientAddress === undefined ) {
            struct['messages'].push( 'recipientAddress: Missing value' )
        } else if( typeof recipientAddress !== 'string' ) {
            struct['messages'].push( 'recipientAddress: Must be a string' )
        } else if( !recipientAddress.trim() ) {
            struct['messages'].push( 'recipientAddress: Cannot be empty' )
        } else {
            let normalizedAddress = recipientAddress.trim()
            if( !normalizedAddress.toLowerCase().startsWith( '0x' ) ) {
                normalizedAddress = `0x${normalizedAddress}`
            }
            if( normalizedAddress.length !== 42 ) {
                struct['messages'].push( 'recipientAddress: Must be 42 character hex string starting with 0x' )
            } else if( !/^0x[a-fA-F0-9]{40}$/i.test( normalizedAddress ) ) {
                struct['messages'].push( 'recipientAddress: Must contain only hex characters' )
            }
        }
        
        if( amount === undefined ) {
            struct['messages'].push( 'amount: Missing value' )
        } else if( typeof amount !== 'string' ) {
            struct['messages'].push( 'amount: Must be a string' )
        } else if( !amount.trim() ) {
            struct['messages'].push( 'amount: Cannot be empty' )
        } else {
            const trimmedAmount = amount.trim()
            if( trimmedAmount.startsWith( '-' ) ) {
                struct['messages'].push( 'amount: Must be positive' )
            } else if( isNaN( parseFloat( trimmedAmount ) ) ) {
                struct['messages'].push( 'amount: Must be a valid number' )
            } else if( parseFloat( trimmedAmount ) <= 0 ) {
                struct['messages'].push( 'amount: Must be greater than zero' )
            }
        }
        
        if( tokenAddress === undefined ) {
            struct['messages'].push( 'tokenAddress: Missing value' )
        } else if( typeof tokenAddress !== 'string' ) {
            struct['messages'].push( 'tokenAddress: Must be a string' )
        } else if( !tokenAddress.trim() ) {
            struct['messages'].push( 'tokenAddress: Cannot be empty' )
        } else {
            let normalizedAddress = tokenAddress.trim()
            if( !normalizedAddress.toLowerCase().startsWith( '0x' ) ) {
                normalizedAddress = `0x${normalizedAddress}`
            }
            if( normalizedAddress.length !== 42 ) {
                struct['messages'].push( 'tokenAddress: Must be 42 character hex string starting with 0x' )
            } else if( !/^0x[a-fA-F0-9]{40}$/i.test( normalizedAddress ) ) {
                struct['messages'].push( 'tokenAddress: Must contain only hex characters' )
            }
        }
        
        struct['status'] = true
        return struct
    }


    static error( { messages } ) {
        const errorMessage = messages.join( ', ' )
        throw new Error( errorMessage )
    }


}


export default Validation