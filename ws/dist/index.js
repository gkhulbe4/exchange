"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const UserManager_1 = require("./classes/UserManager");
function main() {
    const wss = new ws_1.WebSocketServer({ port: 8080 });
    wss.on("connection", (ws, request) => {
        const url = request.url;
        if (!url) {
            console.log("WebSocket url not found");
            return;
        }
        const queryParams = new URLSearchParams(url.split("?")[1]);
        const userId = queryParams.get("userId");
        UserManager_1.UserManager.getInstance().addUser(ws, userId);
        if (!userId) {
            console.log("User ID not found");
            ws.close();
            return;
        }
        console.log(`User ID: ${userId} connected`);
    });
}
main();
//# sourceMappingURL=index.js.map