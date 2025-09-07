import Redis from "ioredis";
import { initialiseViews } from "./initialiseViews";

export async function main() {
  await initialiseViews();
  const redisClient = new Redis();
}
