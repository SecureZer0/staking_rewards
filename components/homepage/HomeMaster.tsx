"use client"
import { useState, useEffect } from "react";
import MainDiv from "./mainDiv/MainDiv";
import { useStakingData } from "@/hooks/useStakingData";
import { StakingRewardTable, NetworkTokens, UserPortfolio } from "@/types/staking";
import { getWalletTokens } from '@/hooks/useGetWalletTokens';
import { useProcessWalletTokens } from '@/hooks/useProcessWalletTokens';

import ExampleWallets from "./exampleWallets/ExampleWallets";
import RewardCards from "./rewardCards/RewardCards";

export default function HomeMaster() {

  // STATES
   // USER PORTFOLIO STATES 
    // Users Wallet Address (0x...)
    const [walletAddress, setWalletAddress] = useState('')
    // Tokens in user wallet, raw format
    const [userTokens, setUserTokens] = useState<NetworkTokens[]>([])
    // User Portfolio With calculated Rewards & APYs spread in
    const [userPortfolio, setUserPortfolio] = useState<UserPortfolio[]>([])
    // Calculated Total Rewards for a user
    const [totalRewards, setTotalRewards] = useState<number[]>([0]);

   // STAKING DATA STATES
    const [stakingData, setStakingData] = useState<StakingRewardTable[] | null>(null)
    const [stakingDataError, setStakingDataError] = useState<string | null>(null)

   // TOKEN ADDRESSES STATES
    const [networkAddresses, setNetworkAddresses] = useState<{[key: string]: string[]}>({});
    const [isLoading, setIsLoading] = useState(false)
    const [isNetworkChecking, setIsNetworkChecking] = useState(false);

   // Specicial Wallets
    const [exampleWalletOwner, setExampleWalletOwner] = useState("")
  //

  console.log(stakingData)

  
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
        setUserTokens([]);
        
        try {
          await getWalletTokens(
            walletAddress, 
            networkAddresses, 
            (networkData) => {
                setUserTokens(prev => [...prev, networkData]);
            },
            (isRunning) => {
                setIsNetworkChecking(isRunning);
            }
          );
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
  useProcessWalletTokens(userTokens, stakingData || [], setUserPortfolio);

  // Calculate the total rewards
  useEffect(() => {
    const total = userPortfolio.reduce((acc, curr) => acc + curr.annual_rewards, 0);
    setTotalRewards(prev => [...prev, total]);
  }, [userPortfolio]);


  return (
    <div>
      <div className={`
        text-white flex w-[100vw] flex-col text-center items-center justify-center
        transition-[height] duration-700 ease-in-out h-[100svh] 
      `}>

        <div className="flex flex-col gap-0 sm:-mt-[10vh] mb-10 sm:mb-5">
        {walletAddress ? 
          <div className="text-4xl -mt-2  font-medium leading-none">
            Staking would earn {exampleWalletOwner ? exampleWalletOwner.split(' ').pop() : 'you'}:
          </div>
          : 

          <div className="text-left w-[1000px] mb-[15px]">
            <h1 className=" text-[120px] font-medium leading-none -ml-8">
              Yield Finder
            </h1>
            <div className="text-[25px] font-[300] w-[565px] leading-none">
             Earn real passive income by staking your tokens,
             simply enter your wallet to calculate rewards
            </div>
          </div>
          }
        </div>

        {isNetworkChecking && <p>Searching for yield..</p>}

        <MainDiv 
          setWalletAddress={setWalletAddress} 
          walletAddress={walletAddress} 
          totalRewards={totalRewards} 
          loadingRewards={isLoading}
        />

        {!walletAddress && 
            <ExampleWallets 
            setWallet={setWalletAddress}
            setOwner={setExampleWalletOwner}
            />
        }

        {walletAddress &&
        <div className="relative group">
          <div className="text-[18px] font-medium text-[#D6D6D6] mt-3 cursor-help flex items-start gap-1">
            Annually, if you stake your tokens today
          </div>
          
          {/* Tooltip */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 
                        opacity-0 group-hover:opacity-100 transition-opacity duration-200
                        bg-[#1A1A1A] text-[#D6D6D6] text-sm py-2 px-3 rounded-md
                        whitespace-nowrap border border-[#363636] z-10">
            APYs are variable and subject to change
            {/* Arrow */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 
                          border-8 border-transparent border-b-[#363636]"></div>
          </div>
        </div>
        }

      </div>

      {userPortfolio.length > 0 && (
        <div className="absolute bottom-10 mb-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center ">
          <div className="border-2 border-[#00FFDF] rounded-full p-2 flex items-center justify-center animate-bounce ">
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="text-[#00FFDF]"
            >
              <path d="M7 13l5 5 5-5"/>
              <path d="M7 6l5 5 5-5"/>
            </svg>
          </div>
        </div> 
      )}
 
      {userPortfolio.length > 0 && (
      <>
          <RewardCards 
            stakingData={stakingData}
            userPortfolio={userPortfolio}
          />
      </>
      )}















{/* 
      {totalRewards.length > 0 && <p>Total Rewards: {totalRewards[totalRewards.length - 1]}</p>}
      {stakingDataError && <p>Error getting staking rewards data: {stakingDataError}</p>}
      
      {isLoading && <p>Loading wallet tokens...</p>} */}

      {/* {userPortfolio.length > 0 && (
        <div>
          <h2>Your Staking Portfolio:</h2>
          <pre>{JSON.stringify(userPortfolio, null, 2)}</pre>
        </div>
      )} */}
      
      {/* Show network tokens as they arrive
      {/* {networkTokens.length > 0 ? (
        <p>Network tokens: {JSON.stringify(networkTokens)}</p>
      ) : null}
       */}

    </div>
  )
} 