import { useWebSocket } from "@/context/WebSocketContext";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { SiSolana } from "react-icons/si";
import { LuDollarSign } from "react-icons/lu";

const PriceTicker = () => {
  const {
    setUserId,
    refetchUserBalance,
    ticker,
    userId,
    setUserBalance,
    userBalance,
  } = useWebSocket();
  const [userIdEntered, setUserIdEntered] = useState("");

  async function signIn() {
    if (userIdEntered.length == 0) {
      toast.info("Please enter the user Id");
      return;
    }
    console.log("USER ID ENTERED: ", userIdEntered);
    setUserId(() => userIdEntered);
    refetchUserBalance();
    localStorage.setItem("userId", userIdEntered);
    toast.success("User signed in successfully");
  }

  async function signOut() {
    setUserId(null);
    setUserBalance({
      INR: null,
      SOL: null,
    });
    localStorage.removeItem("userId");
    toast.success("User signed out successfully");
  }

  return (
    <div className="h-16 bg-card border-b border-border flex items-center justify-between px-4">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-black">
              <img
                src="https://i.pinimg.com/736x/bd/f5/06/bdf5066589b7865a55d6790c210dba6d.jpg"
                alt="SOL"
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <div className="font-semibold text-sm">SOL/USD</div>
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
                24h Volume(USD)
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
        {!userId && (
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
        )}
        {userId && (
          <>
            <div className="flex justify-center gap-5 items-center border border-input px-3 py-2 rounded-md bg-[#070707]">
              <p className="text-sm text-muted-foreground font-extralight flex justify-center items-center gap-2">
                <LuDollarSign size={18} /> {userBalance?.INR?.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground font-extralight flex justify-center items-center gap-2">
                <SiSolana /> {userBalance?.SOL?.toLocaleString()}
              </p>
            </div>
            <div className="flex justify-center items-center border border-input px-3 py-2 rounded-md bg-[#070707]">
              <p className="text-sm text-muted-foreground font-extralight">
                USER ID: {userId}
              </p>
            </div>
          </>
        )}
        <Button
          onClick={() => {
            if (!userId) {
              signIn();
            } else {
              signOut();
            }
          }}
          className={`${
            !userId
              ? "bg-purple-600 hover:bg-purple-700"
              : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {!userId ? " Sign In" : "Sign Out"}
        </Button>
      </div>
    </div>
  );
};

export default PriceTicker;
