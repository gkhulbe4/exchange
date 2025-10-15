import axios from "axios";

export async function fetchUserBalance(userId: string) {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}api/v1/user/getBalance?userId=${userId}`
    );
    if (res.status == 200) {
      return res.data.response;
    } else {
      throw new Error();
    }
    //   console.log(res.data.response);
  } catch (error) {
    console.log("Error in fetching user balance", error);
  }
}
