import { StakingRewardTable, ContractAddressMap } from "@/types/staking";

interface CacheItem {
  data: StakingDataResponse;
  timestamp: number;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
let cache: CacheItem | null = null;

export type StakingDataResponse = {
  stakingData: StakingRewardTable[] | null;
  stakingDataError: string | null;
  networkAddresses: { [key: string]: string[] };
}

export async function useStakingData(): Promise<StakingDataResponse> {
  // Check cache
  if (cache && Date.now() - cache.timestamp < CACHE_DURATION) {
    console.log('Returning cached staking data');
    return cache.data;
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/staking`);
    
    if (!res.ok) {
      console.error('Fetch failed:', res.status)
      return { 
        stakingData: null, 
        stakingDataError: 'Failed to fetch staking data',
        networkAddresses: {}
      }
    }
    
    const data = await res.json()
    
    const isValidAddress = (address: string): boolean => {
      return address !== "ether" && /^0x[a-fA-F0-9]{40}$/.test(address);
    };

    const networkAddresses = data.reduce((acc: { [key: string]: string[] }, item: StakingRewardTable) => {
      Object.entries(item.contract_addresses as ContractAddressMap).forEach(([network, chainInfo]) => {
        if (!acc[network]) acc[network] = [];
        if (chainInfo.contract_address && isValidAddress(chainInfo.contract_address)) {
          acc[network].push(chainInfo.contract_address);
        }
      });
      return acc;
    }, {});

    const response = { 
      stakingData: data, 
      stakingDataError: null,
      networkAddresses
    };

    // Update cache
    cache = {
      data: response,
      timestamp: Date.now()
    };
    
    return response;
  } catch (error) {
    console.error('Error:', error)
    return { 
      stakingData: null, 
      stakingDataError: 'An unexpected error occurred',
      networkAddresses: {}
    }
  }
} 