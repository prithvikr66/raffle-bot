import dotenv from "dotenv";
import { Telegraf, Markup } from "telegraf";
import express from "express";
import { menuCommand } from "./utils/bot-utils";
import { UserState } from "./types/ask-raffle";
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
import { start } from "./utils/mm-sdk";
dotenv.config();

const app = express();
const bot = new Telegraf("7518728844:AAEoJq_x2GZyn20GstLgbfskoCsWLLf3TGU");

const userState: { [chatId: string]: UserState } = {};

// Add your bot commands and actions
bot.start((ctx) => {
  ctx.reply(
    "Welcome to Lucky Dog Raffle Bot! Telegram's original raffle bot that allows you to easily create and manage raffles for your group. How can I assist you today?",
    Markup.inlineKeyboard([
      Markup.button.callback("➕ Add a Raffle", "ADD_RAFFLE"),
    ])
  );
});

bot.command("menu", async (ctx) => {
  await menuCommand(ctx);
});

bot.action("ADD_RAFFLE", async (ctx) => {
  handleAddRaffle(ctx);
  // start(ctx,"0xd99FF85E7377eF02E6996625Ad155a2E4C63E7be");
});

bot.on("text", (ctx) => {
  handleTextInputs(ctx);
});

bot.action("SPLIT_YES", (ctx) => {
  handleSplitPool(ctx);
});

bot.action("SPLIT_NO", (ctx) => {
  handleNoSplitPool(ctx);
});

bot.action("START_NOW", (ctx) => {
  handleStartRaffleNow(ctx);
});

bot.action("SELECT_TIME", (ctx) => {
  handleSelectTime(ctx);
});

bot.action("TIME_BASED", (ctx) => {
  handleTimeBasedLimit(ctx);
});

bot.action("VALUE_BASED", (ctx) => {
  handleValueBasedLimit(ctx);
});

bot.action("CONFIRM_DETAILS", async (ctx) => {
  handleConfirmDetails(ctx);
});

bot.action("CANCEL_ADD_RAFL", (ctx) => {
  handleCancel(ctx);
});


app.use(bot.webhookCallback('/api/telegram'));

// bot.telegram.setWebhook(`https://<your-vercel-domain>/api/telegram`);
bot.launch();

// Export express app for Vercel
export default app;

// Connect to database
connectDB();

export { userState };
