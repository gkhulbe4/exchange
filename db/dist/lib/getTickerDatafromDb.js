"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTickerDataFromDb = getTickerDataFromDb;
const db_1 = require("../db");
async function getTickerDataFromDb() {
    const query = `SELECT 
    MAX(price) AS max_price,
    MIN(price) AS min_price,
    SUM(volume) AS volume,
    (SELECT price 
     FROM trades 
     WHERE trade_time >= NOW() - INTERVAL '24 hours'
     ORDER BY trade_time DESC 
     LIMIT 1) AS last_trade_price
FROM trades
WHERE trade_time >= NOW() - INTERVAL '24 hours'`;
    const res = await db_1.pool.query(query);
    return res.rows[0];
}
//# sourceMappingURL=getTickerDatafromDb.js.map