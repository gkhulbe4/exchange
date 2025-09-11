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

  public getRandomClientId() {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }
}
