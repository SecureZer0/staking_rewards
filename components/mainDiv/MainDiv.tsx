import { Command, CommandInput } from "../ui/command"

export default function MainDiv() {
  return (
    <div className="w-[600px] sm:w-[95vw] h-[50px] border border-teal-500 rounded-md bg-[#121212]">
        <input 
            type="text" 
            placeholder="Type a command or search..." 
            className="w-full h-full bg-transparent border-0 outline-none focus:outline-none focus:ring-0 focus:border-0" 
        />
    </div>
  )
}
