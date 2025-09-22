export type WebSocketContextType = {
  socket: WebSocket | null;
  isConnected: boolean;
  userId: string;
  setUserId: React.Dispatch<React.SetStateAction<string>>;
  userBalance: {
    USD: number;
    SOL: number;
    ETH: number;
    BTC: number;
  };
  setUserBalance: React.Dispatch<
    React.SetStateAction<{
      USD: number | null;
      SOL: number | null;
      ETH: number | null;
      BTC: number | null;
    }>
  >;
  refetchUserBalance: () => void;
  trades: Trade[];
  ticker: Ticker;
  // currentPrice: string;
  userOrders: {
    bids: RawOrder[];
    asks: RawOrder[];
  };
};

export type Trade = {
  price: string;
  quantity: string;
  trade_time: string;
  side: string;
};

export type Ticker = {
  price: string;
  max_price: string;
  min_price: string;
  volume: string;
};

export type Kline = {
  bucket: string;
  open: string;
  close: string;
  high: string;
  low: string;
  market: string;
  volume: string;
};

export type RawOrder = {
  orderId: string;
  price: number;
  quantity: number;
  filled: number;
  side: "buy" | "sell";
  market: string;
  baseAsset: string;
  quoteAsset: string;
  userId: string;
};
