import { Request, Response, Router } from "express";
import { RedisManager } from "../RedisManager";

export const orderRouter: Router = Router();

orderRouter.post("/", async (req: Request, res: Response) => {
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
    // console.log(response);
    res.status(200).json({ response: response });
  } catch (error) {
    res.status(500).json({ message: "Error while ordering", error });
  }
});

orderRouter.get("/getOrders", async (req: Request, res: Response) => {
  try {
    const response = await RedisManager.getInstance().getOrders();
    console.log(response);
    res
      .status(200)
      .json({ message: "Fetched all orders successfully", response });
  } catch (error) {
    res.status(500).json({ message: "Error while fetching all orders", error });
  }
});

orderRouter.get("/getUserOrders", async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string;
    console.log(userId);
    if (!userId) {
      res.status(400).json({ message: "User ID not found" });
    }
    const response = await RedisManager.getInstance().getUserOrders(userId);
    // console.log(response);
    res
      .status(200)
      .json({ message: "Fetched user's all orders successfully", response });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error while fetching user's orders", error });
  }
});
