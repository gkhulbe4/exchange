import { WebSocket, WebSocketServer } from "ws";
import { UserManager } from "./classes/UserManager";

function main() {
  const wss = new WebSocketServer({ port: 8080 });
  wss.on("connection", (ws: WebSocket, request) => {
    const url = request.url;
    if (!url) {
      console.log("WebSocket url not found");
      return;
    }

    const queryParams = new URLSearchParams(url.split("?")[1]);
    const userId = queryParams.get("userId") as string;

    UserManager.getInstance().addUser(ws, userId);

    if (!userId) {
      console.log("User ID not found");
      ws.close();
      return;
    }

    console.log(`User ID: ${userId} connected`);
  });
}
main();
