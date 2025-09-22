import { Fill, FinalOrder, MessageFromApi, OrderDetails } from "../types";
import { Order, OrderBook } from "./OrderBook";
import { RedisManager } from "./RedisManager";

interface AssetBalance {
  available: number;
  locked: number;
}

type baseAssets = "SOL" | "BTC" | "ETH";
type quoteAssets = "USD";

type UserBalances = {
  USD: AssetBalance;
  SOL: AssetBalance;
  ETH: AssetBalance;
  BTC: AssetBalance;
};
export class Engine {
  private orderbooks: OrderBook[] = [];
  private balances: Map<string, UserBalances> = new Map<string, UserBalances>();

  constructor() {
    // console.log("i am in engine constructor");
    this.orderbooks.push(new OrderBook([], [], "SOL", 1, 200));
    this.orderbooks.push(new OrderBook([], [], "ETH", 1, 200));
    this.orderbooks.push(new OrderBook([], [], "BTC", 1, 200));

    // console.log(this.orderbooks);

    this.balances.set("1", {
      USD: { available: 100000, locked: 0 },
      SOL: { available: 1000, locked: 0 },
      ETH: { available: 1000, locked: 0 },
      BTC: { available: 1000, locked: 0 },
    });
    this.balances.set("2", {
      USD: { available: 200000, locked: 0 },
      SOL: { available: 1000, locked: 0 },
      ETH: { available: 1000, locked: 0 },
      BTC: { available: 1000, locked: 0 },
    });
    this.balances.set("3", {
      USD: { available: 300000, locked: 0 },
      SOL: { available: 1000, locked: 0 },
      ETH: { available: 1000, locked: 0 },
      BTC: { available: 1000, locked: 0 },
    });
    this.balances.set("4", {
      USD: { available: 400000, locked: 0 },
      SOL: { available: 1000, locked: 0 },
      ETH: { available: 1000, locked: 0 },
      BTC: { available: 1000, locked: 0 },
    });
    this.balances.set("5", {
      USD: { available: 500000, locked: 0 },
      SOL: { available: 1000, locked: 0 },
      ETH: { available: 1000, locked: 0 },
      BTC: { available: 1000, locked: 0 },
    });
    this.balances.set("6", {
      USD: { available: 600000, locked: 0 },
      SOL: { available: 1000, locked: 0 },
      ETH: { available: 1000, locked: 0 },
      BTC: { available: 1000, locked: 0 },
    });
  }

  getUserBalance(userId: string) {
    const userBalance = this.balances.get(userId);
    // console.log("user balance:", userBalance);
    RedisManager.getInstance().sendUserBalance(
      JSON.stringify({ userBalance: userBalance, userId: userId })
    );
  }

  checkBalanceAndLock(
    baseAsset: baseAssets,
    quoteAsset: quoteAssets,
    side: "buy" | "sell",
    price: number,
    quantity: number,
    userId: string
  ) {
    // console.log("in check balance");
    const user = this.balances.get(userId);
    if (!user) throw new Error("User not found!");

    // quote -> USD
    // base -> SOL/ETH/BTC
    if (side == "buy") {
      const userQuoteBalance = user[quoteAsset].available;
      if (userQuoteBalance < price * quantity)
        throw new Error("Insufficient funds!");

      user[quoteAsset].available -= price * quantity;
      user[quoteAsset].locked += price * quantity;
    } else {
      const userBaseAsset = user[baseAsset].available;
      if (userBaseAsset < quantity) throw new Error("Insufficient funds!");

      user[baseAsset].available -= quantity;
      user[baseAsset].locked += quantity;
    }
  }

  updateBalances(
    baseAsset: baseAssets,
    quoteAsset: quoteAssets,
    fills: Fill[],
    executedQuantity: number,
    side: string,
    userId: string
  ) {
    console.log("In updating balance");

    if (side === "buy") {
      fills.forEach((fill) => {
        // Seller side
        const seller = this.balances.get(fill.otherUserId);

        if (!seller) throw new Error("Seller not found in balances");
        if (seller[baseAsset].locked < fill.qty) {
          throw new Error("Invalid state: locked < qty (seller)");
        }

        seller[baseAsset].locked -= fill.qty; // decrease locked tokens
        seller[quoteAsset].available += fill.qty * Number(fill.price); // increase USD

        // Buyer side
        const buyer = this.balances.get(userId);
        if (!buyer) throw new Error("Buyer not found in balances");

        if (buyer[quoteAsset].locked < fill.qty * Number(fill.price)) {
          throw new Error("Invalid state: locked USD < cost");
        }

        buyer[quoteAsset].locked -= fill.qty * Number(fill.price); // release USD
        buyer[baseAsset].available += fill.qty; // add tokens

        console.log("Buyer Base:", buyer[baseAsset].available);
        console.log("Seller Base:", seller[baseAsset].available);
        console.log("Seller Quote:", seller[quoteAsset].available);
      });
    } else {
      fills.forEach((fill) => {
        // Seller side
        const seller = this.balances.get(userId);
        if (!seller) throw new Error("Seller not found in balances");
        if (seller[baseAsset].locked < fill.qty) {
          throw new Error("Invalid state: locked < qty (seller)");
        }

        seller[baseAsset].locked -= fill.qty; // decrease locked tokens
        seller[quoteAsset].available += fill.qty * Number(fill.price); // increase USD

        // Buyer side
        const buyer = this.balances.get(fill.otherUserId);
        if (!buyer) throw new Error("Buyer not found in balances");

        if (buyer[quoteAsset].locked < fill.qty * Number(fill.price)) {
          throw new Error("Invalid state: locked USD < cost");
        }

        buyer[quoteAsset].locked -= fill.qty * Number(fill.price); // release USD
        buyer[baseAsset].available += fill.qty; // add tokens

        console.log("Buyer Base:", buyer[baseAsset].available);
        console.log("Seller Base:", seller[baseAsset].available);
        console.log("Seller Quote:", seller[quoteAsset].available);
      });
    }
  }

  createDbTrade(fills: Fill[], market: string, userId: string, side: string) {
    console.log(fills);

    fills.forEach((fill: Fill) => {
      RedisManager.getInstance().sendDbCalls({
        type: "ADD_TRADE",
        data: {
          market: market,
          id: fill.tradeId.toString(),
          buyer_id: side === "buy" ? userId : fill.otherUserId,
          seller_id: side === "sell" ? userId : fill.otherUserId,
          price: fill.price,
          qty: fill.qty,
          side: side,
        },
      });
    });
  }

  handleDbOrder(order: FinalOrder, fills: Fill[]) {
    RedisManager.getInstance().sendDbCalls({
      type: "ADD_ORDER",
      data: { order: order, fills: fills },
    });
  }

  publishWsTrades(
    fills: Fill[],
    userId: string,
    market: string,
    side: string,
    orderId: string
  ) {
    console.log("Publishing TRADE");
    fills.forEach((fill: Fill) => {
      RedisManager.getInstance().publishToWs(`trades.${market}`, {
        stream: "trade",
        data: {
          e: "trade",
          t: fill.tradeId,
          p: fill.price,
          q: fill.qty,
          m: market,
          s: side,
          o: orderId, // order that filled the order
          of: fill.marketOrderId, // order that got filled
          T: fill.time,
        },
      });
    });
  }

  publishWsOrder(
    order: {
      baseAsset: string;
      quoteAsset: string;
      side: "buy" | "sell";
      price: number;
      quantity: number;
      userId: string;
      orderId: string;
      filled: number;
      market: string;
    } | null
  ) {
    console.log("Publishing Order");
    RedisManager.getInstance().publishToWs(`order.${order?.market}`, {
      stream: "order",
      data: {
        e: "order",
        f: order?.filled as number,
        m: order?.market as string,
        o: order?.orderId as string,
        p: order?.price as number,
        q: order?.quantity as number,
        s: order?.side as string,
        u: order?.userId as string,
      },
    });
  }

  createOrder(orderDetails: OrderDetails) {
    // console.log("in create order for", orderDetails.userId);
    const baseAsset = orderDetails.market.split("_")[0];
    const quoteAsset = orderDetails.market.split("_")[1];
    // diff orderbooks of diff base assets like SOL, BTC with all the bids, asks and other info
    const orderbook = this.orderbooks.find((o) => {
      return o.baseAsset === baseAsset && o.quoteAsset === quoteAsset;
    });

    // console.log(orderDetails.market.split("_"));

    // SOL_USD | USD
    if (!orderbook) {
      throw new Error("OrderBook not found");
    }

    this.checkBalanceAndLock(
      baseAsset as baseAssets,
      quoteAsset as quoteAssets,
      orderDetails.side,
      orderDetails.price,
      orderDetails.quantity,
      orderDetails.userId
    );

    const order: FinalOrder = {
      baseAsset: baseAsset as string,
      quoteAsset: quoteAsset as string,
      side: orderDetails.side,
      price: orderDetails.price,
      quantity: orderDetails.quantity,
      userId: orderDetails.userId,
      orderId: `${Date.now()}${Math.floor(Math.random() * 1000)}`,
      filled: 0,
      market: orderDetails.market,
      time: Date.now(),
    };
    console.log("order:", order);

    const { fills, executedQuantity, remainingOrder } =
      orderbook.addOrder(order);

    // console.log("New order :", order)

    //updating the lock balances
    this.updateBalances(
      baseAsset as baseAssets,
      quoteAsset as quoteAssets,
      fills,
      executedQuantity,
      order.side,
      order.userId
    );

    this.createDbTrade(
      fills,
      orderDetails.market,
      orderDetails.userId,
      orderDetails.side
    );

    // publishWsOrder
    // - get remaining order with all the details like filled , quantity , orderId, price and send to publishWs
    // - in frontend it will catch all the orders and show in the orderbook with colors
    // - also send order Id with the trade ws so that it can be checked in the frontend. If filled == quantity and remove the order from the array and show updated orders in the orderbook

    this.handleDbOrder(order, fills);

    this.publishWsTrades(
      fills,
      orderDetails.userId,
      orderDetails.market,
      orderDetails.side,
      order.orderId
    );

    if (remainingOrder) {
      // @ts-ignore
      this.publishWsOrder(remainingOrder);
    }

    return { executedQuantity, fills, orderId: order.orderId };
  }

  process(clientId: string, message: MessageFromApi) {
    // console.log("in process");
    // console.log("Client Id:", clientId);
    // console.log("User Id:", message.data.userId);
    if (message.type == "CREATE_ORDER") {
      try {
        const { executedQuantity, fills, orderId } = this.createOrder({
          market: message.data.market,
          price: message.data.price,
          quantity: message.data.quantity,
          side: message.data.side,
          userId: message.data.userId,
        });

        console.log("IN ENGINE PROCESS (ORDER PLACED):");
        console.log({ executedQuantity, fills, orderId });

        console.log("sending to client Id:", clientId);

        // sending response back to API Server
        RedisManager.getInstance().sendToApi(clientId, {
          type: "ORDER_PLACED",
          data: {
            orderId: orderId,
            executedQuantity: executedQuantity,
            fills: fills,
          },
        });
      } catch (error) {
        console.log("ERROR CAME WHILE PLACING AN ORDER", error);
        RedisManager.getInstance().sendToApi(clientId, {
          type: "ORDERED_CANCELLED",
          data: {
            orderId: "",
            executedQuantity: 0,
            fills: [],
          },
        });
      }
    }
  }

  getOrders(market: string) {
    if (!market) return;
    console.log("GETTING ORDERS FOR MARKET: ", market);
    const baseAsset = market.split("_")[0];
    const orderbook = this.orderbooks.find((o) => o.baseAsset == baseAsset);
    RedisManager.getInstance().sendOrders(
      JSON.stringify({ buys: orderbook?.bids, asks: orderbook?.asks })
    );
  }

  getUserOrders(userId: string, market: string) {
    if (!market) return;
    console.log("GETTING ORDERS FOR MARKET: ", market);

    const baseAsset = market.split("_")[0];
    const o = this.orderbooks.find(
      (orderbook: OrderBook) => orderbook.baseAsset == baseAsset
    );
    const bids = o?.bids.filter((order) => order.userId == userId);
    const asks = o?.asks.filter((order) => order.userId == userId);
    RedisManager.getInstance().sendUserOrders(
      JSON.stringify({ buys: bids, asks: asks })
    );
  }
}
