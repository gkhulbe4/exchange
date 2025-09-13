export type WebSocketContextType = {
  socket: WebSocket | null;
  isConnected: boolean;
  userId: string;
  setUserId: React.Dispatch<React.SetStateAction<string>>;
  userBalance: {
    INR: number;
    SOL: number;
  };
  setUserBalance: React.Dispatch<
    React.SetStateAction<{ INR: number | null; SOL: number | null }>
  >;
  refetchUserBalance: () => void;
  trades: Trade[];
};

export type Trade = {
  price: string;
  quantity: string;
  trade_time: string;
  side: string;
};
