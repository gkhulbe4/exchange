import { createContext, useEffect, useState } from "react";

type WebSocketContextType = {
  socket: WebSocket | null;
  isConnected: boolean;
  userId: number;
  setUserId: React.Dispatch<React.SetStateAction<number>>;
};

const WebSocketContext = createContext<WebSocketContextType>({
  socket: null,
  isConnected: false,
  userId: 1,
  setUserId: () => {},
});
function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [userId, setUserId] = useState<number>(1);

  useEffect(() => {
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
  return (
    <WebSocketContext.Provider
      value={{ socket, isConnected, userId, setUserId }}
    >
      {children}
    </WebSocketContext.Provider>
  );
}

export default WebSocketProvider;
export { WebSocketContext };
