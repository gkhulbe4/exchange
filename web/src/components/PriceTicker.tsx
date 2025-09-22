import { useWebSocket } from "@/context/WebSocketContext";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { SiSolana } from "react-icons/si";
import { LuDollarSign } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import {
  formatCoinImg,
  formatCoinLogo,
  formatCoinName,
} from "@/lib/utils/format";

const PriceTicker = ({ market }: { market: string }) => {
  const {
    setUserId,
    refetchUserBalance,
    ticker,
    userId,
    setUserBalance,
    userBalance,
  } = useWebSocket();
  const [userIdEntered, setUserIdEntered] = useState("");
  const navigate = useNavigate();
  const baseAsset = market.split("_")[0];
  const CoinLogo = formatCoinLogo(baseAsset);

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
    setUserBalance((prev) => ({
      ...prev,
      [baseAsset]: null,
    }));
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
                src={formatCoinImg(baseAsset)}
                alt={baseAsset}
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <div className="font-semibold text-sm">{market}</div>
              <div className="text-xs text-muted-foreground">
                {formatCoinName(baseAsset)}
              </div>
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
            <Button
              variant="outline"
              size="sm"
              className={`flex-1 bg-[#070707] text-muted-foreground font-medium`}
              onClick={() => navigate("/orders")}
            >
              My Orders
            </Button>
            <div className="flex justify-center gap-5 items-center border border-input px-3 py-2 rounded-md bg-[#070707]">
              <p className="text-sm text-muted-foreground font-extralight flex justify-center items-center gap-2">
                <LuDollarSign size={18} /> {userBalance?.USD?.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground font-extralight flex justify-center items-center gap-2">
                <CoinLogo />
                {userBalance[baseAsset]?.toLocaleString()}
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
