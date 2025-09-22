import type WebSocket from "ws";
import { User } from "./User";

export class UserManager {
  private static instance: UserManager;
  private users: Map<string, WebSocket> = new Map<string, WebSocket>();

  private constructor() {}

  static getInstance() {
    if (!this.instance) {
      this.instance = new UserManager();
    }
    return this.instance;
  }

  addUser(ws: WebSocket, userId: string) {
    new User(userId, ws);
    this.users.set(userId, ws);
    this.closeWs(userId, ws);
  }

  closeWs(id: string, ws: WebSocket) {
    ws.on("close", () => {
      this.users.delete(id);
    });
  }

  getUser(userId: string) {
    return this.users.get(userId);
  }
}
