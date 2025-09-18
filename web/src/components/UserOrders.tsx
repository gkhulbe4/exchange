"use client";

import { useWebSocket } from "@/context/WebSocketContext";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Clock, CheckCircle } from "lucide-react";

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

  const formatPrice = (price: string | number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    }).format(Number(price));

  const formatQuantity = (quantity: string | number) =>
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 8,
    }).format(Number(quantity));

  const getOrderStatus = (
    filled: string | number,
    quantity: string | number
  ) => {
    const filledNum = Number(filled);
    const quantityNum = Number(quantity);
    const fillPercentage = (filledNum / quantityNum) * 100;

    if (fillPercentage === 0)
      return { status: "Open", variant: "secondary" as const };
    return { status: "Partial", variant: "outline" as const };
  };

  return (
    <Card className="w-full flex flex-col h-full">
      {/* ✅ Sticky header */}
      <CardHeader className="sticky top-0 bg-background z-20 border-b">
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Your Orders
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Track your active and completed trading orders
        </p>
      </CardHeader>

      {/* ✅ Scrollable table only */}
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
              const { status, variant } = getOrderStatus(
                order.filled,
                order.quantity
              );
              return (
                <tr
                  key={order.orderId}
                  className="hover:bg-muted/30 transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">
                    #{order.orderId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {order.side === "buy" ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      )}
                      <span
                        className={`text-sm font-semibold ${
                          order.side === "buy"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {order.side.toUpperCase()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right font-mono text-sm">
                    {formatPrice(order.price)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="font-mono text-sm">
                      {formatQuantity(order.quantity)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {order.baseAsset}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="font-mono text-sm">
                      {formatQuantity(order.filled)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {(
                        (Number(order.filled) / Number(order.quantity)) *
                        100
                      ).toFixed(1)}
                      %
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium">{order.market}</div>
                    <div className="text-xs text-muted-foreground">
                      {order.baseAsset}/{order.quoteAsset}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <Badge variant={variant} className="text-xs">
                      {status === "Filled" && (
                        <CheckCircle className="h-3 w-3 mr-1" />
                      )}
                      {status}
                    </Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

export default UserOrders;
