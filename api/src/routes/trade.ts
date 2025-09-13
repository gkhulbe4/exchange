import { Request, Response, Router } from "express";
import { RedisManager } from "../RedisManager";

export const tradeRouter: Router = Router();

tradeRouter.get("/getTrades", async (req: Request, res: Response) => {
  try {
    const response = await RedisManager.getInstance().getTrades();
    // console.log(response);
    res
      .status(200)
      .json({ message: "Trades fetched successfully", response: response });
  } catch (error) {
    res.status(500).json({ message: "Error while fetching trades", error });
  }
});
