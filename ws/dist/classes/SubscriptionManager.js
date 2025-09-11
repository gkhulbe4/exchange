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
    subscribe(userId, subscription) {
        // if user doesnt exist then make an array of subs for him
        if (!this.subscriptions.has(userId)) {
            this.subscriptions.set(userId, []);
        }
        const userSubscriptions = this.subscriptions.get(userId);
        if (userSubscriptions?.includes(subscription)) {
            return;
        }
        userSubscriptions?.push(subscription);
        // check if sub exists , if not , make it
        if (!this.reverseSubscriptions.has(subscription)) {
            this.reverseSubscriptions.set(subscription, []);
        }
        this.reverseSubscriptions.get(subscription).push(userId);
        if (this.reverseSubscriptions.get(subscription)?.length == 1) {
            this.redisClient.subscribe(subscription);
        }
        console.log("User subscribed to channel :", subscription);
    }
    unsubscribe(userId, subscription) {
        const userSubscriptions = this.subscriptions.get(userId);
        if (!userSubscriptions?.includes(subscription)) {
            return;
        }
        // setting updated subs of user after removing
        const newSubs = userSubscriptions.filter((sub) => sub != subscription);
        this.subscriptions.set(userId, newSubs);
        // removing the user from the subs list
        const allUserSubs = this.reverseSubscriptions.get(subscription);
        const newUsers = allUserSubs?.filter((user) => user != userId);
        this.reverseSubscriptions.set(subscription, newUsers || []);
        if (this.reverseSubscriptions.get(subscription)?.length == 0) {
            this.redisClient.unsubscribe(subscription);
        }
        console.log("User unsubscribed to channel :", subscription);
    }
    startRedisListener(channel, message) {
        const allUsers = this.reverseSubscriptions.get(channel);
        console.log(`message from ${channel}: ${JSON.parse(message)}`);
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