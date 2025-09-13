import { useWebSocket } from "@/context/WebSocketContext";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useState } from "react";
import { toast } from "sonner";

const PriceTicker = () => {
  const { setUserId, refetchUserBalance } = useWebSocket();
  const [userIdEntered, setUserIdEntered] = useState("");

  const price = {
    current: 0,
    change24h: 0,
    high24h: 0,
    low24h: 0,
    volume24h: 0,
  };

  async function signIn() {
    if (userIdEntered.length == 0) {
      toast.info("Please enter the user Id");
      return;
    }

    setUserId(userIdEntered);
    refetchUserBalance();
    toast.success("User signed in successfully");
  }

  return (
    <div className="h-16 bg-card border-b border-border flex items-center justify-between px-4">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xs">SOL</span>
            </div>
            <div>
              <div className="font-semibold text-sm">SOL/INR</div>
              <div className="text-xs text-muted-foreground">Solana</div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <div className="text-2xl font-mono font-bold">
            {price.current.toLocaleString("en-IN")}
          </div>
        </div>

        <div className="flex gap-6 text-sm">
          <div>
            <div className="text-muted-foreground text-xs">24h High</div>
            <div className="font-mono">
              {price.high24h.toLocaleString("en-IN")}
            </div>
          </div>
          <div>
            <div className="text-muted-foreground text-xs">24h Low</div>
            <div className="font-mono">
              {price.low24h.toLocaleString("en-IN")}
            </div>
          </div>
          <div>
            <div className="text-muted-foreground text-xs">24h Volume(INR)</div>
            <div className="font-mono">{price.volume24h}</div>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Input
          className="bg-secondary border-border font-mono pr-12 focus:outline-none focus-visible:ring-2 focus-visible:!ring-purple-500"
          type="text"
          placeholder="Enter user Id"
          value={userIdEntered}
          onChange={(e) => setUserIdEntered(e.target.value)}
        />
        <Button onClick={signIn} className="bg-purple-600 hover:bg-purple-700">
          Sign In
        </Button>
      </div>
    </div>
  );
};

export default PriceTicker;
