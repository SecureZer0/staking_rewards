'use client'
import { useState } from 'react';
import { NetworkTokens, TokenBalance } from '@/types/staking';
import { networks } from '@/constants/networks';


export async function getWalletTokens(
    walletAddress: string,
    networkAddresses: { [key: string]: string[] },
    onNetworkComplete?: (networkData: NetworkTokens) => void
) {


  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }

  const results: NetworkTokens[] = [];

  for (const [networkName, config] of Object.entries(networks)) {
    try {
      const url = `https://${config.network}.g.alchemy.com/v2/NR9fdXtJ7p_7OuMivwjam2iQGwCE7c4O`;
      
      // Get specific ERC20 tokens
      const tokenAddresses = networkAddresses[networkName] || [];
      console.log(`Fetching ${tokenAddresses.length} tokens for ${networkName}`);

      if (tokenAddresses.length > 0) {
        const erc20Response = await fetch(url, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            id: 1,
            jsonrpc: "2.0",
            method: "alchemy_getTokenBalances",
            params: [walletAddress, tokenAddresses]
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
        
        results.push(networkData);
        
        if (onNetworkComplete) {
          onNetworkComplete(networkData);
        }
      }
    } catch (error) {
      console.error(`Error fetching ${networkName} tokens:`, error);
    }
  }

  return results;
}