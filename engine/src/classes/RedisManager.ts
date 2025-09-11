import Redis from "ioredis";
import { DBMessage, PublishToWS } from "../types";

export class RedisManager {
  private static instance: RedisManager;

  public subClient: Redis;
  public pubClient: Redis;

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
}
