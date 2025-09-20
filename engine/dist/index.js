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
        if (queue === "message") {
            if (data.type == "userBalance") {
                engine.getUserBalance(data.userId);
            }
            else if (data.type == "order") {
                engine.getOrders();
            }
            else if (data.type == "userOrders") {
                engine.getUserOrders(data.userId);
            }
            else {
                engine.process(data.clientId, data.message);
            }
        }
        else if (queue === "user") {
            if (data.type === "userBalance") {
                console.log("IN USER QUEUE , USER ID: ", data.userId);
                engine.getUserBalance(data.userId);
            }
        }
    }
}
startEngine();
//# sourceMappingURL=index.js.map