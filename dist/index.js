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
const express_1 = __importDefault(require("express"));
const telegraf_1 = require("telegraf");
const bot_utils_1 = require("./utils/bot-utils");
const connect_db_1 = __importDefault(require("./utils/connect-db"));
const add_raffle_actions_1 = require("./scenes/add-raffle-actions");
dotenv_1.default.config();
let bot;
const userState = {};
exports.userState = userState;
console.log(process.env.TELEGRAM_BOT_TOKEN);
if (process.env.TELEGRAM_BOT_TOKEN) {
    bot = new telegraf_1.Telegraf(process.env.TELEGRAM_BOT_TOKEN);
}
else {
    console.log("Setup your token");
}
bot === null || bot === void 0 ? void 0 : bot.start((ctx) => {
    ctx.reply("Welcome to Lucky Dog Raffle Bot! Telegram's Original Buy Bot! What would you like to do today? \n/menu", telegraf_1.Markup.inlineKeyboard([
        telegraf_1.Markup.button.callback("➕ Add a Raffle", "ADD_RAFFLE"),
    ]));
if (!process.env.TELEGRAM_BOT_TOKEN) {
    console.error("TELEGRAM_BOT_TOKEN is not set in environment variables.");
    process.exit(1);
}
const bot = new telegraf_1.Telegraf(process.env.TELEGRAM_BOT_TOKEN);
// Express app for handling webhook
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(bot.webhookCallback("/secret-path"));
bot.telegram.setWebhook("https://lucky-dog-raffle.vercel.app/secret-path");
// Set up bot commands and actions
bot.start((ctx) => {
    if (ctx.chat.type === "private" && !ctx.message.from.is_bot) {
        ctx.reply("Welcome to Lucky Dog Raffle Bot! Telegram's Original Buy Bot! What would you like to do today? \n/menu");
    }
    else {
        console.log("Ignoring automatic or non-private /start command.");
    }
});
bot.command("menu", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, bot_utils_1.menuCommand)(ctx);
}));
bot === null || bot === void 0 ? void 0 : bot.action("ADD_RAFFLE", (ctx) => {
    (0, add_raffle_actions_1.handleAddRaffle)(ctx);
});
bot === null || bot === void 0 ? void 0 : bot.on("text", (ctx) => {
    (0, add_raffle_actions_1.handleTextInputs)(ctx);
});
// handle split percentage for raffle
bot === null || bot === void 0 ? void 0 : bot.action("SPLIT_YES", (ctx) => {
    (0, add_raffle_actions_1.handleSplitPool)(ctx);
});
bot === null || bot === void 0 ? void 0 : bot.action("SPLIT_NO", (ctx) => {
    (0, add_raffle_actions_1.handleNoSplitPool)(ctx);
});
// handle the raffle start time
bot === null || bot === void 0 ? void 0 : bot.action("START_NOW", (ctx) => {
    (0, add_raffle_actions_1.handleStartRaffleNow)(ctx);
});
bot === null || bot === void 0 ? void 0 : bot.action("SELECT_TIME", (ctx) => {
    (0, add_raffle_actions_1.handleSelectTIme)(ctx);
});
// handle raffle limit
bot === null || bot === void 0 ? void 0 : bot.action("TIME_BASED", (ctx) => {
    (0, add_raffle_actions_1.handleTimeBasedLimit)(ctx);
});
bot === null || bot === void 0 ? void 0 : bot.action("VALUE_BASED", (ctx) => {
    (0, add_raffle_actions_1.handleValueBasedLimit)(ctx);
});
// confirm details
bot === null || bot === void 0 ? void 0 : bot.action("CONFIRM_DETAILS", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    (0, add_raffle_actions_1.handleConfirmDetails)(ctx);
}));
bot === null || bot === void 0 ? void 0 : bot.action("CANCEL_ADD_RAFL", (ctx) => {
    (0, add_raffle_actions_1.handleCancel)(ctx);
});
bot === null || bot === void 0 ? void 0 : bot.launch();
(0, connect_db_1.default)();
bot.action("ADD_BOT", (ctx) => {
    const botUsername = ctx.botInfo.username; // Get bot's username dynamically
    ctx.reply("Use the buttons below to select the group or channel that you want to add or modify Bobby with (If Bobby is not in this group, it will be automatically added).", telegraf_1.Markup.inlineKeyboard([
        telegraf_1.Markup.button.url("Click here to select your Group", `https://t.me/${botUsername}?startgroup=true`),
        telegraf_1.Markup.button.callback("Click here to select your Channel", "ADD_RAFFLE"),
    ]));
});
bot.on("new_chat_members", (ctx) => {
    if (ctx.message.new_chat_members.some((member) => member.id === ctx.botInfo.id)) {
        ctx.reply(`Lucky Dog Raffle Bot has been added to the group! Please click [here](https://t.me/${ctx.botInfo.username}) to continue the setup in the private chat.`, { parse_mode: "Markdown" });
    }
});
// bot.launch(() => {
//   console.log("Bot is running...");
// });
// // Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map
