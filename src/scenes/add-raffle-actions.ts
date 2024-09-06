import { userState } from "..";
import { Context, Markup } from "telegraf";
import Raffle from "../models/raffle";
import { formatDate } from "../utils/fortmat-date";
export const handleAddRaffle = (ctx: Context) => {
  const chatId = ctx.chat?.id.toString();
  if (chatId) {
    userState[chatId] = { stage: "ASK_RAFFLE_TITLE" };
    ctx.reply("Enter the Raffle Title:");
  } else {
    ctx.reply("Unable to retrieve chat ID. Please try again.");
  }
};

export const handleSplitPool = (ctx: Context) => {
  const chatId = ctx.chat?.id.toString();
  if (chatId) {
    const state = userState[chatId];
    if (state) {
      state.splitPool = "YES";
      state.stage = "ASK_SPLIT_PERCENT";
      ctx.reply("Please enter the split percentage for the owner:");
    }
  }
};
export const handleNoSplitPool = (ctx: Context) => {
  const chatId = ctx.chat?.id.toString();
  if (chatId) {
    const state = userState[chatId];
    if (state) {
      state.splitPool = "NO";
      state.stage = "ASK_RAFFLE_START_TIME";
      ctx.reply(
        "Set raffle start time:",
        Markup.inlineKeyboard([
          [Markup.button.callback("🙌 Now", "START_NOW")],
          [Markup.button.callback("🕰️ Select time", "SELECT_TIME")],
        ])
      );
    }
  }
};

export const handleStartRaffleNow = (ctx: Context) => {
  const chatId = ctx.chat?.id.toString();
  if (chatId) {
    const state = userState[chatId];
    if (state) {
      state.startTime = formatDate(new Date());
      ctx.reply("Your raffle will start as soon as it is created.");
      state.stage = "ASK_RAFFLE_LIMIT";
      ctx.reply(
        "Set raffle limit:",
        Markup.inlineKeyboard([
          [Markup.button.callback("⏱️ Time based", "TIME_BASED")],
          [Markup.button.callback("#️⃣ Value based", "VALUE_BASED")],
        ])
      );
    }
  }
};

export const handleSelectTIme = (ctx: Context) => {
  const chatId = ctx.chat?.id.toString();
  if (chatId) {
    const state = userState[chatId];
    if (state) {
      state.startTimeOption = "SELECT";
      state.stage = "ASK_RAFFLE_START_TIME";
      ctx.reply(
        "Enter the start date & time in this format DD-MM-YYYY HH:MM\nExample: 04-09-2024 15:06"
      );
    }
  }
};
export const handleTimeBasedLimit = (ctx: Context) => {
  const chatId = ctx.chat?.id.toString();
  if (chatId) {
    const state = userState[chatId];
    if (state) {
      state.raffleLimitOption = "TIME_BASED";
      state.stage = "ASK_RAFFLE_END_TIME";
      ctx.reply(
        "Enter the end date & time in this format DD-MM-YYYY HH:MM\nExample: 04-09-2024 15:06"
      );
    }
  }
};

export const handleValueBasedLimit = (ctx: Context) => {
  const chatId = ctx.chat?.id.toString();
  if (chatId) {
    const state = userState[chatId];
    if (state) {
      state.raffleLimitOption = "VALUE_BASED";
      state.stage = "ASK_RAFFLE_VALUE";
      ctx.reply("Enter the number of Tickets");
    }
  }
};

export const handleConfirmDetails = async (ctx: Context) => {
  const chatId = ctx.chat?.id.toString();
  if (chatId) {
    const state = userState[chatId];
    if (state) {
      try {
        const raffle = new Raffle({
          createdBy: ctx.from?.username?.toString(),
          createdGroup: "Placeholder",
          raffleTitle: state.raffleTitle,
          rafflePrice: state.rafflePrice,
          splitPool: state.splitPool,
          splitPercentage: state.splitPercentage || null,
          ownerWalletAddress: state.ownerWalletAddress || null,
          startTimeOption: state.startTimeOption,
          startTime: state.startTime,
          raffleLimitOption: state.raffleLimitOption,
          raffleEndTime: state.raffleEndTime || null,
          raffleEndValue: state.raffleEndValue || null,
          rafflePurpose: state.rafflePurpose,
        });

        await raffle.save();
        ctx.reply("Raffle successfully created! 🎉🎉");
        delete userState[chatId];
      } catch (error) {
        console.error("Error saving raffle to MongoDB:", error);
        ctx.reply("Failed to create raffle. Please try again.");
      }
    }
  }
};

export const handleCancel = (ctx: Context) => {
  const chatId = ctx.chat?.id.toString();
  ctx.reply("Operation canceled");
  if (chatId) delete userState[chatId];
};
export const handleTextInputs = (ctx: any) => {
  const chatId = ctx.chat?.id.toString();
  if (chatId) {
    const state = userState[chatId];
    if (state) {
      switch (state?.stage) {
        case "ASK_RAFFLE_TITLE":
          state.raffleTitle = ctx.message?.text;
          state.stage = "ASK_RAFFLE_PRICE";
          ctx.reply("Enter raffle Ticket Price(ETH):");
          break;

        case "ASK_RAFFLE_PRICE":
          state.rafflePrice = Number(ctx.message.text);
          state.stage = "ASK_SPLIT_POOL";
          ctx.reply(
            "Do you wish to have a split of the Raffle Pool?",
            Markup.inlineKeyboard([
              [
                Markup.button.callback("☑️ Yes", "SPLIT_YES"),
                Markup.button.callback("❌ No", "SPLIT_NO"),
              ],
            ])
          );
          break;

        case "ASK_SPLIT_PERCENT":
          state.splitPercentage = Number(ctx.message.text);
          state.stage = "ASK_WALLET_ADDRESS";
          ctx.reply("Enter the wallet address to receive the share:");
          break;

        case "ASK_WALLET_ADDRESS":
          state.ownerWalletAddress = ctx.message.text;
          state.stage = "ASK_RAFFLE_START_TIME";
          ctx.reply(
            "Set raffle start time:",
            Markup.inlineKeyboard([
              [Markup.button.callback("🙌 Now", "START_NOW")],
              [Markup.button.callback("🕰️ Select time", "SELECT_TIME")],
            ])
          );
          break;

        case "ASK_RAFFLE_START_TIME":
          state.startTime = ctx.message.text;
          state.stage = "ASK_RAFFLE_LIMIT";
          ctx.reply(
            "Set raffle limit:",
            Markup.inlineKeyboard([
              [Markup.button.callback("⏱️ Time based", "TIME_BASED")],
              [Markup.button.callback("#️⃣ Value based", "VALUE_BASED")],
            ])
          );
          break;

        case "ASK_RAFFLE_VALUE":
          state.raffleEndValue = Number(ctx.message.text);
          state.stage = "ASK_RAFFLE_PURPOSE";
          ctx.reply("Add raffle purpose or description:");
          break;
        case "ASK_RAFFLE_END_TIME":
          state.raffleEndTime = ctx.message.text;
          state.stage = "ASK_RAFFLE_PURPOSE";
          ctx.reply("Add raffle purpose or description:");
          break;

        case "ASK_RAFFLE_PURPOSE":
          state.rafflePurpose = ctx.message.text;
          ctx.reply(
            `Raffle Title: ${state.raffleTitle}
Raffle Ticket Price: ${state.rafflePrice}ETH
${
  state.splitPool == "YES"
    ? `Split Raffle Pool: Yes
Split Percentage for Owner: ${state.splitPercentage}%
Wallet Address: ${state.ownerWalletAddress}`
    : `Split Raffle Pool: No`
}
Raffle Start Time: ${state.startTime}
${
  state.raffleLimitOption === "VALUE_BASED"
    ? `Raffle Limit Option: Value Based
Raffle Limit Value: ${state.raffleEndValue} Tickets`
    : `Raffle Limit Option: Time Based
Raffle End Time: ${state.raffleEndTime}`
}
Raffle Description/Purpose: ${state.rafflePurpose}`,
            Markup.inlineKeyboard([
              [
                Markup.button.callback(
                  "☑️ Confirm and Create",
                  "CONFIRM_DETAILS"
                ),
              ],
              [Markup.button.callback("❌ Cancel", "CANCEL_ADD_RAFL")],
            ])
          );
          break;

        default:
          ctx.reply("Unexpected input. Please start the process again.");
          break;
      }
    }
  }
};
