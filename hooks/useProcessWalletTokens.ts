import { StakingRewardTable, UserPortfolio, NetworkTokens } from "@/types/staking";
import { useEffect } from "react";

export function useProcessWalletTokens(networkTokens: NetworkTokens[], stakingData: StakingRewardTable[], setUserPortfolio: (portfolio: UserPortfolio[]) => void) {
    useEffect(() => {
        const processTokens = () => {
            console.log('Starting processTokens with:', {
                networkTokens,
                stakingData
            });

            const portfolio: UserPortfolio[] = [];

            networkTokens.forEach(networkToken => {
                console.log('Processing network:', {
                    network: networkToken.network,
                    tokensCount: networkToken.tokens.length
                });

                networkToken.tokens.forEach(token => {
                    console.log('Processing token:', {
                        contractAddress: token.contractAddress,
                        balance: token.tokenBalance
                    });

                    // Log contract addresses being compared
                    stakingData.forEach(staking => {
                        console.log('Comparing:', {
                            network: networkToken.network,
                            tokenContract: token.contractAddress.toLowerCase(),
                            stakingContract: staking.contract_address[networkToken.network]?.toLowerCase()
                        });
                    });

                    const matchingStakingData = stakingData.find(staking => {
                        // Get the contract address for the current network
                        const networkAddress = staking.contract_address[networkToken.network];
                        return networkAddress?.toLowerCase() === token.contractAddress.toLowerCase();
                    });

                    if (matchingStakingData) {
                        console.log('Found match:', matchingStakingData);
                        
                        const balance = Number(token.tokenBalance) / Math.pow(10, matchingStakingData.token_decimal);
                        const balance_usd = balance * matchingStakingData.price_usd;
                        const annual_rewards = balance_usd * (matchingStakingData.apy / 100);

                        console.log('Calculated values:', {
                            balance,
                            balance_usd,
                            annual_rewards
                        });

                        portfolio.push({
                            token_name: matchingStakingData.token_name,
                            token_symbol: matchingStakingData.token_symbol,
                            token_decimal: matchingStakingData.token_decimal,
                            price_usd: matchingStakingData.price_usd,
                            apy: matchingStakingData.apy,
                            apy_chain: matchingStakingData.apy_chain,
                            apy_source: matchingStakingData.apy_source,
                            balance,
                            balance_usd,
                            current_chain: networkToken.network,
                            annual_rewards
                        });
                    } else {
                        console.log('No match found for token:', token.contractAddress);
                    }
                });
            });

            console.log('Final portfolio:', portfolio);
            setUserPortfolio(portfolio);
        };

        if (networkTokens.length > 0 && stakingData.length > 0) {
            console.log('Conditions met for processing:', {
                networkTokensLength: networkTokens.length,
                stakingDataLength: stakingData.length
            });
            processTokens();
        } else {
            console.log('Conditions not met:', {
                networkTokensLength: networkTokens.length,
                stakingDataLength: stakingData.length
            });
        }
    }, [networkTokens, stakingData, setUserPortfolio]);
}