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
exports.handleTextInputs = exports.handleCancel = exports.handleConfirmDetails = exports.handleValueBasedLimit = exports.handleTimeBasedLimit = exports.handleSelectTIme = exports.handleStartRaffleNow = exports.handleNoSplitPool = exports.handleSplitPool = exports.handleAddRaffle = void 0;
const __1 = require("..");
const telegraf_1 = require("telegraf");
const raffle_1 = __importDefault(require("../models/raffle"));
const fortmat_date_1 = require("../utils/fortmat-date");
const handleAddRaffle = (ctx) => {
    var _a;
    const chatId = (_a = ctx.chat) === null || _a === void 0 ? void 0 : _a.id.toString();
    if (chatId) {
        __1.userState[chatId] = { stage: "ASK_RAFFLE_TITLE" };
        ctx.reply("Enter the Raffle Title:");
    }
    else {
        ctx.reply("Unable to retrieve chat ID. Please try again.");
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
            ctx.reply("Please enter the split percentage for the owner:");
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
            ctx.reply("Set raffle start time:", telegraf_1.Markup.inlineKeyboard([
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
            ctx.reply("Your raffle will start as soon as it is created.");
            state.stage = "ASK_RAFFLE_LIMIT";
            ctx.reply("Set raffle limit:", telegraf_1.Markup.inlineKeyboard([
                [telegraf_1.Markup.button.callback("⏱️ Time based", "TIME_BASED")],
                [telegraf_1.Markup.button.callback("#️⃣ Value based", "VALUE_BASED")],
            ]));
        }
    }
};
exports.handleStartRaffleNow = handleStartRaffleNow;
const handleSelectTIme = (ctx) => {
    var _a;
    const chatId = (_a = ctx.chat) === null || _a === void 0 ? void 0 : _a.id.toString();
    if (chatId) {
        const state = __1.userState[chatId];
        if (state) {
            state.startTimeOption = "SELECT";
            state.stage = "ASK_RAFFLE_START_TIME";
            ctx.reply("Enter the start date & time in this format DD-MM-YYYY HH:MM\nExample: 04-09-2024 15:06");
        }
    }
};
exports.handleSelectTIme = handleSelectTIme;
const handleTimeBasedLimit = (ctx) => {
    var _a;
    const chatId = (_a = ctx.chat) === null || _a === void 0 ? void 0 : _a.id.toString();
    if (chatId) {
        const state = __1.userState[chatId];
        if (state) {
            state.raffleLimitOption = "TIME_BASED";
            state.stage = "ASK_RAFFLE_END_TIME";
            ctx.reply("Enter the end date & time in this format DD-MM-YYYY HH:MM\nExample: 04-09-2024 15:06");
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
            ctx.reply("Enter the number of Tickets");
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
                ctx.reply("Raffle successfully created! 🎉🎉");
                delete __1.userState[chatId];
            }
            catch (error) {
                console.error("Error saving raffle to MongoDB:", error);
                ctx.reply("Failed to create raffle. Please try again.");
            }
        }
    }
});
exports.handleConfirmDetails = handleConfirmDetails;
const handleCancel = (ctx) => {
    var _a;
    const chatId = (_a = ctx.chat) === null || _a === void 0 ? void 0 : _a.id.toString();
    ctx.reply("Operation canceled");
    if (chatId)
        delete __1.userState[chatId];
};
exports.handleCancel = handleCancel;
const handleTextInputs = (ctx) => {
    var _a, _b;
    const chatId = (_a = ctx.chat) === null || _a === void 0 ? void 0 : _a.id.toString();
    if (chatId) {
        const state = __1.userState[chatId];
        if (state) {
            switch (state === null || state === void 0 ? void 0 : state.stage) {
                case "ASK_RAFFLE_TITLE":
                    state.raffleTitle = (_b = ctx.message) === null || _b === void 0 ? void 0 : _b.text;
                    state.stage = "ASK_RAFFLE_PRICE";
                    ctx.reply("Enter raffle Ticket Price(ETH):");
                    break;
                case "ASK_RAFFLE_PRICE":
                    state.rafflePrice = Number(ctx.message.text);
                    state.stage = "ASK_SPLIT_POOL";
                    ctx.reply("Do you wish to have a split of the Raffle Pool?", telegraf_1.Markup.inlineKeyboard([
                        [
                            telegraf_1.Markup.button.callback("☑️ Yes", "SPLIT_YES"),
                            telegraf_1.Markup.button.callback("❌ No", "SPLIT_NO"),
                        ],
                    ]));
                    break;
                case "ASK_SPLIT_PERCENT":
                    state.splitPercentage = Number(ctx.message.text);
                    state.stage = "ASK_WALLET_ADDRESS";
                    ctx.reply("Enter the wallet address to receive the share:");
                    break;
                case "ASK_WALLET_ADDRESS":
                    state.ownerWalletAddress = ctx.message.text;
                    state.stage = "ASK_RAFFLE_START_TIME";
                    ctx.reply("Set raffle start time:", telegraf_1.Markup.inlineKeyboard([
                        [telegraf_1.Markup.button.callback("🙌 Now", "START_NOW")],
                        [telegraf_1.Markup.button.callback("🕰️ Select time", "SELECT_TIME")],
                    ]));
                    break;
                case "ASK_RAFFLE_START_TIME":
                    state.startTime = ctx.message.text;
                    state.stage = "ASK_RAFFLE_LIMIT";
                    ctx.reply("Set raffle limit:", telegraf_1.Markup.inlineKeyboard([
                        [telegraf_1.Markup.button.callback("⏱️ Time based", "TIME_BASED")],
                        [telegraf_1.Markup.button.callback("#️⃣ Value based", "VALUE_BASED")],
                    ]));
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
                    ctx.reply(`Raffle Title: ${state.raffleTitle}
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
Raffle Description/Purpose: ${state.rafflePurpose}`, telegraf_1.Markup.inlineKeyboard([
                        [
                            telegraf_1.Markup.button.callback("☑️ Confirm and Create", "CONFIRM_DETAILS"),
                        ],
                        [telegraf_1.Markup.button.callback("❌ Cancel", "CANCEL_ADD_RAFL")],
                    ]));
                    break;
                default:
                    ctx.reply("Unexpected input. Please start the process again.");
                    break;
            }
        }
    }
};
exports.handleTextInputs = handleTextInputs;
//# sourceMappingURL=add-raffle-actions.js.map