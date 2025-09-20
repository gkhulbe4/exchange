import { Fill, FinalOrder, MessageFromApi, OrderDetails } from "../types";
export declare class Engine {
    private orderbooks;
    private balances;
    constructor();
    getUserBalance(userId: string): void;
    checkBalanceAndLock(baseAsset: "SOL", quoteAsset: "INR", side: "buy" | "sell", price: number, quantity: number, userId: string): void;
    updateBalances(baseAsset: "SOL", quoteAsset: "INR", fills: Fill[], executedQuantity: number, side: string, userId: string): void;
    createDbTrade(fills: Fill[], market: string, userId: string, side: string): void;
    handleDbOrder(order: FinalOrder, fills: Fill[]): void;
    publishWsTrades(fills: Fill[], userId: string, market: string, side: string, orderId: string): void;
    publishWsOrder(order: {
        baseAsset: string;
        quoteAsset: string;
        side: "buy" | "sell";
        price: number;
        quantity: number;
        userId: string;
        orderId: string;
        filled: number;
        market: string;
    } | null): void;
    createOrder(orderDetails: OrderDetails): {
        executedQuantity: number;
        fills: Fill[];
        orderId: string;
    };
    process(clientId: string, message: MessageFromApi): void;
    getOrders(): void;
    getUserOrders(userId: string): void;
}
//# sourceMappingURL=Engine.d.ts.map