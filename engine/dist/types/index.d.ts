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
export type DBMessage = {
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
} | {
    type: "ORDER_PLACED" | "ORDERED_CANCELLED";
    data: {
        orderId: string;
        executedQuantity: number;
        fills: Fill[] | [];
    };
};
export type PublishToWS = {
    stream: "trade";
    data: {
        e: string;
        t: number;
        p: string;
        q: number;
        s: string;
        m: string;
        o: string;
        of: string;
        T: number;
    };
} | {
    stream: "order";
    data: {
        e: string;
        o: string;
        f: number;
        p: number;
        q: number;
        s: string;
        m: string;
        u: string;
    };
};
//# sourceMappingURL=index.d.ts.map