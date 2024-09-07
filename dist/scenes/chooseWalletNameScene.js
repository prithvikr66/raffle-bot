"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chooseWalletNameStep = exports.chooseWalletNameScene = void 0;
const telegraf_1 = require("telegraf");
const utils_1 = require("../utils");
exports.chooseWalletNameScene = 'chooseWalletNameScene';
exports.chooseWalletNameStep = new telegraf_1.Scenes.BaseScene(exports.chooseWalletNameScene);
exports.chooseWalletNameStep.enter((ctx) => ctx.reply('Choose a name for the newly generated wallet. (Max 8 characters)'));
exports.chooseWalletNameStep.on('text', (ctx) => {
    var _a;
    const walletName = ctx.message.text;
    if (walletName.length > 8) {
        ctx.reply('Wallet name must be less than or equal to 8 characters');
    }
    else {
        if (ctx.session.wallets && ctx.session.wallets.length === 6) {
            ctx.reply('Wallet limit reached');
        }
        else {
            ctx.deleteMessage();
            const newWallet = ctx.session.newWallet;
            newWallet.name = walletName;
            ctx.session.wallets = [...((_a = ctx.session.wallets) !== null && _a !== void 0 ? _a : []), newWallet];
            ctx.replyWithHTML(`✅ New wallet <b>${walletName}</b> was successfully imported & encrypted\n\nAddress:\n${(0, utils_1.makeItClickable)(newWallet.address)}`);
        }
    }
    delete ctx.session.newWallet;
    ctx.scene.leave();
});
//# sourceMappingURL=chooseWalletNameScene.js.map