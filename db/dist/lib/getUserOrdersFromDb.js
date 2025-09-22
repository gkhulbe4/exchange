"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserOrdersFromDb = getUserOrdersFromDb;
const db_1 = require("../db");
async function getUserOrdersFromDb(userId) {
    try {
        const query = `SELECT * FROM orders WHERE user_id = '${userId}' ORDER BY order_time DESC;`;
        const res = await db_1.pool.query(query);
        return res.rows;
    }
    catch (error) {
        console.log("Error while fetching user's orders from DB", error);
    }
}
//# sourceMappingURL=getUserOrdersFromDb.js.map