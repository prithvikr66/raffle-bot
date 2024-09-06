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
exports.start = void 0;
const { MetaMaskSDK } = require("@metamask/sdk");
const qrcode = require("qrcode");
const sdk = new MetaMaskSDK({
    shouldShimWeb3: false,
    //   showQRCode: false,
});
// console.log("Connected accounts:", accounts);
// const from = accounts[0];
// const paymentLink = `ethereum:${toAccount}?value=0x38D7EA4C68000&from=${from}`;
// console.log("Payment Link:", paymentLink);
// const qrCodeImageBuffer = await qrcode.toBuffer(paymentLink);
// // Send the QR code image to the user via Telegram bot
// await ctx.replyWithPhoto({ source: qrCodeImageBuffer });
// await ctx.reply(`Please scan the QR code or use this link to complete the payment: ${paymentLink}`);
const ethereum = sdk.getProvider();
const start = (ctx, toAccount) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accounts = ethereum === null || ethereum === void 0 ? void 0 : ethereum.request({
            method: "eth_requestAccounts",
            params: [],
        });
        const from = accounts[0];
        console.log("Connected account:", from);
        const value = "0x38D7EA4C68000";
        const paymentLink = `ethereum:${toAccount}?value=${value}&from=${from}`;
        console.log("Payment Link:", paymentLink);
        // const qrBuffer = await qrcode.toBuffer(link, {
        //   type: "png",
        // });
        // await ctx.replyWithPhoto({ source: qrBuffer });
    }
    catch (error) {
        console.error("An error occurred:", error);
        // await ctx.reply(
        //   "An error occurred while connecting your wallet or sending the transaction."
        // );
    }
});
exports.start = start;
