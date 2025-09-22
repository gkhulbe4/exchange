import type WebSocket from "ws";
export declare class UserManager {
    private static instance;
    private users;
    private constructor();
    static getInstance(): UserManager;
    addUser(ws: WebSocket, userId: string): void;
    closeWs(id: string, ws: WebSocket): void;
    getUser(userId: string): WebSocket | undefined;
}
//# sourceMappingURL=UserManager.d.ts.map