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
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeGetter = exports.refundWrite = exports.flipWrite = exports.formatEther = exports.formatBalance = exports.getBalance = exports.generateAccount = void 0;
const ethers_1 = require("ethers");
const encryption_utils_1 = require("./encryption-utils");
const config_1 = require("../config");
// Function to generate an account
function generateAccount(seedPhrase = '', index = 0) {
    let wallet;
    // If the seed phrase is not provided, generate a random mnemonic
    if (seedPhrase === '') {
        seedPhrase = ethers_1.Wallet.createRandom().mnemonic.phrase;
    }
    // If the seed phrase does not contain spaces, it is likely a private key
    wallet = seedPhrase.includes(' ')
        ? ethers_1.Wallet.fromMnemonic(seedPhrase, `m/44'/60'/0'/0/${index}`)
        : new ethers_1.Wallet(seedPhrase);
    return {
        address: wallet.address,
        privateKey: (0, encryption_utils_1.encrypt)(wallet.privateKey),
        mnemonic: (0, encryption_utils_1.encrypt)(seedPhrase),
    };
}
exports.generateAccount = generateAccount;
// Function to get balance
function getBalance(rpcUrl, address) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = new ethers_1.ethers.providers.JsonRpcProvider(rpcUrl);
        const balance = yield provider.getBalance(address);
        return Number(formatEther(balance));
    });
}
exports.getBalance = getBalance;
// Function to format balance
function formatBalance(value, decimalPlaces = 3) {
    const formattedBalance = +parseFloat(value).toFixed(decimalPlaces);
    if (formattedBalance < 0.001) {
        return +value;
    }
    return formattedBalance;
}
exports.formatBalance = formatBalance;
// Function to format Ether value
function formatEther(value) {
    return ethers_1.ethers.utils.formatEther(value !== null && value !== void 0 ? value : 0);
}
exports.formatEther = formatEther;
// Function to handle flip write
function flipWrite(amount, isTail, privateKey) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = new ethers_1.ethers.providers.JsonRpcProvider(config_1.CHAIN['mumbai-testnet'].rpcUrl);
        const wallet = new ethers_1.ethers.Wallet((0, encryption_utils_1.decrypt)(privateKey), provider);
        const contract = new ethers_1.Contract(config_1.COIN_FLIP_CONTRACT, config_1.COIN_FLIP_ABI, wallet);
        const transaction = yield contract.flip(isTail, {
            gasLimit: 999999,
            value: ethers_1.ethers.utils.parseEther(amount),
        });
        const newFlip = { listening: true };
        const handleNewFlipEvent = (user, amount, isTail, gameId) => {
            newFlip.gameId = gameId.toString();
            newFlip.user = user;
            newFlip.amount = amount.toString();
            newFlip.isTail = isTail;
            newFlip.listening = false;
            contract.removeListener('NewFlip', handleNewFlipEvent);
        };
        contract.on('NewFlip', handleNewFlipEvent);
        return { transaction, newFlip, contract };
    });
}
exports.flipWrite = flipWrite;
// Function to handle refund write
function refundWrite(privateKey) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = new ethers_1.ethers.providers.JsonRpcProvider(config_1.CHAIN['mumbai-testnet'].rpcUrl);
        const wallet = new ethers_1.ethers.Wallet((0, encryption_utils_1.decrypt)(privateKey), provider);
        const contract = new ethers_1.Contract(config_1.COIN_FLIP_CONTRACT, config_1.COIN_FLIP_ABI, wallet);
        const transaction = yield contract.getRefund({ gasLimit: 999999 });
        return { transaction };
    });
}
exports.refundWrite = refundWrite;
// Initialize getter functions
function initializeGetter() {
    const provider = new ethers_1.ethers.providers.JsonRpcProvider(config_1.CHAIN['mumbai-testnet'].rpcUrl);
    const contract = new ethers_1.Contract(config_1.COIN_FLIP_CONTRACT, config_1.COIN_FLIP_ABI, provider);
    return {
        getMinBet: function () {
            return __awaiter(this, void 0, void 0, function* () {
                const data = yield contract.minBet();
                return formatEther(data);
            });
        },
        getMaxBet: function () {
            return __awaiter(this, void 0, void 0, function* () {
                const data = yield contract.maxBet();
                return formatEther(data);
            });
        },
        getPauseStatus: function () {
            return __awaiter(this, void 0, void 0, function* () {
                return yield contract.pause();
            });
        },
        getPendingGameId: function (address) {
            return __awaiter(this, void 0, void 0, function* () {
                const gameId = yield contract.addressToFlip(address);
                let pendingNewFlip;
                if (Number(gameId) !== 0) {
                    pendingNewFlip = yield contract.flipToAddress(gameId);
                }
                return { gameId, pendingNewFlip };
            });
        },
        getRefundDelay: function () {
            return __awaiter(this, void 0, void 0, function* () {
                return yield contract.refundDelay();
            });
        },
        getHistory: function () {
            return __awaiter(this, void 0, void 0, function* () {
                return yield contract.getLastFlipResults(20);
            });
        },
    };
}
exports.initializeGetter = initializeGetter;
exports.default = Object.assign({ generateAccount,
    getBalance,
    formatBalance,
    formatEther,
    flipWrite,
    refundWrite }, initializeGetter());
//# sourceMappingURL=account-utils.js.map