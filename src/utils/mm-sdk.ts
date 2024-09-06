const { MetaMaskSDK } = require("@metamask/sdk");
const qrcode = require("qrcode");
const sdk = new MetaMaskSDK({
  shouldShimWeb3: false,
  //   showQRCode: false,
});

// console.log("Connected accounts:", accounts);

// const from = accounts[0];

// const paymentLink = `ethereum:${toAccount}?value=0x38D7EA4C68000&from=${from}`;
// console.log("Payment Link:", paymentLink);

// const qrCodeImageBuffer = await qrcode.toBuffer(paymentLink);

// // Send the QR code image to the user via Telegram bot
// await ctx.replyWithPhoto({ source: qrCodeImageBuffer });
// await ctx.reply(`Please scan the QR code or use this link to complete the payment: ${paymentLink}`);

const ethereum = sdk.getProvider();

export const start = async (ctx: any, toAccount: any) => {
  try {
    const accounts = ethereum?.request({
      method: "eth_requestAccounts",
      params: [],
    });

    const from = accounts[0];
   console.log("Connected account:", from);

   const value = "0x38D7EA4C68000"; 
   const paymentLink = `ethereum:${toAccount}?value=${value}&from=${from}`;
   console.log("Payment Link:", paymentLink);

  
    // const qrBuffer = await qrcode.toBuffer(link, {
    //   type: "png",
    // });
    // await ctx.replyWithPhoto({ source: qrBuffer });
  } catch (error) {
    console.error("An error occurred:", error);
    // await ctx.reply(
    //   "An error occurred while connecting your wallet or sending the transaction."
    // );
  }
};
