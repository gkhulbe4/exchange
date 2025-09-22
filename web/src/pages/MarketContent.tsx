import PriceTicker from "@/components/PriceTicker";
import TradingChart from "@/components/TradingChart";
import OrderBook from "@/components/OrderBook";
import RecentTrades from "@/components/RecentTrades";
import OrderPanel from "@/components/OrderPanel";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import UserOrders from "@/components/UserOrders";
import { useWebSocket } from "@/context/WebSocketContext";

function MarketContent({ market }: { market: string }) {
  const { userId } = useWebSocket();

  return (
    <div className="h-full bg-background flex flex-col">
      <div className={`h-1 ${userId ? "bg-buy" : "bg-sell"}`} />

      <div className="p-2">
        <PriceTicker market={market} />
      </div>

      <div className="flex flex-1 gap-2 p-2 overflow-hidden max-h-[500px]">
        <div className="flex-1 flex gap-2 overflow-hidden">
          <div className="flex-1 bg-card rounded-lg border border-border p-2 overflow-hidden">
            <TradingChart />
          </div>

          <div className="w-80 bg-card rounded-lg border border-border flex flex-col overflow-hidden">
            <Tabs
              defaultValue="orderBook"
              className="flex-1 flex flex-col overflow-hidden"
            >
              <TabsList className="border-b border-border flex-shrink-0">
                <TabsTrigger value="orderBook" className="flex-1">
                  Order Book
                </TabsTrigger>
                <TabsTrigger value="recentTrades" className="flex-1">
                  Trades
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-hidden">
                <TabsContent
                  value="orderBook"
                  className="h-full overflow-y-auto p-2"
                >
                  <OrderBook />
                </TabsContent>

                <TabsContent
                  value="recentTrades"
                  className="h-full overflow-y-auto p-2"
                >
                  <RecentTrades />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>

        <div className="w-72 bg-card rounded-lg border border-border flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-2">
            <OrderPanel market={market} />
          </div>
        </div>
      </div>

      <div className="p-2 bg-card rounded-lg border border-border m-2 max-h-[400px]">
        <UserOrders />
      </div>
    </div>
  );
}

export default MarketContent;
