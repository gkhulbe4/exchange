import { useWebSocket } from "@/context/WebSocketContext";

const RecentTrades = () => {
  const { trades } = useWebSocket();

  return (
    <div className="flex flex-col h-full bg-card rounded-lg border border-border overflow-hidden">
      <div className="p-3 border-b border-border flex-shrink-0">
        <h3 className="font-semibold text-sm mb-2">Recent Trades</h3>
        <div className="grid grid-cols-3 text-xs text-muted-foreground font-medium">
          <div className="text-left">Price (INR)</div>
          <div className="text-right">Amount (SOL)</div>
          <div className="text-right">Time</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-border">
        {trades && trades.length > 0 ? (
          trades.map((trade, i) => (
            <div
              key={i}
              className="grid grid-cols-3 text-xs py-1.5 px-3 hover:bg-secondary/20 transition-colors font-mono"
            >
              <div
                className={`text-left ${
                  trade.side === "buy" ? "text-green-500" : "text-red-500"
                }`}
              >
                {Number(trade.price).toFixed(2)}
              </div>
              <div className="text-right text-white">
                {Number(trade.quantity).toFixed(3)}
              </div>
              <div className="text-right text-muted-foreground">
                {new Date(trade.trade_time).toLocaleTimeString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            No recent trades
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentTrades;
