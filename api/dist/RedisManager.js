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
    async sendAndAwait(message) {
        return new Promise(async (resolve, reject) => {
            const clientId = this.getRandomClientId();
            this.subClient.subscribe(clientId);
            console.log("in sendAndAwait , sending clientId: ", clientId);
            this.subClient.on("message", (channel, message) => {
                if (channel != clientId)
                    reject();
                this.subClient.unsubscribe(clientId);
                resolve(JSON.parse(message));
                // console.log("Order promise done");
                // console.log(message);
            });
            await this.pubClient.lpush("message", JSON.stringify({ message: message, clientId: clientId }));
        });
    }
    async getUserBalance(userId) {
        // console.log("pushing to userBalance");
        return new Promise(async (resolve) => {
            await this.pubClient.lpush("user", JSON.stringify({ type: "userBalance", userId: userId }));
            console.log(`Subscribing to userBalance:${userId}`);
            this.subClient.subscribe(`userBalance:${userId}`);
            this.subClient.on("message", (channel, message) => {
                // console.log(channel, message);
                if (channel == `userBalance:${userId}`) {
                    this.subClient.unsubscribe(`userBalance:${userId}`);
                    console.log(message);
                    resolve(JSON.parse(message));
                }
            });
        });
    }
    getTrades() {
        return new Promise(async (resolve) => {
            this.subClient.subscribe("trades");
            await this.pubClient.lpush("dbMessage", JSON.stringify({ type: "trades" }));
            this.subClient.on("message", (channel, message) => {
                if (channel == "trades") {
                    this.subClient.unsubscribe("trades");
                    resolve(JSON.parse(message));
                }
            });
        });
    }
    getOrders() {
        return new Promise(async (resolve) => {
            await this.pubClient.lpush("message", JSON.stringify({ type: "order" }));
            this.subClient.subscribe("order");
            this.subClient.on("message", (channel, message) => {
                // console.log(channel, message);
                if (channel == "order") {
                    this.subClient.unsubscribe("order");
                    resolve(JSON.parse(message));
                }
            });
        });
    }
    getTickerData() {
        return new Promise(async (resolve) => {
            this.subClient.subscribe("ticker");
            await this.pubClient.lpush("dbMessage", JSON.stringify({ type: "ticker" }));
            this.subClient.on("message", (channel, message) => {
                if (channel == "ticker") {
                    this.subClient.unsubscribe("ticker");
                    resolve(JSON.parse(message));
                }
            });
        });
    }
    getKlineData(timeFrame) {
        return new Promise(async (resolve) => {
            this.subClient.subscribe("kline");
            await this.pubClient.lpush("dbMessage", JSON.stringify({ type: "kline", timeFrame: timeFrame }));
            this.subClient.on("message", (channel, message) => {
                if (channel == "kline") {
                    this.subClient.unsubscribe("kline");
                    resolve(JSON.parse(message));
                }
            });
        });
    }
    getUserOrders(userId) {
        return new Promise(async (resolve) => {
            this.subClient.subscribe("userOrders");
            await this.pubClient.lpush("message", JSON.stringify({ type: "userOrders", userId: userId }));
            this.subClient.on("message", (channel, message) => {
                if (channel == "userOrders") {
                    this.subClient.unsubscribe("userOrders");
                    resolve(JSON.parse(message));
                }
            });
        });
    }
    getRandomClientId() {
        return (Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15));
    }
}
exports.RedisManager = RedisManager;
//# sourceMappingURL=RedisManager.js.map