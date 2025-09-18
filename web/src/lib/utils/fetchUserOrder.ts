import axios from "axios";

export async function fetchUserOrder(userId: string) {
  try {
    const res = await axios.get(
      `http://localhost:3001/api/v1/order/getUserOrders?userId=${userId}`
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching user orders:", error);
  }
}
