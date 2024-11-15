import { StakingRewardTable } from "@/types/staking";

export type StakingDataResponse = {
  stakingData: StakingRewardTable[] | null;
  stakingDataError: string | null;
}

export async function useStakingData(): Promise<StakingDataResponse> {
  try {
    console.log('Fetching from:', `${process.env.NEXT_PUBLIC_API_URL}/api/staking`)
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/staking`, {
      next: { revalidate: 1 } // 1 hour cache
    })
    
    console.log('Response status:', res.status)
    
    if (!res.ok) {
      console.error('Fetch failed:', res.status)
      return { stakingData: null, stakingDataError: 'Failed to fetch staking data' }
    }
    
    const data = await res.json()
    console.log('Received data:', data)
    return { stakingData: data, stakingDataError: null }
  } catch (error) {
    console.error('Error:', error)
    return { stakingData: null, stakingDataError: 'An unexpected error occurred' }
  }
} 