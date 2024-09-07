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
exports.playAmountStep = exports.playAmountScene = void 0;
const telegraf_1 = require("telegraf");
const utils_1 = require("../utils");
const config_1 = require("../config");
const utils_2 = require("../utils");
exports.playAmountScene = 'playAmountScene';
exports.playAmountStep = new telegraf_1.Scenes.BaseScene(exports.playAmountScene);
exports.playAmountStep.enter((ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const walletName = ctx.session.selectedPlayWalletName;
    const wallet = (0, utils_1.getWalletByName)(ctx, walletName);
    let htmlMessage = yield (0, utils_1.getSelectedWalletHtml)(wallet, `Selected wallet to bet <b>${ctx.session.selectedCoin}</b>:\n\n`);
    const MIN_BET = yield (0, utils_2.getMinBet)();
    const MAX_BET = yield (0, utils_2.getMaxBet)();
    htmlMessage += `\n\n\nHow much are we betting?\n<b>Minimum Bet:</b> ${MIN_BET}\n<b>Maximum Bet:</b> ${MAX_BET}\n\nPlease reply with ${config_1.CHAIN['mumbai-testnet'].currency} amount to bet.`;
    ctx.replyWithHTML(htmlMessage);
}));
exports.playAmountStep.on('text', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const wallet = (0, utils_1.getWalletByName)(ctx, ctx.session.selectedPlayWalletName);
        const sendAmount = Number.parseFloat(ctx.message.text);
        const MIN_BET = yield (0, utils_2.getMinBet)();
        const MAX_BET = yield (0, utils_2.getMaxBet)();
        const walletBalance = yield (0, utils_2.getBalance)(config_1.CHAIN['mumbai-testnet'].rpcUrl, wallet.address);
        if (sendAmount === 0) {
            ctx.reply('⚠️ Incorrect bet amount.');
        }
        else if (sendAmount > walletBalance) {
            ctx.reply('⚠️ Incorrect bet amount. Insufficient balance.');
        }
        else if (sendAmount < MIN_BET) {
            ctx.reply('⚠️ Incorrect bet amount. Need at least minimum bet amount.');
        }
        else if (sendAmount > MAX_BET) {
            ctx.reply("⚠️ Incorrect bet amount. Amount can't be more than maximum bet amount.");
        }
        else {
            const pendingReply = yield ctx.reply('pending...');
            try {
                const { transaction, newFlip, contract } = yield (0, utils_2.flipWrite)(sendAmount.toString(), ctx.session.selectedCoin === 'Tails', wallet.privateKey);
                ctx.deleteMessage(pendingReply.message_id);
                const pendingTxHashReply = yield ctx.reply(`⏱️ Transaction Pending!\n\nTransaction hash:\n${config_1.CHAIN['mumbai-testnet'].explorerUrl}/tx/${transaction.hash}`);
                try {
                    const receipt = yield transaction.wait();
                    ctx.deleteMessage(pendingTxHashReply.message_id);
                    if (receipt.status === 1) {
                        yield ctx.replyWithHTML(`✅ Transaction Confirmed!\n\nTransaction hash:\n${config_1.CHAIN['mumbai-testnet'].explorerUrl}/tx/${receipt.transactionHash}`);
                        const bettingReply = yield ctx.reply('betting...');
                        const spinningCoinReply = yield ctx.replyWithAnimation('https://i.pinimg.com/originals/1f/3f/71/1f3f71f0ef3470c354aa7cfcf1272b56.gif');
                        const handleFlipCompletedEvent = (player, didWin, isTail, amount, gameId) => {
                            ctx.deleteMessage(bettingReply.message_id);
                            ctx.deleteMessage(spinningCoinReply.message_id);
                            if (newFlip.gameId === gameId.toString() &&
                                player === wallet.address) {
                                ctx.replyWithHTML(`<b>You ${didWin ? 'Win' : 'Lost'}</b>${didWin
                                    ? `\nYou will get ${(0, utils_2.formatEther)(amount.toString())} amount of ${config_1.CHAIN['mumbai-testnet'].currency} as a reward in your wallet`
                                    : ''}\n\nPlay again /play`);
                            }
                            contract.removeListener('FlipCompleted', handleFlipCompletedEvent);
                        };
                        contract.on('FlipCompleted', handleFlipCompletedEvent);
                    }
                    else {
                        ctx.replyWithHTML(`😔 Failed to bet ${receipt}`);
                    }
                }
                catch (error) {
                    ctx.deleteMessage(pendingTxHashReply.message_id);
                    ctx.replyWithHTML(error.message);
                }
            }
            catch (error) {
                ctx.deleteMessage(pendingReply.message_id);
                ctx.replyWithHTML(error.message);
            }
            delete ctx.session.selectedCoin;
            delete ctx.session.selectedPlayWalletName;
            ctx.scene.leave();
        }
    }
    catch (_) {
        ctx.replyWithHTML('⚠️ Incorrect bet amount.');
    }
}));
//# sourceMappingURL=playAmountScene.js.map