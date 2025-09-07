import Redis from "ioredis";

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
}
