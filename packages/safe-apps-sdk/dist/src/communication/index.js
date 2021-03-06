"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const semver_1 = __importDefault(require("semver"));
const messageFormatter_1 = require("./messageFormatter");
class PostMessageCommunicator {
    constructor(allowedOrigins = null) {
        this.allowedOrigins = null;
        this.callbacks = new Map();
        this.isValidMessage = ({ origin, data, source }) => {
            const emptyOrMalformed = !data;
            const sentFromParentEl = source === window.parent;
            const allowedSDKVersion = typeof data.version !== 'undefined' ? semver_1.default.gte(data.version, '1.0.0') : false;
            let validOrigin = true;
            if (Array.isArray(this.allowedOrigins)) {
                validOrigin = this.allowedOrigins.find((regExp) => regExp.test(origin)) !== undefined;
            }
            return !emptyOrMalformed && sentFromParentEl && allowedSDKVersion && validOrigin;
        };
        this.logIncomingMessage = (msg) => {
            console.info(`Safe Apps SDK v1: A message was received from origin ${msg.origin}. `, msg.data);
        };
        this.onParentMessage = (msg) => {
            if (this.isValidMessage(msg)) {
                this.logIncomingMessage(msg);
                this.handleIncomingMessage(msg.data);
            }
        };
        this.handleIncomingMessage = (payload) => {
            const { id } = payload;
            const cb = this.callbacks.get(id);
            if (cb) {
                cb(payload);
                this.callbacks.delete(id);
            }
        };
        this.send = (method, params) => {
            const request = messageFormatter_1.MessageFormatter.makeRequest(method, params);
            if (typeof window === 'undefined') {
                throw new Error("Window doesn't exist");
            }
            window.parent.postMessage(request, '*');
            return new Promise((resolve) => {
                this.callbacks.set(request.id, (response) => {
                    resolve(response);
                });
            });
        };
        this.allowedOrigins = allowedOrigins;
        window.addEventListener('message', this.onParentMessage);
    }
}
exports.default = PostMessageCommunicator;
__exportStar(require("./methods"), exports);
//# sourceMappingURL=index.js.map