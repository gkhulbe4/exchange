import { useWebSocket } from "@/context/WebSocketContext";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const PriceTicker = () => {
  const { setUserId, refetchUserBalance, ticker } = useWebSocket();
  const [userIdEntered, setUserIdEntered] = useState("");

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
            {ticker.price ? (
              Number(ticker.price).toFixed(2)
            ) : (
              <Loader2 className="animate-spin" />
            )}
          </div>
        </div>

        {!ticker.max_price ? (
          <Loader2 className="animate-spin" />
        ) : (
          <div className="flex gap-6 text-sm">
            <div>
              <div className="text-muted-foreground text-xs">24h High</div>
              <div className="font-mono">
                {Number(ticker.max_price).toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs">24h Low</div>
              <div className="font-mono">
                {Number(ticker.min_price).toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs">
                24h Volume(INR)
              </div>
              <div className="font-mono">
                {" "}
                {Number(ticker.volume).toFixed(2)}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <Input
          className="bg-secondary border-border font-mono pr-12 focus:outline-none focus-visible:ring-2 focus-visible:!ring-purple-500"
          type="text"
          placeholder="Enter user Id"
          value={userIdEntered}
          onChange={(e) => setUserIdEntered(e.target.value)}
          onKeyDown={(e) => {
            if (e.key == "Enter" && userIdEntered.length != 0) {
              signIn();
            }
          }}
        />
        <Button onClick={signIn} className="bg-purple-600 hover:bg-purple-700">
          Sign In
        </Button>
      </div>
    </div>
  );
};

export default PriceTicker;
