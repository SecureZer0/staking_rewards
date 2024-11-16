import { Inter } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core';
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { Toaster } from 'react-hot-toast';

const inter = Inter({ 
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
});

export const metadata: Metadata = {
  title: "Staking Rewards",
  description: "See What You're Missing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body className="antialiased bg-black">
        <DynamicContextProvider
          settings={{
            environmentId: process.env.NEXT_PUBLIC_DYNAMIC_APP_ID!,
            walletConnectors: [ EthereumWalletConnectors ],
        }}>
          <Toaster position="top-right" />
          {children}
        </DynamicContextProvider>
      </body>
    </html>
  );
}
