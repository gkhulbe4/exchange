import type WebSocket from "ws";
export declare class User {
    private id;
    private ws;
    constructor(id: string, ws: WebSocket);
    startWsListener(): void;
}
//# sourceMappingURL=User.d.ts.map