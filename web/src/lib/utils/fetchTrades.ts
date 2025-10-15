import axios from "axios";

export async function fetchTrades(market: string) {
  try {
    // console.log("i am in fetchTrades");
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}api/v1/trade/getTrades?market=${market}`
    );
    const data = res.data;
    console.log("FETCHED TRADES DATA");

    return data;
  } catch (error) {
    console.log("Error while fetching trades", error);
  }
}
