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
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const config_1 = require("./config");
const telegraf_1 = require("telegraf");
const bot_utils_1 = require("./utils/bot-utils");
const connect_db_1 = __importDefault(require("./utils/connect-db"));
const add_raffle_actions_1 = require("./scenes/add-raffle-actions");
const importWalletScene_1 = require("./scenes/importWalletScene");
const chooseWalletNameScene_1 = require("./scenes/chooseWalletNameScene");
const generateWalletSeedScene_1 = require("./scenes/generateWalletSeedScene");
const playAmountScene_1 = require("./scenes/playAmountScene");
dotenv_1.default.config();
if (!process.env.TELEGRAM_BOT_TOKEN) {
    console.error("Setup your token");
    process.exit(1);
}
const bot = new telegraf_1.Telegraf("7518728844:AAEoJq_x2GZyn20GstLgbfskoCsWLLf3TGU");
// // Express app for handling webhook
// const app = express();
// app.use(express.json());
// app.use(bot.webhookCallback("/secret-path"));
// bot.telegram.setWebhook(process.env.SERVER_URL);
const stage = new telegraf_1.Scenes.Stage([
    importWalletScene_1.importWalletStep,
    chooseWalletNameScene_1.chooseWalletNameStep,
    generateWalletSeedScene_1.generateWalletSeedStep,
    playAmountScene_1.playAmountStep,
]);
bot.use((0, telegraf_1.session)());
bot.use(stage.middleware());
// Set up bot commands and actions
// bot.start((ctx) => {
//   if (ctx.chat.type === "private" && !ctx.message.from.is_bot) {
//     ctx.reply(
//       "Welcome to Lucky Dog Raffle Bot! Telegram's Original Buy Bot! What would you like to do today? \n/menu"
//     );
//   } else {
//     console.log("Ignoring automatic or non-private /start command.");
//   }
// });
bot.command("menu", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, bot_utils_1.menuCommand)(ctx, ctx.session.wallets);
}));
bot.command("start", (ctx) => {
    const botUsername = ctx.botInfo.username; // Get bot's username dynamically
    ctx.reply("Welcome to Lucky Dog Raffle Bot! Telegram's Original Buy Bot! What would you like to do today? \n/menu", telegraf_1.Markup.inlineKeyboard([
        telegraf_1.Markup.button.callback("➕ Add a Raffle", "ADD_RAFFLE"),
    ]));
});
bot.command("wallets", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, bot_utils_1.walletsCommand)(ctx, ctx.session.wallets);
}));
bot.command("wallets", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    ctx.deleteMessage();
    yield (0, bot_utils_1.walletsCommand)(ctx, ctx.session.wallets);
}));
bot.on("new_chat_members", (ctx) => {
    if (ctx.message.new_chat_members.some((member) => member.id === ctx.botInfo.id)) {
        ctx.reply(`Lucky Dog Raffle Bot has been added to the group! Please click [here](https://t.me/${ctx.botInfo.username}) to continue the setup in the private chat.`, { parse_mode: "Markdown" });
    }
});
bot.action("ADD_RAFFLE", (ctx) => {
    (0, add_raffle_actions_1.handleAddRaffle)(ctx);
});
bot.on("text", (ctx) => {
    (0, add_raffle_actions_1.handleTextInputs)(ctx);
});
// handle split percentage for raffle
bot.action("SPLIT_YES", (ctx) => {
    (0, add_raffle_actions_1.handleSplitPool)(ctx);
});
bot.action("SPLIT_NO", (ctx) => {
    (0, add_raffle_actions_1.handleNoSplitPool)(ctx);
});
// handle the raffle start time
bot.action("START_NOW", (ctx) => {
    (0, add_raffle_actions_1.handleStartRaffleNow)(ctx);
});
bot.action("SELECT_TIME", (ctx) => {
    (0, add_raffle_actions_1.handleSelectTime)(ctx);
});
// handle raffle limit
bot.action("TIME_BASED", (ctx) => {
    (0, add_raffle_actions_1.handleTimeBasedLimit)(ctx);
});
bot.action("VALUE_BASED", (ctx) => {
    (0, add_raffle_actions_1.handleValueBasedLimit)(ctx);
});
// confirm details
bot.action("CONFIRM_DETAILS", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    (0, add_raffle_actions_1.handleConfirmDetails)(ctx);
}));
bot.action("CANCEL_ADD_RAFL", (ctx) => {
    (0, add_raffle_actions_1.handleCancel)(ctx);
});
// Connect to the database
(0, connect_db_1.default)();
bot.launch(() => {
    console.log("Bot is running....");
});
// Start the Express server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
//# sourceMappingURL=index.js.map