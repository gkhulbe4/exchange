"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderRouter = void 0;
const express_1 = require("express");
exports.orderRouter = (0, express_1.Router)();
exports.orderRouter.get("/", (req, res) => {
    res.json({ message: "hello" });
});
//# sourceMappingURL=order.js.map