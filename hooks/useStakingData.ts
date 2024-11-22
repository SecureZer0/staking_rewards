import { StakingRewardTable, ContractAddressMap } from "@/types/staking";

export type StakingDataResponse = {
  stakingData: StakingRewardTable[] | null;
  stakingDataError: string | null;
  networkAddresses: { [key: string]: string[] };
}

export async function useStakingData(): Promise<StakingDataResponse> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/staking`, {
      next: { revalidate: 1 }
    });
    
    if (!res.ok) {
      console.error('Fetch failed:', res.status)
      return { 
        stakingData: null, 
        stakingDataError: 'Failed to fetch staking data',
        networkAddresses: {}
      }
    }
    
    const data = await res.json()
    
    // Add address validation function
    const isValidAddress = (address: string): boolean => {
      return address !== "ether" && /^0x[a-fA-F0-9]{40}$/.test(address);
    };

    // Modified reduce function to handle new contract_address structure
    const networkAddresses = data.reduce((acc: { [key: string]: string[] }, item: StakingRewardTable) => {
      Object.entries(item.contract_addresses as ContractAddressMap).forEach(([network, chainInfo]) => {
        if (!acc[network]) acc[network] = [];
        if (chainInfo.contract_address && isValidAddress(chainInfo.contract_address)) {
          acc[network].push(chainInfo.contract_address);
        }
      });
      return acc;
    }, {});

    console.log('Organized network addresses:', networkAddresses);
    
    return { 
      stakingData: data, 
      stakingDataError: null,
      networkAddresses
    }
  } catch (error) {
    console.error('Error:', error)
    return { 
      stakingData: null, 
      stakingDataError: 'An unexpected error occurred',
      networkAddresses: {}
    }
  }
} 