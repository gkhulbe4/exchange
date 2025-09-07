export type MessageToEngine = {
  type: "CREATE_ORDER";
  data: {
    market: string;
    side: "buy" | "sell";
    quantity: number;
    price: number;
    userId: number;
  };
};
