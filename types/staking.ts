export type StakingRewardTable = {
  id: number;
  token_name: string;
  token_symbol: string;
  type: 'token' | 'staked_token';
  coingecko_id: string;
  contract_addresses: ContractAddressMap
  price: number;
  apy: number ; // Percentage
  apy_30d: number; // Percentage
  apy_chain: string ;
  apy_source: string ;
  apy_updated_at: Date;
  price_updated_at: Date;
} 

interface ChainContractInfo {
  decimal: number;
  contract_address: string;
}

export interface ContractAddressMap {
  [chainName: string]: ChainContractInfo;
}


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


export type UserPortfolio = {

  token_name: string;
  token_symbol: string;
  token_decimal: number;
  price_usd: number;
  apy: number;
  apy_30d: number;
  apy_chain: string;
  apy_source: string;

  balance: number; // Amount of tokens in wallet (decimal)
  balance_usd: number; // Amount of tokens in wallet (USD)
  current_chain: string; // Chain the token is on
  annual_rewards: number; // Annual staking rewards in USD
  annual_rewards_30d: number; // 30d staking rewards in USD

}