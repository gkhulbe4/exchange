import { pool } from "../db";

export async function getKlineDataFromDb(timeFrame: string) {
  const query = `SELECT * FROM klines_${timeFrame} WHERE market = 'SOL_INR' ORDER BY bucket ASC`;
  const res = await pool.query(query);
  return res.rows;
}
