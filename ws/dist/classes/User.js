"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const SubscriptionManager_1 = require("./SubscriptionManager");
class User {
    id;
    ws;
    constructor(id, ws) {
        this.id = id;
        this.ws = ws;
        this.startWsListener();
    }
    startWsListener() {
        this.ws.on("message", (message) => {
            const parsedMessage = JSON.parse(message);
            console.log("Message from frontend:", parsedMessage);
            if (parsedMessage.type == "SUBSCRIBE") {
                SubscriptionManager_1.SubscriptionManager.getInstance().subscribe(this.id, parsedMessage.subType, parsedMessage.market);
            }
            else if (parsedMessage.type == "UNSUBSCRIBE") {
                SubscriptionManager_1.SubscriptionManager.getInstance().unsubscribe(this.id, parsedMessage.subType, parsedMessage.market);
            }
        });
    }
}
exports.User = User;
//# sourceMappingURL=User.js.map