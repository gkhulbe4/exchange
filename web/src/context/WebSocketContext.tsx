import { queryClient } from "@/App";
import { Trade, WebSocketContextType } from "@/lib/types";
import { fetchTrades } from "@/lib/utils/fetchTrades";
import { fetchUserBalance } from "@/lib/utils/fetchUserBalance";
import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useState } from "react";

const WebSocketContext = createContext<WebSocketContextType>({
  socket: null,
  isConnected: false,
  userId: null,
  setUserId: () => {},
  userBalance: {
    INR: null,
    SOL: null,
  },
  setUserBalance: () => {},
  refetchUserBalance: () => {},
  trades: [],
});

export function useWebSocket() {
  return useContext(WebSocketContext);
}

function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>(null);
  const [userBalance, setUserBalance] = useState({
    INR: null as number | null,
    SOL: null as number | null,
  });
  const [trades, setTrades] = useState<Trade[]>([]);

  const data = useQuery({
    queryKey: ["userBalance", userId],
    queryFn: () => fetchUserBalance(userId!),
    enabled: !!userId,
  });

  useEffect(() => {
    if (!userId) return;
    const ws = new WebSocket(`ws://localhost:8080?userId=${userId}`);

    ws.onopen = () => {
      console.log("Connected to ws server");
      setSocket(ws);
      setIsConnected(true);
      ws.send(
        JSON.stringify({
          type: "SUBSCRIBE",
          subType: "trades",
        })
      );
    };

    ws.onmessage = async (data) => {
      const message = JSON.parse(data.data as string);
      console.log(message);
    };

    ws.onclose = () => {
      console.log("Disconnected to ws server");
      setSocket(null);
      setIsConnected(false);
      ws.send(
        JSON.stringify({
          type: "UNSUBSCRIBE",
          subType: "trades",
        })
      );
    };
  }, [userId]);

  useEffect(() => {
    if (data.data) {
      setUserBalance({
        INR: data.data.INR.available || 0,
        SOL: data.data.SOL.available || 0,
      });
    }
  }, [data.data]);

  useEffect(() => {
    async function getTrades() {
      const data = await fetchTrades();
      // console.log(data.response);
      setTrades(data.response);
    }
    getTrades();
  }, []);

  async function refetchUserBalance() {
    if (userId) {
      // console.log("i am here in the refetch");
      await queryClient.invalidateQueries({
        queryKey: ["userBalance", userId],
      });
    }
  }

  return (
    <WebSocketContext.Provider
      value={{
        socket,
        isConnected,
        userId,
        setUserId,
        userBalance,
        setUserBalance,
        refetchUserBalance,
        trades,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
}

export default WebSocketProvider;
export { WebSocketContext };
