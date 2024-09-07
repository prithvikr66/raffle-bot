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
exports.menuCommand = void 0;
const telegraf_1 = require("telegraf");
// Function to reply with HTML and inline keyboards
function replyWithHTMLAndInlineKeyboard(ctx, htmlMessage, inlineKeyboard) {
    ctx.replyWithHTML(htmlMessage, {
        reply_markup: {
            inline_keyboard: inlineKeyboard,
        },
    });
}
// Function to create a callback button
function createCallBackBtn(btnLabel, cbActionCommand) {
    return telegraf_1.Markup.button.callback(btnLabel, cbActionCommand);
}
// Show Menu commands
function menuCommand(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        // Send a processing reply and get the message object
        const processingReply = yield ctx.reply("processing...");
        // Create the HTML message content
        let htmlMessage = "👛 Balances (Combined):\n";
        htmlMessage += `<b></b>\n\n${htmlMessage}`;
        // Create inline buttons
        const walletsButton = createCallBackBtn("Wallets", "wallets");
        const addBotButton = createCallBackBtn("🌱 Add bot", "ADD_BOT");
        const historyButton = createCallBackBtn("😎 History", "history");
        // Arrange buttons into an inline keyboard layout
        const inlineKeyboard = [[walletsButton, addBotButton], [historyButton]];
        // Delete the processing message
        yield ctx.deleteMessage(processingReply.message_id);
        // Send the HTML message with inline keyboard
        replyWithHTMLAndInlineKeyboard(ctx, htmlMessage, inlineKeyboard);
    });
}
exports.menuCommand = menuCommand;
//# sourceMappingURL=bot-utils.js.map