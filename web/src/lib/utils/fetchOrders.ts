import axios from "axios";

export async function fetchOrders() {
  try {
    console.log("i am in fetchOrder");
    const res = await axios.get(`http://localhost:3001/api/v1/order/getOrders`);
    console.log("FETCHED ORDER DATA");
    return res.data.response;
  } catch (error) {
    console.log("Error while fetching orders", error);
  }
}
