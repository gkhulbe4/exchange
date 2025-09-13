import { Fill, MessageFromApi, OrderDetails } from "../types";
export declare class Engine {
    private orderbooks;
    private balances;
    constructor();
    getUserBalance(userId: string): void;
    checkBalanceAndLock(baseAsset: "SOL", quoteAsset: "INR", side: "buy" | "sell", price: number, quantity: number, userId: string): void;
    updateBalances(baseAsset: "SOL", quoteAsset: "INR", fills: Fill[], executedQuantity: number, side: string, userId: string): void;
    createDbTrade(fills: Fill[], market: string, userId: string, side: string): void;
    publishWsTrades(fills: Fill[], userId: string, market: string): void;
    createOrder(orderDetails: OrderDetails): {
        executedQuantity: number;
        fills: Fill[];
        orderId: string;
    };
    process(clientId: string, message: MessageFromApi): void;
}
//# sourceMappingURL=Engine.d.ts.map