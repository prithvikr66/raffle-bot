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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userState = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const telegraf_1 = require("telegraf");
const express_1 = __importDefault(require("express"));
const bot_utils_1 = require("./utils/bot-utils");
const connect_db_1 = __importDefault(require("./utils/connect-db"));
const add_raffle_actions_1 = require("./scenes/add-raffle-actions");
dotenv_1.default.config();
const app = (0, express_1.default)();
const bot = new telegraf_1.Telegraf("7518728844:AAEoJq_x2GZyn20GstLgbfskoCsWLLf3TGU");
const userState = {};
exports.userState = userState;
// Add your bot commands and actions
bot.start((ctx) => {
    ctx.reply("Welcome to Lucky Dog Raffle Bot! Telegram's original raffle bot that allows you to easily create and manage raffles for your group. How can I assist you today?", telegraf_1.Markup.inlineKeyboard([
        telegraf_1.Markup.button.callback("➕ Add a Raffle", "ADD_RAFFLE"),
    ]));
});
bot.command("menu", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, bot_utils_1.menuCommand)(ctx);
}));
bot.action("ADD_RAFFLE", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    (0, add_raffle_actions_1.handleAddRaffle)(ctx);
    // start(ctx,"0xd99FF85E7377eF02E6996625Ad155a2E4C63E7be");
}));
bot.on("text", (ctx) => {
    (0, add_raffle_actions_1.handleTextInputs)(ctx);
});
bot.action("SPLIT_YES", (ctx) => {
    (0, add_raffle_actions_1.handleSplitPool)(ctx);
});
bot.action("SPLIT_NO", (ctx) => {
    (0, add_raffle_actions_1.handleNoSplitPool)(ctx);
});
bot.action("START_NOW", (ctx) => {
    (0, add_raffle_actions_1.handleStartRaffleNow)(ctx);
});
bot.action("SELECT_TIME", (ctx) => {
    (0, add_raffle_actions_1.handleSelectTime)(ctx);
});
bot.action("TIME_BASED", (ctx) => {
    (0, add_raffle_actions_1.handleTimeBasedLimit)(ctx);
});
bot.action("VALUE_BASED", (ctx) => {
    (0, add_raffle_actions_1.handleValueBasedLimit)(ctx);
});
bot.action("CONFIRM_DETAILS", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    (0, add_raffle_actions_1.handleConfirmDetails)(ctx);
}));
bot.action("CANCEL_ADD_RAFL", (ctx) => {
    (0, add_raffle_actions_1.handleCancel)(ctx);
});
app.use(bot.webhookCallback('/api/telegram'));
// bot.telegram.setWebhook(`https://<your-vercel-domain>/api/telegram`);
bot.launch();
// Export express app for Vercel
exports.default = app;
// Connect to database
(0, connect_db_1.default)();
