# Avalanche FlowMCP Schemas

Dieses Dokument enthält alle verfügbaren FlowMCP-Routen, die Avalanche-Blockchain-Funktionalität unterstützen.

## Übersicht der verfügbaren Routen

| Namespace | Route Name | Beschreibung | Avalanche Parameter |
|-----------|------------|--------------|-------------------|
| **etherscan** | getGasOracle | Aktuelle Gas-Oracle-Daten für eine bestimmte Chain abrufen | `AVALANCHE_CCHAIN` |
| **etherscan** | estimateGasCost | Gas-Kosten mit einem spezifischen Gas-Preis schätzen | `AVALANCHE_CCHAIN` |
| **etherscan** | getAvailableChains | Verfügbare Blockchain-Aliase auflisten | Enthält Avalanche-Chains |
| **etherscan** | getSmartContractAbi | Smart Contract ABI nach Alias abrufen | `AVALANCHE_CCHAIN`, `AVALANCHE_FUJI_TESTNET` |
| **etherscan** | getSourceCode | Smart Contract Quellcode nach Alias abrufen | `AVALANCHE_CCHAIN`, `AVALANCHE_FUJI_TESTNET` |
| **ohlcv** | getRecursiveOhlcvEVM | OHLCV-Daten rekursiv abrufen bis Maximallänge erreicht ist | `AVALANCHE_MAINNET` |
| **blocknative** | getGasPrices | Gas-Preis-Schätzungen für den nächsten Block abrufen | `AVALANCHE` |
| **dexscreener** | getLatestPairs | Spezifisches Token-Paar nach Chain und Pair-Adresse abrufen | `avalanche` |
| **dexscreener** | getPairsByChain | Trending Token-Paare nach Chain abrufen | `avalanche` |
| **dexscreener** | getSpecificPair | Detaillierte Informationen über ein Token-Paar | `avalanche` |
| **thegraph** | getNewPools | Neue Uniswap V3-Pools nach Chain auflisten | `avalanche` |
| **moralis** | /wallets/:address/defi/:protocol/positions | Detaillierte DeFi-Positionen nach Protokoll für Wallet | `avalanche`, `0xa86a` |
| **moralis** | /wallets/:address/defi/positions | Positions-Zusammenfassung einer Wallet-Adresse | `avalanche`, `0xa86a` |
| **moralis** | /wallets/:address/defi/summary | DeFi-Zusammenfassung einer Wallet-Adresse | `avalanche`, `0xa86a` |
| **moralis** | /wallets/:address/nfts/trades | NFT-Trades für eine bestimmte Wallet | `avalanche`, `0xa86a` |
| **moralis** | /:address/nft/collections | NFT-Sammlungen einer Wallet-Adresse | `avalanche`, `0xa86a` |
| **moralis** | /:address/nft/transfers | NFT-Transfers einer Wallet | `avalanche`, `0xa86a` |
| **moralis** | /:address/nft | NFTs einer bestimmten Adresse | `avalanche`, `0xa86a` |
| **moralis** | /wallets/:address/swaps | Alle Swap-bezogenen Transaktionen | `avalanche`, `0xa86a` |
| **moralis** | /wallets/:address/approvals | Aktive ERC20-Token-Genehmigungen | `avalanche`, `0xa86a` |
| **moralis** | /wallets/:address/tokens | Token-Guthaben und USD-Preise | `avalanche`, `0xa86a` |
| **moralis** | /:address/erc20 | ERC20-Token-Guthaben für Wallet | `avalanche`, `0xa86a` |
| **moralis** | /:address/erc20/transfers | ERC20-Token-Transaktionen | `avalanche`, `0xa86a` |
| **moralis** | /wallets/:address/chains | Aktive Chains für Wallet-Adresse | `avalanche`, `0xa86a` |
| **moralis** | /:address/balance | Native Balance für Wallet-Adresse | `avalanche`, `0xa86a` |
| **moralis** | /wallets/:address/history | Vollständige Transaktionshistorie einer Wallet | `avalanche`, `0xa86a` |
| **moralis** | /wallets/:address/net-worth | Nettovermögen einer Wallet in USD | `avalanche`, `0xa86a` |
| **moralis** | /wallets/:address/profitability/summary | Zusammenfassung der Wallet-Rentabilität | `avalanche`, `0xa86a` |
| **moralis** | /wallets/:address/profitability | Rentabilitätsinformationen für Wallet | `avalanche`, `0xa86a` |
| **moralis** | /wallets/:address/stats | Statistiken für Wallet-Adresse | `avalanche`, `0xa86a` |

## Code Array für FlowMCP Schema-Filterung

```javascript
const avalancheRoutes = [
    // Etherscan Routes
    'etherscan.getGasOracle',
    'etherscan.estimateGasCost',
    'etherscan.getAvailableChains',
    'etherscan.getSmartContractAbi',
    'etherscan.getSourceCode',
    
    // OHLCV Routes
    'ohlcv.getRecursiveOhlcvEVM',
    
    // Blocknative Routes
    'blocknative.getGasPrices',
    
    // DexScreener Routes
    'dexscreener.getLatestPairs',
    'dexscreener.getPairsByChain',
    'dexscreener.getSpecificPair',
    
    // TheGraph Routes
    'thegraph.getNewPools',
    
    // Moralis Routes
    'moralis./wallets/:address/defi/:protocol/positions',
    'moralis./wallets/:address/defi/positions',
    'moralis./wallets/:address/defi/summary',
    'moralis./wallets/:address/nfts/trades',
    'moralis./:address/nft/collections',
    'moralis./:address/nft/transfers',
    'moralis./:address/nft',
    'moralis./wallets/:address/swaps',
    'moralis./wallets/:address/approvals',
    'moralis./wallets/:address/tokens',
    'moralis./:address/erc20',
    'moralis./:address/erc20/transfers',
    'moralis./wallets/:address/chains',
    'moralis./:address/balance',
    'moralis./wallets/:address/history',
    'moralis./wallets/:address/net-worth',
    'moralis./wallets/:address/profitability/summary',
    'moralis./wallets/:address/profitability',
    'moralis./wallets/:address/stats'
];
```

## Chain-IDs und Parameter

### Avalanche-spezifische Identifier:

- **Etherscan**: `AVALANCHE_CCHAIN` (43114), `AVALANCHE_FUJI_TESTNET` (43113)
- **OHLCV**: `AVALANCHE_MAINNET` → `avalanche`
- **Blocknative**: `AVALANCHE` (43114)
- **DexScreener**: `avalanche`
- **TheGraph**: `avalanche`
- **Moralis**: `avalanche` oder `0xa86a`

## Verwendung

Dieses Array kann verwendet werden, um FlowMCP-Schemas zu filtern und nur Avalanche-bezogene Routen in einem spezialisierten FlowMCP-Server zu verwenden.

**Beispiel-Verwendung:**
```javascript
// Schema-Filter für nur Avalanche-Routen
const filteredSchemas = allSchemas.filter(schema => 
    schema.routes && Object.keys(schema.routes).some(routeName =>
        avalancheRoutes.includes(`${schema.namespace}.${routeName}`)
    )
);
```

---

**Gesamt:** 29 verfügbare Avalanche-Routen aus 6 verschiedenen Namespaces