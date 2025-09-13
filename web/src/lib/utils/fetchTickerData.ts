import axios from "axios";

export async function fetchTickerData() {
  try {
    const res = await axios.get(
      "http://localhost:3001/api/v1/trade/getTickerData"
    );
    const data = res.data;
    return data;
  } catch (error) {
    console.log("Error while fetching ticker data", error);
  }
}
