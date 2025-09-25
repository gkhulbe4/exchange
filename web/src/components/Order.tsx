import { formatDate, formatPrice, formatQuantity } from "@/lib/utils/format";
import CancelOrderDialog from "./CancelOrderDialog";
import { useWebSocket } from "@/context/WebSocketContext";
import { useState } from "react";

function Order({
  price,
  quantity,
  filled,
  market,
  orderId,
  side,
  status,
  time,
}: {
  price: number;
  quantity: number;
  filled: number;
  status: string;
  market: string;
  orderId: string;
  side: string;
  time?: string;
}) {
  const { userId } = useWebSocket();
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const getSideColor = (side: string) => {
    return side === "buy" ? "text-buy" : "text-sell";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open":
        return "text-blue-500";
      case "Partial":
        return "text-yellow-500";
      case "Filled":
        return "text-green-500";
      case "Cancelled":
        return "text-red-500";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <tr
      key={orderId}
      className="hover:bg-muted/30 transition-colors duration-150"
    >
      <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">
        #{orderId}
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`text-sm font-semibold ${getSideColor(side)}`}>
          {side.toUpperCase()}
        </span>
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-right font-mono text-sm">
        {formatPrice(price)}
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-right">
        <div className="font-mono text-sm">{formatQuantity(quantity)}</div>
        <div className="text-xs text-muted-foreground">
          {market.split("_")[0]}
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-right">
        <div className="font-mono text-sm">{formatQuantity(filled)}</div>
        <div className="text-xs text-muted-foreground">
          {((Number(filled) / Number(quantity)) * 100).toFixed(1)}%
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-right">{market}</div>
        <div className="text-xs text-muted-foreground text-right">{market}</div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-center text-xs">
        <div className="flex justify-center items-center">
          <p
            className={`px-2 py-1 w-full rounded-md bg-muted/50 text-xs font-medium ${getStatusColor(
              status
            )}`}
          >
            {status}
          </p>
        </div>
      </td>

      {time && (
        <td className="px-6 py-4 whitespace-nowrap text-center text-xs">
          <p className="px-2 py-1 rounded-md bg-muted/50 text-xs font-medium">
            {formatDate(new Date(time))}
          </p>
        </td>
      )}

      {status === "Open" || status === "Partial" ? (
        <td className="px-6 py-4 whitespace-nowrap text-center text-xs">
          <CancelOrderDialog
            key={orderId}
            market={market}
            userId={userId}
            orderId={orderId}
            side={side}
            openCancelDialog={openCancelDialog}
            setOpenCancelDialog={setOpenCancelDialog}
          />
        </td>
      ) : (
        <td className="px-6 py-4 whitespace-nowrap text-center text-xs">
          <button className="px-2 py-2 w-full rounded-md bg-gray-500 text-white text-xs font-medium">
            {status == "Cancelled" ? "Cancelled" : "Filled"}
          </button>
        </td>
      )}
    </tr>
  );
}

export default Order;
