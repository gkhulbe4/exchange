import { MessageFromEngine, MessageToEngine } from "./types";
export declare class RedisManager {
    private static instance;
    private subClient;
    private pubClient;
    constructor();
    static getInstance(): RedisManager;
    sendAndAwait(message: MessageToEngine): Promise<MessageFromEngine>;
    getUserBalance(userId: string): Promise<unknown>;
    getTrades(market: string): Promise<unknown>;
    getOrders(market: string): Promise<unknown>;
    getTickerData(market: string): Promise<unknown>;
    getKlineData(timeFrame: string, market: string): Promise<unknown>;
    getUserOrders(userId: string, market: string): Promise<unknown>;
    getUserOrdersFromDb(userId: string): Promise<unknown>;
    getRandomClientId(): string;
}
//# sourceMappingURL=RedisManager.d.ts.map