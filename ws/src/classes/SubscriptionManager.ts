import Redis from "ioredis";
import { UserManager } from "./UserManager";

export class SubscriptionManager {
  private static instance: SubscriptionManager;
  private subscriptions: Map<string, string[]> = new Map<string, string[]>();
  private reverseSubscriptions: Map<string, string[]> = new Map<
    string,
    string[]
  >();
  private redisClient: Redis;
  private constructor() {
    this.redisClient = new Redis();

    this.redisClient.on("message", this.startRedisListener.bind(this));
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new SubscriptionManager();
    }
    return this.instance;
  }

  subscribe(userId: string, subscription: string, market: string) {
    // trade.SOL_USD or order.SOL_USD
    const sub = `${subscription}.${market}`;
    // if user doesnt exist then make an array of subs for him
    if (!this.subscriptions.has(userId)) {
      this.subscriptions.set(userId, []);
    }

    const userSubscriptions = this.subscriptions.get(userId);
    if (userSubscriptions?.includes(sub)) {
      return;
    }

    // pushing sub to user's array
    userSubscriptions?.push(sub);

    // check if sub exists , if not , make it
    if (!this.reverseSubscriptions.has(sub)) {
      this.reverseSubscriptions.set(sub, []);
    }
    this.reverseSubscriptions.get(sub)!.push(userId);

    if (this.reverseSubscriptions.get(sub)?.length == 1) {
      this.redisClient.subscribe(sub);
    }

    console.log("User subscribed to channel :", sub);
  }

  unsubscribe(userId: string, subscription: string, market: string) {
    // trade.SOL_USD or order.SOL_USD
    const channelToUnsub = `${subscription}.${market}`;

    const userSubscriptions = this.subscriptions.get(userId);
    if (!userSubscriptions?.includes(channelToUnsub)) {
      return;
    }

    // setting updated subs of user after removing
    const newSubs = userSubscriptions.filter((sub) => sub != channelToUnsub);
    this.subscriptions.set(userId, newSubs);

    // removing the user from the subs list
    const allUserSubs = this.reverseSubscriptions.get(channelToUnsub);
    const newUsers = allUserSubs?.filter((user) => user != userId);

    this.reverseSubscriptions.set(channelToUnsub, newUsers || []);

    if (this.reverseSubscriptions.get(channelToUnsub)?.length == 0) {
      this.redisClient.unsubscribe(channelToUnsub);
    }
    console.log("User unsubscribed to channel :", channelToUnsub);
  }

  startRedisListener(channel: string, message: string) {
    const allUsers = this.reverseSubscriptions.get(channel);
    // console.log(allUsers);
    // console.log(`message from ${channel}: ${JSON.parse(message)}`);
    allUsers?.map((userId: string) => {
      UserManager.getInstance().getUser(userId)?.send(message);
    });
  }
}

/* 
user came
sub to trades channel through his ws 
sent trades to his ws
*/
