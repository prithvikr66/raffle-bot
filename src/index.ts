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
  handleSelectTIme,
  handleSplitPool,
  handleStartRaffleNow,
  handleTextInputs,
  handleTimeBasedLimit,
  handleValueBasedLimit,
} from "./scenes/add-raffle-actions";

dotenv.config();

const app = express();
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

const userState: { [chatId: string]: UserState } = {};

// Add your bot commands and actions
bot.start((ctx) => {
  ctx.reply(
    "Welcome to Lucky Dog Raffle Bot! How can I assist you today? \n/menu",
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
  handleSelectTIme(ctx);
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

// Setup webhook for Telegraf on Vercel
app.use(bot.webhookCallback('/api/telegram'));

bot.telegram.setWebhook(`https://<your-vercel-domain>/api/telegram`);

// Export express app for Vercel
export default app;

// Connect to database
connectDB();

export { userState };
