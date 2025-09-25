import { pool } from "../db";

export async function getAllMarketsCurrentPrice() {
  try {
    const query = `SELECT DISTINCT ON (market)
                market,
                price AS current_price,
                FROM trades
                ORDER BY market, trade_time DESC;
                `;

    const res = await pool.query(query);
    // console.log(res.rows);
    return res.rows;
  } catch (error) {
    console.log("Error while fetching all markets price");
  }
}
