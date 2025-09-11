"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderRouter = void 0;
const express_1 = require("express");
const RedisManager_1 = require("../RedisManager");
exports.orderRouter = (0, express_1.Router)();
exports.orderRouter.post("/", async (req, res) => {
    const { market, price, quantity, side, userId } = req.body;
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
        console.log(response);
        res.status(200).json({ response: response });
    }
    catch (error) {
        res.status(500).json({ message: "Error while ordering", error });
    }
});
//# sourceMappingURL=order.js.map