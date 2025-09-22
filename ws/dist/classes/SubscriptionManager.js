"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionManager = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const UserManager_1 = require("./UserManager");
class SubscriptionManager {
    static instance;
    subscriptions = new Map();
    reverseSubscriptions = new Map();
    redisClient;
    constructor() {
        this.redisClient = new ioredis_1.default();
        this.redisClient.on("message", this.startRedisListener.bind(this));
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new SubscriptionManager();
        }
        return this.instance;
    }
    subscribe(userId, subscription, market) {
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
        this.reverseSubscriptions.get(sub).push(userId);
        if (this.reverseSubscriptions.get(sub)?.length == 1) {
            this.redisClient.subscribe(sub);
        }
        console.log("User subscribed to channel :", sub);
    }
    unsubscribe(userId, subscription, market) {
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
    startRedisListener(channel, message) {
        const allUsers = this.reverseSubscriptions.get(channel);
        // console.log(allUsers);
        // console.log(`message from ${channel}: ${JSON.parse(message)}`);
        allUsers?.map((userId) => {
            UserManager_1.UserManager.getInstance().getUser(userId)?.send(message);
        });
    }
}
exports.SubscriptionManager = SubscriptionManager;
/*
user came
sub to trades channel through his ws
sent trades to his ws
*/
//# sourceMappingURL=SubscriptionManager.js.map