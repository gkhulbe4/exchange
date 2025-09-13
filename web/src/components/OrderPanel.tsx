import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Info } from "lucide-react";
import { useWebSocket } from "@/context/WebSocketContext";
import { toast } from "sonner";
import axios from "axios";
import { orderSchema } from "@/lib/schema";

const OrderPanel = () => {
  const { socket, userBalance, userId, refetchUserBalance } = useWebSocket();
  const [orderType, setOrderType] = useState<"limit" | "market">("limit");
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [errors, setErrors] = useState<{ price?: string; quantity?: string }>(
    {}
  );

  async function handleOrder() {
    if (!socket && !userId) return;

    const validation = orderSchema.safeParse({ price, quantity });
    if (!validation.success) {
      const newErrors: { price?: string; quantity?: string } = {};
      validation.error.errors.forEach((err) => {
        if (err.path[0] === "price") newErrors.price = err.message;
        if (err.path[0] === "quantity") newErrors.quantity = err.message;
      });
      setErrors(newErrors);
      return;
    }

    const total =
      side == "buy"
        ? Number(price) * Number(quantity) +
          (Number(price) * Number(quantity) * 1) / 1000
        : Number(quantity) + (Number(price) * Number(quantity) * 1) / 1000;

    const balance =
      side === "buy" ? userBalance.INR ?? 0 : userBalance.SOL ?? 0;

    if (total > balance) {
      toast.error("Not enough balance");
      return;
    }

    try {
      const res = await axios.post("http://localhost:3001/api/v1/order", {
        market: "SOL_INR",
        price: Number(price),
        quantity: Number(quantity),
        side: side,
        userId: userId.toString(),
      });
      const data = res.data;
      console.log("Order Placed", data);
      refetchUserBalance();
      toast.success("Order Placed Successfully");
    } catch (error) {
      console.log("Error while placing order", error);
      toast.error("Error while placing order");
    }
  }

  if (!userId)
    return (
      <div className="h-full bg-card flex justify-center items-center">
        <Info className="w-3 h-3" />
        <span className="text-gray-400 text-muted-foreground text-sm">
          SignIn to trade
        </span>
      </div>
    );

  return (
    <div className="h-full bg-card rounded-lg border border-border">
      <div className="p-4">
        <div className="grid grid-cols-2 gap-2 mb-4">
          <Button
            className={`${
              side === "buy"
                ? "bg-buy hover:bg-buy-hover text-white"
                : "bg-secondary hover:bg-secondary/80"
            }`}
            onClick={() => setSide("buy")}
          >
            Buy
          </Button>
          <Button
            className={`${
              side === "sell"
                ? "bg-sell hover:bg-sell-hover text-white"
                : "bg-secondary hover:bg-secondary/80"
            }`}
            onClick={() => setSide("sell")}
          >
            Sell
          </Button>
        </div>

        <div className="flex gap-2 mb-4">
          <Button
            variant="outline"
            size="sm"
            className={`flex-1 ${orderType === "limit" ? "bg-secondary" : ""}`}
            onClick={() => setOrderType("limit")}
          >
            Limit
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={`flex-1 ${orderType === "market" ? "bg-secondary" : ""}`}
            onClick={() => setOrderType("market")}
          >
            Market
          </Button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Available</span>
            <span className="font-mono">
              {side === "buy"
                ? `₹ ${userBalance.INR ? userBalance.INR.toLocaleString() : 0}`
                : `${
                    userBalance.SOL ? userBalance.SOL.toLocaleString() : 0
                  } SOL`}
            </span>
          </div>

          {orderType === "limit" && (
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Price
              </label>
              <div className="relative">
                <Input
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="bg-secondary border-border font-mono pr-12"
                  placeholder="0.00"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                  INR
                </span>
                {errors.price && (
                  <p className="text-xs text-red-500 mt-1">{errors.price}</p>
                )}
              </div>
            </div>
          )}

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              Quantity
            </label>
            <div className="relative">
              <Input
                type="text"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="bg-secondary border-border font-mono pr-12"
                placeholder="0.00"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                SOL
              </span>
              {errors.quantity && (
                <p className="text-xs text-red-500 mt-1">{errors.quantity}</p>
              )}
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-border">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Total</span>
              <span className="font-mono">
                ₹{Number(price) * Number(quantity)}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Fee (0.1%)</span>
              <span className="font-mono">
                ₹{(Number(price) * Number(quantity) * 1) / 1000}
              </span>
            </div>
          </div>

          <Button
            onClick={() => {
              if (orderType == "limit") {
                handleOrder();
              }
            }}
            className={`w-full ${
              side === "buy"
                ? "bg-buy hover:bg-buy-hover shadow-glow-buy"
                : "bg-sell hover:bg-sell-hover shadow-glow-sell"
            } text-white font-semibold`}
          >
            {side === "buy" ? "Buy" : "Sell"} SOL
          </Button>

          {/* <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Info className="w-3 h-3" />
            <span>Login to trade</span>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default OrderPanel;
