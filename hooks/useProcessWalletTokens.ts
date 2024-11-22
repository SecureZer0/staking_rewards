import { StakingRewardTable, UserPortfolio, NetworkTokens } from "@/types/staking";
import { useEffect } from "react";

export function useProcessWalletTokens(networkTokens: NetworkTokens[], stakingData: StakingRewardTable[], setUserPortfolio: (portfolio: UserPortfolio[]) => void) {
    useEffect(() => {
        const processTokens = () => {
            const portfolio: UserPortfolio[] = [];

            networkTokens.forEach(networkToken => {
                networkToken.tokens.forEach(token => {
                    const matchingStakingData = stakingData.find(staking => {
                        const networkInfo = staking.contract_addresses[networkToken.network];
                        return networkInfo?.contract_address.toLowerCase() === token.contractAddress.toLowerCase();
                    });

                    if (matchingStakingData) {
                        const networkInfo = matchingStakingData.contract_addresses[networkToken.network];
                        const balance = Number(token.tokenBalance) / Math.pow(10, networkInfo.decimal);
                        const balance_usd = balance * matchingStakingData.price;
                        const annual_rewards = balance_usd * (matchingStakingData.apy / 100);
                        const annual_rewards_30d = balance_usd * (matchingStakingData.apy_30d / 100);

                        portfolio.push({
                            token_name: matchingStakingData.token_name,
                            token_symbol: matchingStakingData.token_symbol,
                            token_decimal: networkInfo.decimal,
                            price_usd: matchingStakingData.price,
                            apy: matchingStakingData.apy,
                            apy_30d: matchingStakingData.apy_30d,
                            apy_chain: matchingStakingData.apy_chain,
                            apy_source: matchingStakingData.apy_source,
                            balance,
                            balance_usd,
                            current_chain: networkToken.network,
                            annual_rewards,
                            annual_rewards_30d
                        });
                    }
                });
            });

            setUserPortfolio(portfolio);
        };

        if (networkTokens.length > 0 && stakingData.length > 0) {
            processTokens();
        }
    }, [networkTokens, stakingData, setUserPortfolio]);
}