'use client'
import { useState } from 'react';

export type NetworkTokens = {
  network: string;
  tokens: any[];  // Replace 'any' with your token type
}

export async function getWalletTokens(
    walletAddress: string, 
    onNetworkComplete?: (networkData: NetworkTokens) => void
) {
  console.log('Starting getWalletTokens for address:', walletAddress);
  
  const networks = {
    ethereum: 'eth-mainnet',
    zksync: 'zksync-mainnet',
    optimism: 'opt-mainnet'
  }

  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }

  const results: NetworkTokens[] = [];

  for (const [networkName, networkId] of Object.entries(networks)) {
    try {
      console.log(`Fetching ${networkName} tokens...`);
      const url = `https://${networkId}.g.alchemy.com/v2/NR9fdXtJ7p_7OuMivwjam2iQGwCE7c4O`;
      const body = JSON.stringify({
        id: 1,
        jsonrpc: "2.0",
        method: "alchemy_getTokenBalances",
        params: [walletAddress, "erc20"]
      });

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body
      });

      const data = await response.json();
      console.log(`${networkName} response:`, data);
      
      const networkData = { network: networkName, tokens: data.result };
      results.push(networkData);
      
      if (onNetworkComplete) {
        console.log(`Calling callback for ${networkName}`);
        onNetworkComplete(networkData);
      }
    } catch (error) {
      console.error(`Error fetching ${networkName} tokens:`, error);
    }
  }

  return results;
}