import Redis from "ioredis";
import { initialiseViews } from "./initialiseViews";
import { pool } from "./db";
import { getTradesFromDb } from "./lib/getTradesFromDb";
import { addTradeInDb } from "./lib/addTradeInDb";
import { getTickerDataFromDb } from "./lib/getTickerDatafromDb";
import { getKlineDataFromDb } from "./lib/getKlineDataFromDb";
import { handleOrderInDb } from "./lib/handleOrderInDb";
import { getUserOrdersFromDb } from "./lib/getUserOrdersFromDb";
import { cancelOrderInDb } from "./lib/cancelOrderInDb";
import { getAllMarketsCurrentPrice } from "./lib/getAllMarketsCurrentPrice";

export async function main() {
  await initialiseViews();
  const redisClient = new Redis();

  while (true) {
    const res = await redisClient.rpop("dbMessage");
    if (!res) continue;

    const message = JSON.parse(res);

    switch (message.type) {
      case "ADD_TRADE":
        await addTradeInDb(
          message.data.id,
          message.data.market,
          message.data.buyer_id,
          message.data.seller_id,
          message.data.side,
          message.data.price,
          message.data.qty
        );
        break;

      case "ADD_ORDER":
        // console.log(message);
        await handleOrderInDb(message?.data?.order, message?.data?.fills);
        break;

      case "CANCEL_ORDER":
        console.log("Cancelling order: ", message?.data);
        cancelOrderInDb(message?.data?.orderId);
        break;

      case "trades": {
        const data = await getTradesFromDb(message.market);
        redisClient.publish("trades", JSON.stringify(data));
        break;
      }

      case "ticker": {
        const data = await getTickerDataFromDb(message.market);
        redisClient.publish("ticker", JSON.stringify(data));
        break;
      }

      case "kline": {
        const data = await getKlineDataFromDb(
          message.timeFrame,
          message.market
        );
        redisClient.publish("kline", JSON.stringify(data));
        break;
      }

      case "userOrdersFromDb": {
        const data = await getUserOrdersFromDb(message.userId);
        redisClient.publish("userOrdersFromDb", JSON.stringify(data));
        break;
      }

      case "allMarketsCurrentPrice": {
        const data = await getAllMarketsCurrentPrice();
        redisClient.publish("allMarketsCurrentPrice", JSON.stringify(data));
        break;
      }

      default:
        console.warn(`Unhandled message type: ${message.type}`);
    }
  }
}

main();
