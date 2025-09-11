import { Fill, OrderDetails } from "../types";

interface Order {
  market: string;
  side: "buy" | "sell";
  quantity: number;
  price: number;
  userId: string;
  filled: number;
  orderId: string;
}

export class OrderBook {
  bids: Order[];
  asks: Order[];
  baseAsset: string;
  quoteAsset = "INR";
  lastTradeId: number;
  currentPrice: number;

  constructor(
    bids: Order[],
    asks: Order[],
    baseAsset: string,
    lastTradeId: number,
    currentPrice: number
  ) {
    this.bids = bids;
    this.asks = asks;
    this.baseAsset = baseAsset;
    this.lastTradeId = lastTradeId || 0;
    this.currentPrice = currentPrice || 0;
  }

  private sortBids() {
    this.bids.sort((a, b) => b.price - a.price); // show highest bids first
  }

  private sortAsks() {
    this.asks.sort((a, b) => a.price - b.price); // show lowest asks first
  }

  getOrderBook() {
    console.log(`OrderBook: ${this.baseAsset}_${this.quoteAsset}`);
    console.log("Bids: ", this.bids);
    console.log("Asks: ", this.asks);
  }

  addOrder(order: Order) {
    console.log(
      `📥 New Order: ${order.side.toUpperCase()} ${order.quantity} @ ${
        order.price
      }`
    );

    const { executedQuantity, fills } =
      order.side === "buy"
        ? this.matchBid(order.price, order.quantity)
        : this.matchAsk(order.price, order.quantity);

    order.filled = executedQuantity;

    console.log("Fills:", fills);
    console.log("Executed Qty:", executedQuantity);

    // push the one who are not fully executed
    if (executedQuantity < order.quantity) {
      const remainingOrder: Order = { ...order };
      if (order.side === "buy") {
        this.bids.push(remainingOrder);
        this.sortBids();
      } else {
        this.asks.push(remainingOrder);
        this.sortAsks();
      }
      console.log("📌 Order added to book:", remainingOrder);
    } else {
      console.log("✅ Fully executed order, not added to book.");
    }

    this.getOrderBook();

    return { executedQuantity, fills };
  }

  matchBid(price: number, quantity: number) {
    let executedQuantity = 0;
    let fills: Fill[] = [];
    console.log("in match bid");

    for (const ask of this.asks) {
      const remainingAsk = ask.quantity - ask.filled;

      // console.log("Ask price: ", ask.price);
      // console.log("Bid price: ", price);
      // console.log("Remaining: ", remainingAsk);
      // console.log("Bid Quantity: ", quantity);

      if (
        ask.price <= price &&
        executedQuantity <= quantity &&
        remainingAsk > 0
      ) {
        const filled = Math.min(quantity - executedQuantity, remainingAsk);
        executedQuantity += filled;
        ask.filled += filled;

        console.log("filled this much:", filled);

        fills.push({
          price: ask.price.toString(),
          qty: filled,
          tradeId: this.lastTradeId++,
          otherUserId: ask.userId,
          markerOrderId: ask.orderId,
        });

        console.log(`🤝 Matched BUY ${filled} @ ${ask.price}`);
      }
    }

    this.asks = this.asks.filter((ask) => ask.filled < ask.quantity);
    return { fills, executedQuantity };
  }

  matchAsk(price: number, quantity: number) {
    let executedQuantity = 0;
    let fills: Fill[] = [];

    for (const bid of this.bids) {
      const remainingBid = bid.quantity - bid.filled;
      if (
        bid.price >= price &&
        executedQuantity < quantity &&
        remainingBid > 0
      ) {
        const filled = Math.min(quantity - executedQuantity, remainingBid);
        executedQuantity += filled;
        bid.filled += filled;

        fills.push({
          price: bid.price.toString(),
          qty: filled,
          tradeId: this.lastTradeId++,
          otherUserId: bid.userId,
          markerOrderId: bid.orderId,
        });

        console.log(`🤝 Matched SELL ${filled} @ ${bid.price}`);
      }
    }

    this.bids = this.bids.filter((bid) => bid.filled < bid.quantity);
    return { fills, executedQuantity };
  }
}
