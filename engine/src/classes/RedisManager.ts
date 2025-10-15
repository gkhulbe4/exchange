import Redis from "ioredis";
import { DBMessage, PublishToWS } from "../types";

export class RedisManager {
  private static instance: RedisManager;

  public subClient: Redis;
  public pubClient: Redis;

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

  async sendDbCalls(message: DBMessage) {
    await this.pubClient.lpush("dbMessage", JSON.stringify(message));
  }

  async publishToWs(channel: string, data: PublishToWS) {
    console.log(`Publishing to ${channel}`);
    this.pubClient.publish(channel, JSON.stringify(data));
  }

  async sendToApi(clientId: string, message: DBMessage) {
    console.log("publishing to:", clientId);
    this.pubClient.publish(clientId, JSON.stringify(message));
  }

  async sendUserBalance(userBalanceData: string) {
    console.log(userBalanceData);
    const data = JSON.parse(userBalanceData);
    console.log(data);
    console.log(`Publishing to userBalance:${data.userId}`);
    this.pubClient.publish(
      `userBalance:${data.userId}`,
      JSON.stringify(data.userBalance)
    );
  }

  async sendOrders(order: string) {
    this.pubClient.publish("order", order);
  }

  async sendUserOrders(orders: string) {
    this.pubClient.publish("userOrders", orders);
  }
}
