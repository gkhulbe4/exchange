import { Request, Response, Router } from "express";
import { RedisManager } from "../RedisManager";

export const userRouter: Router = Router();

userRouter.get("/getBalance", async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string;
    if (!userId) {
      res.status(400).json({ message: "User ID is missing" });
    }
    // console.log(`balance request received:${userId}`);
    const response = await RedisManager.getInstance().getUserBalance(userId);
    console.log(`BALANCE FETCHED FOR ${userId} : ${JSON.stringify(response)}`);
    res.status(200).json({ response });
  } catch (error) {
    console.log("Error in fetching balance", error);
    res.status(500).json({ message: "Error in fetching balance", error });
  }
});
