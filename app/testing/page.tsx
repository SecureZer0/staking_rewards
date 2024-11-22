"use client"

import { createThirdwebClient } from "thirdweb";
import { ConnectButton } from "thirdweb/react";

import { createWallet } from "thirdweb/wallets";

import { useActiveAccount, useWalletBalance } from "thirdweb/react";




export default function TestingPage() {

    const client = createThirdwebClient({
        clientId: "....",
    });
    
    const wallets = [
        createWallet("io.metamask"),
        createWallet("com.coinbase.wallet"),
        createWallet("me.rainbow"),
        createWallet("io.rabby"),
        createWallet("com.trustwallet.app"),
    ];

    const account = useActiveAccount();
    // const { data: balance, isLoading } = useWalletBalance({
    //   client,
    //   chain,
    //   address: account?.address,
    // });
  
      
    
    
    return (
      <div className="text-white">

        <ConnectButton
        client={client}
        wallets={wallets}
        connectButton={{ label: "or Connect Wallet" }}
        connectModal={{
            size: "wide",
            title: "Connect Wallet",
            showThirdwebBranding: false,
        }}
        />
    
        <p>Wallet address: {account?.address}</p>
      </div>
    )
}

