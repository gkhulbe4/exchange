"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTradesFromDb = getTradesFromDb;
const db_1 = require("../db");
async function getTradesFromDb() {
    const query = `SELECT price, quantity, trade_time, side FROM trades ORDER BY trade_time DESC LIMIT 50;`;
    const data = await db_1.pool.query(query);
    //   console.log(data.rows);
    return data.rows;
}
//# sourceMappingURL=getTradesFromDb.js.map