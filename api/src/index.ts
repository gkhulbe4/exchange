import express from "express";
import cors from "cors";
import { orderRouter } from "./routes/order";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/v1/order", orderRouter);
app.listen(3001, () => {
  console.log("Started API Server on port 3001");
});
