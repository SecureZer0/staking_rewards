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
  apy: number | null;
  apy_chain: string | null;
  apy_source: string | null;
  updated_at: Date;
} 