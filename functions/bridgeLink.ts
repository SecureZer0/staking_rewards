import { UserPortfolio, StakingRewardTable } from "@/types/staking";

export function getBridgeUrl(token: UserPortfolio, stakingData: StakingRewardTable[] | null): string {
  console.log('getBridgeUrl - Input token:', token);
  console.log('getBridgeUrl - StakingData:', stakingData);

  if (!stakingData) return '#';

  // Find matching staking data to get contract addresses
  const stakingInfo = stakingData.find(data => 
    data.token_symbol.toLowerCase() === token.token_symbol.toLowerCase() &&
    data.apy_chain.toLowerCase() === token.apy_chain.toLowerCase()
  );

  if (!stakingInfo) return '#';

  // Special case for ETH on Ethereum
  const tokenIn = token.token_symbol.toUpperCase() === 'ETH' && token.current_chain === 'Ethereum' 
    ? 'ETH' 
    : stakingInfo.contract_addresses[token.current_chain].contract_address;

  const tokenOut = token.token_symbol.toUpperCase() === 'ETH' && token.apy_chain === 'Ethereum'
    ? 'ETH'
    : stakingInfo.contract_addresses[token.apy_chain].contract_address;

  const url = `https://app.symbiosis.finance/swap?amountIn&chainIn=${token.current_chain}&chainOut=${token.apy_chain}&tokenIn=${tokenIn}&tokenOut=${tokenOut}`;

  console.log('getBridgeUrl - Generated URL:', url);
  return url;
}
