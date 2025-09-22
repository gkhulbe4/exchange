import { Request, Response, Router } from "express";
import { RedisManager } from "../RedisManager";

export const orderRouter: Router = Router();

orderRouter.post("/", async (req: Request, res: Response) => {
  const { market, price, quantity, side, userId } = req.body;
  if (price == 0) {
    res.status(404).json({ message: "Price cannot be zero" });
  }
  if (quantity == 0) {
    res.status(404).json({ message: "Quantity cannot be zero" });
  }
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
    console.log("-------------------------------------------");
    //@ts-ignore
    console.log("Order Id: ", response.data.orderId);
    //@ts-ignore
    console.log("Executed: ", response.data.executedQuantity);
    //@ts-ignore
    console.log("Fills: ", response.data.fills);

    console.log("-------------------------------------------");
    res.status(200).json({ response: response });
  } catch (error) {
    res.status(500).json({ message: "Error while ordering", error });
  }
});

orderRouter.get("/getOrders", async (req: Request, res: Response) => {
  const market = req.query.market as string;
  if (!market) {
    res.status(404).json({ message: "Market missing" });
  }
  try {
    const response = await RedisManager.getInstance().getOrders(market);
    // console.log(response);
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
    const market = req.query.market as string;
    // console.log(userId);
    if (!userId) {
      res.status(400).json({ message: "User ID not found" });
    }
    if (!market) {
      res.status(404).json({ message: "Market missing" });
    }
    const response = await RedisManager.getInstance().getUserOrders(
      userId,
      market
    );
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

orderRouter.get("/getUserOrdersFromDb", async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string;
    if (!userId) {
      res.status(404).json({ message: "User Id not found" });
    }

    const response = await RedisManager.getInstance().getUserOrdersFromDb(
      userId
    );
    res
      .status(200)
      .json({ message: "Fetched user's order from DB successfully", response });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error while fetching user's orders from DB", error });
  }
});
