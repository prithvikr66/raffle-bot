import dotenv from "dotenv";
import { BOT_NAME } from "./config";
import { Telegraf } from "telegraf";
import { menuCommand } from "./utils/bot-utils";

dotenv.config();

let bot;

if (process.env.TELEGRAM_BOT_TOKEN) {
  bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
} else {
  console.log("Setup your token");
}

bot?.start((ctx) => {
  ctx.reply(
    "Welcome to Lucky Dog Raffle Bot! Telegram's Original Buy Bot! What would you like to do today? \n/menu"
  );
});

bot?.command("menu", async (ctx) => {
  await menuCommand(ctx);
});


bot?.launch();
