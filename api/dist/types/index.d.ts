export type Fill = {
    price: string;
    qty: number;
    tradeId: number;
    otherUserId: string;
    markerOrderId: string;
};
export type MessageToEngine = {
    type: "CREATE_ORDER";
    data: {
        market: string;
        side: "buy" | "sell";
        quantity: number;
        price: number;
        userId: number;
    };
} | {
    type: "CANCEL_ORDER";
    data: {
        market: string;
        side: "buy" | "sell";
        orderId: string;
        userId: string;
    };
};
export type MessageFromEngine = {
    type: "ORDER_PLACED" | "ORDER_CANCELLED";
    payload: {
        orderId: string;
        executedQuantity: number;
        fills: Fill[] | [];
    };
};
//# sourceMappingURL=index.d.ts.map