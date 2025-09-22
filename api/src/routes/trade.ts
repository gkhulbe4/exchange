import { Request, Response, Router } from "express";
import { RedisManager } from "../RedisManager";

export const tradeRouter: Router = Router();

tradeRouter.get("/getTrades", async (req: Request, res: Response) => {
  const market = req.query.market as string;
  if (!market) {
    res.status(404).json({ message: "Market missing" });
  }
  try {
    const response = await RedisManager.getInstance().getTrades(market);
    // console.log(response);
    res
      .status(200)
      .json({ message: "Trades fetched successfully", response: response });
  } catch (error) {
    res.status(500).json({ message: "Error while fetching trades", error });
  }
});

tradeRouter.get("/getTickerData", async (req: Request, res: Response) => {
  const market = req.query.market as string;
  if (!market) {
    res.status(404).json({ message: "Market missing" });
  }
  try {
    // console.log("calling ticker data");
    const response = await RedisManager.getInstance().getTickerData(market);
    res.status(200).json({
      message: "Ticker data fetched successfully",
      response: response,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error while fetching ticker data", error });
  }
});

tradeRouter.get("/getKlineData", async (req: Request, res: Response) => {
  const timeFrame = req.query.timeFrame as string;
  const market = req.query.market as string;
  if (!timeFrame) {
    res.status(404).json({ message: "Timeframe is missing" });
  }
  if (!market) {
    res.status(404).json({ message: "Market missing" });
  }
  try {
    const response = await RedisManager.getInstance().getKlineData(
      timeFrame,
      market
    );
    res.status(200).json({
      message: "Kline data fetched successfully",
      response: response,
    });
  } catch (error) {
    res.status(500).json({ message: "Error while fetching kline data", error });
  }
});
