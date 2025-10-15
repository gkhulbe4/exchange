import axios from "axios";

export async function fetchUserOrder(userId: string, market: string) {
  if (!userId) {
    console.log("User ID is missing");
    return;
  }

  if (!market) {
    console.log("Market is missing");
    return;
  }
  try {
    const res = await axios.get(
      `${
        import.meta.env.VITE_API_URL
      }api/v1/order/getUserOrders?userId=${userId}&market=${market}`
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching user orders:", error);
  }
}
