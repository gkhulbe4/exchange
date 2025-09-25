"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderBook = void 0;
class OrderBook {
    bids;
    asks;
    baseAsset;
    quoteAsset = "USD";
    lastTradeId;
    currentPrice;
    constructor(bids, asks, baseAsset, lastTradeId, currentPrice) {
        this.bids = bids;
        this.asks = asks;
        this.baseAsset = baseAsset;
        this.lastTradeId = lastTradeId || 0;
        this.currentPrice = currentPrice || 0;
    }
    sortBids() {
        this.bids.sort((a, b) => b.price - a.price); // show highest bids first
    }
    sortAsks() {
        this.asks.sort((a, b) => a.price - b.price); // show lowest asks first
    }
    getOrderBook() {
        console.log(`OrderBook: ${this.baseAsset}_${this.quoteAsset}`);
        console.log("Bids: ", this.bids);
        console.log("Asks: ", this.asks);
    }
    addOrder(order) {
        let remainingOrder = null;
        const { executedQuantity, fills } = order.side === "buy"
            ? this.matchBid(order.price, order.quantity, order.userId)
            : this.matchAsk(order.price, order.quantity, order.userId);
        order.filled = executedQuantity;
        if (executedQuantity < order.quantity) {
            remainingOrder = { ...order }; // not fully executed
            // console.log("FILLS ARRAY ------> ", fills);
            if (order.side === "buy") {
                this.bids.push(remainingOrder);
                this.sortBids();
            }
            else {
                this.asks.push(remainingOrder);
                this.sortAsks();
            }
            console.log("Order added to book:", remainingOrder);
        }
        else {
            console.log("Fully executed order, not added to book.");
        }
        return { executedQuantity, fills, remainingOrder };
    }
    matchBid(price, quantity, userId) {
        let executedQuantity = 0;
        let fills = [];
        console.log("in match bid");
        for (const ask of this.asks) {
            const remainingAsk = ask.quantity - ask.filled;
            // console.log("Ask price: ", ask.price);
            // console.log("Bid price: ", price);
            // console.log("Remaining: ", remainingAsk);
            // console.log("Bid Quantity: ", quantity);
            if (ask.price <= price &&
                executedQuantity < quantity &&
                remainingAsk > 0 &&
                ask.userId !== userId) {
                const filled = Math.min(quantity - executedQuantity, remainingAsk);
                executedQuantity += filled;
                ask.filled += filled;
                console.log("filled this much:", filled);
                fills.push({
                    price: ask.price.toString(),
                    qty: filled,
                    tradeId: this.lastTradeId++,
                    otherUserId: ask.userId,
                    marketOrderId: ask.orderId,
                    time: Date.now(),
                });
                console.log(`Matched BUY ${filled} @ ${ask.price}`);
            }
        }
        this.asks = this.asks.filter((ask) => ask.filled < ask.quantity);
        return { fills, executedQuantity };
    }
    matchAsk(price, quantity, userId) {
        let executedQuantity = 0;
        let fills = [];
        for (const bid of this.bids) {
            const remainingBid = bid.quantity - bid.filled;
            if (bid.price >= price &&
                executedQuantity < quantity &&
                remainingBid > 0 &&
                bid.userId !== userId) {
                const filled = Math.min(quantity - executedQuantity, remainingBid);
                executedQuantity += filled;
                bid.filled += filled;
                fills.push({
                    price: bid.price.toString(),
                    qty: filled,
                    tradeId: this.lastTradeId++,
                    otherUserId: bid.userId,
                    marketOrderId: bid.orderId,
                    time: Date.now(),
                });
                console.log(`Matched SELL ${filled} @ ${bid.price}`);
            }
        }
        this.bids = this.bids.filter((bid) => bid.filled < bid.quantity);
        return { fills, executedQuantity };
    }
}
exports.OrderBook = OrderBook;
//# sourceMappingURL=OrderBook.js.map