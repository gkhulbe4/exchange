import Redis from "ioredis";
import { Engine } from "./classes/Engine";

async function startEngine() {
  const engine = new Engine();
  const redisClient = new Redis();
  while (true) {
    const response = await redisClient.rpop("messages" as string);
    if (!response) {
    } else {
      engine.process(JSON.parse(response));
    }
  }
}

startEngine();
