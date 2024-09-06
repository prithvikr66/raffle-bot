"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { z } = require("zod");
const userStateSchema = z.object({
    raffleTitle: z.string().min(1, "Raffle title is required"),
    rafflePrice: z
        .number()
        .nonnegative("Raffle price must be a non-negative number"),
    splitPercentage: z.number().min(0).max(100).optional(), // Optional, but if present, must be between 0 and 100
    ownerWalletAddress: z
        .string()
        .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address")
        .optional(),
    startTimeOption: z.enum(["NOW", "SELECT"]),
    startTime: z.string().optional(), // Optional, but must be a string if provided
    raffleLimitOption: z.enum(["TIME_BASED", "VALUE_BASED"]),
    raffleEndTime: z.string().optional(),
    raffleEndValue: z.number().nonnegative().optional(), // Optional, but must be a non-negative number if provided
    rafflePurpose: z.string().optional(), // Optional, but must be a string if provided
});
