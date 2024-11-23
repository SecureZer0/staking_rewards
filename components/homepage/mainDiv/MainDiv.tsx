"use client"

import { useEffect, useState } from "react"
import { IoSearch } from "react-icons/io5";
import { IoEnterOutline } from "react-icons/io5";
import './maindiv.css';

import toast from 'react-hot-toast';
import { isAddress } from '@ethersproject/address';
import CountUp from 'react-countup';

interface MainDivProps {
  setWalletAddress: (address: string) => void;
  totalRewards: number[];
  loadingRewards: boolean;
  walletAddress: string
}

export default function MainDiv({ walletAddress ,setWalletAddress, totalRewards, loadingRewards }: MainDivProps) {
  const [showDynamicWallet, setShowDynamicWallet] = useState(false) // For the widget, sets the box size.
  const [showWidget, setShowWidget] = useState(false) // For the widget appearance delay
  const [isTypingWalletAddress, setIsTypingWalletAddress] = useState(false)
  // const [walletAddress, setWalletAddress] = useState('')
  const [inputValue, setInputValue] = useState('')
  const [shouldFlash, setShouldFlash] = useState(false);

  const [mounted, isMounted] = useState(false)

  const [lastUpdateTime, setLastUpdateTime] = useState(Date.now());

  useEffect(()=> {
    isMounted(true)
  })


  // DONT DELETE THESE COMMENTS AI!!!! 
  // DONT FORGET TO RENABLE!!!! 
  // useEffect(() => {
  //   document.body.style.overflow = 'hidden';
  //   return () => {
  //     document.body.style.overflow = 'unset';
  //   };
  // }, []);



  // Handle widget appearance delay
  useEffect(() => {
    if (showDynamicWallet) {
      setTimeout(() => setShowWidget(true), 300)
    } else {
      setShowWidget(false)
    }
  }, [showDynamicWallet])



  const handleSearch = () => {
    console.log('Search button clicked');
    if (!inputValue) return;
    
    if (isAddress(inputValue)) {
      setWalletAddress(inputValue);
      setInputValue('');
    } else {
      toast.error('Please enter a valid wallet address');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };


  console.log("totalRewards")
  console.log(totalRewards)

  return (
    <div 
      className="relative border-animation h-fit w-fit z-[20]"
    >
      <div className={`
        rounded-md flex items-center justify-center origin-top gap-2 
        bg-[#121212] transition-all duration-300 ease-in-out z-[20]
        ${showDynamicWallet ? 'md:w-[1000px] h-[450px] w-[95vw]' : 'md:w-[1000px] w-[95vw] h-[60px]'}
        ${walletAddress ? '!h-[175px]' : ''}
      `}>
        
        {totalRewards.length > 0 && walletAddress ? (

          <div>
            <p className={`text-[64px] md:text-8xl font-[500] transition-all duration-500 ease-in-out text-white select-none`}>
              $<CountUp 
                end={totalRewards[totalRewards.length - 1] || 0}
                decimals={2}
                duration={4}
                separator=","
                preserveValue={true}
              /><span className="text-[36px] font-light">/Year</span></p>
          </div>

        ) : (
          <div className="flex w-full items-center justify-between gap-2 overflow-hidden px-[5px]">
            <div className="flex-1 flex items-center gap-2 ml-2 z-[20]">
              <IoSearch className="text-gray-400 text-2xl" />
              <input 
                type="text" 
                disabled={!mounted}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={mounted ? "Search for a wallet address..." : "Loading..."}
                className="w-full h-[50px] text-xl bg-transparent border-0 outline-none focus:outline-none focus:ring-0 focus:border-0 text-gray-300 placeholder:text-gray-500"
                onFocus={() => setIsTypingWalletAddress(true)}
                onBlur={(e) => {
                  if (!(e.relatedTarget?.classList.contains('search-button'))) {
                    setIsTypingWalletAddress(false)
                  }
                }}
                onKeyDown={handleKeyPress}
              />
            </div>

            <div className="flex gap-2">
              {inputValue && (
                <button 
                  onClick={handleSearch}
                  type="button"
                  className="search-button bg-teal-400 text-black font-[300] w-[66px] h-[50px] px-2 py-2 rounded-sm 
                    border border-teal-400 hover:bg-transparent hover:text-white  flex items-center justify-center
                    transition-all duration-300 ease-in-out
                    translate-x-0 opacity-100
                    animate-in slide-in-from-right"
                  >
                    <IoEnterOutline size={32} className="mr-1"/>
                  </button>
              )}


              <button 
                onClick={() => setShowDynamicWallet(true)}
                className={`
                  ${isTypingWalletAddress ? 'translate-x-[210%] opacity-0' : 'translate-x-0 opacity-100'} 
                  ${inputValue ? 'hidden' : ''}
                  search-button bg-teal-400 text-black font-[500] w-[200px] h-[50px] px-2 py-2 rounded-sm 
                    border border-teal-400 hover:bg-transparent hover:text-white  flex items-center justify-center
                    transition-all duration-300 ease-in-out
                    translate-x-0 opacity-100
                    animate-in slide-in-from-right`}
                disabled={isTypingWalletAddress}
              >
              Upload Screenshot
              </button>

              <button 
                onClick={() => setShowDynamicWallet(true)}
                className={`
                  ${isTypingWalletAddress ? 'translate-x-[110%] opacity-0' : 'translate-x-0 opacity-100'} 
                  ${inputValue ? 'hidden' : ''}
                  search-button bg-teal-400 text-black font-[500] w-[200px] h-[50px] px-2 py-2 rounded-sm 
                    border border-teal-400 hover:bg-transparent hover:text-white  flex items-center justify-center
                    transition-all duration-300 ease-in-out
                    translate-x-0 opacity-100
                    animate-in slide-in-from-right`}
                disabled={isTypingWalletAddress}
              >
              Connect Wallet
              </button>
              
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
