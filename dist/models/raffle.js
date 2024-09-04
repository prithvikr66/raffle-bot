"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const raffleSchema = new mongoose_1.default.Schema({
    createdBy: { type: String, required: true },
    createdGroup: { type: String, required: true },
    raffleTitle: { type: String, required: true },
    rafflePrice: { type: Number, required: true },
    splitPool: { type: String, enum: ["YES", "NO"] },
    splitPercentage: { type: Number },
    ownerWalletAddress: { type: String },
    startTimeOption: { type: String, enum: ["NOW", "SELECT"] },
    startTime: { type: String },
    raffleLimitOption: {
        type: String,
        enum: ["TIME_BASED", "VALUE_BASED"],
    },
    raffleEndTime: { type: String, default: null },
    raffleEndValue: { type: Number, default: null },
    rafflePurpose: { type: String, required: true },
});
const Raffle = mongoose_1.default.model("Raffle", raffleSchema);
exports.default = Raffle;
