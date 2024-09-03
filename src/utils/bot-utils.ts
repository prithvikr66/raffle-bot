import { Markup, Context, Telegraf } from "telegraf";
import { InlineKeyboardButton } from "@telegraf/types";

// Function to reply with HTML and inline keyboards
function replyWithHTMLAndInlineKeyboard(
  ctx: Context,
  htmlMessage: string,
  inlineKeyboard: InlineKeyboardButton[][]
) {
  ctx.replyWithHTML(htmlMessage, {
    reply_markup: {
      inline_keyboard: inlineKeyboard,
    },
  });
}

// Function to create a callback button
function createCallBackBtn(btnLabel: string, cbActionCommand: string) {
  return Markup.button.callback(btnLabel, cbActionCommand);
}

// Show Menu commands
async function menuCommand(ctx: Context) {
  // Send a processing reply and get the message object
  const processingReply = await ctx.reply("processing...");

  // Create the HTML message content
  let htmlMessage = "👛 Balances (Combined):\n";
  htmlMessage += `<b></b>\n\n${htmlMessage}`;

  // Create inline buttons
  const walletsButton = createCallBackBtn("Wallets", "wallets");
  const playButton = createCallBackBtn("🌱Play", "play");
  const historyButton = createCallBackBtn("😎History", "history");

  // Arrange buttons into an inline keyboard layout
  const inlineKeyboard = [[walletsButton, playButton], [historyButton]];

  // Delete the processing message
  await ctx.deleteMessage(processingReply.message_id);

  // Send the HTML message with inline keyboard
  replyWithHTMLAndInlineKeyboard(ctx, htmlMessage, inlineKeyboard);
}

export { menuCommand };
