import Redis from "ioredis";
import { initialiseViews } from "./initialiseViews";
import { pool } from "./db";

export async function main() {
  await initialiseViews();
  const redisClient = new Redis();
  // console.log("In DB:");

  while (true) {
    const res = await redisClient.rpop("dbMessage");
    if (res) {
      const message = JSON.parse(res);
      // console.log("Message in DB:", message);
      if (message.type == "ADD_TRADE") {
        const query1 = `
        INSERT INTO trades (id, market, buyer_id, seller_id, side, price, quantity)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `;
        const values1 = [
          message.data.id,
          message.data.market,
          message.data.buyer_id,
          message.data.seller_id,
          message.data.side,
          message.data.price,
          message.data.qty,
        ];
        await pool.query(query1, values1);

        const query2 = `INSERT INTO trade_prices (price, volume , currency_code) VALUES ($1, $2, $3)`;
        const values2 = [
          message.data.price,
          message.data.price * message.data.qty,
          message.data.market,
        ];

        await pool.query(query2, values2);
      }
    }
  }
}

main();
