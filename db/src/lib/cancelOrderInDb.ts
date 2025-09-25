import { pool } from "../db";

export async function cancelOrderInDb(orderId: string) {
  if (!orderId) {
    console.log("Order ID not found");
    return;
  }
  try {
    const query = `UPDATE orders SET status = $1 WHERE id = $2;`;
    const values = ["Cancelled", orderId];
    await pool.query(query, values);
  } catch (error) {
    console.log("Error while cancelling order in DB", error);
  }
}
