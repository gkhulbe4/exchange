"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const RedisManager_1 = require("../RedisManager");
exports.userRouter = (0, express_1.Router)();
exports.userRouter.get("/getBalance", async (req, res) => {
    try {
        const userId = req.query.userId;
        if (!userId) {
            res.status(400).json({ message: "User ID not found" });
        }
        // console.log(`balance request received:${userId}`);
        const response = await RedisManager_1.RedisManager.getInstance().getUserBalance(userId);
        res.status(200).json({ response });
    }
    catch (error) {
        console.log("Error in fetching balance", error);
        res.status(500).json({ message: "Error in fetching balance", error });
    }
});
//# sourceMappingURL=user.js.map