export type MessageFromApi = {
  type: "CREATE_ORDER";
  data: {
    market: string;
    side: "buy" | "sell";
    quantity: number;
    price: number;
    userId: string;
  };
};

export type OrderDetails = {
  market: string;
  side: "buy" | "sell";
  quantity: number;
  price: number;
  userId: string;
};
