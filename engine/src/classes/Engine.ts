import { MessageFromApi, OrderDetails } from "../types";
import { OrderBook } from "./OrderBook";

interface AssetBalance {
  available: number;
  locked: number;
}

export class Engine {
  private orderbooks: OrderBook[] = [];
  private balances: Map<string, AssetBalance> = new Map<string, AssetBalance>();

  checkBalanceAndLock(
    baseAsset: string,
    quoteAsset: string,
    side: "buy" | "sell",
    price: number,
    quantity: number,
    userId: string
  ) {
    const user = this.balances.get(userId);
    if (!user) throw new Error("User not found!");

    // quote -> inr
    // base -> sol
    if (side == "buy") {
      // @ts-ignore
      const userQuoteBalance = user[quoteAsset].available;
      if (userQuoteBalance < price * quantity)
        throw new Error("Insufficient funds!");

      // @ts-ignore
      user[quoteAsset].available -= price * quantity;
      // @ts-ignore
      user[quoteAsset].locked += price * quantity;
    } else {
      // @ts-ignore
      const userBaseAsset = user[baseAsset].available;
      if (userBaseAsset < quantity) throw new Error("Insufficient funds!");

      // @ts-ignore
      user[baseAsset].available -= quantity;
      // @ts-ignore
      user[baseAsset].locked += quantity;
    }
  }

  createOrder(orderDetails: OrderDetails) {
    // diff orderbooks of diff base assets like SOL, BTC with all the bids, asks and other info
    const orderbook = this.orderbooks.find((o) => {
      o.baseAsset == orderDetails.market.split("_")[0] &&
        o.quoteAsset == orderDetails.market.split("_")[1];
    });

    const baseAsset = orderDetails.market.split("_")[0];
    const quoteAsset = orderDetails.market.split("_")[1];
    // SOL_INR

    if (!orderbook) {
      throw new Error("OrderBook not found");
    }

    this.checkBalanceAndLock(
      baseAsset as string,
      quoteAsset as string,
      orderDetails.side,
      orderDetails.price,
      orderDetails.quantity,
      orderDetails.userId
    );

    const { fills, executedQuantity } = orderbook.addOrder({
      baseAsset: baseAsset as string,
      quoteAsset: quoteAsset as string,
      side: orderDetails.side,
      price: orderDetails.price,
      quantity: orderDetails.quantity,
      userId: orderDetails.userId,
    });

    //    const order = {
    //   price,
    //   side,
    //   quantity,
    //   userId,
    //   orderId: parseInt((Math.random() * 1000000000).toString()),
    //   filled: 0,
    // };
  }

  process(clientId: string, message: MessageFromApi) {
    if (message.type == "CREATE_ORDER") {
      const res = this.createOrder({
        market: message.data.market,
        price: message.data.price,
        quantity: message.data.quantity,
        side: message.data.side,
        userId: message.data.userId,
      });
    }
  }
}
