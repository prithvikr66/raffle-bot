import dotenv, { config } from "dotenv";
import express from "express";
import { BOT_NAME } from "./config";
import { Telegraf, Context, Markup } from "telegraf";
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


// Express app for handling webhook
const app = express();
app.use(express.json());
app.use(bot.webhookCallback("/secret-path"));
bot.telegram.setWebhook("https://lucky-dog-raffle.onrender.com/secret-path");

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

// bot.action("ADD_BOT", (ctx: Context) => {
//   const botUsername = ctx.botInfo.username; // Get bot's username dynamically

//   ctx.reply(
// <<<<<<< prithvi
//     "Welcome to Lucky Dog Raffle Bot! Telegram's Original Buy Bot! What would you like to do today? \n/menu",
//     Markup.inlineKeyboard([
//       Markup.button.callback("➕ Add a Raffle", "ADD_RAFFLE"),
// =======
//     "Use the buttons below to select the group or channel that you want to add or modify Bobby with (If Bobby is not in this group, it will be automatically added).",
//     Markup.inlineKeyboard([
//       Markup.button.url(
//         "Click here to select your Group",
//         `https://t.me/${botUsername}?startgroup=true`
//       ),
//       Markup.button.callback("Click here to select your Channel", "ADD_RAFFLE"),
// >>>>>>> main
//     ])
//   );
// });

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
// bot.launch(() => {
//   console.log("Bot is running...");
// });

// // Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
