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
    getRandomClientId() {
        return (Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15));
    }
}
exports.RedisManager = RedisManager;
//# sourceMappingURL=RedisManager.js.map