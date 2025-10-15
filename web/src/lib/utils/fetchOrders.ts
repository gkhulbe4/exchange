import axios from "axios";

export async function fetchOrders(market: string) {
  try {
    // console.log("i am in fetchOrder");
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}api/v1/order/getOrders?market=${market}`
    );
    console.log("FETCHED ORDER DATA");
    return res.data.response;
  } catch (error) {
    console.log("Error while fetching orders", error);
  }
}
