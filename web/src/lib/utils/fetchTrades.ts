import axios from "axios";

export async function fetchTrades() {
  try {
    console.log("i am in fetchTrades");
    const res = await axios.get("http://localhost:3001/api/v1/trade/getTrades");
    const data = res.data;
    console.log("FETCHED TRADES DATA");

    return data;
  } catch (error) {
    console.log("Error while fetching trades", error);
  }
}
