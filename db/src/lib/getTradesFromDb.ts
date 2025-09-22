import { pool } from "../db";

export async function getTradesFromDb(market: string) {
  const query = `
  SELECT price, quantity, trade_time, side
  FROM trades
  WHERE market = $1
  ORDER BY trade_time DESC
  LIMIT 50;
`;
  const values = [market];
  const data = await pool.query(query, values);
  //   console.log(data.rows);
  return data.rows;
}
