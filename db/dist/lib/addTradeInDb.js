"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addTradeInDb = addTradeInDb;
const db_1 = require("../db");
async function addTradeInDb(id, market, buyer_id, seller_id, side, price, qty) {
    const query1 = `
        INSERT INTO trades (id, market, buyer_id, seller_id, side, price, quantity)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `;
    const values1 = [id, market, buyer_id, seller_id, side, price, qty];
    await db_1.pool.query(query1, values1);
}
//# sourceMappingURL=addTradeInDb.js.map