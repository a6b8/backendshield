const config = {
    'abis': {
        encryptedERC: [
            // Balance query function - returns EGCT structure
            'function balanceOf(address user, uint256 tokenId) view returns (tuple(tuple(uint256 x, uint256 y) c1, tuple(uint256 x, uint256 y) c2) eGCT, uint256 nonce, uint256 transactionIndex, uint256[7] balancePCT, tuple(uint256[7] pct, uint256 index)[] amountPCTs)',
            // Deposit function - converter mode (no proof required)
            'function deposit(uint256 amount, address tokenAddress, uint256[7] amountPCT)',
            // Transfer function with ZK proof
            'function transfer(address to, uint256 tokenId, tuple(tuple(uint256[2] a, uint256[2][2] b, uint256[2] c) proofPoints, uint256[32] publicSignals) proof, uint256[7] balancePCT)',
            // Withdraw function with ZK proof  
            'function withdraw(uint256 tokenId, tuple(tuple(uint256[2] a, uint256[2][2] b, uint256[2] c) proofPoints, uint256[16] publicSignals) proof, uint256[7] balancePCT)',
            // Token registry functions
            'function getTokens() view returns (address[])',
            'function tokenIds(address) view returns (uint256)',
            'function tokenAddresses(uint256) view returns (address)'
        ],
        registrar: [
            'function isUserRegistered(address) view returns (bool)',
            'function getUserPublicKey(address) view returns (uint256[2])',
            // Register function with ZK proof
            'function register(tuple(tuple(uint256[2] a, uint256[2][2] b, uint256[2] c) proofPoints, uint256[5] publicSignals) proof)'
        ],
        erc20: [
            'function balanceOf(address) view returns (uint256)',
            'function approve(address,uint256) returns (bool)',
            'function decimals() view returns (uint8)',
            'function symbol() view returns (string)',
            'function transfer(address,uint256) returns (bool)',
            'function transferFrom(address,address,uint256) returns (bool)'
        ]
    },
    'chains': {
        'AVALANCHE_FUJI': {
            'rpcUrl': 'https://api.avax-test.network/ext/bc/C/rpc',
            'chainId': 43113,
            'explorerUrl': 'https://testnet.snowtrace.io'
        },
        'ETHEREUM_SEPOLIA': {
            'rpcUrl': 'https://rpc.sepolia.org',
            'chainId': 11155111,
            'explorerUrl': 'https://sepolia.etherscan.io'
        },
        'POLYGON_MUMBAI': {
            'rpcUrl': 'https://rpc-mumbai.maticvigil.com',
            'chainId': 80001,
            'explorerUrl': 'https://mumbai.polygonscan.com'
        }
    }
}


export { config }