export type IncomingWsMessage = {
  type: "SUBSCRIBE" | "UNSUBSCRIBE";
  subType: "trades" | "order";
  market: "ETH_USD" | "SOL_USD" | "BTC_USD";
};
