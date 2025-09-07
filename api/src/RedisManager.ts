import Redis from "ioredis";
import { MessageToEngine } from "./types";

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
    return new Promise((resolve) => {
      const id = this.getRandomClientId();
      this.subClient.subscribe(id);
      this.subClient.on("message", (messageFromPublisher) => {
        resolve(JSON.parse(messageFromPublisher));
      });
      this.pubClient.lpush(
        "message",
        JSON.stringify({ message: message, clientId: id })
      );
    });
  }

  public getRandomClientId() {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }
}
