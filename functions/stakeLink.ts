import { UserPortfolio } from "@/types/staking";

type ChainMapping = {
  [key: string]: string;
};

const CHAIN_MAPPINGS: ChainMapping = {
  'ethereum': 'mainnet',
  'zksync era': 'zksync',
  // Add more chain mappings as needed
};

export function getStakeUrl(token: UserPortfolio, stakingData: any): string {


  const source = token.apy_source.toLowerCase();

  const chain = CHAIN_MAPPINGS[token.apy_chain.toLowerCase()] || token.apy_chain.toLowerCase();
  
  // Find the matching staking data to get contract addresses
  const stakingInfo = stakingData.find((data: any) => 
    data.token_symbol.toLowerCase() === token.token_symbol.toLowerCase() &&
    data.apy_chain.toLowerCase() === token.apy_chain.toLowerCase()
  );


  if (!stakingInfo) {
    return '#';
  }

  let url = '#';
  switch (source) {
    case 'aave-v3':
      url = `https://app.aave.com/reserve-overview/?underlyingAsset=${stakingInfo.contract_address[token.apy_chain].toLowerCase()}&marketName=proto_${chain}_v2`;
      break;

    case 'aave-v2':
      url = `https://app.aave.com/reserve-overview/?underlyingAsset=${stakingInfo.contract_address[token.apy_chain].toLowerCase()}&marketName=proto_${chain}_v3`;
      break;
    
    case 'fraxlend':
      url = `https://app.frax.finance/fraxlend`;
      break;
    
    case 'compound-v3':
      url = `https://app.compound.finance/?market=${token.token_symbol.toLowerCase()}-${chain}`;
      break;

    case 'lido':
      if(token.apy_chain.toLowerCase() === 'ethereum') {
        url = `https://stake.lido.fi/`;
      } else if (token.apy_chain.toLowerCase() === 'polygon') {
        url = `https://polygon.lido.fi/`;
      }
      break;
    
    default:
      return '#';
  }

  return url;
}
