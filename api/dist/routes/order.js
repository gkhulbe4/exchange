"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderRouter = void 0;
const express_1 = require("express");
const RedisManager_1 = require("../RedisManager");
exports.orderRouter = (0, express_1.Router)();
exports.orderRouter.post("/", async (req, res) => {
    const { market, price, quantity, side, userId } = req.body;
    if (price == 0) {
        res.status(404).json({ message: "Price cannot be zero" });
    }
    if (quantity == 0) {
        res.status(404).json({ message: "Quantity cannot be zero" });
    }
    try {
        const response = await RedisManager_1.RedisManager.getInstance().sendAndAwait({
            type: "CREATE_ORDER",
            data: {
                market, // sol_inr
                price,
                quantity,
                side,
                userId,
            },
        });
        console.log("-------------------------------------------");
        //@ts-ignore
        console.log("Order Id: ", response.data.orderId);
        //@ts-ignore
        console.log("Executed: ", response.data.executedQuantity);
        //@ts-ignore
        console.log("Fills: ", response.data.fills);
        console.log("-------------------------------------------");
        res.status(200).json({ response: response });
    }
    catch (error) {
        res.status(500).json({ message: "Error while ordering", error });
    }
});
exports.orderRouter.post("/cancelOrder", async (req, res) => {
    const { orderId, market, userId, side } = req.body;
    if (!orderId) {
        res.status(404).json({ message: "Order ID is missing" });
    }
    if (!market) {
        res.status(404).json({ message: "Market is missing" });
    }
    if (!userId) {
        res.status(404).json({ message: "User ID is missing" });
    }
    if (!side) {
        res.status(404).json({ message: "Side is missing" });
    }
    try {
        const response = await RedisManager_1.RedisManager.getInstance().sendAndAwait({
            type: "CANCEL_ORDER",
            data: {
                market: market,
                orderId: orderId,
                side: side,
                userId: userId,
            },
        });
        res
            .status(200)
            .json({ message: "Order cancelled successfully", response: response });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Error while  cancelling the ordering", error });
    }
});
exports.orderRouter.get("/getOrders", async (req, res) => {
    const market = req.query.market;
    if (!market) {
        res.status(404).json({ message: "Market missing" });
    }
    try {
        const response = await RedisManager_1.RedisManager.getInstance().getOrders(market);
        // console.log(response);
        res
            .status(200)
            .json({ message: "Fetched all orders successfully", response });
    }
    catch (error) {
        res.status(500).json({ message: "Error while fetching all orders", error });
    }
});
exports.orderRouter.get("/getUserOrders", async (req, res) => {
    try {
        const userId = req.query.userId;
        const market = req.query.market;
        // console.log(userId);
        if (!userId) {
            res.status(400).json({ message: "User ID not found" });
        }
        if (!market) {
            res.status(404).json({ message: "Market missing" });
        }
        const response = await RedisManager_1.RedisManager.getInstance().getUserOrders(userId, market);
        // console.log(response);
        res
            .status(200)
            .json({ message: "Fetched user's all orders successfully", response });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Error while fetching user's orders", error });
    }
});
exports.orderRouter.get("/getUserOrdersFromDb", async (req, res) => {
    try {
        const userId = req.query.userId;
        if (!userId) {
            res.status(404).json({ message: "User Id not found" });
        }
        const response = await RedisManager_1.RedisManager.getInstance().getUserOrdersFromDb(userId);
        res
            .status(200)
            .json({ message: "Fetched user's order from DB successfully", response });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Error while fetching user's orders from DB", error });
    }
});
//# sourceMappingURL=order.js.map