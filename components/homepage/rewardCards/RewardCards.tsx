import { UserPortfolio, StakingRewardTable } from "@/types/staking";
import { getSourceDisplayName } from '@/functions/apySourceFormatter';
import { getStakeUrl } from '@/functions/stakeLink';
import { getBridgeUrl } from '@/functions/bridgeLink';
import { useState } from 'react';
import { IoWalletOutline } from "react-icons/io5";  // Example icons
import { IoBookOutline } from "react-icons/io5";
import { IoStatsChartOutline } from "react-icons/io5";
import { RiChatSmileLine } from "react-icons/ri";
import { TypeAnimation } from 'react-type-animation';
import { TbBuildingBridge } from "react-icons/tb";
import { FiPlus } from "react-icons/fi";
import { TbEqual } from "react-icons/tb";
import { HiOutlineSparkles } from "react-icons/hi2";



import { Arrow } from '@/components/icons/Arrow';

interface TabState {
    [key: string]: 'stake' | 'guide' | 'details';
}

export default function RewardCards({ userPortfolio, stakingData }: { userPortfolio: UserPortfolio[], stakingData: StakingRewardTable[] | null }) {
    const [activeTab, setActiveTab] = useState<TabState>({});

    const tabConfig = [
        { id: 'stake', icon: <HiOutlineSparkles /> },
        { id: 'guide', icon: <IoBookOutline /> },
        { id: 'details', icon: <IoStatsChartOutline /> }
    ];

    console.log(userPortfolio);
    console.log("userPortfolio");

    const rewardElements = [...userPortfolio]
        .sort((a, b) => b.annual_rewards - a.annual_rewards)
        .map((token, i) => {
            if (token.annual_rewards < 0.5) return null;

            const sameChain = token.apy_chain === token.current_chain;
            
            const renderContent = () => {
                switch(activeTab[token.annual_rewards] || 'stake') {

                    case 'guide':
                        return (
                            <div className="text-center text-gray-400 mt-4 px-5">
                                Coming Soon
                            </div>
                        );

                    case 'details':
                        return (
                            <div className="flex flex-col gap-5 mt-[20px] ">

                                <div className="text-[16px] flex items-center justify-start gap-4 bg-black py-3 px-4 rounded-[3px] text-[#696969] mx-5 min-h-[39px]">
                                    <RiChatSmileLine className="flex-shrink-0 w-[30px] h-[30px]" />
                                    
                                    {token.current_chain === token.apy_chain ? 
                                        <TypeAnimation
                                            sequence={[
                                               `Stake your ${token.token_symbol} on ${token.current_chain} chain on ${getSourceDisplayName(token.apy_source)} to earn ${(Number(token.apy || 0)).toFixed(2)}% APY or $${token.annual_rewards.toLocaleString('en-US', { maximumFractionDigits: 0 })}/year`,
                                        ]}
                                            wrapper="p"
                                            speed={65}
                                            cursor={false}
                                        />
                                    :
                                        <TypeAnimation
                                            sequence={[
                                                   `Bridge your ${token.token_symbol} to ${token.apy_chain} chain and stake it on ${getSourceDisplayName(token.apy_source)} to earn ${(Number(token.apy || 0)).toFixed(2)}% APY or $${token.annual_rewards.toLocaleString('en-US', { maximumFractionDigits: 0 })}/year`,
                                            ]}
                                            wrapper="p"
                                            speed={65}
                                                cursor={false}
                                        />

                                    }
                                </div>

                                <div>
                                    <h3 className="mb-[6px] font-bold text-[14px] text-[#434343] ml-[15px]">BRIDGE</h3>
                                    <div className="text-[#DADADA] flex relative items-center bg-[#191919] px-8 py-3 h-[80px]">
                                        <div className="flex flex-col -ml-2">
                                            <h1 className="text-[30px] font-semibold">
                                                {token.current_chain.split(' ')[0].toUpperCase()}
                                            </h1>
                                            <p className="text-[14px] -mt-1 font-[400]">
                                                Current Chain
                                            </p>
                                        </div>

                                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center gap-10">
                                            <Arrow />
                                            <TbBuildingBridge className="!w-[30px] !h-[30px] !stroke-[1]" />
                                            <Arrow />
                                        </div>

                                        <div className="flex flex-col ml-auto -mr-2 text-right font-semibold">
                                            <h1 className="text-[30px]">
                                                {token.apy_chain.split(' ')[0].toUpperCase()}
                                            </h1>
                                            <p className="text-[14px] -mt-1 font-[400]">
                                                Staking Chain
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="mb-[6px] font-bold text-[14px] text-[#434343] ml-[15px]">YIELD</h3>

                                    <div className="text-[#DADADA flex relative items-center bg-[#191919] px-8 py-3 h-[70px]">

                                        <div className="flex items-center justify-between w-full ">
                                            <div>
                                                <h1 className="text-[30px] font-semibold">
                                                    {(Number(token.apy || 0)).toFixed(2)}%
                                                </h1>
                                                <p className="text-[12px] font-[400] text-[#828282] -mt-1">
                                                    Current APY
                                                </p>
                                            </div>

                                            <FiPlus className="text-[20px] text-[#828282]" />

                                            <div>
                                                <h1 className="text-[25px] font-semibold">
                                                    {token.balance.toLocaleString('en-US', { maximumFractionDigits: 2 })} <span className="text-[20px]">{token.token_symbol}</span>
                                                </h1>
                                                <p className="text-[12px] font-[400] text-[#828282] -mt-1">
                                                    Your Holdings
                                                </p>
                                            </div>

                                            <TbEqual className="text-[20px] text-[#828282]" />

                                            <div className="text-right">
                                                <h1 className="text-[25px] font-semibold">
                                                    ${token.annual_rewards.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                                                </h1>
                                                <p className="text-[12px] font-[400] text-[#828282] -mt-1">
                                                    Annual Return 
                                                </p>
                                            </div>
                                        </div>
                                        



                                    </div>

                                </div>


                            </div>
                        );

                    default: // 'stake'
                        return (
                            <div className="flex flex-col gap-3 sm:gap-2 mt-4 px-5 min-h-[100px]">
                                {!sameChain ? 
                                    <button 
                                        onClick={() => window.open(getBridgeUrl(token, stakingData), '_blank')}
                                        className="
                                          text-white text-[16px] md:text-[18px] bg-transparent border border-white rounded-[3px] p-2 
                                          hover:bg-white hover:text-black transition-all duration-300
                                            w-full h-[45px]"
                                    >
                                        Bridge to {token.apy_chain}
                                    </button>
                                    :
                                    <div className="h-[45px] bg-[#2A2A2A] flex items-center justify-center text-[#696969] text-[16px] select-none">
                                        Already On Correct Chain!
                                    </div>
                                }
                                <button 
                                    onClick={() => window.open(getStakeUrl(token, stakingData), '_blank')}
                                    className="
                                      text-black text-[16px] md:text-[18px] bg-[#00FFDF] border border-[#00FFDF] rounded-[3px] p-2 
                                        hover:bg-transparent hover:text-white transition-all duration-300
                                        w-full h-[45px]"
                                    
                                >
                                    Stake Now
                                </button>
                            </div>
                        );
                }
            };

            return (
                <div 
                    key={token.annual_rewards}
                    className="h-fit bg-[#121212] border border-[#363636] rounded-[10px] pt-5 pb-5 flex flex-col justify-between max-1370:max-w-[750px] w-full"
                >
                    <div className="px-5 mb-5">
                        <div className="flex justify-between">
                            
                            <div className="flex flex-col gap-0 text-left justify-items-start">
                                <div className="text-[40px] font-medium leading-none text-white">
                                    {token.token_name}
                                </div>
                                <div className="text-[14px] text-[#696969] ml-[2px]">
                                    Held on {token.current_chain} Chain
                                </div>
                            </div>


                            <div className="flex flex-col items-end">
                                <div className="text-[32px] md:text-[42px] font-semibold leading-none">
                                    ${token.annual_rewards.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                                </div>
                                <div className="text-[14px] text-[#696969] ml-[2px]">
                                    from {token.balance.toLocaleString('en-US', { maximumFractionDigits: 2 })} {token.token_symbol}
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="relative w-full">
                        <div className="grid grid-cols-3 w-full">
                            {tabConfig.map(({ id, icon }) => (
                                <div key={id} className="flex justify-center">
                                    <button
                                        onClick={() => setActiveTab(prev => ({
                                            ...prev,
                                            [token.annual_rewards]: id as 'stake' | 'guide' | 'details'
                                        }))}
                                        className={`
                                            flex items-center gap-2 
                                            px-4 py-2 text-lg capitalize
                                            transition-all duration-300
                                            ${activeTab[token.annual_rewards] === id || (!activeTab[token.annual_rewards] && id === 'stake')
                                                ? 'text-[#FFFFFF]'
                                                : 'text-[#696969]'}
                                        `}
                                    >
                                        {icon}
                                        {id}
                                    </button>
                                    <div className={`
                                        absolute bottom-0 
                                        w-[110px] h-[4px]
                                        rounded-t-[15px]
                                        transition-all duration-300
                                        ${activeTab[token.annual_rewards] === id || (!activeTab[token.annual_rewards] && id === 'stake')
                                            ? 'bg-[#FFFFFF]'
                                            : 'bg-[#696969]'}
                                    `}/>
                                </div>
                            ))}
                        </div>
                        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-[#696969]"></div>
                    </div>

                    <div className="px-0">
                        {renderContent()}
                    </div>
                </div>
            );
        });

    return (
        <div className="flex flex-col items-center mb-20 gap-5 mx-5
                        1370:max-w-none 1370:grid 1370:grid-cols-2 1370:mx-28 "> 
            {rewardElements}
        </div>
    );
}