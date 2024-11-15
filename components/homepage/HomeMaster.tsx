"use client"
import { useState, useEffect } from "react";
import MainDiv from "./mainDiv/MainDiv";
import { useStakingData } from "@/hooks/useStakingData";
import { StakingRewardTable } from "@/types/staking";
import { getWalletTokens, NetworkTokens } from '@/hooks/useGetWalletTokens';

export default function HomeMaster() {
  const [walletAddress, setWalletAddress] = useState('')
  const [userPortfolio, setUserPortfolio] = useState<null>(null)


  const [stakingData, setStakingData] = useState<StakingRewardTable[] | null>(null)
  const [stakingDataError, setStakingDataError] = useState<string | null>(null)
  const [networkTokens, setNetworkTokens] = useState<NetworkTokens[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Get data from staking_rewards table
  useEffect(() => {
    const fetchData = async () => {
      const response = await useStakingData()
      setStakingData(response.stakingData)
      setStakingDataError(response.stakingDataError)
    }
    fetchData()
  }, [])

  // Get the tokens from the users wallet address 
  useEffect(() => {
    console.log('walletAddress useEffect running')
    if (walletAddress) {
      const fetchTokens = async () => {
        console.log('Starting token fetch for wallet:', walletAddress);
        setIsLoading(true);
        setNetworkTokens([]);
        
        try {
          await getWalletTokens(walletAddress, (networkData) => {
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
  }, [walletAddress]);




  // Process data with wallet address
  useEffect(() => {
    if (userPortfolio && stakingData) {
        // PROCESS WALLET TOKENS AGAINST THE STAKING APY'S FROM STAKING DATA
        // CALCULATE THE REWARDS FOR EACH STAKING APY
        // ADD THEM TO THE USER PORTFOLIO
    }
  }, [userPortfolio, stakingData])

  return (
    <div>
      {/* {stakingData && <p>{JSON.stringify(stakingData)}</p>} */}
      {walletAddress && <p>Wallet Address: {walletAddress}</p>}
      <div className="text-white flex w-[100vw] h-[50vh] items-center justify-center">
        <MainDiv passWalletAddress={setWalletAddress}/>
      </div>
      {stakingDataError && <p>Error getting staking rewards data: {stakingDataError}</p>}
      
      {isLoading && <p>Loading wallet tokens...</p>}
      
      {/* Show network tokens as they arrive */}
      {networkTokens.length > 0 ? (
        <p>Network tokens: {JSON.stringify(networkTokens)}</p>
      ) : null}
    </div>
  )
} 