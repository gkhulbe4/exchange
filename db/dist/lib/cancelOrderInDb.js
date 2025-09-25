"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelOrderInDb = cancelOrderInDb;
const db_1 = require("../db");
async function cancelOrderInDb(orderId) {
    if (!orderId) {
        console.log("Order ID not found");
        return;
    }
    try {
        const query = `UPDATE orders SET status = $1 WHERE id = $2;`;
        const values = ["Cancelled", orderId];
        await db_1.pool.query(query, values);
    }
    catch (error) {
        console.log("Error while cancelling order in DB", error);
    }
}
//# sourceMappingURL=cancelOrderInDb.js.map