"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getKlineDataFromDb = getKlineDataFromDb;
const db_1 = require("../db");
const allowedTimeFrames = ["1m", "15m", "30m", "1h", "1d"];
async function getKlineDataFromDb(timeFrame, market) {
    if (!allowedTimeFrames.includes(timeFrame)) {
        throw new Error("Invalid time frame");
    }
    const query = `
    SELECT * 
    FROM klines_${timeFrame} 
    WHERE market = $1
    ORDER BY bucket ASC
  `;
    const values = [market];
    const res = await db_1.pool.query(query, values);
    return res.rows;
}
//# sourceMappingURL=getKlineDataFromDb.js.map