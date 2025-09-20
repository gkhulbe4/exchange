"use client";
import { useWebSocket } from "@/context/WebSocketContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Clock } from "lucide-react";
import Order from "./Order";

function UserOrders() {
  const { userOrders } = useWebSocket();

  if (!userOrders || (!userOrders.bids?.length && !userOrders.asks?.length)) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <Clock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No Orders Found
            </h3>
            <p className="text-muted-foreground">
              Your trading orders will appear here once you place them.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const allOrders = [...(userOrders.bids || []), ...(userOrders.asks || [])];

  const getOrderStatus = (
    filled: string | number,
    quantity: string | number
  ) => {
    const filledNum = Number(filled);
    const quantityNum = Number(quantity);
    const fillPercentage = (filledNum / quantityNum) * 100;

    if (fillPercentage === 0) return { status: "Open" };
    return { status: "Partial" };
  };

  return (
    <Card className="w-full flex flex-col max-h-96">
      <CardHeader className="sticky top-0 bg-background z-20 border-b">
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Your Orders
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Track your active and completed trading orders
        </p>
      </CardHeader>

      <CardContent className="p-0 flex-1 overflow-y-auto">
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
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Market
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {allOrders.map((order) => {
              const { status } = getOrderStatus(order.filled, order.quantity);
              return <Order order={order} status={status} />;
            })}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

export default UserOrders;
