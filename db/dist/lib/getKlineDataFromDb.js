"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getKlineDataFromDb = getKlineDataFromDb;
const db_1 = require("../db");
async function getKlineDataFromDb(timeFrame) {
    const query = `SELECT * FROM klines_${timeFrame} WHERE market = 'SOL_INR' ORDER BY bucket ASC`;
    const res = await db_1.pool.query(query);
    return res.rows;
}
//# sourceMappingURL=getKlineDataFromDb.js.map