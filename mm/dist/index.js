"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
async function makeOrder(orderDetails) {
    try {
        await axios_1.default.post("http://localhost:3001/api/v1/order", orderDetails);
        console.log("Order placed:", orderDetails);
    }
    catch (error) {
        console.error("Error placing order:", error);
    }
}
async function startMarketMaker() {
    setInterval(() => {
        const options = ["3", "4", "5", "6"];
        const userId = options[Math.floor(Math.random() * options.length)];
        const orderDetails = {
            market: "SOL_INR",
            price: Number((Math.random() * (240 - 150) + 150).toFixed(2)),
            quantity: Math.floor(Math.random() * (10 - 2 + 1)) + 2,
            side: Math.random() < 0.5 ? "buy" : "sell",
            userId: userId,
        };
        makeOrder(orderDetails);
    }, 500);
}
startMarketMaker();
//# sourceMappingURL=index.js.map