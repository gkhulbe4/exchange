import { Router } from "express";
import { RedisManager } from "../RedisManager";

export const orderRouter: Router = Router();

orderRouter.post("/", async (req, res) => {
  const { market, price, quantity, side, userId } = req.body;
  try {
    const response = await RedisManager.getInstance().sendAndAwait({
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
  } catch (error) {
    res.status(500).json({ message: "Error while ordering", error });
  }
});
