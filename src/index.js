import dotenv from "dotenv";
import express from "express";
import { BOT_NAME } from "./config";
import { Telegraf, session, Scenes, Markup } from "telegraf";
import { menuCommand, walletsCommand } from "./utils/bot-utils";
import connectDB from "./utils/connect-db";
import {
  handleAddRaffle,
  handleCancel,
  handleConfirmDetails,
  handleNoSplitPool,
  handleSelectTime,
  handleSplitPool,
  handleStartRaffleNow,
  handleTextInputs,
  handleTimeBasedLimit,
  handleValueBasedLimit,
} from "./scenes/add-raffle-actions";

import { importWalletStep } from "./scenes/importWalletScene";
import { chooseWalletNameStep } from "./scenes/chooseWalletNameScene";
import { generateWalletSeedStep } from "./scenes/generateWalletSeedScene";
import { playAmountStep } from "./scenes/playAmountScene";

dotenv.config();

if (!process.env.TELEGRAM_BOT_TOKEN) {
  console.error("Setup your token");
  process.exit(1);
}

const bot = new Telegraf("7518728844:AAEoJq_x2GZyn20GstLgbfskoCsWLLf3TGU");

// // Express app for handling webhook
const app = express();
app.use(express.json());
app.use(bot.webhookCallback("/secret-path"));
bot.telegram.setWebhook(process.env.SERVER_URL);

const stage = new Scenes.Stage([
  importWalletStep,
  chooseWalletNameStep,
  generateWalletSeedStep,
  playAmountStep,
]);

bot.use(session());
bot.use(stage.middleware());

// Set up bot commands and actions
bot.start((ctx) => {
  if (ctx.chat.type === "private" && !ctx.message.from.is_bot) {
    ctx.reply(
      "Welcome to Lucky Dog Raffle Bot! Telegram's Original Buy Bot! What would you like to do today? \n/menu"
    );
  } else {
    console.log("Ignoring automatic or non-private /start command.");
  }
});

bot.command("menu", async (ctx) => {
  await menuCommand(ctx, ctx.session.wallets);
});

bot.action("ADD_BOT", (ctx) => {
  const botUsername = ctx.botInfo.username; // Get bot's username dynamically
  ctx.reply(
    "Welcome to Lucky Dog Raffle Bot! Telegram's Original Buy Bot! What would you like to do today? \n/menu",
    Markup.inlineKeyboard([
      Markup.button.callback("➕ Add a Raffle", "ADD_RAFFLE"),
    ])
  );
});

bot.command("wallets", async (ctx) => {
  console.log("Wallets", ctx.session.wallets);
  await walletsCommand(ctx, ctx.session.wallets);
});

bot.action("wallets", async (ctx) => {
  ctx.deleteMessage();
  await walletsCommand(ctx, ctx.session.wallets);
});

bot.on("new_chat_members", (ctx) => {
  if (
    ctx.message.new_chat_members.some((member) => member.id === ctx.botInfo.id)
  ) {
    ctx.reply(
      `Lucky Dog Raffle Bot has been added to the group! Please click [here](https://t.me/${ctx.botInfo.username}) to continue the setup in the private chat.`,
      { parse_mode: "Markdown" }
    );
  }
});

bot.action("ADD_RAFFLE", (ctx) => {
  handleAddRaffle(ctx);
});

bot.on("text", (ctx) => {
  handleTextInputs(ctx);
});

// handle split percentage for raffle
bot.action("SPLIT_YES", (ctx) => {
  handleSplitPool(ctx);
});

bot.action("SPLIT_NO", (ctx) => {
  handleNoSplitPool(ctx);
});

// handle the raffle start time
bot.action("START_NOW", (ctx) => {
  handleStartRaffleNow(ctx);
});

bot.action("SELECT_TIME", (ctx) => {
  handleSelectTime(ctx);
});

// handle raffle limit
bot.action("TIME_BASED", (ctx) => {
  handleTimeBasedLimit(ctx);
});

bot.action("VALUE_BASED", (ctx) => {
  handleValueBasedLimit(ctx);
});

// confirm details
bot.action("CONFIRM_DETAILS", async (ctx) => {
  handleConfirmDetails(ctx);
});

bot.action("CANCEL_ADD_RAFL", (ctx) => {
  handleCancel(ctx);
});

// Connect to the database
connectDB();

bot.launch(() => {
  console.log("Bot is running....");
});

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
