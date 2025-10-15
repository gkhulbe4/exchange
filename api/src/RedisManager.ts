import Redis from "ioredis";
import { MessageFromEngine, MessageToEngine } from "./types";
import "dotenv/config";

export class RedisManager {
  private static instance: RedisManager;

  private subClient: Redis;
  private pubClient: Redis;

  constructor() {
    const redisUrl = process.env.REDIS_URL as string;
    this.subClient = new Redis(redisUrl);
    this.pubClient = new Redis(redisUrl);
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new RedisManager();
    }
    return this.instance;
  }

  public async sendAndAwait(message: MessageToEngine) {
    return new Promise<MessageFromEngine>(async (resolve, reject) => {
      const clientId = this.getRandomClientId();
      this.subClient.subscribe(clientId);
      console.log("in sendAndAwait , sending clientId: ", clientId);
      this.subClient.on("message", (channel, message) => {
        if (channel != clientId) reject();
        this.subClient.unsubscribe(clientId);
        resolve(JSON.parse(message));
        // console.log("Order promise done");
        // console.log(message);
      });
      await this.pubClient.lpush(
        "message",
        JSON.stringify({ message: message, clientId: clientId })
      );
    });
  }

  public async getUserBalance(userId: string) {
    // console.log("pushing to userBalance");
    return new Promise(async (resolve, reject) => {
      await this.pubClient.lpush(
        "user",
        JSON.stringify({ type: "userBalance", userId: userId })
      );
      console.log(`Subscribing to userBalance:${userId}`);
      this.subClient.subscribe(`userBalance:${userId}`);
      this.subClient.on("message", (channel: string, message: string) => {
        // console.log(channel, message);
        if (channel == `userBalance:${userId}`) {
          this.subClient.unsubscribe(`userBalance:${userId}`);
          if (message) {
            resolve(JSON.parse(message));
          } else {
            reject();
          }
        }
      });
    });
  }

  public getTrades(market: string) {
    return new Promise(async (resolve) => {
      this.subClient.subscribe("trades");
      await this.pubClient.lpush(
        "dbMessage",
        JSON.stringify({ type: "trades", market: market })
      );
      this.subClient.on("message", (channel: string, message: string) => {
        if (channel == "trades") {
          this.subClient.unsubscribe("trades");
          resolve(JSON.parse(message));
        }
      });
    });
  }

  public getOrders(market: string) {
    return new Promise(async (resolve) => {
      await this.pubClient.lpush(
        "message",
        JSON.stringify({ type: "order", market: market })
      );
      this.subClient.subscribe("order");
      this.subClient.on("message", (channel: string, message: string) => {
        // console.log(channel, message);
        if (channel == "order") {
          this.subClient.unsubscribe("order");
          resolve(JSON.parse(message));
        }
      });
    });
  }

  public getTickerData(market: string) {
    return new Promise(async (resolve) => {
      this.subClient.subscribe("ticker");
      await this.pubClient.lpush(
        "dbMessage",
        JSON.stringify({ type: "ticker", market: market })
      );
      this.subClient.on("message", (channel: string, message: string) => {
        if (channel == "ticker") {
          this.subClient.unsubscribe("ticker");
          resolve(JSON.parse(message));
        }
      });
    });
  }

  public getKlineData(timeFrame: string, market: string) {
    return new Promise(async (resolve) => {
      this.subClient.subscribe("kline");
      await this.pubClient.lpush(
        "dbMessage",
        JSON.stringify({ type: "kline", timeFrame: timeFrame, market: market })
      );
      this.subClient.on("message", (channel: string, message: string) => {
        if (channel == "kline") {
          this.subClient.unsubscribe("kline");
          resolve(JSON.parse(message));
        }
      });
    });
  }

  public getUserOrders(userId: string, market: string) {
    return new Promise(async (resolve) => {
      this.subClient.subscribe("userOrders");
      await this.pubClient.lpush(
        "message",
        JSON.stringify({ type: "userOrders", userId: userId, market: market })
      );
      this.subClient.on("message", (channel: string, message: string) => {
        if (channel == "userOrders") {
          this.subClient.unsubscribe("userOrders");
          resolve(JSON.parse(message));
        }
      });
    });
  }

  public getUserOrdersFromDb(userId: string) {
    return new Promise(async (resolve) => {
      this.subClient.subscribe("userOrdersFromDb");
      await this.pubClient.lpush(
        "dbMessage",
        JSON.stringify({ type: "userOrdersFromDb", userId: userId })
      );
      this.subClient.on("message", (channel: string, message: string) => {
        if (channel == "userOrdersFromDb") {
          this.subClient.unsubscribe("userOrdersFromDb");
          resolve(JSON.parse(message));
        }
      });
    });
  }

  public getAllMarketsCurrentPrice() {
    return new Promise(async (resolve) => {
      this.subClient.subscribe("allMarketsCurrentPrice");
      await this.pubClient.lpush(
        "dbMessage",
        JSON.stringify({ type: "allMarketsCurrentPrice" })
      );
      this.subClient.on("message", (channel: string, message: string) => {
        if (channel == "allMarketsCurrentPrice") {
          this.subClient.unsubscribe("allMarketsCurrentPrice");
          resolve(JSON.parse(message));
        }
      });
    });
  }

  public getRandomClientId() {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }
}
