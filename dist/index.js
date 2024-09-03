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
const telegraf_1 = require("telegraf");
const bot_utils_1 = require("./utils/bot-utils");
dotenv_1.default.config();
let bot;
if (process.env.TELEGRAM_BOT_TOKEN) {
    bot = new telegraf_1.Telegraf(process.env.TELEGRAM_BOT_TOKEN);
}
else {
    console.log("Setup your token");
}
bot === null || bot === void 0 ? void 0 : bot.start((ctx) => {
    ctx.reply("Welcome to Lucky Dog Raffle Bot! Telegram's Original Buy Bot! What would you like to do today? \n/menu");
});
bot === null || bot === void 0 ? void 0 : bot.command("menu", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, bot_utils_1.menuCommand)(ctx);
}));
bot === null || bot === void 0 ? void 0 : bot.launch();
