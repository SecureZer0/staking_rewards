export type StakingRewardTable = {
  id: number;
  token_name: string;
  token_symbol: string;
  token_decimal: number;
  type: 'token' | 'staked_token';
  unique_id: {
    [key: string]: any;  // JSONB type
  };
  contract_address: {
    [key: string]: any;  // JSONB type
  };
  price_usd: number;
  apy: number ; // Percentage
  apy_chain: string ;
  apy_source: string ;
  updated_at: Date;
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
  apy_chain: string;
  apy_source: string;

  balance: number; // Amount of tokens in wallet (decimal)
  balance_usd: number; // Amount of tokens in wallet (USD)
  current_chain: string; // Chain the token is on
  annual_rewards: number; // Annual staking rewards in USD

}