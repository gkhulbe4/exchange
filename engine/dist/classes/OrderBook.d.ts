import { Fill } from "../types";
interface Order {
    market: string;
    side: "buy" | "sell";
    quantity: number;
    price: number;
    userId: string;
    filled: number;
    orderId: string;
}
export declare class OrderBook {
    bids: Order[];
    asks: Order[];
    baseAsset: string;
    quoteAsset: string;
    lastTradeId: number;
    currentPrice: number;
    constructor(bids: Order[], asks: Order[], baseAsset: string, lastTradeId: number, currentPrice: number);
    private sortBids;
    private sortAsks;
    getOrderBook(): void;
    addOrder(order: Order): {
        executedQuantity: number;
        fills: Fill[];
    };
    matchBid(price: number, quantity: number): {
        fills: Fill[];
        executedQuantity: number;
    };
    matchAsk(price: number, quantity: number): {
        fills: Fill[];
        executedQuantity: number;
    };
}
export {};
//# sourceMappingURL=OrderBook.d.ts.map