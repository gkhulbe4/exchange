"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisManager = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
class RedisManager {
    static instance;
    subClient;
    pubClient;
    constructor() {
        this.subClient = new ioredis_1.default();
        this.pubClient = new ioredis_1.default();
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new RedisManager();
        }
        return this.instance;
    }
    async sendDbCalls(message) {
        await this.pubClient.lpush("dbMessage", JSON.stringify(message));
    }
    async publishToWs(channel, data) {
        console.log(`Publishing to ${channel}`);
        this.pubClient.publish(channel, JSON.stringify(data));
    }
    async sendToApi(clientId, message) {
        console.log("publishing to:", clientId);
        this.pubClient.publish(clientId, JSON.stringify(message));
    }
    async sendUserBalance(userBalanceData) {
        console.log(userBalanceData);
        const data = JSON.parse(userBalanceData);
        console.log(data);
        console.log(`Publishing to userBalance:${data.userId}`);
        this.pubClient.publish(`userBalance:${data.userId}`, JSON.stringify(data.userBalance));
    }
    async sendOrders(order) {
        this.pubClient.publish("order", order);
    }
    async sendUserOrders(orders) {
        this.pubClient.publish("userOrders", orders);
    }
}
exports.RedisManager = RedisManager;
//# sourceMappingURL=RedisManager.js.map