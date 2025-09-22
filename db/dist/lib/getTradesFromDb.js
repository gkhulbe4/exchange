"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTradesFromDb = getTradesFromDb;
const db_1 = require("../db");
async function getTradesFromDb(market) {
    const query = `
  SELECT price, quantity, trade_time, side
  FROM trades
  WHERE market = $1
  ORDER BY trade_time DESC
  LIMIT 50;
`;
    const values = [market];
    const data = await db_1.pool.query(query, values);
    //   console.log(data.rows);
    return data.rows;
}
//# sourceMappingURL=getTradesFromDb.js.map