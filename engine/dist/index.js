"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = __importDefault(require("ioredis"));
const Engine_1 = require("./classes/Engine");
async function startEngine() {
    const engine = new Engine_1.Engine();
    const redisClient = new ioredis_1.default();
    while (true) {
        const response = await redisClient.brpop("message", "user", 0);
        if (!response)
            continue;
        const [queue, rawData] = response;
        const data = JSON.parse(rawData);
        switch (queue) {
            case "message":
                switch (data.type) {
                    case "userBalance":
                        engine.getUserBalance(data.userId);
                        break;
                    case "order":
                        engine.getOrders(data.market);
                        break;
                    case "userOrders":
                        engine.getUserOrders(data.userId, data.market);
                        break;
                    default:
                        engine.process(data.clientId, data.message);
                }
                break;
            case "user":
                switch (data.type) {
                    case "userBalance":
                        console.log("IN USER QUEUE , USER ID: ", data.userId);
                        engine.getUserBalance(data.userId);
                        break;
                    default:
                        console.warn(`Unhandled message in 'user' queue: ${data.type}`);
                }
                break;
            default:
                console.warn(`Unhandled queue: ${queue}`);
        }
    }
}
startEngine();
//# sourceMappingURL=index.js.map