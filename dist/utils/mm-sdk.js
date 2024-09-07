"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelSession = exports.transact = void 0;
const { MetaMaskSDK } = require("@metamask/sdk");
const qrcode = require("qrcode");
const userSessions = new Map();
const delay = (ms) => new Promise((res) => setTimeout(res, ms));
const transact = (ctx, toAccount) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = ctx.from.id;
    if (userSessions.has(userId)) {
        yield ctx.reply("A session is already in progress. Please finish or cancel it before starting a new one.");
        return;
    }
    const sdk = new MetaMaskSDK({
        shouldShimWeb3: false,
        chainId: 11155111,
    });
    const ethereum = sdk.getProvider();
    userSessions.set(userId, { sdk, ethereum, ctx });
    try {
        const accountsPromise = ethereum === null || ethereum === void 0 ? void 0 : ethereum.request({
            method: "eth_requestAccounts",
            params: [],
        });
        yield delay(2500);
        const link = sdk.getUniversalLink();
        const qrBuffer = yield qrcode.toBuffer(link, {
            type: "png",
        });
        yield ctx.replyWithPhoto({ source: qrBuffer });
        yield ctx.reply(`Please scan the QR code to link your wallet or use this url:\n${link}`);
        yield ctx.reply("Waiting for Wallet Connection..");
        let connected = false;
        let from;
        while (!connected && userSessions.has(userId)) {
            yield delay(5000);
            try {
                const accounts = yield accountsPromise;
                from = accounts[0];
                if (from != undefined) {
                    connected = true;
                    yield ctx.reply(`Wallet connected: ${from}`);
                }
            }
            catch (error) {
                console.error("Error connecting:", error);
                yield ctx.reply("Error Connecting!! Try Again");
            }
        }
        if (from && userSessions.has(userId)) {
            yield ctx.reply("Initiating transaction...");
            yield ctx.reply("Open your metamask wallet to sign and complete the transaction.");
            try {
                const txHash = yield ethereum.request({
                    method: "eth_sendTransaction",
                    params: [
                        {
                            from: from,
                            to: toAccount,
                            value: "0x38D7EA4C68000",
                        },
                    ],
                });
                yield ctx.reply(`Transaction sent! Hash: ${txHash}`);
                return 1;
            }
            catch (error) {
                yield ctx.reply("Failed to send transaction. Please try again.");
            }
        }
        else if (userSessions.has(userId)) {
            yield ctx.reply("No account connected. Cannot initiate transaction.");
        }
    }
    catch (error) {
        console.error("An error occurred:", error);
        yield ctx.reply("An error occurred. Please try again later.");
    }
    finally {
        userSessions.delete(userId);
    }
});
exports.transact = transact;
const cancelSession = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = ctx.from.id;
    if (userSessions.has(userId)) {
        userSessions.delete(userId);
        yield ctx.reply("Your session has been cancelled.");
    }
    else {
        yield ctx.reply("You don't have an active session.");
    }
});
exports.cancelSession = cancelSession;
//# sourceMappingURL=mm-sdk.js.map