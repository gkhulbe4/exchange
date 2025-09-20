"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleOrderInDb = handleOrderInDb;
const db_1 = require("../db");
async function handleOrderInDb(order, fills) {
    // create order
    const createOrderQuery = `
    INSERT INTO orders (
      id,
      user_id,
      side,
      price,
      quantity,
      filled,
      market,
      status,
      order_time
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8 , $9
    )
    RETURNING *
  `;
    const createOrderStatus = order.quantity === order.filled
        ? "Filled"
        : order.filled === 0
            ? "Open"
            : "Partial";
    const createOrderValues = [
        order.orderId,
        order.userId,
        order.side,
        order.price,
        order.quantity,
        order.filled,
        order.market,
        createOrderStatus,
        new Date(order.time),
    ];
    const orderCreated = await db_1.pool.query(createOrderQuery, createOrderValues);
    console.log("CREATED ORDER:", orderCreated.rows[0]);
    // check fills order in the table
    for (const fill of fills) {
        const findFillOrderQuery = `
      SELECT *
      FROM orders
      WHERE id = $1
    `;
        const result = await db_1.pool.query(findFillOrderQuery, [fill.marketOrderId]);
        const fillOrder = result.rows[0];
        if (!fillOrder) {
            console.log("FILL ORDER NOT FOUND:", fill.marketOrderId);
            continue;
        }
        // update filled quantity
        const newFilled = Number(fillOrder.filled) + Number(fill.qty);
        await db_1.pool.query(`UPDATE orders SET filled = $1 WHERE id = $2`, [
            newFilled,
            fillOrder.id,
        ]);
        // if filled == quantity, update the status to Filled else Partial
        if (newFilled >= Number(fillOrder.quantity)) {
            await db_1.pool.query(`UPDATE orders 
         SET status = 'Filled' 
         WHERE id = $1`, [fillOrder.id]);
        }
        else {
            await db_1.pool.query(`UPDATE orders 
         SET status = 'Partial' 
         WHERE id = $1`, [fillOrder.id]);
        }
    }
}
//# sourceMappingURL=handleOrderInDb.js.map