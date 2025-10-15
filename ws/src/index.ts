import { WebSocket, WebSocketServer } from "ws";
import { UserManager } from "./classes/UserManager";
import "dotenv/config";

function main() {
  const port = Number(process.env.PORT) || 8080;
  const wss = new WebSocketServer({ port });
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
