import MainDiv from "@/components/mainDiv/MainDiv";
import Image from "next/image";

export default function Home() {
  return (
    <div className="text-white flex w-[100vw] h-[100vh] items-center justify-center">
      <div>
        <h1>Staking Rewards</h1>
        <MainDiv />
      </div>
    </div>
  );
}
