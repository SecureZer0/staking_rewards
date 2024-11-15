"use client"
import { useState, useEffect } from "react";
import MainDiv from "./mainDiv/MainDiv";
import { useStakingData } from "@/hooks/useStakingData";
import { StakingRewardTable, NetworkTokens, UserPortfolio } from "@/types/staking";
import { getWalletTokens } from '@/hooks/useGetWalletTokens';
import { useProcessWalletTokens } from '@/hooks/useProcessWalletTokens';

export default function HomeMaster() {
  const [walletAddress, setWalletAddress] = useState('')
  const [userPortfolio, setUserPortfolio] = useState<UserPortfolio[]>([])
  const [stakingData, setStakingData] = useState<StakingRewardTable[] | null>(null)
  const [stakingDataError, setStakingDataError] = useState<string | null>(null)
  const [networkTokens, setNetworkTokens] = useState<NetworkTokens[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [networkAddresses, setNetworkAddresses] = useState<{[key: string]: string[]}>({});
  const [totalRewards, setTotalRewards] = useState<number[]>([0]);

  // Get data from staking_rewards table
  useEffect(() => {
    const fetchData = async () => {
      const response = await useStakingData()
      setStakingData(response.stakingData)
      setStakingDataError(response.stakingDataError)
      setNetworkAddresses(response.networkAddresses)
    }
    fetchData()
  }, [])

  // Get the tokens from the users wallet address 
  useEffect(() => {
    if (walletAddress && Object.keys(networkAddresses).length > 0) {
      const fetchTokens = async () => {
        console.log('Starting token fetch for wallet:', walletAddress);
        setIsLoading(true);
        setNetworkTokens([]);
        
        try {
          await getWalletTokens(walletAddress, networkAddresses, (networkData) => {
            console.log('Received network data:', networkData);
            setNetworkTokens(prev => [...prev, networkData]);
          });
        } catch (error) {
          console.error('Error fetching tokens:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchTokens();
    }
  }, [walletAddress, networkAddresses]);

  // Process the wallet tokens and set the user portfolio
  useProcessWalletTokens(networkTokens, stakingData || [], setUserPortfolio);

  // Calculate the total rewards
  useEffect(() => {
    const total = userPortfolio.reduce((acc, curr) => acc + curr.annual_rewards, 0);
    setTotalRewards(prev => [...prev, total]);
  }, [userPortfolio]);


  return (
    <div>
      {stakingData && <p>{JSON.stringify(stakingData)}</p>}
      {walletAddress && <p>Wallet Address: {walletAddress}</p>}
      <div className="text-white flex w-[100vw] h-[50vh] items-center justify-center">
        <MainDiv passWalletAddress={setWalletAddress} totalRewards={totalRewards} />
      </div>
      {totalRewards.length > 0 && <p>Total Rewards: {totalRewards[totalRewards.length - 1]}</p>}
      {stakingDataError && <p>Error getting staking rewards data: {stakingDataError}</p>}
      
      {isLoading && <p>Loading wallet tokens...</p>}

      {userPortfolio.length > 0 && (
        <div>
          <h2>Your Staking Portfolio:</h2>
          <pre>{JSON.stringify(userPortfolio, null, 2)}</pre>
        </div>
      )}
      
      {/* Show network tokens as they arrive */}
      {networkTokens.length > 0 ? (
        <p>Network tokens: {JSON.stringify(networkTokens)}</p>
      ) : null}
      

    </div>
  )
} 