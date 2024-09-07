"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleTextInputs = exports.handleCancel = exports.handleConfirmDetails = exports.handleValueBasedLimit = exports.handleTimeBasedLimit = exports.handleSelectTime = exports.handleStartRaffleNow = exports.handleNoSplitPool = exports.handleSplitPool = exports.handleAddRaffle = void 0;
const __1 = require("..");
const telegraf_1 = require("telegraf");
const raffle_1 = __importDefault(require("../models/raffle"));
const fortmat_date_1 = require("../utils/fortmat-date");
const ask_raffle_1 = require("../types/ask-raffle"); // Assuming this is the correct path
const formatMessage = (message) => {
    const lines = message.split("\n");
    const maxLength = Math.max(...lines.map((line) => line.length));
    const border = " ".repeat(maxLength + 4);
    const paddedLines = lines.map((line) => ` ${line.padEnd(maxLength)} `);
    return `${border}\n${paddedLines.join("\n")}\n${border}`;
};
const validateUserState = (state) => {
    return ask_raffle_1.userStateSchema.safeParse(state);
};
const validateField = (field, value) => {
    const schema = ask_raffle_1.userStateSchema.shape[field];
    const result = schema.safeParse(value);
    if (!result.success) {
        return result.error.errors[0].message;
    }
    return null;
};
const handleAddRaffle = (ctx) => {
    var _a;
    const chatId = (_a = ctx.chat) === null || _a === void 0 ? void 0 : _a.id.toString();
    if (chatId) {
        __1.userState[chatId] = { stage: "ASK_RAFFLE_TITLE" };
        ctx.reply(formatMessage("Enter the Raffle Title:"));
    }
    else {
        ctx.reply(formatMessage("Unable to retrieve chat ID. Please try again."));
    }
};
exports.handleAddRaffle = handleAddRaffle;
const handleSplitPool = (ctx) => {
    var _a;
    const chatId = (_a = ctx.chat) === null || _a === void 0 ? void 0 : _a.id.toString();
    if (chatId) {
        const state = __1.userState[chatId];
        if (state) {
            state.splitPool = "YES";
            state.stage = "ASK_SPLIT_PERCENT";
            ctx.reply(formatMessage("Please enter the split percentage for the owner (0-100):"));
        }
    }
};
exports.handleSplitPool = handleSplitPool;
const handleNoSplitPool = (ctx) => {
    var _a;
    const chatId = (_a = ctx.chat) === null || _a === void 0 ? void 0 : _a.id.toString();
    if (chatId) {
        const state = __1.userState[chatId];
        if (state) {
            state.splitPool = "NO";
            state.stage = "ASK_RAFFLE_START_TIME";
            ctx.reply(formatMessage("Set raffle start time:\t\t\t\t\t\t\t\t\t\t\t\t"), telegraf_1.Markup.inlineKeyboard([
                [telegraf_1.Markup.button.callback("🙌 Now", "START_NOW")],
                [telegraf_1.Markup.button.callback("🕰️ Select time", "SELECT_TIME")],
            ]));
        }
    }
};
exports.handleNoSplitPool = handleNoSplitPool;
const handleStartRaffleNow = (ctx) => {
    var _a;
    const chatId = (_a = ctx.chat) === null || _a === void 0 ? void 0 : _a.id.toString();
    if (chatId) {
        const state = __1.userState[chatId];
        if (state) {
            state.startTime = (0, fortmat_date_1.formatDate)(new Date());
            state.startTimeOption = "NOW";
            ctx.reply(formatMessage("Your raffle will start as soon as it is created."));
            state.stage = "ASK_RAFFLE_LIMIT";
            ctx.reply(formatMessage("Set raffle limit:"), telegraf_1.Markup.inlineKeyboard([
                [telegraf_1.Markup.button.callback("⏱️ Time based", "TIME_BASED")],
                [telegraf_1.Markup.button.callback("#️⃣ Value based", "VALUE_BASED")],
            ]));
        }
    }
};
exports.handleStartRaffleNow = handleStartRaffleNow;
const handleSelectTime = (ctx) => {
    var _a;
    const chatId = (_a = ctx.chat) === null || _a === void 0 ? void 0 : _a.id.toString();
    if (chatId) {
        const state = __1.userState[chatId];
        if (state) {
            state.startTimeOption = "SELECT";
            state.stage = "ASK_RAFFLE_START_TIME";
            ctx.reply(formatMessage("Enter the start date & time in this format DD-MM-YYYY HH:MM\nExample: 04-09-2024 15:06"));
        }
    }
};
exports.handleSelectTime = handleSelectTime;
const handleTimeBasedLimit = (ctx) => {
    var _a;
    const chatId = (_a = ctx.chat) === null || _a === void 0 ? void 0 : _a.id.toString();
    if (chatId) {
        const state = __1.userState[chatId];
        if (state) {
            state.raffleLimitOption = "TIME_BASED";
            state.stage = "ASK_RAFFLE_END_TIME";
            ctx.reply(formatMessage("Enter the end date & time in this format DD-MM-YYYY HH:MM\nExample: 04-09-2024 15:06"));
        }
    }
};
exports.handleTimeBasedLimit = handleTimeBasedLimit;
const handleValueBasedLimit = (ctx) => {
    var _a;
    const chatId = (_a = ctx.chat) === null || _a === void 0 ? void 0 : _a.id.toString();
    if (chatId) {
        const state = __1.userState[chatId];
        if (state) {
            state.raffleLimitOption = "VALUE_BASED";
            state.stage = "ASK_RAFFLE_VALUE";
            ctx.reply(formatMessage("Enter the number of Tickets"));
        }
    }
};
exports.handleValueBasedLimit = handleValueBasedLimit;
const handleConfirmDetails = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const chatId = (_a = ctx.chat) === null || _a === void 0 ? void 0 : _a.id.toString();
    if (chatId) {
        const state = __1.userState[chatId];
        if (state) {
            const validationResult = validateUserState(state);
            if (!validationResult.success) {
                ctx.reply(formatMessage(`Validation failed: ${validationResult.error.errors
                    .map((e) => e.message)
                    .join(", ")}`));
                return;
            }
            try {
                const raffle = new raffle_1.default({
                    createdBy: (_c = (_b = ctx.from) === null || _b === void 0 ? void 0 : _b.username) === null || _c === void 0 ? void 0 : _c.toString(),
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
                yield raffle.save();
                ctx.reply(formatMessage("Raffle successfully created! 🎉🎉"));
                delete __1.userState[chatId];
            }
            catch (error) {
                console.error("Error saving raffle to MongoDB:", error);
                ctx.reply(formatMessage("Failed to create raffle. Please try again."));
            }
        }
    }
});
exports.handleConfirmDetails = handleConfirmDetails;
const handleCancel = (ctx) => {
    var _a;
    const chatId = (_a = ctx.chat) === null || _a === void 0 ? void 0 : _a.id.toString();
    ctx.reply(formatMessage("Operation canceled"));
    if (chatId)
        delete __1.userState[chatId];
};
exports.handleCancel = handleCancel;
const handleTextInputs = (ctx) => {
    var _a, _b, _c;
    const chatId = (_a = ctx.chat) === null || _a === void 0 ? void 0 : _a.id.toString();
    if (chatId) {
        const state = __1.userState[chatId];
        if (state) {
            switch (state === null || state === void 0 ? void 0 : state.stage) {
                case "ASK_RAFFLE_TITLE":
                    const titleError = validateField("raffleTitle", (_b = ctx.message) === null || _b === void 0 ? void 0 : _b.text);
                    if (titleError) {
                        ctx.reply(formatMessage(`Error: ${titleError}. Please enter a valid raffle title.`));
                        return;
                    }
                    state.raffleTitle = (_c = ctx.message) === null || _c === void 0 ? void 0 : _c.text;
                    state.stage = "ASK_RAFFLE_PRICE";
                    ctx.reply(formatMessage("Enter raffle Ticket Price(ETH):"));
                    break;
                case "ASK_RAFFLE_PRICE":
                    const price = Number(ctx.message.text);
                    const priceError = validateField("rafflePrice", price);
                    if (priceError) {
                        ctx.reply(formatMessage(`Error: ${priceError}. Please enter a valid non-negative number for the price.`));
                        return;
                    }
                    state.rafflePrice = price;
                    state.stage = "ASK_SPLIT_POOL";
                    ctx.reply(formatMessage("Do you wish to have a split of the Raffle Pool?"), telegraf_1.Markup.inlineKeyboard([
                        [
                            telegraf_1.Markup.button.callback("☑️ Yes", "SPLIT_YES"),
                            telegraf_1.Markup.button.callback("❌ No", "SPLIT_NO"),
                        ],
                    ]));
                    break;
                case "ASK_SPLIT_PERCENT":
                    const splitPercent = Number(ctx.message.text);
                    const splitPercentError = validateField("splitPercentage", splitPercent);
                    if (splitPercentError) {
                        ctx.reply(formatMessage(`Error: ${splitPercentError}. Please enter a valid percentage between 0 and 100.`));
                        return;
                    }
                    state.splitPercentage = splitPercent;
                    state.stage = "ASK_WALLET_ADDRESS";
                    ctx.reply(formatMessage("Enter the wallet address to receive the share:"));
                    break;
                case "ASK_WALLET_ADDRESS":
                    const walletError = validateField("ownerWalletAddress", ctx.message.text);
                    if (walletError) {
                        ctx.reply(formatMessage(`Error: ${walletError}. Please enter a valid Ethereum address.`));
                        return;
                    }
                    state.ownerWalletAddress = ctx.message.text;
                    state.stage = "ASK_RAFFLE_START_TIME";
                    ctx.reply(formatMessage("Set raffle start time:\t\t\t\t\t\t\t\t\t\t\t\t"), telegraf_1.Markup.inlineKeyboard([
                        [telegraf_1.Markup.button.callback("🙌 Now", "START_NOW")],
                        [telegraf_1.Markup.button.callback("🕰️ Select time", "SELECT_TIME")],
                    ]));
                    break;
                case "ASK_RAFFLE_START_TIME":
                    const startTimeError = validateField("startTime", ctx.message.text);
                    if (startTimeError) {
                        ctx.reply(formatMessage(`Error: ${startTimeError}. Please enter a valid date and time in the format DD-MM-YYYY HH:MM.`));
                        return;
                    }
                    state.startTime = ctx.message.text;
                    state.stage = "ASK_RAFFLE_LIMIT";
                    ctx.reply(formatMessage("Set raffle limit:"), telegraf_1.Markup.inlineKeyboard([
                        [telegraf_1.Markup.button.callback("⏱️ Time based", "TIME_BASED")],
                        [telegraf_1.Markup.button.callback("#️⃣ Value based", "VALUE_BASED")],
                    ]));
                    break;
                case "ASK_RAFFLE_VALUE":
                    const endValue = Number(ctx.message.text);
                    const endValueError = validateField("raffleEndValue", endValue);
                    if (endValueError) {
                        ctx.reply(formatMessage(`Error: ${endValueError}. Please enter a valid non-negative number for the raffle limit.`));
                        return;
                    }
                    state.raffleEndValue = endValue;
                    state.stage = "ASK_RAFFLE_PURPOSE";
                    ctx.reply(formatMessage("Add raffle purpose or description:"));
                    break;
                case "ASK_RAFFLE_END_TIME":
                    const endTimeError = validateField("raffleEndTime", ctx.message.text);
                    if (endTimeError) {
                        ctx.reply(formatMessage(`Error: ${endTimeError}. Please enter a valid date and time in the format DD-MM-YYYY HH:MM.`));
                        return;
                    }
                    state.raffleEndTime = ctx.message.text;
                    state.stage = "ASK_RAFFLE_PURPOSE";
                    ctx.reply(formatMessage("Add raffle purpose or description:"));
                    break;
                case "ASK_RAFFLE_PURPOSE":
                    const purposeError = validateField("rafflePurpose", ctx.message.text);
                    if (purposeError) {
                        ctx.reply(formatMessage(`Error: ${purposeError}. Please enter a valid raffle description.`));
                        return;
                    }
                    state.rafflePurpose = ctx.message.text;
                    const validationResult = validateUserState(state);
                    if (!validationResult.success) {
                        ctx.reply(formatMessage(`Validation failed: ${validationResult.error.errors
                            .map((e) => e.message)
                            .join(", ")}`));
                        return;
                    }
                    const summaryMessage = formatMessage(`Raffle Title: ${state.raffleTitle}
Raffle Ticket Price: ${state.rafflePrice}ETH
${state.splitPool == "YES"
                        ? `Split Raffle Pool: Yes
Split Percentage for Owner: ${state.splitPercentage}%
Wallet Address: ${state.ownerWalletAddress}`
                        : `Split Raffle Pool: No`}
Raffle Start Time: ${state.startTime}
${state.raffleLimitOption === "VALUE_BASED"
                        ? `Raffle Limit Option: Value Based
Raffle Limit Value: ${state.raffleEndValue} Tickets`
                        : `Raffle Limit Option: Time Based
Raffle End Time: ${state.raffleEndTime}`}
Raffle Description/Purpose: ${state.rafflePurpose}`);
                    ctx.reply(summaryMessage, telegraf_1.Markup.inlineKeyboard([
                        [
                            telegraf_1.Markup.button.callback("☑️ Confirm and Create", "CONFIRM_DETAILS"),
                        ],
                        [telegraf_1.Markup.button.callback("❌ Cancel", "CANCEL_ADD_RAFL")],
                    ]));
                    break;
                default:
                    ctx.reply(formatMessage("Unexpected input. Please start the process again."));
                    break;
            }
        }
    }
};
exports.handleTextInputs = handleTextInputs;
