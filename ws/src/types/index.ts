export type IncomingWsMessage = {
  type: "SUBSCRIBE" | "UNSUBSCRIBE";
  subType: "trades" | "depth";
};
