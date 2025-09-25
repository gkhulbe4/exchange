import axios from "axios";

export async function fetchAllMarketsCurrentPrice() {
  try {
    const res = await axios.get(
      "http://localhost:3001/api/v1/trade/getAllMarketCurrentPrices"
    );
    const data = res.data;
    return data;
  } catch (error) {
    console.log("Error while fetching all markets current price", error);
  }
}
