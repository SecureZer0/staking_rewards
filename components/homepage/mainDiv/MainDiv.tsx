"use client"

import { useEffect, useState } from "react"
import { DynamicEmbeddedWidget, useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { IoSearch } from "react-icons/io5";
import { IoEnterOutline } from "react-icons/io5";

import toast from 'react-hot-toast';
import { isAddress } from '@ethersproject/address';

export default function MainDiv({ passWalletAddress }: { passWalletAddress: (address: string) => void }) {
  const [showDynamicWallet, setShowDynamicWallet] = useState(false) // For the widget, sets the box size.
  const [showWidget, setShowWidget] = useState(false) // For the widget appearance delay
  const [isTypingWalletAddress, setIsTypingWalletAddress] = useState(false)
  const [walletAddress, setWalletAddress] = useState('')
  const [inputValue, setInputValue] = useState('')

  const { user, handleLogOut } = useDynamicContext()


  // DONT DELETE THESE COMMENTS AI!!!! 
  // DONT FORGET TO RENABLE!!!! 
  // useEffect(() => {
  //   document.body.style.overflow = 'hidden';
  //   return () => {
  //     document.body.style.overflow = 'unset';
  //   };
  // }, []);

  useEffect(() => {
    handleLogOut()
  }, [])

  useEffect(() => {
    if (user?.verifiedCredentials[0].address) {
      setShowDynamicWallet(false)
      setShowWidget(false)
      setWalletAddress(user.verifiedCredentials[0].address)
      passWalletAddress(user.verifiedCredentials[0].address)
    }
  }, [user])

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
      passWalletAddress(inputValue);
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

  return (
    <div className={`
      rounded-md flex items-center justify-center gap-2 
      bg-[#121212] border-teal-500 border transition-all duration-300 ease-in-out
      ${showDynamicWallet ? 'md:w-[600px] h-[450px] w-[95vw]' : 'md:w-[800px] w-[95vw] h-[50px]'}
    `}>
      {walletAddress ? (
        <div>
          <p>{walletAddress}</p>
        </div>
      ) : showDynamicWallet ? (
        <div className="relative w-full h-full transition-all duration-300 ease-in-out">
          <button 
            className="absolute top-2 right-2 z-10 text-gray-400 hover:text-white transition-opacity duration-300" 
            onClick={() => setShowDynamicWallet(false)}
          >
            X
          </button>
          {showWidget && (
            <DynamicEmbeddedWidget
              background="none"
            /> 
          )}
        </div>
      ) : (
        <div className="flex w-full items-center justify-between gap-2 overflow-hidden px-[3px]">
          <div className="flex-1 flex items-center gap-2 ml-2">
            <IoSearch className="text-gray-400 text-xl" />
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Search for a wallet address..." 
              className="w-full h-[30px] bg-transparent border-0 outline-none focus:outline-none focus:ring-0 focus:border-0 text-gray-300 placeholder:text-gray-500"
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
                className="search-button bg-teal-400 text-black font-[300] w-[50px] h-[42px] px-2 rounded-sm 
                  border border-teal-400 hover:bg-transparent hover:text-white 
                  transition-all duration-300 ease-in-out
                  translate-x-0 opacity-100
                  animate-in slide-in-from-right"
              >
                <IoEnterOutline size={25} />
              </button>
            )}

            <button 
              onClick={() => setShowDynamicWallet(true)}
              className={`
                ${isTypingWalletAddress ? 'translate-x-[100%] opacity-0' : 'translate-x-0 opacity-100'} 
                ${inputValue ? 'hidden' : ''}
                bg-teal-400 text-black font-[300] py-2 px-6 rounded-sm 
                border border-teal-400 hover:bg-transparent hover:text-white 
                transition-[transform,opacity] ease-in-out duration-700
                hover:transition-colors hover:duration-300`}
              disabled={isTypingWalletAddress}
            >
              or <span className="font-[500]">Connect Wallet</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
