import { pool } from "../db";

export async function addTradeInDb(
  id: string,
  market: string,
  buyer_id: string,
  seller_id: string,
  side: string,
  price: string,
  qty: number
) {
  const query1 = `
        INSERT INTO trades (id, market, buyer_id, seller_id, side, price, quantity)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `;
  const values1 = [id, market, buyer_id, seller_id, side, price, qty];
  await pool.query(query1, values1);
}
