import axios from "axios";

export async function fetchTickerData(market: string) {
  try {
    // console.log("i am in fetchTickerData");
    const res = await axios.get(
      `${
        import.meta.env.VITE_API_URL
      }api/v1/trade/getTickerData?market=${market}`
    );
    const data = res.data;
    // console.log("TICKER DATA: ", data);
    console.log("FETCHED TICKER DATA");
    return data;
  } catch (error) {
    console.log("Error while fetching ticker data", error);
  }
}
