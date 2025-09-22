import { pool } from "../db";

export async function getUserOrdersFromDb(userId: string) {
  try {
    const query = `SELECT * FROM orders WHERE user_id = '${userId}' ORDER BY order_time DESC;`;
    const res = await pool.query(query);
    return res.rows;
  } catch (error) {
    console.log("Error while fetching user's orders from DB", error);
  }
}
