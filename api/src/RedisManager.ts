import Redis from "ioredis";
import { MessageFromEngine, MessageToEngine } from "./types";

export class RedisManager {
  private static instance: RedisManager;

  private subClient: Redis;
  private pubClient: Redis;

  constructor() {
    this.subClient = new Redis();
    this.pubClient = new Redis();
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
    return new Promise(async (resolve) => {
      await this.pubClient.lpush(
        "message",
        JSON.stringify({ type: "userBalance", userId: userId })
      );
      this.subClient.subscribe("userBalance");
      this.subClient.on("message", (channel: string, message: string) => {
        // console.log(channel, message);
        if (channel == "userBalance") {
          this.subClient.unsubscribe("userBalance");
          resolve(JSON.parse(message));
        }
      });
    });
  }

  public getTrades() {
    return new Promise(async (resolve) => {
      this.subClient.subscribe("trades");
      await this.pubClient.lpush(
        "dbMessage",
        JSON.stringify({ type: "trades" })
      );
      this.subClient.on("message", (channel: string, message: string) => {
        if (channel == "trades") {
          this.subClient.unsubscribe("trades");
          resolve(JSON.parse(message));
        }
      });
    });
  }

  public getOrders() {
    return new Promise(async (resolve) => {
      await this.pubClient.lpush("message", JSON.stringify({ type: "order" }));
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

  public getTickerData() {
    return new Promise(async (resolve) => {
      this.subClient.subscribe("ticker");
      await this.pubClient.lpush(
        "dbMessage",
        JSON.stringify({ type: "ticker" })
      );
      this.subClient.on("message", (channel: string, message: string) => {
        if (channel == "ticker") {
          this.subClient.unsubscribe("ticker");
          resolve(JSON.parse(message));
        }
      });
    });
  }

  public getKlineData(timeFrame: string) {
    return new Promise(async (resolve) => {
      this.subClient.subscribe("kline");
      await this.pubClient.lpush(
        "dbMessage",
        JSON.stringify({ type: "kline", timeFrame: timeFrame })
      );
      this.subClient.on("message", (channel: string, message: string) => {
        if (channel == "kline") {
          this.subClient.unsubscribe("kline");
          resolve(JSON.parse(message));
        }
      });
    });
  }

  public getUserOrders(userId: string) {
    return new Promise(async (resolve) => {
      this.subClient.subscribe("userOrders");
      await this.pubClient.lpush(
        "message",
        JSON.stringify({ type: "userOrders", userId: userId })
      );
      this.subClient.on("message", (channel: string, message: string) => {
        if (channel == "userOrders") {
          this.subClient.unsubscribe("userOrders");
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
