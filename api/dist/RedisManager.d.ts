import { MessageFromEngine, MessageToEngine } from "./types";
export declare class RedisManager {
    private static instance;
    private subClient;
    private pubClient;
    constructor();
    static getInstance(): RedisManager;
    sendAndAwait(message: MessageToEngine): Promise<MessageFromEngine>;
    getUserBalance(userId: string): Promise<unknown>;
    getTrades(): Promise<unknown>;
    getRandomClientId(): string;
}
//# sourceMappingURL=RedisManager.d.ts.map