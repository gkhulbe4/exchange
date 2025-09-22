import type WebSocket from "ws";
import { IncomingWsMessage } from "../types";
import { SubscriptionManager } from "./SubscriptionManager";

export class User {
  private id: string;
  private ws: WebSocket;

  constructor(id: string, ws: WebSocket) {
    this.id = id;
    this.ws = ws;
    this.startWsListener();
  }

  startWsListener() {
    this.ws.on("message", (message: string) => {
      const parsedMessage: IncomingWsMessage = JSON.parse(message);
      console.log("Message from frontend:", parsedMessage);
      if (parsedMessage.type == "SUBSCRIBE") {
        SubscriptionManager.getInstance().subscribe(
          this.id,
          parsedMessage.subType,
          parsedMessage.market
        );
      } else if (parsedMessage.type == "UNSUBSCRIBE") {
        SubscriptionManager.getInstance().unsubscribe(
          this.id,
          parsedMessage.subType,
          parsedMessage.market
        );
      }
    });
  }
}
