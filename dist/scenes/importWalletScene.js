"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.importWalletStep = exports.importWalletScene = void 0;
const telegraf_1 = require("telegraf");
const chooseWalletNameScene_1 = require("./chooseWalletNameScene");
const utils_1 = require("../utils");
exports.importWalletScene = 'importWalletScene';
exports.importWalletStep = new telegraf_1.Scenes.BaseScene(exports.importWalletScene);
exports.importWalletStep.enter((ctx) => ctx.reply('Please provide either the private key of the wallet you wish to import or a 12-word mnemonic phrase.'));
exports.importWalletStep.on('text', (ctx) => {
    const phrase = ctx.message.text;
    ctx.deleteMessage();
    try {
        const wallet = (0, utils_1.generateAccount)(phrase);
        ctx.session.newWallet = wallet;
        ctx.scene.enter(chooseWalletNameScene_1.chooseWalletNameScene);
    }
    catch (error) {
        console.error("Error generating wallet:", error);
        ctx.reply('😔 This does not appear to be a valid private key / mnemonic phrase. Please try again.');
        ctx.scene.reenter(); // Re-enter the scene to allow user to try again
    }
});
//# sourceMappingURL=importWalletScene.js.map