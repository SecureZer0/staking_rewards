'use client'
import { useState } from 'react';

export type TokenBalance = {
  contractAddress: string;
  tokenBalance: string;
}

export type AlchemyResponse = {
  address: string;
  tokenBalances: TokenBalance[];
}

export type NetworkTokens = {
  network: string;
  tokens: TokenBalance[];
}

export async function getWalletTokens(
    walletAddress: string, 
    onNetworkComplete?: (networkData: NetworkTokens) => void
) {
  console.log('Starting getWalletTokens for address:', walletAddress);
  
  const networks = {
    Ethereum: {
      network: 'eth-mainnet',
      nativeTokenCheck: {
        contractAddress: 'ether'
      }
    },
    Polygon: {
      network: 'polygon-mainnet',
      nativeTokenCheck: {
        contractAddress: 'pol'
      }
    },
    Arbitrum: {
      network: 'arb-mainnet',
      nativeTokenCheck: {
        contractAddress: 'ether'
      }
    },
    Optimism: {
      network: 'opt-mainnet',
      nativeTokenCheck: {
        contractAddress: 'ether'
      }
    },
    Linea: {
      network: 'linea-mainnet',
      nativeTokenCheck: {
        contractAddress: 'ether'
      }
    },
    Base: {
      network: 'base-mainnet',
      nativeTokenCheck: {
        contractAddress: 'ether'
      }
    },
    Scroll: {
      network: 'scroll-mainnet',
      nativeTokenCheck: {
        contractAddress: 'ether'
      }
    },
    BSC: {
      network: 'bnb-mainnet',
      nativeTokenCheck: {
        contractAddress: 'bnb'
      }
    },
    'zkSync Era': {
      network: 'zksync-mainnet',
      nativeTokenCheck: {
        contractAddress: 'ether'
      }
    }
  };

  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }

  const results: NetworkTokens[] = [];

  for (const [networkName, config] of Object.entries(networks)) {
    try {
      console.log(`Fetching ${networkName} tokens...`);
      const url = `https://${config.network}.g.alchemy.com/v2/NR9fdXtJ7p_7OuMivwjam2iQGwCE7c4O`;
      
      // Get ERC20 tokens
      const erc20Response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          id: 1,
          jsonrpc: "2.0",
          method: "alchemy_getTokenBalances",
          params: [walletAddress, "erc20"]
        })
      });
      const erc20Data = await erc20Response.json();
      
      let tokens = erc20Data.result.tokenBalances.filter(
        (token: TokenBalance) => token.tokenBalance !== '0x0000000000000000000000000000000000000000000000000000000000000000'
      );

      // Check native token balance if configured
      if (config.nativeTokenCheck) {
        const nativeResponse = await fetch(url, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            id: 1,
            jsonrpc: "2.0",
            method: "eth_getBalance",
            params: [walletAddress, "latest"]
          })
        });
        const nativeData = await nativeResponse.json();
        
        if (nativeData.result !== "0x0") {
          tokens.push({
            contractAddress: config.nativeTokenCheck.contractAddress,
            tokenBalance: nativeData.result
          });
        }
      }

      const networkData = { 
        network: networkName, 
        tokens
      };

      console.log('networkData')
      console.log(networkData)
      
      results.push(networkData);
      
      if (onNetworkComplete) {
        console.log(`Calling callback for ${networkName} with tokens:`, networkData.tokens);
        onNetworkComplete(networkData);
      }
    } catch (error) {
      console.error(`Error fetching ${networkName} tokens:`, error);
    }
  }

  return results;
}