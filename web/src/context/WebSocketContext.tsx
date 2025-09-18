import { queryClient } from "@/App";
import { RawOrder, Ticker, Trade, WebSocketContextType } from "@/lib/types";
import { fetchOrders } from "@/lib/utils/fetchOrders";
import { fetchTickerData } from "@/lib/utils/fetchTickerData";
import { fetchTrades } from "@/lib/utils/fetchTrades";
import { fetchUserBalance } from "@/lib/utils/fetchUserBalance";
import { fetchUserOrder } from "@/lib/utils/fetchUserOrder";
import { useQuery } from "@tanstack/react-query";
import { CloudCog } from "lucide-react";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useRef,
} from "react";

export type AggregatedOrder = {
  price: number;
  amount: number; // open/unfilled quantity
  filled: number; // cumulative filled at this level
  total: number; // cumulative total (price*amount running sum)
};

interface OrdersState {
  bids: AggregatedOrder[];
  asks: AggregatedOrder[];
}

const WebSocketContext = createContext<
  WebSocketContextType & {
    orders: OrdersState;
    setOrders: React.Dispatch<React.SetStateAction<OrdersState>>;
  }
>({
  socket: null,
  isConnected: false,
  userId: null,
  setUserId: () => {},
  userBalance: { INR: null, SOL: null },
  setUserBalance: () => {},
  refetchUserBalance: () => {},
  trades: [],
  ticker: { max_price: null, min_price: null, price: null, volume: null },
  orders: { bids: [], asks: [] },
  setOrders: () => {},
  userOrders: {
    bids: [],
    asks: [],
  },
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
    if (o.side !== side) return;
    const remaining = o.quantity - o.filled;
    if (remaining <= 0) return; // Skip fully filled orders

    if (!map.has(o.price)) {
      map.set(o.price, { amount: 0, filled: 0 });
    }
    const prev = map.get(o.price)!;
    map.set(o.price, {
      amount: prev.amount + remaining,
      filled: prev.filled + o.filled,
    });
  });

  let levels = Array.from(map.entries()).map(([price, { amount, filled }]) => ({
    price,
    amount,
    filled,
    total: 0,
  }));

  // sort (buys: high→low, sells: low→high)
  levels.sort((a, b) =>
    side === "buy" ? b.price - a.price : a.price - b.price
  );

  // running cumulative total (just amount for cumulative volume)
  let running = 0;
  levels = levels.map((l) => {
    running += l.amount;
    return { ...l, total: running };
  });

  return levels;
}

function WebSocketProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userBalance, setUserBalance] = useState({ INR: null, SOL: null });
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
    bids: RawOrder[] | [];
    asks: RawOrder[] | [];
  }>({
    bids: [],
    asks: [],
  });
  const userOrdersRef = useRef(userOrders);

  // derive aggregated orders
  useEffect(() => {
    console.log("Raw orders updated:", rawOrders);
    const newBids = aggregateOrders(rawOrders, "buy");
    const newAsks = aggregateOrders(rawOrders, "sell");
    console.log("Aggregated bids:", newBids);
    console.log("Aggregated asks:", newAsks);
    setOrders({
      bids: newBids,
      asks: newAsks,
    });
  }, [rawOrders]);

  // user balance
  const balanceQuery = useQuery({
    queryKey: ["userBalance", userId],
    queryFn: () => fetchUserBalance(userId!),
    enabled: !!userId,
  });

  // initial data - fetch even without userId
  useEffect(() => {
    console.log("Fetching initial data...");
    (async () => {
      try {
        const t = await fetchTrades();
        console.log("Initial trades:", t);
        if (t?.response) setTrades(t.response);
      } catch (error) {
        console.error("Error fetching trades:", error);
      }
    })();

    (async () => {
      try {
        const d = await fetchTickerData();
        console.log("Initial ticker data:", d);
        if (d?.response) {
          setTicker({
            max_price: d.response.max_price,
            min_price: d.response.min_price,
            volume: d.response.volume,
            price: d.response.last_trade_price,
          });
        }
      } catch (error) {
        console.error("Error fetching ticker:", error);
      }
    })();

    (async () => {
      try {
        const o = await fetchOrders();
        console.log("Initial orders from DB:", o);

        // Handle both formats: flat array or grouped by buys/asks
        if (o?.response && Array.isArray(o.response)) {
          setRawOrders(o.response);
        } else if (o?.buys || o?.asks) {
          // Combine buys and asks into a single array
          const allOrders: RawOrder[] = [];

          // Add buy orders
          if (o.buys && Array.isArray(o.buys)) {
            console.log(o.buys);
            o.buys.forEach((order: RawOrder) => {
              allOrders.push({
                ...order,
                side: order.side || "buy",
              });
            });
          }

          // Add sell orders (asks)
          if (o.asks && Array.isArray(o.asks)) {
            o.asks.forEach((order: RawOrder) => {
              allOrders.push({
                ...order,
                side: order.side || "sell",
              });
            });
          }

          console.log("Processed orders:", allOrders);
          setRawOrders(allOrders);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    })();

    (async () => {
      try {
        if (!userId) return;
        const data = await fetchUserOrder(userId);
        console.log("User all orders", data);
      } catch (error) {
        console.error("Error fetching user orders:", error);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        if (!userId) return;
        const data = await fetchUserOrder(userId);
        console.log("User all orders", data);
        setUserOrders({
          bids: data?.response?.buys ?? [],
          asks: data?.response?.asks ?? [],
        });
      } catch (error) {
        console.error("Error fetching user orders:", error);
      }
    })();
  }, [userId]);

  useEffect(() => {
    userOrdersRef.current = userOrders;
    console.log("UserOrders updated:", userOrders); // This should show your data
  }, [userOrders]);

  // websocket - connect even without userId for public data
  useEffect(() => {
    const ws = new WebSocket(
      userId ? `ws://localhost:8080?userId=${userId}` : `ws://localhost:8080`
    );

    ws.onopen = () => {
      console.log("WebSocket connected");
      setSocket(ws);
      setIsConnected(true);
      // Subscribe to public streams
      ws.send(JSON.stringify({ type: "SUBSCRIBE", subType: "trades" }));
      ws.send(JSON.stringify({ type: "SUBSCRIBE", subType: "order" }));
    };

    ws.onmessage = (raw) => {
      const message = JSON.parse(raw.data as string);
      console.log("WebSocket message received:", message);

      if (message.stream === "trade") {
        const t = message.data;
        const newTrade: Trade = {
          price: t.p,
          quantity: t.q,
          side: t.s,
          trade_time: new Date(t.T).toISOString(),
        };

        // prepend trade
        setTrades((prev) => [newTrade, ...prev].slice(0, 50));

        // update ticker
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

        const sideKey = t.s === "buy" ? "asks" : "bids";

        const userCurrentOrders = userOrdersRef.current;
        const userSideOrders = [...userCurrentOrders[sideKey]];
        const orderIndex = userSideOrders.findIndex(
          (order) => order.orderId === t.of
        );

        // console.log(
        //   `USER SIDE ORDERS: ${userSideOrders}, ORDER ID GOT FROM TRADE: ${t.of}`
        // );

        if (orderIndex !== -1) {
          const particularOrder = { ...userSideOrders[orderIndex] };
          particularOrder.filled += t.q;

          if (particularOrder.filled >= particularOrder.quantity) {
            userSideOrders.splice(orderIndex, 1);
          } else {
            userSideOrders[orderIndex] = particularOrder;
          }

          const updatedOrders = {
            ...userCurrentOrders,
            [sideKey]: userSideOrders,
          };

          setUserOrders(updatedOrders);
          userOrdersRef.current = updatedOrders;
        }

        setRawOrders((prev) => {
          return prev
            .map((o) => {
              if (o.orderId === t.of) {
                const newFilled = o.filled + t.q;
                return {
                  ...o,
                  filled: newFilled > o.quantity ? o.quantity : newFilled,
                };
              }
              return o;
            })
            .filter((o) => o.filled < o.quantity);
        });
      }

      if (message.stream === "order") {
        const orderData = message.data;
        console.log("Order update received:", orderData);

        // If format is { e: "order", f: filled, m: market, o: orderId, p: price, q: quantity, s: side }
        let order: RawOrder;

        if (orderData.e === "order") {
          // Transform WebSocket format to RawOrder format
          order = {
            orderId: orderData.o,
            price: orderData.p,
            quantity: orderData.q,
            filled: orderData.f,
            side: orderData.s,
            market: orderData.m,
            baseAsset: orderData.baseAsset || "SOL",
            quoteAsset: orderData.quoteAsset || "INR",
            userId: orderData.u || "",
          };
        } else {
          // Already in RawOrder format
          order = orderData as RawOrder;
        }

        // console.log(
        //   `ORDER USER ID: ${order.userId} , CURRENT USER ID: ${userId}`
        // );
        if (order.userId === userId) {
          const userCurrentOrders = userOrdersRef.current;

          const sideKey = order.side === "sell" ? "asks" : "bids";

          const updatedUserSideOrders = [...userCurrentOrders[sideKey], order];

          const updatedOrders = {
            ...userCurrentOrders,
            [sideKey]: updatedUserSideOrders,
          };

          setUserOrders(updatedOrders);
          userOrdersRef.current = updatedOrders;
        }

        setRawOrders((prev) => {
          // Check if order is fully filled
          if (order.filled >= order.quantity) {
            // Remove the order if fully filled
            return prev.filter((o) => o.orderId !== order.orderId);
          }

          // Update or add the order
          const existingIndex = prev.findIndex(
            (o) => o.orderId === order.orderId
          );
          if (existingIndex !== -1) {
            // Update existing order
            const updated = [...prev];
            updated[existingIndex] = order;
            return updated;
          } else {
            // Add new order
            return [...prev, order];
          }
        });
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
      setSocket(null);
      setIsConnected(false);
    };

    return () => {
      console.log("Cleaning up WebSocket");
      ws.close();
    };
  }, [userId]); // Reconnect when userId changes

  // sync balance
  useEffect(() => {
    if (balanceQuery.data) {
      setUserBalance({
        INR: balanceQuery.data.INR?.available || 0,
        SOL: balanceQuery.data.SOL?.available || 0,
      });
    }
  }, [balanceQuery.data]);

  async function refetchUserBalance() {
    if (userId) {
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
