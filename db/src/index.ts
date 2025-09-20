import Redis from "ioredis";
import { initialiseViews } from "./initialiseViews";
import { pool } from "./db";
import { getTradesFromDb } from "./lib/getTradesFromDb";
import { addTradeInDb } from "./lib/addTradeInDb";
import { getTickerDataFromDb } from "./lib/getTickerDatafromDb";
import { getKlineDataFromDb } from "./lib/getKlineDataFromDb";
import { handleOrderInDb } from "./lib/handleOrderInDb";

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
        await addTradeInDb(
          message.data.id,
          message.data.market,
          message.data.buyer_id,
          message.data.seller_id,
          message.data.side,
          message.data.price,
          message.data.qty
        );
      } else if ((message.type = "ADD_ORDER")) {
        console.log(message);
        await handleOrderInDb(message.data.order, message.data.fills);
      } else if (message.type == "trades") {
        const data = await getTradesFromDb();
        redisClient.publish("trades", JSON.stringify(data));
      } else if (message.type == "ticker") {
        const data = await getTickerDataFromDb();
        redisClient.publish("ticker", JSON.stringify(data));
      } else if (message.type == "kline") {
        const data = await getKlineDataFromDb(message.timeFrame);
        redisClient.publish("kline", JSON.stringify(data));
      }
    }
  }
}

main();
