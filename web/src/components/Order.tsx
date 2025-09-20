import { RawOrder } from "@/lib/types";
import { formatPrice, formatQuantity } from "@/lib/utils/format";
import { Badge, CheckCircle } from "lucide-react";
import React from "react";

function Order({ order, status }: { order: RawOrder; status: string }) {
  //   console.log(order, status, variant);
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
          <span
            className={`text-sm font-semibold ${
              order.side === "buy" ? "text-green-600" : "text-red-600"
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
        <div className="text-xs text-muted-foreground">{order.baseAsset}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <div className="font-mono text-sm">{formatQuantity(order.filled)}</div>
        <div className="text-xs text-muted-foreground">
          {((Number(order.filled) / Number(order.quantity)) * 100).toFixed(1)}%
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium">{"SOL/USD"}</div>
        <div className="text-xs text-muted-foreground">
          {order.baseAsset}/{"USD"}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-center text-xs">
        <div className="flex justify-center items-center">
          <p
            className={`w-max text-center px-2 py-1 rounded-md bg-[#18171c] ${
              status == "Partial" ? "text-yellow-500" : "text-green-500"
            }`}
          >
            {status}
          </p>
        </div>
      </td>
    </tr>
  );
}

export default Order;
