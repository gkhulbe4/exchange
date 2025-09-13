import Redis from "ioredis";
import { Engine } from "./classes/Engine";

async function startEngine() {
  const engine = new Engine();
  const redisClient = new Redis();
  while (true) {
    const response = await redisClient.rpop("message" as string);
    const data = JSON.parse(response as string);
    if (!response) {
    } else {
      // console.log(response, "in startEngine");
      // console.log(data);
      if (data.type == "userBalance") {
        engine.getUserBalance(data.userId);
      } else {
        engine.process(data.clientId, data.message);
        //client id for communicating to that order
      }
    }
  }
}

startEngine();
