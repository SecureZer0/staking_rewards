import { UserPortfolio, StakingRewardTable } from "@/types/staking";
import { getSourceDisplayName } from '@/functions/apySourceFormatter';
import { getStakeUrl } from '@/functions/stakeLink';
import { getBridgeUrl } from '@/functions/bridgeLink';

export default function RewardCards({ userPortfolio, stakingData }: { userPortfolio: UserPortfolio[], stakingData: StakingRewardTable[] | null }) {


    const rewardElements = [...userPortfolio]
        .sort((a, b) => b.annual_rewards - a.annual_rewards)
        .map((token, i) => {

            if (token.annual_rewards < 0.5) return null;

            let sameChain = token.apy_chain === token.current_chain;

            return (
                <div 
                    key={i}
                    className="sm:h-[200px] h-fit bg-[#121212] border border-[#363636] rounded-[10px] p-5 flex flex-col justify-between"
                >
                    <div className="flex justify-between">
                        
                        <div className="flex flex-col gap-0 text-left justify-items-start">
                            <div className="text-[32px] md:text-[42px] font-semibold leading-none">
                                {token.token_name}
                            </div>
                            {token.apy_chain !== token.current_chain && (
                                <>
                                    <div className="text-[12px] md:text-[18px] text-[#D6D6D6] ml-[2px] -mb-1">
                                        Bridge to {token.apy_chain}
                                    </div>
                                </>
                            )}
                            <div className="text-[12px] md:text-[18px] text-[#D6D6D6]  ml-[2px]">
                                Stake on {getSourceDisplayName(token.apy_source)}
                            </div>
                        </div>


                        <div className="flex flex-col items-end">
                            <div className="text-[32px] md:text-[42px] font-semibold leading-none">
                                ${token.annual_rewards.toLocaleString('en-US', { maximumFractionDigits: 2 })} <br />
                                ${token.annual_rewards_30d.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                            </div>
                            <div className="text-[14px] md:text-[24px] text-[#D6D6D6] font-light">
                                {(Number(token.apy || 0)).toFixed(2)}% APY <br />
                                {(Number(token.apy_30d || 0)).toFixed(2)}% APY
                            </div>
                        </div>

                    </div>
                    <div className="flex sm:flex-row flex-col sm:gap-5 gap-2 mt-3 sm:mt-0">
                        {!sameChain && (
                            <button 
                                onClick={() => window.open(getBridgeUrl(token, stakingData), '_blank')}
                                className="text-black text-[14px] md:text-[18px] bg-[#00FFDF]  border border-[#00FFDF] rounded-[9px] p-2 w-full sm:w-1/2  hover:bg-transparent hover:text-white transition-all duration-300"
                            >
                                Bridge to {token.apy_chain}
                            </button>
                        )}
                        <button 
                            onClick={() => window.open(getStakeUrl(token, stakingData), '_blank')}
                            className={`
                              text-white text-[14px] md:text-[18px] bg-transparent border border-[#00FFDF]
                               rounded-[9px] p-2 w-full  ${sameChain ? "sm:w-full" : "sm:w-1/2"}  hover:bg-[#00FFDF]
                             hover:text-black transition-all duration-300`}
                        >
                            Stake Now
                        </button>
                        
                        
                    </div>
                </div>
            )
        });


  return (
    <div className="grid 1200:grid-cols-2 grid-cols-1 gap-5 mx-5 sm:mx-14 md:mx-28 mb-20">
        {rewardElements}
    </div>
  )
}