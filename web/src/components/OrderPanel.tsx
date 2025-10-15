import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRightLeft, Info } from "lucide-react";
import { useWebSocket } from "@/context/WebSocketContext";
import { toast } from "sonner";
import axios from "axios";
import { orderSchema } from "@/lib/schema";

const OrderPanel = ({ market }: { market: string }) => {
  const { socket, userBalance, userId, refetchUserBalance, ticker } =
    useWebSocket();
  const [orderType, setOrderType] = useState<"limit" | "market">("limit");
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [errors, setErrors] = useState<{ price?: string; quantity?: string }>(
    {}
  );
  const [toggleQuantity, setToggleQuantity] = useState(false);
  const baseAsset = market.split("_")[0];

  async function handleLimitOrder() {
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
      side === "buy"
        ? Number(price) * Number(quantity) +
          (Number(price) * Number(quantity) * 1) / 1000
        : Number(quantity) + (Number(price) * Number(quantity) * 1) / 1000;

    const balance =
      side === "buy" ? userBalance.USD ?? 0 : userBalance[baseAsset] ?? 0;

    if (total > balance) {
      toast.error("Not enough balance");
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}api/v1/order`,
        {
          market: market,
          price: Number(price),
          quantity: Number(quantity),
          side: side,
          userId: userId.toString(),
          type: "limit",
        }
      );
      console.log("Limit Order Placed", res.data);
      refetchUserBalance();
      toast.success("Limit Order Placed Successfully");
      setPrice("");
      setQuantity("");
    } catch (error) {
      console.log("Error while placing limit order", error);
      toast.error("Error while placing limit order");
    }
  }

  async function handleMarketOrder() {
    if (!socket && !userId) return;

    let solQuantity = 0;

    if (toggleQuantity) {
      solQuantity = Number(quantity);
    } else {
      solQuantity = Number(quantity) / Number(ticker.price);
    }

    if (solQuantity <= 0) {
      toast.error("Invalid order amount");
      return;
    }

    const balance =
      side === "buy" ? userBalance.USD ?? 0 : userBalance[baseAsset] ?? 0;

    const total =
      side === "buy" ? solQuantity * Number(ticker.price) : solQuantity;

    if (total > balance) {
      toast.error("Not enough balance");
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}api/v1/order`,
        {
          market: market,
          price: Number(ticker.price),
          quantity: solQuantity,
          side: side,
          userId: userId.toString(),
          type: "market",
        }
      );
      console.log("Market Order Placed", res.data);
      refetchUserBalance();
      toast.success("Market Order Placed Successfully");
      setQuantity("");
    } catch (error) {
      console.log("Error while placing market order", error);
      toast.error("Error while placing market order");
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

  const priceValue =
    orderType === "limit" ? Number(price) : Number(ticker.price);
  const solValue =
    orderType === "market"
      ? toggleQuantity
        ? Number(quantity)
        : Number(quantity) / Number(ticker.price)
      : Number(quantity);

  const totalValue = priceValue * solValue;
  const fee = (totalValue * 1) / 1000;

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
            className={`flex-1 ${orderType === "limit" ? "" : "bg-secondary"}`}
            onClick={() => setOrderType("limit")}
          >
            Limit
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={`flex-1 ${orderType === "market" ? "" : "bg-secondary"}`}
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
                ? `$${userBalance.USD ? userBalance.USD.toLocaleString() : 0}`
                : `${
                    userBalance[baseAsset]
                      ? userBalance[baseAsset].toLocaleString()
                      : 0
                  } ${baseAsset}`}
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
                  USD
                </span>
                {errors.price && (
                  <p className="text-xs text-red-500 mt-1">{errors.price}</p>
                )}
              </div>
            </div>
          )}

          {orderType === "market" ? (
            <div>
              <label className="flex justify-between text-xs text-muted-foreground mb-1 ">
                <p
                  onClick={() => setToggleQuantity((prev) => !prev)}
                  className="flex gap-1 items-center cursor-pointer hover:text-gray-500 transition-all ease-in-out duration-200"
                >
                  {toggleQuantity ? "Quantity" : "Order Value"}{" "}
                  <ArrowRightLeft size={14} />
                </p>
                <span className="font-mono">
                  {toggleQuantity
                    ? `≈ $${(
                        Number(quantity) * Number(ticker.price)
                      ).toLocaleString()}`
                    : `≈ ${(Number(quantity) / Number(ticker.price)).toFixed(
                        4
                      )} ${baseAsset}`}
                </span>
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
                  {toggleQuantity ? `${baseAsset}` : "USD"}
                </span>
              </div>
            </div>
          ) : (
            <div>
              <label className="flex justify-between text-xs text-muted-foreground mb-1 ">
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
                  {baseAsset}
                </span>
                {errors.quantity && (
                  <p className="text-xs text-red-500 mt-1">{errors.quantity}</p>
                )}
              </div>
            </div>
          )}

          <div className="space-y-2 pt-2 border-t border-border">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Total</span>
              <span className="font-mono">${totalValue.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Fee (0.1%)</span>
              <span className="font-mono">${fee.toFixed(2)}</span>
            </div>
          </div>

          <Button
            onClick={() => {
              if (orderType === "limit") {
                handleLimitOrder();
              } else {
                handleMarketOrder();
              }
            }}
            className={`w-full ${
              side === "buy"
                ? "bg-buy hover:bg-buy-hover shadow-glow-buy"
                : "bg-sell hover:bg-sell-hover shadow-glow-sell"
            } text-white font-semibold`}
          >
            {side === "buy" ? "Buy" : "Sell"} {baseAsset}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderPanel;
