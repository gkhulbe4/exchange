import { OrderDetails } from "../types";

interface Order {
  market: string;
  side: "buy" | "sell";
  quantity: number;
  price: number;
  userId: string;
  filled: number;
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
    this.lastTradeId = lastTradeId | 0;
    this.currentPrice = currentPrice | 0;
  }

  getOrderBook() {
    return `${this.baseAsset}_${this.quoteAsset}`;
  }

  addOrder({
    baseAsset,
    quoteAsset,
    side,
    price,
    quantity,
    userId,
  }: {
    baseAsset: string;
    quoteAsset: string;
    side: string;
    price: number;
    quantity: number;
    userId: string;
  }) {
    if (side == "buy") {
      this.matchBid(price, quantity);
    }
  }

  matchBid(price: number, quantity: number) {
    let executedQuantity = 0;
    let fills = [];

    this.asks.forEach((ask) => {
      if (ask.price <= price && executedQuantity < quantity) {
        const amountRemaining = Math.min(
          quantity - executedQuantity,
          ask.quantity - ask.filled
        );

        ask.filled += amountRemaining;
        executedQuantity += amountRemaining;
        fills.push({
          price: ask.price.toString(),
          qty: amountRemaining,
          tradeId: this.lastTradeId++,
          otherUserId: ask.userId,
          //   markerOrderId: ask.orderId,
        });
      }
    });
  }
}
