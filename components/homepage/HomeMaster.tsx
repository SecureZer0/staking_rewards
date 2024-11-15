"use client"
import { useState, useEffect } from "react";
import MainDiv from "./mainDiv/MainDiv";
import { useStakingData } from "@/hooks/useStakingData";
import { StakingRewardTable } from "@/types/staking";

export default function HomeMaster() {
  const [walletAddress, setWalletAddress] = useState('')
//   const [userPortfolio, setUserPortfolio] = useState<UserPortfolio | null>(null)


  const [stakingData, setStakingData] = useState<StakingRewardTable[] | null>(null)
  const [stakingDataError, setStakingDataError] = useState<string | null>(null)

  // Get data from staking_rewards table
  useEffect(() => {
    const fetchData = async () => {
      const response = await useStakingData()
      setStakingData(response.stakingData)
      setStakingDataError(response.stakingDataError)
    }
    fetchData()
  }, [])

  // Process data with wallet address
  useEffect(() => {
    if (walletAddress && stakingData) {

    }
  }, [walletAddress, stakingData])

  return (
    <div>
      {stakingData && <p>{JSON.stringify(stakingData)}</p>}
      {walletAddress && <p>{walletAddress}</p>}
      <div className="text-white flex w-[100vw] h-[100vh] items-center justify-center">
        <MainDiv passWalletAddress={setWalletAddress}/>
      </div>
      {stakingDataError && <p>Error getting staking rewards data:{stakingDataError}</p>}
    </div>
  )
} 