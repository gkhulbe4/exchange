"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = main;
const ioredis_1 = __importDefault(require("ioredis"));
const initialiseViews_1 = require("./initialiseViews");
const db_1 = require("./db");
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
                const query1 = `
        INSERT INTO trades (id, market, buyer_id, seller_id, side, price, quantity)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `;
                const values1 = [
                    message.data.id,
                    message.data.market,
                    message.data.buyer_id,
                    message.data.seller_id,
                    message.data.side,
                    message.data.price,
                    message.data.qty,
                ];
                await db_1.pool.query(query1, values1);
                const query2 = `INSERT INTO trade_prices (price, volume , currency_code) VALUES ($1, $2, $3)`;
                const values2 = [
                    message.data.price,
                    message.data.price * message.data.qty,
                    message.data.market,
                ];
                await db_1.pool.query(query2, values2);
            }
        }
    }
}
main();
//# sourceMappingURL=index.js.map