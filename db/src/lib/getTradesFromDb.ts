import { pool } from "../db";

export async function getTradesFromDb() {
  const query = `SELECT price, quantity, trade_time, side FROM trades ORDER BY trade_time DESC LIMIT 50;`;
  const data = await pool.query(query);
  //   console.log(data.rows);
  return data.rows;
}
