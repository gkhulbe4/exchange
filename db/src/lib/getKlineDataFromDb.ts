import { pool } from "../db";

const allowedTimeFrames = ["1m", "15m", "30m", "1h", "1d"];

export async function getKlineDataFromDb(timeFrame: string, market: string) {
  if (!allowedTimeFrames.includes(timeFrame)) {
    throw new Error("Invalid time frame");
  }

  const query = `
    SELECT * 
    FROM klines_${timeFrame} 
    WHERE market = $1
    ORDER BY bucket ASC
  `;
  const values = [market];
  const res = await pool.query(query, values);
  return res.rows;
}
