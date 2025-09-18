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

export type Fill = {
  price: string;
  qty: number;
  tradeId: number;
  otherUserId: string;
  marketOrderId: string;
  time: number;
};

export type DBMessage =
  | {
      type: "ADD_TRADE";
      data: {
        market: string;
        id: string;
        buyer_id: string;
        seller_id: string;
        price: string;
        qty: number;
        side: string;
      };
    }
  | {
      type: "ORDER_PLACED" | "ORDERED_CANCELLED";
      data: {
        orderId: string;
        executedQuantity: number;
        fills: Fill[] | [];
      };
    };

export type PublishToWS =
  | {
      stream: "trade";
      data: {
        e: string; // event
        t: number; // trade id
        p: string; // price
        q: number; // quantity
        s: string; // side
        m: string; // market
        o: string; // order id
        of: string;
        T: number; // time of trade
      };
    }
  | {
      stream: "order";
      data: {
        e: string; // event
        o: string; // orderId
        f: number; // fill
        p: number; // price
        q: number; // quantity
        s: string; // side
        m: string; // market
        u: string;
        // T: number; // time mp
      };
    };
