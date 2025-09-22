import { queryClient } from "@/App";
import { RawOrder, Ticker, Trade, WebSocketContextType } from "@/lib/types";
import { fetchOrders } from "@/lib/utils/fetchOrders";
import { fetchTickerData } from "@/lib/utils/fetchTickerData";
import { fetchTrades } from "@/lib/utils/fetchTrades";
import { fetchUserBalance } from "@/lib/utils/fetchUserBalance";
import { fetchUserOrder } from "@/lib/utils/fetchUserOrder";
import { useQuery } from "@tanstack/react-query";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useRef,
  useCallback,
} from "react";
import { useParams } from "react-router-dom";

export type AggregatedOrder = {
  price: number;
  amount: number;
  filled: number;
  total: number;
};

interface OrdersState {
  bids: AggregatedOrder[];
  asks: AggregatedOrder[];
}

const WebSocketContext = createContext<
  WebSocketContextType & {
    orders: OrdersState;
    setOrders: React.Dispatch<React.SetStateAction<OrdersState>>;
    refreshBalance: () => Promise<void>;
  }
>({
  socket: null,
  isConnected: false,
  userId: null,
  setUserId: () => {},
  userBalance: { USD: null, SOL: null, ETH: null, BTC: null },
  setUserBalance: () => {},
  refetchUserBalance: () => {},
  trades: [],
  ticker: { max_price: null, min_price: null, price: null, volume: null },
  orders: { bids: [], asks: [] },
  setOrders: () => {},
  userOrders: { bids: [], asks: [] },
  refreshBalance: async () => {},
});

export function useWebSocket() {
  return useContext(WebSocketContext);
}

function aggregateOrders(
  rawOrders: RawOrder[],
  side: "buy" | "sell"
): AggregatedOrder[] {
  const map = new Map<number, { amount: number; filled: number }>();

  rawOrders.forEach((o) => {
    if (o.side !== side || o.quantity - o.filled <= 0) return;

    const remaining = o.quantity - o.filled;
    const current = map.get(o.price) || { amount: 0, filled: 0 };
    map.set(o.price, {
      amount: current.amount + remaining,
      filled: current.filled + o.filled,
    });
  });

  const levels = Array.from(map.entries()).map(
    ([price, { amount, filled }]) => ({
      price,
      amount,
      filled,
      total: 0,
    })
  );

  levels.sort((a, b) =>
    side === "buy" ? b.price - a.price : a.price - b.price
  );

  let running = 0;
  return levels.map((l) => {
    running += l.amount;
    return { ...l, total: running };
  });
}

function WebSocketProvider({
  children,
  market,
}: {
  children: ReactNode;
  market: string;
}) {
  // Core state
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userBalance, setUserBalance] = useState({
    USD: null,
    SOL: null,
    ETH: null,
    BTC: null,
  });
  const [trades, setTrades] = useState<Trade[]>([]);
  const [ticker, setTicker] = useState<Ticker>({
    max_price: null,
    min_price: null,
    price: null,
    volume: null,
  });
  const [rawOrders, setRawOrders] = useState<RawOrder[]>([]);
  const [orders, setOrders] = useState<OrdersState>({ bids: [], asks: [] });
  const [userOrders, setUserOrders] = useState<{
    bids: RawOrder[];
    asks: RawOrder[];
  }>({ bids: [], asks: [] });

  // Refs for WebSocket callbacks
  const userOrdersRef = useRef(userOrders);
  const userIdRef = useRef(userId);
  console.log("USER ID IN STATE: ", userId);

  // console.log("USER REF ID: ", userIdRef.current);

  // user ID
  useEffect(() => {
    const storedId = localStorage.getItem("userId");
    if (storedId && storedId.length > 0) {
      setUserId(storedId);
    }
  }, []);

  // Update refs
  useEffect(() => {
    userOrdersRef.current = userOrders;
  }, [userOrders]);
  useEffect(() => {
    userIdRef.current = userId;
  }, [userId]);

  // Balance management
  const balanceQuery = useQuery({
    queryKey: ["userBalance", userId],
    queryFn: () => fetchUserBalance(userId!),
    enabled: !!userId,
    refetchOnWindowFocus: false,
  });

  const refreshBalance = useCallback(async () => {
    // console.log("USER ID: ", userId);
    if (!userIdRef.current) return;

    try {
      await queryClient.invalidateQueries({
        queryKey: ["userBalance", userIdRef.current],
      });
      const data = await queryClient.fetchQuery({
        queryKey: ["userBalance", userIdRef.current],
        queryFn: () => fetchUserBalance(userIdRef.current),
      });

      if (data) {
        setUserBalance({
          USD: data?.USD?.available || 0,
          SOL: data?.SOL?.available || 0,
          ETH: data?.ETH?.available || 0,
          BTC: data?.BTC?.available || 0,
        });
      }
    } catch (error) {
      console.error("Balance refresh failed:", error);
    }
  }, [userId]);

  // Sync balance from React Query
  useEffect(() => {
    console.log("USER BALANCE: ", balanceQuery.data);
    if (balanceQuery.data) {
      setUserBalance({
        USD: balanceQuery?.data?.USD?.available || 0,
        SOL: balanceQuery?.data?.SOL?.available || 0,
        ETH: balanceQuery?.data?.ETH?.available || 0,
        BTC: balanceQuery?.data?.BTC?.available || 0,
      });
    }
  }, [balanceQuery.data]);

  // Aggregate orders when raw orders change
  useEffect(() => {
    setOrders({
      bids: aggregateOrders(rawOrders, "buy"),
      asks: aggregateOrders(rawOrders, "sell"),
    });
  }, [rawOrders]);

  // Load initial data once
  useEffect(() => {
    async function loadData() {
      try {
        console.log("LOADING DATA FROM TRADES, TICKER, ORDERS");
        const [tradesData, tickerData, ordersData] = await Promise.all([
          fetchTrades(market),
          fetchTickerData(market),
          fetchOrders(market),
        ]);

        console.log("TICKER: ", tickerData);
        console.log("TRADES: ", tradesData.response);
        if (tradesData?.response) setTrades(tradesData.response);

        if (tickerData?.response) {
          setTicker({
            max_price: tickerData.response.max_price,
            min_price: tickerData.response.min_price,
            volume: tickerData.response.volume,
            price: tickerData.response.last_trade_price,
          });
        }

        // Handle orders data
        if (ordersData?.response && Array.isArray(ordersData.response)) {
          setRawOrders(ordersData.response);
        } else if (ordersData?.buys || ordersData?.asks) {
          const allOrders: RawOrder[] = [];

          ordersData.buys?.forEach((order: RawOrder) => {
            allOrders.push({ ...order, side: order.side || "buy" });
          });

          ordersData.asks?.forEach((order: RawOrder) => {
            allOrders.push({ ...order, side: order.side || "sell" });
          });

          setRawOrders(allOrders);
        }
      } catch (error) {
        console.error("Failed to load initial data:", error);
      }
    }

    loadData();
  }, [market]);

  // Load user orders when userId changes
  useEffect(() => {
    if (!userId) {
      setUserOrders({ bids: [], asks: [] });
      return;
    }

    fetchUserOrder(userId, market)
      .then((data) => {
        setUserOrders({
          bids: data?.response?.buys ?? [],
          asks: data?.response?.asks ?? [],
        });
      })
      .catch((error) => {
        console.error("Failed to load user orders:", error);
        setUserOrders({ bids: [], asks: [] });
      });
  }, [userId, market]);

  // WebSocket connection
  useEffect(() => {
    if (!market) return;
    if (!userIdRef.current) return;

    const wsUrl = userId
      ? `ws://localhost:8080?userId=${userId}`
      : `ws://localhost:8080`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      setSocket(ws);
      setIsConnected(true);
      ws.send(
        JSON.stringify({ type: "SUBSCRIBE", subType: "trades", market: market })
      );
      ws.send(
        JSON.stringify({ type: "SUBSCRIBE", subType: "order", market: market })
      );
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log(message);
        if (message.data.m !== market) return;

        if (message.stream === "trade") {
          const t = message.data;

          // Add new trade
          const newTrade: Trade = {
            price: t.p,
            quantity: t.q,
            side: t.s,
            trade_time: new Date(t.T).toISOString(),
          };
          setTrades((prev) => [newTrade, ...prev].slice(0, 50));

          // Update ticker
          setTicker((prev) => ({
            ...prev,
            max_price:
              prev.max_price === null || t.p > prev.max_price
                ? t.p
                : prev.max_price,
            min_price:
              prev.min_price === null || t.p < prev.min_price
                ? t.p
                : prev.min_price,
            price: t.p,
          }));

          // Update user orders if user was involved
          const currentUserOrders = userOrdersRef.current;
          const sideKey = t.s === "buy" ? "asks" : "bids";
          const orderIndex = currentUserOrders[sideKey].findIndex(
            (order) => order.orderId === t.of
          );

          if (orderIndex !== -1) {
            const updatedOrders = { ...currentUserOrders };
            const updatedSideOrders = [...updatedOrders[sideKey]];
            const order = { ...updatedSideOrders[orderIndex] };

            order.filled += t.q;

            if (order.filled >= order.quantity) {
              updatedSideOrders.splice(orderIndex, 1);
            } else {
              updatedSideOrders[orderIndex] = order;
            }

            updatedOrders[sideKey] = updatedSideOrders;
            setUserOrders(updatedOrders);
            userOrdersRef.current = updatedOrders;

            // Refresh balance after user trade
            setTimeout(() => refreshBalance(), 100);
          }

          // Update raw orders (order book)
          setRawOrders((prev) =>
            prev
              .map((o) => {
                if (o.orderId === t.of) {
                  const newFilled = Math.min(o.filled + t.q, o.quantity);
                  return { ...o, filled: newFilled };
                }
                return o;
              })
              .filter((o) => o.filled < o.quantity)
          );
        } else if (message.stream === "order") {
          const orderData = message.data;

          const order: RawOrder =
            orderData.e === "order"
              ? {
                  orderId: orderData.o,
                  price: orderData.p,
                  quantity: orderData.q,
                  filled: orderData.f,
                  side: orderData.s,
                  market: orderData.m,
                  baseAsset: orderData.baseAsset || "SOL",
                  quoteAsset: orderData.quoteAsset || "INR",
                  userId: orderData.u || "",
                }
              : orderData;

          // Update user orders if this belongs to current user
          if (order.userId === userIdRef.current) {
            const currentUserOrders = userOrdersRef.current;
            const sideKey = order.side === "sell" ? "asks" : "bids";
            const updatedOrders = {
              ...currentUserOrders,
              [sideKey]: [...currentUserOrders[sideKey], order],
            };

            setUserOrders(updatedOrders);
            userOrdersRef.current = updatedOrders;

            // Refresh balance after new order
            setTimeout(() => refreshBalance(), 100);
          }

          // Update raw orders
          setRawOrders((prev) => {
            if (order.filled >= order.quantity) {
              return prev.filter((o) => o.orderId !== order.orderId);
            }

            const existingIndex = prev.findIndex(
              (o) => o.orderId === order.orderId
            );

            if (existingIndex !== -1) {
              const updated = [...prev];
              updated[existingIndex] = order;
              return updated;
            }

            return [...prev, order];
          });
        }
      } catch (error) {
        console.error("WebSocket message error:", error);
      }
    };

    ws.onerror = (error) => console.error("WebSocket error:", error);
    ws.onclose = () => {
      if (market && userIdRef.current) {
        ws.send(
          JSON.stringify({ type: "UNSUBSCRIBE", subType: "trades", market })
        );
        ws.send(
          JSON.stringify({ type: "UNSUBSCRIBE", subType: "order", market })
        );
      }
      setSocket(null);
      setIsConnected(false);
    };

    return () => {
      ws.send(
        JSON.stringify({ type: "UNSUBSCRIBE", subType: "trades", market })
      );
      ws.send(
        JSON.stringify({ type: "UNSUBSCRIBE", subType: "order", market })
      );
      ws.close();
    };
  }, [userId, refreshBalance]);

  return (
    <WebSocketContext.Provider
      value={{
        socket,
        isConnected,
        userId,
        setUserId,
        userBalance,
        setUserBalance,
        refetchUserBalance: refreshBalance,
        refreshBalance,
        trades,
        ticker,
        orders,
        setOrders,
        userOrders,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
}

export default WebSocketProvider;
export { WebSocketContext };
