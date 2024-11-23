import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { MdOpenInNew } from "react-icons/md";


interface ExampleWalletsProps {
    setWallet: Dispatch<SetStateAction<string>>;
    setOwner: Dispatch<SetStateAction<string>>;
}

export default function ExampleWallets({ setWallet, setOwner }: ExampleWalletsProps) {

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);


    const exampleWallets = [
        { name: "Vitalik Buterin", address: "0xd8da6bf26964af9d7eed9e03e53415d37aa96045" },
        { name: "Donald Trump", address: "0x94845333028B1204Fbe14E1278Fd4Adde46B22ce" },
        { name: "Vitalik Buterin", address: "0xd8da6bf26964af9d7eed9e03e53415d37aa96045" },
        { name: "Donald Trump", address: "0x94845333028B1204Fbe14E1278Fd4Adde46B22ce" },
    ]

    // if (!mounted) return null;

    return (
            <div className='grid grid-cols-4 gap-4 w-[1000px] mt-[30px]'>

                {exampleWallets.map((wallet, index) => (
                    <div 
                        key={index}
                        className={`
                            bg-transparent border border-1 border-[#3E3E3E] h-[125px] rounded-[9px] text-left
                            ease-in-out duration-900 px-[14px] py-[18px] select-none 
                            relative z-[2] ${mounted ? "cursor-pointer hover:border-white transition-[border-color] duration-300" : ""}
                            animate-in fade-in slide-in-from-top
                        `}
                        style={{
                            animationDelay: `${index * 200}ms`,
                            animationFillMode: 'backwards'
                        }}
                        onClick={() => {
                            if(mounted) {
                                setWallet(wallet.address);
                                setOwner(wallet.name);
                            }
                        }}
                    >
                        <h1 className='text-[24px] text-[#CECECE] leading-none'>{wallet.name}</h1>
                        <p className='text-[12px] text-[#3E3E3E]'>{wallet.address.slice(0, 10)}...</p>
                        <p className='absolute bottom-[10px] right-[10px] text-[12px] text-[#3E3E3E] flex items-center gap-1'>
                            See Example
                            <MdOpenInNew size={12}/>
                        </p>
                    </div>
                ))}
            </div>
    );
}
    