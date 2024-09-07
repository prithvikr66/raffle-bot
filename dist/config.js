"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COIN_FLIP_CONTRACT = exports.COIN_FLIP_ABI = exports.BOT_NAME = exports.CHAIN = void 0;
// Define CHAIN object with type
exports.CHAIN = {
    "mumbai-testnet": {
        rpcUrl: "https://polygon-amoy.g.alchemy.com/v2/NeEbQDi3yU9wRy7OsVEmYF4dpyRaKm1I",
        explorerUrl: "https://mumbai.polygonscan.com",
        name: "Mumbai Testnet",
        currency: "MATIC",
        cbActionKey: "polygon-mumbai-testnet",
    },
};
// Define the bot name
exports.BOT_NAME = "PsychoBot";
// Define the ABI for the Coin Flip contract
exports.COIN_FLIP_ABI = [
    {
        inputs: [
            { internalType: "uint64", name: "subscriptionId", type: "uint64" },
            { internalType: "uint256", name: "_minBet", type: "uint256" },
            {
                internalType: "uint256",
                name: "_maxRewardPoolPercentage",
                type: "uint256",
            },
            { internalType: "address", name: "_feeWallet", type: "address" },
            { internalType: "uint256", name: "_feePercentage", type: "uint256" },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    {
        inputs: [
            { internalType: "address", name: "have", type: "address" },
            { internalType: "address", name: "want", type: "address" },
        ],
        name: "OnlyCoordinatorCanFulfill",
        type: "error",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "uint32",
                name: "oldValue",
                type: "uint32",
            },
            {
                indexed: false,
                internalType: "uint32",
                name: "newValue",
                type: "uint32",
            },
        ],
        name: "CallbackGasLimitUpdated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: "address", name: "user", type: "address" },
            {
                indexed: false,
                internalType: "uint256",
                name: "amount",
                type: "uint256",
            },
            {
                indexed: true,
                internalType: "uint256",
                name: "gameId",
                type: "uint256",
            },
        ],
        name: "Cancel",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "player",
                type: "address",
            },
            { indexed: false, internalType: "bool", name: "didWin", type: "bool" },
            { indexed: false, internalType: "bool", name: "isTail", type: "bool" },
            {
                indexed: false,
                internalType: "uint256",
                name: "amount",
                type: "uint256",
            },
            {
                indexed: true,
                internalType: "uint256",
                name: "gameId",
                type: "uint256",
            },
        ],
        name: "FlipCompleted",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: "address", name: "user", type: "address" },
            {
                indexed: false,
                internalType: "uint256",
                name: "amount",
                type: "uint256",
            },
            { indexed: false, internalType: "bool", name: "isTail", type: "bool" },
            {
                indexed: true,
                internalType: "uint256",
                name: "gameId",
                type: "uint256",
            },
        ],
        name: "NewFlip",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "previousOwner",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "newOwner",
                type: "address",
            },
        ],
        name: "OwnershipTransferred",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            { indexed: false, internalType: "bool", name: "newState", type: "bool" },
        ],
        name: "PauseChanged",
        type: "event",
    },
    {
        inputs: [],
        name: "addToRewardPool",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "", type: "address" }],
        name: "addressToFlip",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        name: "allFlipResults",
        outputs: [
            { internalType: "address", name: "player", type: "address" },
            { internalType: "bool", name: "didWin", type: "bool" },
            { internalType: "bool", name: "isTail", type: "bool" },
            { internalType: "uint256", name: "amount", type: "uint256" },
            { internalType: "uint256", name: "gameId", type: "uint256" },
            { internalType: "uint256", name: "timestamp", type: "uint256" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "uint32", name: "newLimit", type: "uint32" }],
        name: "changeCallbackGasLimit",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "feeWallet",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "bool", name: "isTail", type: "bool" }],
        name: "flip",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        name: "flipToAddress",
        outputs: [
            { internalType: "address", name: "user", type: "address" },
            { internalType: "uint256", name: "userBet", type: "uint256" },
            { internalType: "uint256", name: "time", type: "uint256" },
            { internalType: "bool", name: "isTail", type: "bool" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "uint256", name: "_count", type: "uint256" }],
        name: "getLastFlipResults",
        outputs: [
            {
                components: [
                    { internalType: "address", name: "player", type: "address" },
                    { internalType: "bool", name: "didWin", type: "bool" },
                    { internalType: "bool", name: "isTail", type: "bool" },
                    { internalType: "uint256", name: "amount", type: "uint256" },
                    { internalType: "uint256", name: "gameId", type: "uint256" },
                    { internalType: "uint256", name: "timestamp", type: "uint256" },
                ],
                internalType: "struct DracoCoinFlipTg.FlipResult[]",
                name: "",
                type: "tuple[]",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getRefund",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        name: "idToFlipIndex",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "lostAmount",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "maxBet",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "minBet",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "owner",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "pause",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "uint256", name: "requestId", type: "uint256" },
            { internalType: "uint256[]", name: "randomWords", type: "uint256[]" },
        ],
        name: "rawFulfillRandomWords",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "refundDelay",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "renounceOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "resetLostAmount",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "rewardPool",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "rewardPoolPercentage",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "uint256", name: "_feePercentage", type: "uint256" },
        ],
        name: "setFeePercentage",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "_feeWallet", type: "address" }],
        name: "setFeeWallet",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "bytes32", name: "_keyHash", type: "bytes32" }],
        name: "setKeyHash",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "uint256", name: "_minBet", type: "uint256" }],
        name: "setMinBet",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "bool", name: "state", type: "bool" }],
        name: "setPause",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "uint256", name: "_delay", type: "uint256" }],
        name: "setRefundDelay",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "_maxRewardPoolPercentage",
                type: "uint256",
            },
        ],
        name: "setRewardPoolPercentage",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
        name: "transferOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "uint256", name: "_amount", type: "uint256" }],
        name: "withdraw",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    { stateMutability: "payable", type: "receive" },
];
// Define the contract address
exports.COIN_FLIP_CONTRACT = "0x0e146E78F76acF743f563745Bf19d19e5D358C47";
//# sourceMappingURL=config.js.map