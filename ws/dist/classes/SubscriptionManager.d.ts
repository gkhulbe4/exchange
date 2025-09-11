export declare class SubscriptionManager {
    private static instance;
    private subscriptions;
    private reverseSubscriptions;
    private redisClient;
    private constructor();
    static getInstance(): SubscriptionManager;
    subscribe(userId: string, subscription: string): void;
    unsubscribe(userId: string, subscription: string): void;
    startRedisListener(channel: string, message: string): void;
}
//# sourceMappingURL=SubscriptionManager.d.ts.map