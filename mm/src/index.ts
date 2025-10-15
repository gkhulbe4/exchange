import axios from "axios";
import "dotenv/config";

type Order = {
  orderId: string;
  price: number;
  quantity: number;
  filled: number;
  side: "buy" | "sell";
  market: string;
  baseAsset: string;
  quoteAsset: string;
  userId: string;
};

const userIds = ["3", "4", "5", "6"];
const markets = ["SOL_USD", "ETH_USD", "BTC_USD"];

async function makeOrder(orderDetails: {
  market: string;
  price: number;
  quantity: number;
  side: string;
  userId: string;
}) {
  try {
    await axios.post(`${process.env.API_URL}api/v1/order`, orderDetails);
    console.log("Order placed:", orderDetails);
  } catch (error) {
    console.error("Error placing order:", error);
  }
}

async function createSeedOrders(market: string) {
  try {
    const userIds = ["3", "4", "5", "6"];
    const basePrice = 200;

    await makeOrder({
      market: market,
      price: basePrice - 1,
      quantity: 5,
      side: "buy",
      userId: userIds[0] as string,
    });

    await makeOrder({
      market: market,
      price: basePrice + 1,
      quantity: 5,
      side: "sell",
      userId: userIds[1] as string,
    });

    console.log("Seed orders created");
  } catch (error) {
    console.error("Error creating seed orders:", error);
  }
}

async function startMarketMaker() {
  setInterval(async () => {
    try {
      const userId = userIds[Math.floor(Math.random() * userIds.length)];
      const market = markets[Math.floor(Math.random() * markets.length)];
      const res = await axios.get(
        `${process.env.API_URL}api/v1/order/getOrders?market=${market}`
      );
      const data = res.data;
      const allBuys: Order[] = data.response.buys || [];
      const allSells: Order[] = data.response.asks || [];

      // If no orders exists then create seed orders
      if (allBuys.length === 0 && allSells.length === 0) {
        console.log("Empty order book, creating seed orders...");
        await createSeedOrders(market!);
        return;
      }

      // If only one side exists then create orders for the other side
      if (allBuys.length === 0) {
        try {
          const lowestSellPrice = Math.min(
            ...allSells.map((sell) => sell.price)
          );
          const price = lowestSellPrice - 2;
          const quantity = Math.floor(Math.random() * 10) + 3;

          await makeOrder({
            market: market!,
            price: price,
            quantity: quantity,
            side: "buy",
            userId: userId as string,
          });
        } catch (error) {
          console.error("Error creating buy order:", error);
        }
        return;
      }

      if (allSells.length === 0) {
        try {
          const highestBuyPrice = Math.max(...allBuys.map((buy) => buy.price));
          const price = highestBuyPrice + 2;
          const quantity = Math.floor(Math.random() * 10) + 3;

          await makeOrder({
            market: market!,
            price: price,
            quantity: quantity,
            side: "sell",
            userId: userId as string,
          });
        } catch (error) {
          console.error("Error creating sell order:", error);
        }
        return;
      }

      // both side exists
      try {
        const bestBuyPrice = Math.max(...allBuys.map((buy) => buy.price));
        const bestSellPrice = Math.min(...allSells.map((sell) => sell.price));

        const side = Math.random() < 0.5 ? "buy" : "sell";
        const shouldCauseTrade = Math.random() < 0.5;

        let price;
        if (shouldCauseTrade) {
          price = side === "buy" ? bestSellPrice : bestBuyPrice; // immediately the order will happen
        } else {
          price = side === "buy" ? bestSellPrice - 1 : bestBuyPrice + 1; // new order in orderbook
        }

        const quantity = Math.floor(Math.random() * 10) + 3;

        const orderDetails = {
          market: market!,
          price: price,
          quantity: quantity,
          side: side,
          userId: userId,
        };

        // @ts-ignore
        await makeOrder(orderDetails);
      } catch (error) {
        console.error("Error in normal market making:", error);
      }
    } catch (error) {
      console.error("Error in market maker cycle:", error);
    }
  }, 200);
}

try {
  startMarketMaker();
  console.log("Market maker started successfully");
} catch (error) {
  console.error("Error starting market maker:", error);
}
