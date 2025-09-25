"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tradeRouter = void 0;
const express_1 = require("express");
const RedisManager_1 = require("../RedisManager");
exports.tradeRouter = (0, express_1.Router)();
exports.tradeRouter.get("/getTrades", async (req, res) => {
    const market = req.query.market;
    if (!market) {
        res.status(404).json({ message: "Market missing" });
    }
    try {
        const response = await RedisManager_1.RedisManager.getInstance().getTrades(market);
        // console.log(response);
        res
            .status(200)
            .json({ message: "Trades fetched successfully", response: response });
    }
    catch (error) {
        res.status(500).json({ message: "Error while fetching trades", error });
    }
});
exports.tradeRouter.get("/getTickerData", async (req, res) => {
    const market = req.query.market;
    if (!market) {
        res.status(404).json({ message: "Market missing" });
    }
    try {
        // console.log("calling ticker data");
        const response = await RedisManager_1.RedisManager.getInstance().getTickerData(market);
        res.status(200).json({
            message: "Ticker data fetched successfully",
            response: response,
        });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Error while fetching ticker data", error });
    }
});
exports.tradeRouter.get("/getKlineData", async (req, res) => {
    const timeFrame = req.query.timeFrame;
    const market = req.query.market;
    if (!timeFrame) {
        res.status(404).json({ message: "Timeframe is missing" });
    }
    if (!market) {
        res.status(404).json({ message: "Market missing" });
    }
    try {
        const response = await RedisManager_1.RedisManager.getInstance().getKlineData(timeFrame, market);
        res.status(200).json({
            message: "Kline data fetched successfully",
            response: response,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Error while fetching kline data", error });
    }
});
exports.tradeRouter.get("/getAllMarketCurrentPrices", async (req, res) => {
    try {
        const response = await RedisManager_1.RedisManager.getInstance().getAllMarketsCurrentPrice();
        res.status(200).json({
            message: "Fetched all market current prices successfully",
            response,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error while fetching all market current prices",
            error,
        });
    }
});
//# sourceMappingURL=trade.js.map