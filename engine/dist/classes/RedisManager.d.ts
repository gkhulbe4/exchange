import Redis from "ioredis";
import { DBMessage, PublishToWS } from "../types";
export declare class RedisManager {
    private static instance;
    subClient: Redis;
    pubClient: Redis;
    constructor();
    static getInstance(): RedisManager;
    sendDbCalls(message: DBMessage): Promise<void>;
    publishToWs(channel: string, data: PublishToWS): Promise<void>;
    sendToApi(clientId: string, message: DBMessage): Promise<void>;
    sendUserBalance(userBalanceData: string): Promise<void>;
    sendOrders(order: string): Promise<void>;
    sendUserOrders(orders: string): Promise<void>;
}
//# sourceMappingURL=RedisManager.d.ts.map