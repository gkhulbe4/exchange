export type MessageFromApi =
  | {
      type: "CREATE_ORDER";
      data: {
        market: string;
        side: "buy" | "sell";
        quantity: number;
        price: number;
        userId: string;
      };
    }
  | {
      type: "CANCEL_ORDER";
      data: {
        market: string;
        side: "buy" | "sell";
        orderId: string;
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

export type FinalOrder = {
  baseAsset: string;
  quoteAsset: string;
  side: "buy" | "sell";
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
      type: "ORDER_PLACED" | "ERROR_WHILE_PLACING_ORDER";
      data: {
        orderId: string;
        executedQuantity: number;
        fills: Fill[] | [];
      };
    }
  | {
      type: "ADD_ORDER";
      data: { order: FinalOrder; fills: Fill[] };
    }
  | {
      type: "CANCEL_ORDER";
      data: {
        orderId: string;
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
      data:
        | {
            // this is for placed orders
            e: string; // event
            o: string; // orderId
            f: number; // fill
            p: number; // price
            q: number; // quantity
            s: string; // side
            m: string; // market
            u: string;
            // T: number; // time mp
          }
        | {
            // this is for cancel_order
            e: string;
            o: string;
            m: string;
            s: string;
          };
    };
