import { Scenes } from 'telegraf';
import { getSelectedWalletHtml,getWalletByName } from '../utils/bot-utils';
import { CHAIN } from '../config';
import { flipWrite,getBalance,formatEther,initializeGetter } from '../utils/account-utils';

export const playAmountScene = 'playAmountScene';
export const playAmountStep = new Scenes.BaseScene(playAmountScene);

const {getMaxBet,getMinBet} =initializeGetter();

playAmountStep.enter(async (ctx) => {
  const walletName = ctx.session.selectedPlayWalletName;
  const wallet = getWalletByName(ctx, walletName);

  let htmlMessage = await getSelectedWalletHtml(
    wallet,
    `Selected wallet to bet <b>${ctx.session.selectedCoin}</b>:\n\n`
  );

  const MIN_BET = await getMinBet();
  const MAX_BET = await getMaxBet();

  htmlMessage += `\n\n\nHow much are we betting?\n<b>Minimum Bet:</b> ${MIN_BET}\n<b>Maximum Bet:</b> ${MAX_BET}\n\nPlease reply with ${CHAIN['mumbai-testnet'].currency} amount to bet.`;
  ctx.replyWithHTML(htmlMessage);
});

playAmountStep.on('text', async (ctx) => {
  try {
    const wallet = getWalletByName(ctx, ctx.session.selectedPlayWalletName);

    const sendAmount = Number.parseFloat(ctx.message.text);
    const MIN_BET = await getMinBet();
    const MAX_BET = await getMaxBet();
    const walletBalance = await getBalance(
      CHAIN['mumbai-testnet'].rpcUrl,
      wallet.address
    );

    if (sendAmount === 0) {
      ctx.reply('⚠️ Incorrect bet amount.');
    } else if (sendAmount > walletBalance) {
      ctx.reply('⚠️ Incorrect bet amount. Insufficient balance.');
    } else if (sendAmount < MIN_BET) {
      ctx.reply('⚠️ Incorrect bet amount. Need at least minimum bet amount.');
    } else if (sendAmount > MAX_BET) {
      ctx.reply(
        "⚠️ Incorrect bet amount. Amount can't be more than maximum bet amount."
      );
    } else {
      const pendingReply = await ctx.reply('pending...');
      try {
        const { transaction, newFlip, contract } = await flipWrite(
          sendAmount.toString(),
          ctx.session.selectedCoin === 'Tails',
          wallet.privateKey
        );

        ctx.deleteMessage(pendingReply.message_id);
        const pendingTxHashReply = await ctx.reply(
          `⏱️ Transaction Pending!\n\nTransaction hash:\n${CHAIN['mumbai-testnet'].explorerUrl}/tx/${transaction.hash}`
        );

        try {
          const receipt = await transaction.wait();
          ctx.deleteMessage(pendingTxHashReply.message_id);

          if (receipt.status === 1) {
            await ctx.replyWithHTML(
              `✅ Transaction Confirmed!\n\nTransaction hash:\n${CHAIN['mumbai-testnet'].explorerUrl}/tx/${receipt.transactionHash}`
            );

            const bettingReply = await ctx.reply('betting...');
            const spinningCoinReply = await ctx.replyWithAnimation(
              'https://i.pinimg.com/originals/1f/3f/71/1f3f71f0ef3470c354aa7cfcf1272b56.gif'
            );

            const handleFlipCompletedEvent = (
              player,
              didWin,
              isTail,
              amount,
              gameId
            ) => {
              ctx.deleteMessage(bettingReply.message_id);
              ctx.deleteMessage(spinningCoinReply.message_id);

              if (
                newFlip.gameId === gameId.toString() &&
                player === wallet.address
              ) {
                ctx.replyWithHTML(
                  `<b>You ${didWin ? 'Win' : 'Lost'}</b>${
                    didWin
                      ? `\nYou will get ${formatEther(
                          amount.toString()
                        )} amount of ${
                          CHAIN['mumbai-testnet'].currency
                        } as a reward in your wallet`
                      : ''
                  }\n\nPlay again /play`
                );
              }

              contract.removeListener(
                'FlipCompleted',
                handleFlipCompletedEvent
              );
            };

            contract.on('FlipCompleted', handleFlipCompletedEvent);
          } else {
            ctx.replyWithHTML(`😔 Failed to bet ${receipt}`);
          }
        } catch (error) {
          ctx.deleteMessage(pendingTxHashReply.message_id);
          ctx.replyWithHTML(error.message);
        }
      } catch (error) {
        ctx.deleteMessage(pendingReply.message_id);
        ctx.replyWithHTML(error.message);
      }

      delete ctx.session.selectedCoin;
      delete ctx.session.selectedPlayWalletName;

      ctx.scene.leave();
    }
  } catch (_) {
    ctx.replyWithHTML('⚠️ Incorrect bet amount.');
  }
});
