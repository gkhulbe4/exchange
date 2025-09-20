import { pool } from "../db";
import { Fill, FinalOrder } from "../types";

export async function handleOrderInDb(order: FinalOrder, fills: Fill[]) {
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

  const createOrderStatus =
    order.quantity === order.filled
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

  const orderCreated = await pool.query(createOrderQuery, createOrderValues);
  console.log("CREATED ORDER:", orderCreated.rows[0]);

  // check fills order in the table
  for (const fill of fills) {
    const findFillOrderQuery = `
      SELECT *
      FROM orders
      WHERE id = $1
    `;

    const result = await pool.query(findFillOrderQuery, [fill.marketOrderId]);
    const fillOrder = result.rows[0];

    if (!fillOrder) {
      console.log("FILL ORDER NOT FOUND:", fill.marketOrderId);
      continue;
    }

    // update filled quantity
    const newFilled = Number(fillOrder.filled) + Number(fill.qty);
    await pool.query(`UPDATE orders SET filled = $1 WHERE id = $2`, [
      newFilled,
      fillOrder.id,
    ]);

    // if filled == quantity, update the status to Filled else Partial
    if (newFilled >= Number(fillOrder.quantity)) {
      await pool.query(
        `UPDATE orders 
         SET status = 'Filled' 
         WHERE id = $1`,
        [fillOrder.id]
      );
    } else {
      await pool.query(
        `UPDATE orders 
         SET status = 'Partial' 
         WHERE id = $1`,
        [fillOrder.id]
      );
    }
  }
}
