import dotenv from "dotenv";
import { Telegraf, Markup } from "telegraf";
import { menuCommand } from "./utils/bot-utils";
import { UserState } from "./types/ask-raffle";
import connectDB from "./utils/connect-db";
import {
  handleAddRaffle,
  handleCancel,
  handleConfirmDetails,
  handleNoSplitPool,
  handleSelectTIme,
  handleSplitPool,
  handleStartRaffleNow,
  handleTextInputs,
  handleTimeBasedLimit,
  handleValueBasedLimit,
} from "./scenes/add-raffle-actions";

dotenv.config();

let bot;

const userState: { [chatId: string]: UserState } = {};
console.log(process.env.TELEGRAM_BOT_TOKEN)
if (process.env.TELEGRAM_BOT_TOKEN) {
bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
} else {
  console.log("Setup your token");
}

bot?.start((ctx) => {
  ctx.reply(
    "Welcome to Lucky Dog Raffle Bot! Telegram's Original Buy Bot! What would you like to do today? \n/menu",
    Markup.inlineKeyboard([
      Markup.button.callback("➕ Add a Raffle", "ADD_RAFFLE"),
    ])
  );
});

bot?.command("menu", async (ctx) => {
  await menuCommand(ctx);
});

bot?.action("ADD_RAFFLE", (ctx) => {
  handleAddRaffle(ctx);
});

bot?.on("text", (ctx) => {
  handleTextInputs(ctx);
});

// handle split percentage for raffle
bot?.action("SPLIT_YES", (ctx) => {
  handleSplitPool(ctx);
});

bot?.action("SPLIT_NO", (ctx) => {
  handleNoSplitPool(ctx);
});

// handle the raffle start time
bot?.action("START_NOW", (ctx) => {
  handleStartRaffleNow(ctx);
});

bot?.action("SELECT_TIME", (ctx) => {
  handleSelectTIme(ctx);
});

// handle raffle limit
bot?.action("TIME_BASED", (ctx) => {
  handleTimeBasedLimit(ctx);
});

bot?.action("VALUE_BASED", (ctx) => {
  handleValueBasedLimit(ctx);
});

// confirm details
bot?.action("CONFIRM_DETAILS", async (ctx) => {
  handleConfirmDetails(ctx);
});

bot?.action("CANCEL_ADD_RAFL", (ctx) => {
  handleCancel(ctx);
});

bot?.launch();

connectDB();

export { userState };
