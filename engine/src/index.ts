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

    switch (queue) {
      case "message":
        switch (data.type) {
          case "userBalance":
            engine.getUserBalance(data.userId);
            break;

          case "order":
            engine.getOrders(data.market);
            break;

          case "userOrders":
            engine.getUserOrders(data.userId, data.market);
            break;

          default:
            engine.process(data.clientId, data.message);
        }
        break;

      case "user":
        switch (data.type) {
          case "userBalance":
            console.log("IN USER QUEUE , USER ID: ", data.userId);
            engine.getUserBalance(data.userId);
            break;

          default:
            console.warn(`Unhandled message in 'user' queue: ${data.type}`);
        }
        break;

      default:
        console.warn(`Unhandled queue: ${queue}`);
    }
  }
}

startEngine();
