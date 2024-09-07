"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userStateSchema = void 0;
const { z } = require("zod");
const userStateSchema = z.object({
    raffleTitle: z.string().min(1, 'Raffle title is required'),
    rafflePrice: z.number().nonnegative('Raffle price must be a non-negative number'),
    splitPercentage: z.number().min(0).max(100).optional(),
    ownerWalletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address').optional(),
    startTimeOption: z.enum(["NOW", "SELECT"]),
    startTime: z.string().optional(),
    raffleLimitOption: z.enum(["TIME_BASED", "VALUE_BASED"]),
    raffleEndTime: z.string().optional(),
    raffleEndValue: z.number().nonnegative().optional(),
    rafflePurpose: z.string().min(1, "Raffle description is required")
});
exports.userStateSchema = userStateSchema;
