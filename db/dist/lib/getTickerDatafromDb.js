"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTickerDataFromDb = getTickerDataFromDb;
const db_1 = require("../db");
async function getTickerDataFromDb(market) {
    const query = `
    SELECT 
      MAX(price) AS max_price,
      MIN(price) AS min_price,
      SUM(volume) AS volume,
      (
        SELECT price 
        FROM trades 
        WHERE trade_time >= NOW() - INTERVAL '24 hours'
          AND market = $1
        ORDER BY trade_time DESC 
        LIMIT 1
      ) AS last_trade_price
    FROM trades
    WHERE trade_time >= NOW() - INTERVAL '24 hours'
      AND market = $1
  `;
    const values = [market];
    const res = await db_1.pool.query(query, values);
    return res.rows[0];
}
//# sourceMappingURL=getTickerDatafromDb.js.map