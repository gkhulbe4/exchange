"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Engine = void 0;
const OrderBook_1 = require("./OrderBook");
const RedisManager_1 = require("./RedisManager");
class Engine {
    orderbooks = [];
    balances = new Map();
    constructor() {
        // console.log("i am in engine constructor");
        this.orderbooks.push(new OrderBook_1.OrderBook([], [], "SOL", 1, 200));
        // console.log(this.orderbooks);
        this.balances.set("1", {
            INR: { available: 100000, locked: 0 },
            SOL: { available: 500000, locked: 0 },
        });
        this.balances.set("2", {
            INR: { available: 200000, locked: 0 },
            SOL: { available: 90000, locked: 0 },
        });
        this.balances.set("3", {
            INR: { available: 300000, locked: 0 },
            SOL: { available: 50000, locked: 0 },
        });
        this.balances.set("4", {
            INR: { available: 400000, locked: 0 },
            SOL: { available: 100000, locked: 0 },
        });
        this.balances.set("5", {
            INR: { available: 500000, locked: 0 },
            SOL: { available: 100000, locked: 0 },
        });
        this.balances.set("6", {
            INR: { available: 600000, locked: 0 },
            SOL: { available: 100000, locked: 0 },
        });
    }
    getUserBalance(userId) {
        const userBalance = this.balances.get(userId);
        // console.log("user balance:", userBalance);
        RedisManager_1.RedisManager.getInstance().sendUserBalance(JSON.stringify({ userBalance: userBalance, userId: userId }));
    }
    checkBalanceAndLock(baseAsset, quoteAsset, side, price, quantity, userId) {
        // console.log("in check balance");
        const user = this.balances.get(userId);
        if (!user)
            throw new Error("User not found!");
        // quote -> inr
        // base -> sol
        if (side == "buy") {
            const userQuoteBalance = user[quoteAsset].available;
            if (userQuoteBalance < price * quantity)
                throw new Error("Insufficient funds!");
            user[quoteAsset].available -= price * quantity;
            user[quoteAsset].locked += price * quantity;
        }
        else {
            const userBaseAsset = user[baseAsset].available;
            if (userBaseAsset < quantity)
                throw new Error("Insufficient funds!");
            user[baseAsset].available -= quantity;
            user[baseAsset].locked += quantity;
        }
    }
    updateBalances(baseAsset, quoteAsset, fills, executedQuantity, side, userId) {
        console.log("In updating balance");
        if (side === "buy") {
            fills.forEach((fill) => {
                // Seller side
                const seller = this.balances.get(fill.otherUserId);
                if (!seller)
                    throw new Error("Seller not found in balances");
                if (seller[baseAsset].locked < fill.qty) {
                    throw new Error("Invalid state: locked < qty (seller)");
                }
                seller[baseAsset].locked -= fill.qty; // decrease locked tokens
                seller[quoteAsset].available += fill.qty * Number(fill.price); // increase INR
                // Buyer side
                const buyer = this.balances.get(userId);
                if (!buyer)
                    throw new Error("Buyer not found in balances");
                if (buyer[quoteAsset].locked < fill.qty * Number(fill.price)) {
                    throw new Error("Invalid state: locked INR < cost");
                }
                buyer[quoteAsset].locked -= fill.qty * Number(fill.price); // release INR
                buyer[baseAsset].available += fill.qty; // add tokens
                console.log("Buyer Base:", buyer[baseAsset].available);
                console.log("Seller Base:", seller[baseAsset].available);
                console.log("Seller Quote:", seller[quoteAsset].available);
            });
        }
        else {
            fills.forEach((fill) => {
                // Seller side
                const seller = this.balances.get(userId);
                if (!seller)
                    throw new Error("Seller not found in balances");
                if (seller[baseAsset].locked < fill.qty) {
                    throw new Error("Invalid state: locked < qty (seller)");
                }
                seller[baseAsset].locked -= fill.qty; // decrease locked tokens
                seller[quoteAsset].available += fill.qty * Number(fill.price); // increase INR
                // Buyer side
                const buyer = this.balances.get(fill.otherUserId);
                if (!buyer)
                    throw new Error("Buyer not found in balances");
                if (buyer[quoteAsset].locked < fill.qty * Number(fill.price)) {
                    throw new Error("Invalid state: locked INR < cost");
                }
                buyer[quoteAsset].locked -= fill.qty * Number(fill.price); // release INR
                buyer[baseAsset].available += fill.qty; // add tokens
                console.log("Buyer Base:", buyer[baseAsset].available);
                console.log("Seller Base:", seller[baseAsset].available);
                console.log("Seller Quote:", seller[quoteAsset].available);
            });
        }
    }
    createDbTrade(fills, market, userId, side) {
        console.log(fills);
        fills.forEach((fill) => {
            RedisManager_1.RedisManager.getInstance().sendDbCalls({
                type: "ADD_TRADE",
                data: {
                    market: market,
                    id: fill.tradeId.toString(),
                    buyer_id: side === "buy" ? userId : fill.otherUserId,
                    seller_id: side === "sell" ? userId : fill.otherUserId,
                    price: fill.price,
                    qty: fill.qty,
                    side: side,
                },
            });
        });
    }
    handleDbOrder(order, fills) {
        RedisManager_1.RedisManager.getInstance().sendDbCalls({
            type: "ADD_ORDER",
            data: { order: order, fills: fills },
        });
    }
    publishWsTrades(fills, userId, market, side, orderId) {
        console.log("Publishing TRADE");
        fills.forEach((fill) => {
            RedisManager_1.RedisManager.getInstance().publishToWs(`trades`, {
                stream: "trade",
                data: {
                    e: "trade",
                    t: fill.tradeId,
                    p: fill.price,
                    q: fill.qty,
                    m: market,
                    s: side,
                    o: orderId, // order that filled the order
                    of: fill.marketOrderId, // order that got filled
                    T: fill.time,
                },
            });
        });
    }
    publishWsOrder(order) {
        console.log("Publishing Order");
        RedisManager_1.RedisManager.getInstance().publishToWs("order", {
            stream: "order",
            data: {
                e: "order",
                f: order?.filled,
                m: order?.market,
                o: order?.orderId,
                p: order?.price,
                q: order?.quantity,
                s: order?.side,
                u: order?.userId,
            },
        });
    }
    createOrder(orderDetails) {
        // console.log("in create order for", orderDetails.userId);
        const baseAsset = orderDetails.market.split("_")[0];
        const quoteAsset = orderDetails.market.split("_")[1];
        // diff orderbooks of diff base assets like SOL, BTC with all the bids, asks and other info
        const orderbook = this.orderbooks.find((o) => {
            return o.baseAsset === baseAsset && o.quoteAsset === quoteAsset;
        });
        // console.log(orderDetails.market.split("_"));
        // SOL_INR | BTC_INR
        if (!orderbook) {
            throw new Error("OrderBook not found");
        }
        this.checkBalanceAndLock(baseAsset, quoteAsset, orderDetails.side, orderDetails.price, orderDetails.quantity, orderDetails.userId);
        const order = {
            baseAsset: baseAsset,
            quoteAsset: quoteAsset,
            side: orderDetails.side,
            price: orderDetails.price,
            quantity: orderDetails.quantity,
            userId: orderDetails.userId,
            orderId: `${Date.now()}${Math.floor(Math.random() * 1000)}`,
            filled: 0,
            market: orderDetails.market,
            time: Date.now(),
        };
        console.log("order:", order);
        const { fills, executedQuantity, remainingOrder } = orderbook.addOrder(order);
        // console.log("New order :", order)
        //updating the lock balances
        this.updateBalances(baseAsset, quoteAsset, fills, executedQuantity, order.side, order.userId);
        this.createDbTrade(fills, orderDetails.market, orderDetails.userId, orderDetails.side);
        // publishWsOrder
        // - get remaining order with all the details like filled , quantity , orderId, price and send to publishWs
        // - in frontend it will catch all the orders and show in the orderbook with colors
        // - also send order Id with the trade ws so that it can be checked in the frontend. If filled == quantity and remove the order from the array and show updated orders in the orderbook
        this.handleDbOrder(order, fills);
        this.publishWsTrades(fills, orderDetails.userId, orderDetails.market, orderDetails.side, order.orderId);
        if (remainingOrder) {
            // @ts-ignore
            this.publishWsOrder(remainingOrder);
        }
        return { executedQuantity, fills, orderId: order.orderId };
    }
    process(clientId, message) {
        // console.log("in process");
        // console.log("Client Id:", clientId);
        // console.log("User Id:", message.data.userId);
        if (message.type == "CREATE_ORDER") {
            try {
                const { executedQuantity, fills, orderId } = this.createOrder({
                    market: message.data.market,
                    price: message.data.price,
                    quantity: message.data.quantity,
                    side: message.data.side,
                    userId: message.data.userId,
                });
                console.log("IN ENGINE PROCESS (ORDER PLACED):");
                console.log({ executedQuantity, fills, orderId });
                console.log("sending to client Id:", clientId);
                // sending response back to API Server
                RedisManager_1.RedisManager.getInstance().sendToApi(clientId, {
                    type: "ORDER_PLACED",
                    data: {
                        orderId: orderId,
                        executedQuantity: executedQuantity,
                        fills: fills,
                    },
                });
            }
            catch (error) {
                console.log("ERROR CAME WHILE PLACING AN ORDER", error);
                RedisManager_1.RedisManager.getInstance().sendToApi(clientId, {
                    type: "ORDERED_CANCELLED",
                    data: {
                        orderId: "",
                        executedQuantity: 0,
                        fills: [],
                    },
                });
            }
        }
    }
    getOrders() {
        const o = this.orderbooks[0];
        RedisManager_1.RedisManager.getInstance().sendOrders(JSON.stringify({ buys: o?.bids, asks: o?.asks }));
    }
    getUserOrders(userId) {
        const o = this.orderbooks[0];
        const bids = o?.bids.filter((order) => order.userId == userId);
        const asks = o?.asks.filter((order) => order.userId == userId);
        RedisManager_1.RedisManager.getInstance().sendUserOrders(JSON.stringify({ buys: bids, asks: asks }));
    }
}
exports.Engine = Engine;
//# sourceMappingURL=Engine.js.map