import Order from "@/components/Order";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchUserOrdersFromDb } from "@/lib/utils/fetchUserOrdersFromDb";
import { useQuery } from "@tanstack/react-query";
import { Clock, Info, TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";

function Orders() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [marketFilter, setMarketFilter] = useState<string>("all");
  const userId = localStorage.getItem("userId");

  const { data, isLoading } = useQuery({
    queryKey: ["userAllOrders", userId],
    queryFn: () => fetchUserOrdersFromDb(userId),
    enabled: !!userId,
  });
  //   console.log(data);

  const markets = useMemo(() => {
    if (!data?.response) return [];
    const uniqueMarkets = new Set(data.response.map((order) => order.market));
    return Array.from(uniqueMarkets);
  }, [data]);

  const statuses = ["Open", "Partial", "Filled", "Cancelled"];

  const filteredOrders = useMemo(() => {
    if (!data?.response) return [];
    return data.response.filter((order) => {
      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;
      const matchesMarket =
        marketFilter === "all" || order.market === marketFilter;
      return matchesStatus && matchesMarket;
    });
  }, [data, statusFilter, marketFilter]);

  if (!userId)
    return (
      <div className="min-h-screen bg-card flex justify-center items-center">
        <Info className="w-3 h-3" />
        <span className="text-gray-400 text-muted-foreground text-sm">
          SignIn to see all orders
        </span>
      </div>
    );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4">
        <Card className="w-full">
          <CardHeader className="sticky top-0 bg-background z-20 border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Your Orders
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Track your active and completed trading orders
                </p>
              </div>

              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px] focus:outline-none focus:ring-0">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={marketFilter} onValueChange={setMarketFilter}>
                  <SelectTrigger className="w-[140px] focus:outline-none focus:ring-0">
                    <SelectValue placeholder="Market" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Markets</SelectItem>
                    {markets.map((market: string) => (
                      <SelectItem key={market} value={market}>
                        {market as React.ReactNode}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>

          {isLoading ? (
            <p>Loading user orders</p>
          ) : (
            <CardContent className="p-0">
              {filteredOrders.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Clock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      No Orders Found
                    </h3>
                    <p className="text-muted-foreground">
                      Your trading orders will appear here once you place them.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="overflow-y-auto max-h-[600px]">
                  <table className="w-full">
                    <thead className="sticky top-0 bg-background z-10">
                      <tr className="border-b bg-muted/50">
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Order ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Side
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Quantity
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Filled
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Market
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Time
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredOrders.map((order) => (
                        <Order
                          filled={Number(order.filled)}
                          market={order.market}
                          orderId={order.id}
                          price={Number(order.price)}
                          quantity={Number(order.quantity)}
                          side={order.side}
                          status={order.status}
                          key={order.id}
                          time={order.order_time}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}

export default Orders;
