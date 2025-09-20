export type DBMessage = {
  type: "ADD_TRADE";
  data: {
    market: string;
    id: string;
    buyer_id: string;
    seller_id: string;
    price: string;
    qty: number;
  };
};

export type FinalOrder = {
  baseAsset: string;
  quoteAsset: string;
  side: string;
  price: number;
  quantity: number;
  userId: string;
  orderId: string;
  filled: number;
  market: string;
  time: number;
};

export type Fill = {
  price: string;
  qty: number;
  tradeId: number;
  otherUserId: string;
  marketOrderId: string;
  time: number;
};
