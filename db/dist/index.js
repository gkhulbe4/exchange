"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = main;
const ioredis_1 = __importDefault(require("ioredis"));
const initialiseViews_1 = require("./initialiseViews");
const getTradesFromDb_1 = require("./lib/getTradesFromDb");
const addTradeInDb_1 = require("./lib/addTradeInDb");
const getTickerDatafromDb_1 = require("./lib/getTickerDatafromDb");
async function main() {
    await (0, initialiseViews_1.initialiseViews)();
    const redisClient = new ioredis_1.default();
    // console.log("In DB:");
    while (true) {
        const res = await redisClient.rpop("dbMessage");
        if (res) {
            const message = JSON.parse(res);
            // console.log("Message in DB:", message);
            if (message.type == "ADD_TRADE") {
                await (0, addTradeInDb_1.addTradeInDb)(message.data.id, message.data.market, message.data.buyer_id, message.data.seller_id, message.data.side, message.data.price, message.data.qty);
            }
            else if (message.type == "trades") {
                const data = await (0, getTradesFromDb_1.getTradesFromDb)();
                redisClient.publish("trades", JSON.stringify(data));
            }
            else if (message.type == "ticker") {
                const data = await (0, getTickerDatafromDb_1.getTickerDataFromDb)();
                redisClient.publish("ticker", JSON.stringify(data));
            }
        }
    }
}
main();
//# sourceMappingURL=index.js.map