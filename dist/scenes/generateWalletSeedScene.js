"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateWalletSeedStep = exports.generateWalletSeedScene = void 0;
const telegraf_1 = require("telegraf");
const utils_1 = require("../utils");
exports.generateWalletSeedScene = 'generateWalletSeedScene';
exports.generateWalletSeedStep = new telegraf_1.Scenes.BaseScene(exports.generateWalletSeedScene);
exports.generateWalletSeedStep.enter((ctx) => ctx.reply('🧐 Choose a name for the newly generated wallet. (Max 8 characters)'));
exports.generateWalletSeedStep.on('text', (ctx) => {
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
            const newWallet = (0, utils_1.generateAccount)();
            newWallet.name = walletName;
            ctx.session.wallets = [...((_a = ctx.session.wallets) !== null && _a !== void 0 ? _a : []), newWallet];
            ctx.replyWithHTML(`✅ New wallet <b>${walletName}</b> was successfully created & encrypted.\n\nAddress:\n${(0, utils_1.makeItClickable)(newWallet.address)}\nPrivate Key:\n${(0, utils_1.makeItClickable)((0, utils_1.decrypt)(newWallet.privateKey))}\nMnemonic Phrase:\n${(0, utils_1.makeItClickable)((0, utils_1.decrypt)(newWallet.mnemonic))}\n\nMake sure to save the information above offline. Never send it to anyone, and never hold it in a plain text format on a device connected to the internet. You can also import the wallet above in your Web3 wallet provider (Metamask, Trust Wallet, etc).\n\nOnce you're finished writing down your secret phrase, delete this message. DracoFlip will never display this information again.\n\nSubmit the /wallets command to check the wallet.`);
        }
    }
    ctx.scene.leave();
});
//# sourceMappingURL=generateWalletSeedScene.js.map