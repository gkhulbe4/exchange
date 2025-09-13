import axios from "axios";

export async function fetchUserBalance(userId: string) {
  const res = await axios.get(
    `http://localhost:3001/api/v1/user/getBalance?userId=${userId}`
  );
  //   console.log(res.data.response);
  return res.data.response;
}
