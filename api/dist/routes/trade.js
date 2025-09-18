"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tradeRouter = void 0;
const express_1 = require("express");
const RedisManager_1 = require("../RedisManager");
exports.tradeRouter = (0, express_1.Router)();
exports.tradeRouter.get("/getTrades", async (req, res) => {
    try {
        const response = await RedisManager_1.RedisManager.getInstance().getTrades();
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
    try {
        const response = await RedisManager_1.RedisManager.getInstance().getTickerData();
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
    if (!timeFrame) {
        res.status(404).json({ message: "Timeframe is missing" });
    }
    try {
        const response = await RedisManager_1.RedisManager.getInstance().getKlineData(timeFrame);
        res.status(200).json({
            message: "Kline data fetched successfully",
            response: response,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Error while fetching kline data", error });
    }
});
//# sourceMappingURL=trade.js.map