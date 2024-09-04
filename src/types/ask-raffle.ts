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

export { UserState };
