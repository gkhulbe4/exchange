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
const getKlineDataFromDb_1 = require("./lib/getKlineDataFromDb");
const handleOrderInDb_1 = require("./lib/handleOrderInDb");
const getUserOrdersFromDb_1 = require("./lib/getUserOrdersFromDb");
const cancelOrderInDb_1 = require("./lib/cancelOrderInDb");
const getAllMarketsCurrentPrice_1 = require("./lib/getAllMarketsCurrentPrice");
async function main() {
    await (0, initialiseViews_1.initialiseViews)();
    const redisClient = new ioredis_1.default();
    while (true) {
        const res = await redisClient.rpop("dbMessage");
        if (!res)
            continue;
        const message = JSON.parse(res);
        switch (message.type) {
            case "ADD_TRADE":
                await (0, addTradeInDb_1.addTradeInDb)(message.data.id, message.data.market, message.data.buyer_id, message.data.seller_id, message.data.side, message.data.price, message.data.qty);
                break;
            case "ADD_ORDER":
                // console.log(message);
                await (0, handleOrderInDb_1.handleOrderInDb)(message?.data?.order, message?.data?.fills);
                break;
            case "CANCEL_ORDER":
                console.log("Cancelling order: ", message?.data);
                (0, cancelOrderInDb_1.cancelOrderInDb)(message?.data?.orderId);
                break;
            case "trades": {
                const data = await (0, getTradesFromDb_1.getTradesFromDb)(message.market);
                redisClient.publish("trades", JSON.stringify(data));
                break;
            }
            case "ticker": {
                const data = await (0, getTickerDatafromDb_1.getTickerDataFromDb)(message.market);
                redisClient.publish("ticker", JSON.stringify(data));
                break;
            }
            case "kline": {
                const data = await (0, getKlineDataFromDb_1.getKlineDataFromDb)(message.timeFrame, message.market);
                redisClient.publish("kline", JSON.stringify(data));
                break;
            }
            case "userOrdersFromDb": {
                const data = await (0, getUserOrdersFromDb_1.getUserOrdersFromDb)(message.userId);
                redisClient.publish("userOrdersFromDb", JSON.stringify(data));
                break;
            }
            case "allMarketsCurrentPrice": {
                const data = await (0, getAllMarketsCurrentPrice_1.getAllMarketsCurrentPrice)();
                redisClient.publish("allMarketsCurrentPrice", JSON.stringify(data));
                break;
            }
            default:
                console.warn(`Unhandled message type: ${message.type}`);
        }
    }
}
main();
//# sourceMappingURL=index.js.map