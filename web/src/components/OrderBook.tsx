import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useWebSocket } from '@/context/WebSocketContext';

interface OrderBookEntry {
  price: number;
  amount: number;
  total: number;
}

const OrderBook = () => {
  const { socket } = useWebSocket();
  const [view, setView] = useState<'all' | 'buy' | 'sell'>('all');

  // Order book data will come from WebSocket
  const asks: OrderBookEntry[] = [];
  const bids: OrderBookEntry[] = [];

  const maxTotal = Math.max(
    ...asks.map(a => a.total),
    ...bids.map(b => b.total),
    1 // Prevent division by zero
  );

  return (
    <div className="h-full flex flex-col bg-card rounded-lg border border-border">
      <div className="p-3 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sm">Order Book</h3>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              className={`p-1 ${view === 'all' ? 'bg-secondary' : ''}`}
              onClick={() => setView('all')}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                <rect x="0" y="0" width="14" height="6" className="fill-sell" opacity="0.8"/>
                <rect x="0" y="8" width="14" height="6" className="fill-buy" opacity="0.8"/>
              </svg>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`p-1 ${view === 'buy' ? 'bg-secondary' : ''}`}
              onClick={() => setView('buy')}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                <rect x="0" y="0" width="14" height="14" className="fill-buy" opacity="0.8"/>
              </svg>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`p-1 ${view === 'sell' ? 'bg-secondary' : ''}`}
              onClick={() => setView('sell')}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                <rect x="0" y="0" width="14" height="14" className="fill-sell" opacity="0.8"/>
              </svg>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-3 text-xs text-muted-foreground">
          <div>Price (INR)</div>
          <div className="text-right">Amount (SOL)</div>
          <div className="text-right">Total (INR)</div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-border">
          {(view === 'all' || view === 'sell') && asks.length > 0 && (
            <div className="relative">
              {asks.slice().reverse().map((ask, i) => (
                <div key={i} className="relative grid grid-cols-3 text-xs py-1 px-3 hover:bg-secondary/20">
                  <div
                    className="absolute inset-0 bg-sell/10"
                    style={{ width: `${(ask.total / maxTotal) * 100}%` }}
                  />
                  <div className="relative text-sell font-mono">{ask.price.toFixed(2)}</div>
                  <div className="relative text-right font-mono">{ask.amount.toFixed(3)}</div>
                  <div className="relative text-right font-mono text-muted-foreground">
                    {ask.total.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-center py-2 border-y border-border bg-secondary/30">
            <div className="text-lg font-mono font-bold flex items-center gap-2">
              <span className="text-buy">₹0.00</span>
            </div>
          </div>

          {(view === 'all' || view === 'buy') && bids.length > 0 && (
            <div className="relative">
              {bids.map((bid, i) => (
                <div key={i} className="relative grid grid-cols-3 text-xs py-1 px-3 hover:bg-secondary/20">
                  <div
                    className="absolute inset-0 bg-buy/10"
                    style={{ width: `${(bid.total / maxTotal) * 100}%` }}
                  />
                  <div className="relative text-buy font-mono">{bid.price.toFixed(2)}</div>
                  <div className="relative text-right font-mono">{bid.amount.toFixed(3)}</div>
                  <div className="relative text-right font-mono text-muted-foreground">
                    {bid.total.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          )}

          {asks.length === 0 && bids.length === 0 && (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
              No orders available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderBook;