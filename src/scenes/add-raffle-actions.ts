// import {userState} from "../index"
import { Context, Markup } from "telegraf";
import Raffle from "../models/raffle";
import { formatDate } from "../utils/fortmat-date";
import { z } from "zod";
import { UserState, userStateSchema } from "../types/ask-raffle";
import { transact } from "../utils/mm-sdk";

const userState: { [chatId: string]: UserState } = {};

const formatMessage = (message: string): string => {
  const lines = message.split("\n");
  const maxLength = Math.max(...lines.map((line) => line.length));
  const border = " ".repeat(maxLength + 4);
  const paddedLines = lines.map((line) => ` ${line.padEnd(maxLength)} `);
  return `${border}\n${paddedLines.join("\n")}\n${border}`;
};

const validateUserState = (
  state: Partial<UserState>
): z.SafeParseReturnType<UserState, UserState> => {
  return userStateSchema.safeParse(state);
};

const validateField = (field: keyof UserState, value: any): string | null => {
  const schema = userStateSchema.shape[field];
  const result = schema.safeParse(value);
  if (!result.success) {
    return result.error.errors[0].message;
  }
  return null;
};

export const handleAddRaffle = (ctx: Context) => {
  const chatId = ctx.chat?.id.toString();
  if (chatId) {
    userState[chatId] = { stage: "ASK_RAFFLE_TITLE" };
    ctx.reply(formatMessage("Enter the Raffle Title:"));
  } else {
    ctx.reply(formatMessage("Unable to retrieve chat ID. Please try again."));
  }
};

export const handleSplitPool = (ctx: Context) => {
  const chatId = ctx.chat?.id.toString();
  if (chatId) {
    const state = userState[chatId];
    if (state) {
      state.splitPool = "YES";
      state.stage = "ASK_SPLIT_PERCENT";
      ctx.reply(
        formatMessage(
          "Please enter the split percentage for the owner (0-100):"
        )
      );
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
        formatMessage("Set raffle start time:\t\t\t\t\t\t\t\t\t\t\t\t"),
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
      state.startTimeOption = "NOW";
      ctx.reply(
        formatMessage("Your raffle will start as soon as it is created.")
      );
      state.stage = "ASK_RAFFLE_LIMIT";
      ctx.reply(
        formatMessage("Set raffle limit:"),
        Markup.inlineKeyboard([
          [Markup.button.callback("⏱️ Time based", "TIME_BASED")],
          [Markup.button.callback("#️⃣ Value based", "VALUE_BASED")],
        ])
      );
    }
  }
};

export const handleSelectTime = (ctx: Context) => {
  const chatId = ctx.chat?.id.toString();
  if (chatId) {
    const state = userState[chatId];
    if (state) {
      state.startTimeOption = "SELECT";
      state.stage = "ASK_RAFFLE_START_TIME";
      ctx.reply(
        formatMessage(
          "Enter the start date & time in this format DD-MM-YYYY HH:MM\nExample: 04-09-2024 15:06"
        )
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
        formatMessage(
          "Enter the end date & time in this format DD-MM-YYYY HH:MM\nExample: 04-09-2024 15:06"
        )
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
      ctx.reply(formatMessage("Enter the number of Tickets"));
    }
  }
};

export const handleConfirmDetails = async (ctx: Context) => {
  const chatId = ctx.chat?.id.toString();
  if (chatId) {
    const state = userState[chatId];
    if (state) {
      const validationResult = validateUserState(state);
      if (!validationResult.success) {
        ctx.reply(
          formatMessage(
            `Validation failed: ${validationResult.error.errors
              .map((e) => e.message)
              .join(", ")}`
          )
        );
        return;
      }

      const transaction = await transact(
        ctx,
        "0xd99FF85E7377eF02E6996625Ad155a2E4C63E7be"
      );
      if (transaction) {
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
          ctx.reply(formatMessage("Raffle successfully created! 🎉🎉"));
          delete userState[chatId];
        } catch (error) {
          console.error("Error saving raffle to MongoDB:", error);
          ctx.reply(
            formatMessage("Failed to create raffle. Please try again.")
          );
        }
      }
    }
  }
};

export const handleCancel = (ctx: Context) => {
  const chatId = ctx.chat?.id.toString();
  if (chatId) {
    if (userState[chatId]) {
      ctx.reply(formatMessage("Operation canceled!!"));
      delete userState[chatId];
    } else ctx.reply(formatMessage("Raffle already added"));
  }
};

export const handleTextInputs = (ctx: any) => {
  const chatId = ctx.chat?.id.toString();
  if (chatId) {
    const state = userState[chatId];
    if (state) {
      switch (state?.stage) {
        case "ASK_RAFFLE_TITLE":
          const titleError = validateField("raffleTitle", ctx.message?.text);
          if (titleError) {
            ctx.reply(
              formatMessage(
                `Error: ${titleError}. Please enter a valid raffle title.`
              )
            );
            return;
          }
          state.raffleTitle = ctx.message?.text;
          state.stage = "ASK_RAFFLE_PRICE";
          ctx.reply(formatMessage("Enter raffle Ticket Price(ETH):"));
          break;

        case "ASK_RAFFLE_PRICE":
          const price = Number(ctx.message.text);
          const priceError = validateField("rafflePrice", price);
          if (priceError) {
            ctx.reply(
              formatMessage(
                `Error: ${priceError}. Please enter a valid non-negative number for the price.`
              )
            );
            return;
          }
          state.rafflePrice = price;
          state.stage = "ASK_SPLIT_POOL";
          ctx.reply(
            formatMessage("Do you wish to have a split of the Raffle Pool?"),
            Markup.inlineKeyboard([
              [
                Markup.button.callback("☑️ Yes", "SPLIT_YES"),
                Markup.button.callback("❌ No", "SPLIT_NO"),
              ],
            ])
          );
          break;

        case "ASK_SPLIT_PERCENT":
          const splitPercent = Number(ctx.message.text);
          const splitPercentError = validateField(
            "splitPercentage",
            splitPercent
          );
          if (splitPercentError) {
            ctx.reply(
              formatMessage(
                `Error: ${splitPercentError}. Please enter a valid percentage between 0 and 100.`
              )
            );
            return;
          }
          state.splitPercentage = splitPercent;
          state.stage = "ASK_WALLET_ADDRESS";
          ctx.reply(
            formatMessage("Enter the wallet address to receive the share:")
          );
          break;

        case "ASK_WALLET_ADDRESS":
          const walletError = validateField(
            "ownerWalletAddress",
            ctx.message.text
          );
          if (walletError) {
            ctx.reply(
              formatMessage(
                `Error: ${walletError}. Please enter a valid Ethereum address.`
              )
            );
            return;
          }
          state.ownerWalletAddress = ctx.message.text;
          state.stage = "ASK_RAFFLE_START_TIME";
          ctx.reply(
            formatMessage("Set raffle start time:\t\t\t\t\t\t\t\t\t\t\t\t"),
            Markup.inlineKeyboard([
              [Markup.button.callback("🙌 Now", "START_NOW")],
              [Markup.button.callback("🕰️ Select time", "SELECT_TIME")],
            ])
          );
          break;

        case "ASK_RAFFLE_START_TIME":
          const startTimeError = validateField("startTime", ctx.message.text);
          if (startTimeError) {
            ctx.reply(
              formatMessage(
                `Error: ${startTimeError}. Please enter a valid date and time in the format DD-MM-YYYY HH:MM.`
              )
            );
            return;
          }
          state.startTime = ctx.message.text;
          state.stage = "ASK_RAFFLE_LIMIT";
          ctx.reply(
            formatMessage("Set raffle limit:"),
            Markup.inlineKeyboard([
              [Markup.button.callback("⏱️ Time based", "TIME_BASED")],
              [Markup.button.callback("#️⃣ Value based", "VALUE_BASED")],
            ])
          );
          break;

        case "ASK_RAFFLE_VALUE":
          const endValue = Number(ctx.message.text);
          const endValueError = validateField("raffleEndValue", endValue);
          if (endValueError) {
            ctx.reply(
              formatMessage(
                `Error: ${endValueError}. Please enter a valid non-negative number for the raffle limit.`
              )
            );
            return;
          }
          state.raffleEndValue = endValue;
          state.stage = "ASK_RAFFLE_PURPOSE";
          ctx.reply(formatMessage("Add raffle purpose or description:"));
          break;

        case "ASK_RAFFLE_END_TIME":
          const endTimeError = validateField("raffleEndTime", ctx.message.text);
          if (endTimeError) {
            ctx.reply(
              formatMessage(
                `Error: ${endTimeError}. Please enter a valid date and time in the format DD-MM-YYYY HH:MM.`
              )
            );
            return;
          }
          state.raffleEndTime = ctx.message.text;
          state.stage = "ASK_RAFFLE_PURPOSE";
          ctx.reply(formatMessage("Add raffle purpose or description:"));
          break;

        case "ASK_RAFFLE_PURPOSE":
          const purposeError = validateField("rafflePurpose", ctx.message.text);
          if (purposeError) {
            ctx.reply(
              formatMessage(
                `Error: ${purposeError}. Please enter a valid raffle description.`
              )
            );
            return;
          }
          state.rafflePurpose = ctx.message.text;
          const validationResult = validateUserState(state);
          if (!validationResult.success) {
            ctx.reply(
              formatMessage(
                `Validation failed: ${validationResult.error.errors
                  .map((e) => e.message)
                  .join(", ")}`
              )
            );
            return;
          }
          const summaryMessage = formatMessage(`Raffle Title: ${
            state.raffleTitle
          }
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
Raffle Description/Purpose: ${state.rafflePurpose}`);

          ctx.reply(
            summaryMessage,
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
          ctx.reply(
            formatMessage("Unexpected input. Please start the process again.")
          );
          break;
      }
    }
  }
};
