"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllMarketsCurrentPrice = getAllMarketsCurrentPrice;
const db_1 = require("../db");
async function getAllMarketsCurrentPrice() {
    try {
        const query = `SELECT DISTINCT ON (market) 
                  market, 
                  price AS current_price
                  FROM trades
                  ORDER BY market, trade_time DESC;
                  `;
        const res = await db_1.pool.query(query);
        // console.log(res.rows);
        return res.rows;
    }
    catch (error) {
        console.log("Error while fetching all markets price");
        return [];
    }
}
//# sourceMappingURL=getAllMarketsCurrentPrice.js.map