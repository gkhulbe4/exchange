import axios from "axios";

export async function fetchUserOrdersFromDb(userId: string) {
  try {
    const res = await axios.get(
      `http://localhost:3001/api/v1/order/getUserOrdersFromDb?userId=${userId}`
    );
    const data = res.data;
    return data;
  } catch (error) {
    console.log("Error while fetching user's orders from DB", error);
    throw error;
  }
}
