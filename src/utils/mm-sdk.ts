const { MetaMaskSDK } = require("@metamask/sdk");
const qrcode = require("qrcode");


const userSessions = new Map();

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const start = async (ctx: any, toAccount: any) => {
  const userId = ctx.from.id;
  
  if (userSessions.has(userId)) {
    await ctx.reply("A session is already in progress. Please finish or cancel it before starting a new one.");
    return;
  }

  const sdk = new MetaMaskSDK({
    shouldShimWeb3: false,
  });
  const ethereum = sdk.getProvider();

  userSessions.set(userId, { sdk, ethereum, ctx });

  try {
    const accountsPromise = ethereum?.request({
      method: "eth_requestAccounts",
      params: [],
    });

    await delay(2500);

    const link = sdk.getUniversalLink();
    const qrBuffer = await qrcode.toBuffer(link, {
      type: "png",
    });

    await ctx.replyWithPhoto({ source: qrBuffer });
    await ctx.reply(
      `Please scan the QR code to link your wallet or use this url:\n${link}`
    );
    await ctx.reply("Waiting for Wallet Connection..");

    let connected = false;
    let from;

    while (!connected && userSessions.has(userId)) {
      await delay(5000);
      try {
        const accounts = await accountsPromise;
        from = accounts[0];
        if (from != undefined) {
          connected = true;
          await ctx.reply(`Wallet connected: ${from}`);
        }
      } catch (error) {
        console.error("Error connecting:", error);
        await ctx.reply("Error Connecting!! Try Again");
      }
    }

    if (from && userSessions.has(userId)) {
      await ctx.reply("Initiating transaction...");
      try {
        const txHash = await ethereum.request({
          method: "eth_sendTransaction",
          params: [
            {
              from: from,
              to: toAccount,
              value: "0x38D7EA4C68000", 
            },
          ],
        });
        console.log("Transaction hash:", txHash);
        await ctx.reply(`Transaction sent! Hash: ${txHash}`);
      } catch (error) {
        console.error("Transaction error:", error);
        await ctx.reply("Failed to send transaction. Please try again.");
      }
    } else if (userSessions.has(userId)) {
      await ctx.reply("No account connected. Cannot initiate transaction.");
    }
  } catch (error) {
    console.error("An error occurred:", error);
    await ctx.reply("An error occurred. Please try again later.");
  } finally {
    userSessions.delete(userId);
  }
};


export const cancelSession = async (ctx: any) => {
  const userId = ctx.from.id;
  if (userSessions.has(userId)) {
    userSessions.delete(userId);
    await ctx.reply("Your session has been cancelled.");
  } else {
    await ctx.reply("You don't have an active session.");
  }
};