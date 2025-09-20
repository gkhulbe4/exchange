import { AggregatedOrder, useWebSocket } from "@/context/WebSocketContext";
import { useEffect } from "react";

export default function OrderBook() {
  const { orders, ticker } = useWebSocket();

  const bids = orders.bids || [];
  const asks = orders.asks || [];

  // Debug logging
  useEffect(() => {
    console.log("OrderBook - Current orders:", { bids, asks });
  }, [bids, asks]);

  // calculate max total (for depth % calculation)
  const maxTotal = Math.max(
    bids.length ? bids[bids.length - 1].total : 0,
    asks.length ? asks[asks.length - 1].total : 0
  );

  // best bid/ask
  const bestBid = bids[0]?.price || null;
  const bestAsk = asks[0]?.price || null;
  const midPrice =
    bestBid && bestAsk ? ((bestBid + bestAsk) / 2).toFixed(2) : null;

  const renderRow = (o: AggregatedOrder, side: "buy" | "sell", i: number) => {
    const percent = maxTotal > 0 ? (o.total / maxTotal) * 100 : 0;
    const fillPercent =
      o.amount + o.filled > 0 ? (o.filled / (o.amount + o.filled)) * 100 : 0;

    return (
      <div
        key={`${side}-${o.price}-${i}`}
        className="relative grid grid-cols-3 text-xs py-1 px-3 hover:bg-secondary/20"
      >
        <div
          className={`absolute inset-0 ${
            side === "buy" ? "bg-green-500/20" : "bg-red-500/20"
          }`}
          style={{ width: `${percent}%` }}
        />

        <div
          className={`absolute inset-0 ${
            side === "buy" ? "bg-green-500/40" : "bg-red-500/40"
          }`}
          style={{ width: `${fillPercent}%` }}
        />

        <div
          className={`relative font-mono ${
            side === "buy" ? "text-green-500" : "text-red-500"
          }`}
        >
          {o?.price?.toFixed(2) || 0}
        </div>

        <div className="relative text-right font-mono">
          {o?.amount?.toFixed(3) || 0}
        </div>

        <div className="relative text-right font-mono text-muted-foreground">
          {o?.total?.toFixed(2) || 0}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col border rounded-lg overflow-hidden bg-background">
      <div className="grid grid-cols-3 text-xs font-semibold p-2 border-b">
        <div className="text-left">Price</div>
        <div className="text-right">Amount</div>
        <div className="text-right">Total</div>
      </div>

      <div className="flex-1 overflow-y-auto max-h-64">
        {asks.length > 0 ? (
          [...asks].reverse().map((o, i) => renderRow(o, "sell", i))
        ) : (
          <div className="text-center text-xs text-muted-foreground p-2">
            No asks
          </div>
        )}
      </div>

      <div className="text-left py-2 px-3 bg-secondary text-xl font-bold">
        {Number(ticker.price).toFixed(2)}
      </div>

      <div className="flex-1 overflow-y-auto max-h-64">
        {bids.length > 0 ? (
          bids.map((o, i) => renderRow(o, "buy", i))
        ) : (
          <div className="text-center text-xs text-muted-foreground p-2">
            No bids
          </div>
        )}
      </div>
    </div>
  );
}
