import { Router } from "express";
import { RedisManager } from "../RedisManager";

export const orderRouter: Router = Router();

orderRouter.post("/", (req, res) => {
  const { market, price, quantity, side, userId } = req.body;
  const response = RedisManager.getInstance().sendAndAwait({
    type: "CREATE_ORDER",
    data: {
      market, // sol_inr
      price,
      quantity,
      side,
      userId,
    },
  });
});
