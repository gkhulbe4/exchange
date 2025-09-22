import WebSocketProvider, { useWebSocket } from "@/context/WebSocketContext";
import UserOrders from "@/components/UserOrders";
import { useParams } from "react-router-dom";
import MarketContent from "./MarketContent";

const Market = () => {
  const { userId } = useWebSocket();
  // market from URL params
  const { market } = useParams();

  return (
    <WebSocketProvider market={market}>
      <MarketContent market={market} />
    </WebSocketProvider>
  );
};

export default Market;
