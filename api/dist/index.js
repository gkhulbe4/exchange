"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const order_1 = require("./routes/order");
const user_1 = require("./routes/user");
const trade_1 = require("./routes/trade");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api/v1/order", order_1.orderRouter);
app.use("/api/v1/trade", trade_1.tradeRouter);
app.use("/api/v1/user", user_1.userRouter);
app.listen(3001, () => {
    console.log("Started API Server on port 3001");
});
//# sourceMappingURL=index.js.map