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
  rafflePurpose: z.string().min(1,"Raffle description is required")
});
interface UserState {
  raffleTitle?: string;
  rafflePrice?: number;
  splitPool?: "YES" | "NO";
  splitPercentage?: number;
  ownerWalletAddress?: string;
  startTimeOption?: "NOW" | "SELECT";
  startTime?: string;
  raffleLimitOption?: "TIME_BASED" | "VALUE_BASED";
  raffleEndTime?: string;
  raffleEndValue?: number;
  rafflePurpose?: string;
  stage?:
    | "ASK_RAFFLE_TITLE"
    | "ASK_RAFFLE_PRICE"
    | "ASK_SPLIT_POOL"
    | "ASK_SPLIT_PERCENT"
    | "ASK_WALLET_ADDRESS"
    | "ASK_RAFFLE_START_TIME"
    | "ASK_RAFFLE_LIMIT"
    | "ASK_RAFFLE_END_TIME"
    | "ASK_RAFFLE_VALUE"
    | "ASK_RAFFLE_PURPOSE"
    | "CONFIRM_DETAILS";
}

export { UserState,userStateSchema };
