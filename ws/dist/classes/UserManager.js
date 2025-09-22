"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserManager = void 0;
const User_1 = require("./User");
class UserManager {
    static instance;
    users = new Map();
    constructor() { }
    static getInstance() {
        if (!this.instance) {
            this.instance = new UserManager();
        }
        return this.instance;
    }
    addUser(ws, userId) {
        new User_1.User(userId, ws);
        this.users.set(userId, ws);
        this.closeWs(userId, ws);
    }
    closeWs(id, ws) {
        ws.on("close", () => {
            this.users.delete(id);
        });
    }
    getUser(userId) {
        return this.users.get(userId);
    }
}
exports.UserManager = UserManager;
//# sourceMappingURL=UserManager.js.map