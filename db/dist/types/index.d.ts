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
//# sourceMappingURL=index.d.ts.map