import axios from "axios";

export async function fetchTrades() {
  try {
    const res = await axios.get("http://localhost:3001/api/v1/trade/getTrades");
    const data = res.data;
    return data;
  } catch (error) {
    console.log("Error while fetching trades", error);
  }
}
