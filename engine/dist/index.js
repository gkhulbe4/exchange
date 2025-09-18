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
        const response = await redisClient.rpop("message");
        const data = JSON.parse(response);
        if (!response) {
        }
        else {
            // console.log(response, "in startEngine");
            // console.log(data);
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
                //client id for communicating to that order
            }
        }
    }
}
startEngine();
//# sourceMappingURL=index.js.map