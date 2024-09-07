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
exports.dynamicDeleteWalletAction = exports.btnDeleteWalletAction = exports.deleteWalletWarningMsg = exports.walletsCommand = exports.refundCommand = exports.refundMessageForWalletName = exports.dynamicPlayWalletAction = exports.playCommand = exports.historyCommand = exports.menuCommand = exports.walletsList = exports.createCallBackBtn = exports.replyWithHTMLAndInlineKeyboard = exports.makeItClickable = exports.getWalletByName = exports.getSelectedWalletHtml = exports.getWalletTotalBalance = void 0;
const telegraf_1 = require("telegraf");
const account_utils_1 = require("./account-utils");
const config_1 = require("../config");
// Get wallet total balance
function getWalletTotalBalance(walletAddress, selectedChainObjKey = '') {
    return __awaiter(this, void 0, void 0, function* () {
        let totalWalletBalanceInEth = '';
        const totalWalletBalance = {};
        for (const chainKey in config_1.CHAIN) {
            if (selectedChainObjKey && selectedChainObjKey !== chainKey) {
                continue;
            }
            const walletBalanceInEth = yield (0, account_utils_1.getBalance)(config_1.CHAIN[chainKey].rpcUrl, walletAddress);
            totalWalletBalance[config_1.CHAIN[chainKey].currency] = walletBalanceInEth;
            if (totalWalletBalanceInEth === '') {
                totalWalletBalanceInEth += `${(0, account_utils_1.formatBalance)(walletBalanceInEth)} ${config_1.CHAIN[chainKey].currency}`;
            }
            else {
                totalWalletBalanceInEth += ` | ${(0, account_utils_1.formatBalance)(walletBalanceInEth)} ${config_1.CHAIN[chainKey].currency}`;
            }
        }
        return { totalWalletBalanceInEth, totalWalletBalance };
    });
}
exports.getWalletTotalBalance = getWalletTotalBalance;
// Get selected wallet HTML
function getSelectedWalletHtml(selectedWallet, prefixWithMessage = '', selectedChainObjKey = '') {
    return __awaiter(this, void 0, void 0, function* () {
        const { totalWalletBalanceInEth } = yield getWalletTotalBalance(selectedWallet.address, selectedChainObjKey);
        if (prefixWithMessage === '') {
            prefixWithMessage = `Selected Chain: ${config_1.CHAIN[selectedChainObjKey].name}\n\nSelected Wallet\n\n`;
        }
        return `${prefixWithMessage}Wallet <b>${selectedWallet.name}</b>:\nAddress: ${makeItClickable(selectedWallet.address)}\n${totalWalletBalanceInEth}`;
    });
}
exports.getSelectedWalletHtml = getSelectedWalletHtml;
// Get wallet by name
function getWalletByName(ctx, walletName) {
    return ctx.session.wallets.find((_wallet) => _wallet.name === walletName);
}
exports.getWalletByName = getWalletByName;
// Make it clickable
function makeItClickable(text) {
    return `<code>${text}</code>`;
}
exports.makeItClickable = makeItClickable;
// Reply with HTML and inline keyboards
function replyWithHTMLAndInlineKeyboard(ctx, htmlMessage, inlineKeyboard) {
    ctx.replyWithHTML(htmlMessage, {
        reply_markup: {
            inline_keyboard: inlineKeyboard,
        },
    });
}
exports.replyWithHTMLAndInlineKeyboard = replyWithHTMLAndInlineKeyboard;
// Create callback button
function createCallBackBtn(btnLabel, cbActionCommand) {
    return telegraf_1.Markup.button.callback(btnLabel, cbActionCommand);
}
exports.createCallBackBtn = createCallBackBtn;
// Wallets list
function walletsList(wallets, selectedChainObjKey = '') {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        let htmlMessage = '';
        const totalBalance = {};
        for (const wallet of wallets) {
            try {
                const { totalWalletBalanceInEth, totalWalletBalance } = yield getWalletTotalBalance(wallet.address, selectedChainObjKey);
                for (const chainCurrency in totalWalletBalance) {
                    totalBalance[chainCurrency] = (0, account_utils_1.formatBalance)(totalWalletBalance[chainCurrency] + ((_a = totalBalance[chainCurrency]) !== null && _a !== void 0 ? _a : 0));
                }
                htmlMessage += `Wallet <b>${wallet.name}</b>:\nAddress: ${makeItClickable(wallet.address)}\n<b>${totalWalletBalanceInEth}</b>\n\n`;
            }
            catch (error) {
                console.log('walletsList-error', error);
            }
        }
        const balance = Object.keys(totalBalance).reduce((acc, currCurrency) => {
            if (acc === '') {
                return `${totalBalance[currCurrency]} ${currCurrency}`;
            }
            else {
                return (acc += ` | ${totalBalance[currCurrency]} ${currCurrency}`);
            }
        }, '');
        return { htmlMessage, balance };
    });
}
exports.walletsList = walletsList;
// Show Menu commands
function menuCommand(ctx, wallets) {
    return __awaiter(this, void 0, void 0, function* () {
        const processingReply = yield ctx.reply('processing...');
        let htmlMessage = '👛 Balances (Combined):\n';
        if (wallets && wallets.length) {
            const { balance, htmlMessage: _htmlMessage } = yield walletsList(wallets);
            htmlMessage += `<b>${balance}</b>\n\n${_htmlMessage}`;
        }
        else {
            let nullTotalBalance = '';
            for (const chainKey in config_1.CHAIN) {
                if (nullTotalBalance === '') {
                    nullTotalBalance += `0.000 ${config_1.CHAIN[chainKey].currency}`;
                }
                else {
                    nullTotalBalance += ` | 0.000 ${config_1.CHAIN[chainKey].currency}`;
                }
            }
            htmlMessage += `<b>${nullTotalBalance}</b>`;
        }
        const walletsButton = createCallBackBtn('Wallets', 'wallets');
        const playButton = createCallBackBtn('Add Raffle', 'ADD_BOT');
        const historyButton = createCallBackBtn('History', 'history');
        const inlineKeyboard = [[walletsButton, playButton], [historyButton]];
        ctx.deleteMessage(processingReply.message_id);
        replyWithHTMLAndInlineKeyboard(ctx, htmlMessage, inlineKeyboard);
    });
}
exports.menuCommand = menuCommand;
// Show History commands
function historyCommand(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        const gettingHistoryReply = yield ctx.reply('Getting History...');
        const historyList = yield (0, account_utils_1.getHistory)();
        ctx.deleteMessage(gettingHistoryReply.message_id);
        const backToMainMenu = createCallBackBtn('⬅️ Back to Main Menu', 'back-to-main-menu');
        let htmlMessage = '';
        if ((historyList !== null && historyList !== void 0 ? historyList : []).length) {
            const _htmlMessage = historyList.reduce((acc, history) => {
                const { didWin, isTail, player, amount } = history;
                const formattedAmount = (0, account_utils_1.formatEther)(amount);
                const wager = didWin ? (0, account_utils_1.formatBalance)(Number(formattedAmount) / 2) : (0, account_utils_1.formatBalance)(formattedAmount);
                return acc + `🤖 <b>Player:</b> ${makeItClickable(player)}\n${isTail ? '🦘' : '🤯'} <b>Bet:</b> ${isTail ? 'Tails' : 'Heads'}\n🤑 <b>Wager:</b> ${wager}\n<b>${didWin ? '✌️ Won' : '😭 Lost'}</b>\n\n`;
            }, '');
            htmlMessage = `🔖 Last 20 bets\n\n${_htmlMessage}`;
        }
        else {
            htmlMessage = 'No History';
        }
        replyWithHTMLAndInlineKeyboard(ctx, htmlMessage, [[backToMainMenu]]);
    });
}
exports.historyCommand = historyCommand;
// Show Play commands
function playCommand(ctx, wallets) {
    return __awaiter(this, void 0, void 0, function* () {
        let htmlMessage = '';
        const inlineKeyboard = [];
        const processingReply = yield ctx.reply('processing...');
        const MAX_BET = yield (0, account_utils_1.getMaxBet)();
        const pauseStatus = yield (0, account_utils_1.getPauseStatus)();
        const backToMainMenu = createCallBackBtn('⬅️ Back to Main Menu', 'back-to-main-menu');
        if (pauseStatus) {
            htmlMessage = '<b>⚠️ Under Construction. Not taking any new Bets at the moment.</b>';
            inlineKeyboard.push([backToMainMenu]);
        }
        else if (Number(MAX_BET) === 0) {
            htmlMessage = '<b>⚠️ There is no balance in the contract at the moment. No betting.</b>';
            inlineKeyboard.push([backToMainMenu]);
        }
        else if (wallets && wallets.length) {
            const { htmlMessage: _htmlMessage } = yield walletsList(wallets);
            htmlMessage = `Please select a wallet to play:\n\n${_htmlMessage}`;
            const walletsBtns = wallets.map((wallet) => createCallBackBtn(wallet.name, `play-wallet-${wallet.name}`));
            inlineKeyboard.push(walletsBtns, [backToMainMenu]);
        }
        else {
            htmlMessage = "<b>⚠️ There are no active wallets associated with your account.</b>\n\nTo play, you need at least one active wallet.";
            const goToWalletsMenu = createCallBackBtn('⬆️ Go to Wallets Menu', 'wallets');
            inlineKeyboard.push([goToWalletsMenu]);
        }
        ctx.deleteMessage(processingReply.message_id);
        replyWithHTMLAndInlineKeyboard(ctx, htmlMessage, inlineKeyboard);
    });
}
exports.playCommand = playCommand;
// Show dynamic play wallet action
function dynamicPlayWalletAction(ctx, wallet) {
    return __awaiter(this, void 0, void 0, function* () {
        const { gameId, pendingNewFlip } = yield (0, account_utils_1.getPendingGameId)(wallet.address);
        let htmlMessage = yield getSelectedWalletHtml(wallet, 'Selected wallet for play:\n\n');
        if (gameId && Number(gameId) !== 0) {
            htmlMessage = `${htmlMessage}\n\n\nLast bet is still pending...\n<b>You bet for: </b>${(0, account_utils_1.formatEther)(pendingNewFlip.userBet)}\n\ncheck /refund command`;
            ctx.replyWithHTML(htmlMessage);
            return;
        }
        htmlMessage = `${htmlMessage}\n\n\n\nℹ️ Press one of the buttons below to choose a coin.`;
        const headsBtn = createCallBackBtn('🤯 Heads', 'heads-coin');
        const tailsBtn = createCallBackBtn('🦘 Tails', 'tails-coin');
        const backToPlayMenu = createCallBackBtn('⬅️ Back to Play Menu', 'play');
        const inlineKeyboard = [[headsBtn, tailsBtn], [backToPlayMenu]];
        replyWithHTMLAndInlineKeyboard(ctx, htmlMessage, inlineKeyboard);
    });
}
exports.dynamicPlayWalletAction = dynamicPlayWalletAction;
// Get refund message for a wallet
function refundMessageForWalletName(ctx, walletName) {
    return __awaiter(this, void 0, void 0, function* () {
        const wallet = getWalletByName(ctx, walletName);
        const { gameId, pendingNewFlip } = yield (0, account_utils_1.getPendingGameId)(wallet.address);
        if (gameId && Number(gameId) !== 0) {
            const pendingBetTimestamp = pendingNewFlip.time;
            const refundDelay = yield (0, account_utils_1.getRefundDelay)();
            const diffBtwDatesInSec = Math.floor((new Date() - new Date(pendingBetTimestamp * 1000)) / 1000);
            if (diffBtwDatesInSec >= refundDelay) {
                const inlineKeyboard = [[createCallBackBtn('💸 Get Refund', 'get-refund')]];
                replyWithHTMLAndInlineKeyboard(ctx, `You can get your refund back in ${walletName} wallet`, inlineKeyboard);
            }
            else {
                ctx.replyWithHTML(`Seconds left for refund in <b>${walletName}</b> wallet: ${diffBtwDatesInSec}`);
            }
        }
        else {
            ctx.reply(`No Refund for <b>${walletName}</b> Wallet`);
        }
    });
}
exports.refundMessageForWalletName = refundMessageForWalletName;
// Show Refund commands
function refundCommand(ctx, wallets) {
    return __awaiter(this, void 0, void 0, function* () {
        if ((wallets !== null && wallets !== void 0 ? wallets : []).length === 0) {
            ctx.reply('No Refund');
            return;
        }
        const backToMainMenu = createCallBackBtn('⬅️ Back to Main Menu', 'back-to-main-menu');
        const inlineKeyboard = [];
        if (ctx.session.selectedPlayWalletName) {
            refundMessageForWalletName(ctx, ctx.session.selectedPlayWalletName);
            delete ctx.session.selectedPlayWalletName;
            return;
        }
        const walletsBtns = wallets.map((wallet) => createCallBackBtn(wallet.name, `refund-wallet-${wallet.name}`));
        inlineKeyboard.push(walletsBtns, [backToMainMenu]);
        const htmlMessage = '👇 Choose one wallet to check Refund\n\n';
        replyWithHTMLAndInlineKeyboard(ctx, htmlMessage, inlineKeyboard);
    });
}
exports.refundCommand = refundCommand;
// Show Wallets commands
function walletsCommand(ctx, wallets) {
    return __awaiter(this, void 0, void 0, function* () {
        let htmlMessage = '';
        const processingReply = yield ctx.reply('processing...');
        const importWalletBtn = createCallBackBtn('🔌 Import an Existing Wallet', 'import-existing-wallet');
        const generateWalletBtn = createCallBackBtn('✍️ Generate a new Wallet Seed', 'generate-wallet-seed');
        const backToMenuBtn = createCallBackBtn('⬅️ Back to Main Menu', 'back-to-main-menu');
        const inlineKeyboard = [[importWalletBtn], [generateWalletBtn]];
        if (wallets && wallets.length) {
            const deleteWalletBtn = createCallBackBtn('❌ Delete Wallet', 'btn-delete-wallet');
            inlineKeyboard.push([deleteWalletBtn]);
            const { htmlMessage: _htmlMessage } = yield walletsList(wallets);
            htmlMessage += `${_htmlMessage}`;
        }
        else {
            htmlMessage = "<b>⚠️ There are no active wallets associated with your account.</b>\n\nYou can either link an already existing wallet or create a new wallet seed from the menu below.";
        }
        inlineKeyboard.push([backToMenuBtn]);
        ctx.deleteMessage(processingReply.message_id);
        replyWithHTMLAndInlineKeyboard(ctx, htmlMessage, inlineKeyboard);
    });
}
exports.walletsCommand = walletsCommand;
// Delete wallet warning message
exports.deleteWalletWarningMsg = '⚠️ Warning ⚠️\nDeleting a wallet is irreversible.\n\nIf you do not have your private keys backed up, please transfer out all funds from your wallet.\n\nIf a wallet is deleted and you do not have your private keys, you will lose access to your funds.';
// Show delete wallet action
function btnDeleteWalletAction(ctx, wallets) {
    return __awaiter(this, void 0, void 0, function* () {
        const processingReply = yield ctx.reply('processing...');
        const { htmlMessage: _htmlMessage } = yield walletsList(wallets);
        const htmlMessage = `Please select a wallet to delete:\n\n${_htmlMessage}\n\n${exports.deleteWalletWarningMsg}`;
        const walletsBtns = wallets.map((wallet) => createCallBackBtn(wallet.name, `delete-wallet-${wallet.name}`));
        const backToMenuBtn = createCallBackBtn('⬅️ Back to Menu', 'back-to-main-menu');
        const inlineKeyboard = [walletsBtns, [backToMenuBtn]];
        ctx.deleteMessage(processingReply.message_id);
        replyWithHTMLAndInlineKeyboard(ctx, htmlMessage, inlineKeyboard);
    });
}
exports.btnDeleteWalletAction = btnDeleteWalletAction;
// Show dynamic delete wallet action
function dynamicDeleteWalletAction(ctx, wallet) {
    return __awaiter(this, void 0, void 0, function* () {
        let htmlMessage = yield getSelectedWalletHtml(wallet, 'Selected wallet for deletion:\n\n');
        htmlMessage = `${htmlMessage}\n\n\n\nℹ️ Press one of the buttons below to confirm or cancel deletion of the wallet.\n\n${exports.deleteWalletWarningMsg}`;
        const confirmDeleteBtn = createCallBackBtn('✅ Confirm Delete', 'confirm-delete-wallet');
        const cancelDeleteBtn = createCallBackBtn('❌ Cancel', 'back-to-main-menu');
        const inlineKeyboard = [[confirmDeleteBtn, cancelDeleteBtn]];
        replyWithHTMLAndInlineKeyboard(ctx, htmlMessage, inlineKeyboard);
    });
}
exports.dynamicDeleteWalletAction = dynamicDeleteWalletAction;
//# sourceMappingURL=bot-utils.js.map