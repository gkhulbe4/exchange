import axios from "axios";

export async function fetchOrders() {
  const res = await axios.get(`http://localhost:3001/api/v1/order/getOrders`);
  console.log(res.data.response);
  return res.data.response;
}
