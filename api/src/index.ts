import express from "express";
import cors from "cors";
import { orderRouter } from "./routes/order";
import { userRouter } from "./routes/user";
import { tradeRouter } from "./routes/trade";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/v1/order", orderRouter);
app.use("/api/v1/trade", tradeRouter);
app.use("/api/v1/user", userRouter);
app.get("/", (req, res) => {
  res.send("Hello from API Server");
});

app.listen(3001, () => {
  console.log("Started API Server on port 3001");
});
