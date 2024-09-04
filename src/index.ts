import dotenv, { config } from "dotenv";
import express from "express";
import { BOT_NAME } from "./config";
import { Telegraf, Context, Markup } from "telegraf";
import { menuCommand } from "./utils/bot-utils";

dotenv.config();

if (!process.env.TELEGRAM_BOT_TOKEN) {
  console.error("TELEGRAM_BOT_TOKEN is not set in environment variables.");
  process.exit(1);
}

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// Express app for handling webhook
const app = express();
app.use(express.json());
app.use(bot.webhookCallback("/secret-path"));
bot.telegram.setWebhook("https://lucky-dog-raffle.vercel.app/secret-path");

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
  await menuCommand(ctx);
});

bot.action("ADD_BOT", (ctx: Context) => {
  const botUsername = ctx.botInfo.username; // Get bot's username dynamically

  ctx.reply(
    "Use the buttons below to select the group or channel that you want to add or modify Bobby with (If Bobby is not in this group, it will be automatically added).",
    Markup.inlineKeyboard([
      Markup.button.url(
        "Click here to select your Group",
        `https://t.me/${botUsername}?startgroup=true`
      ),
      Markup.button.callback("Click here to select your Channel", "ADD_RAFFLE"),
    ])
  );
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

// bot.launch(() => {
//   console.log("Bot is running...");
// });

// // Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
