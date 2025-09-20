import Redis from "ioredis";
import { Engine } from "./classes/Engine";

async function startEngine() {
  const engine = new Engine();
  const redisClient = new Redis();

  while (true) {
    const response = await redisClient.brpop("message", "user", 0);
    if (!response) continue;

    const [queue, rawData] = response;
    const data = JSON.parse(rawData);

    if (queue === "message") {
      if (data.type == "userBalance") {
        engine.getUserBalance(data.userId);
      } else if (data.type == "order") {
        engine.getOrders();
      } else if (data.type == "userOrders") {
        engine.getUserOrders(data.userId);
      } else {
        engine.process(data.clientId, data.message);
      }
    } else if (queue === "user") {
      if (data.type === "userBalance") {
        console.log("IN USER QUEUE , USER ID: ", data.userId);
        engine.getUserBalance(data.userId);
      }
    }
  }
}

startEngine();
