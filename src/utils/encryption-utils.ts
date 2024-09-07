import * as dotenv from "dotenv";
import * as crypto from "crypto-js";

dotenv.config();

// AES encryption function
export function encrypt(text: string): string {
  if (!process.env.COINFLIP_TELEGRAM_BOT_TOKEN) {
    throw new Error("COINFLIP_TELEGRAM_BOT_TOKEN is not defined in environment variables");
  }
  return crypto.AES.encrypt(text, process.env.COINFLIP_TELEGRAM_BOT_TOKEN).toString();
}

// AES decryption function
export function decrypt(cipherText: string): string {
  if (!process.env.COINFLIP_TELEGRAM_BOT_TOKEN) {
    throw new Error("COINFLIP_TELEGRAM_BOT_TOKEN is not defined in environment variables");
  }
  const bytes = crypto.AES.decrypt(cipherText, process.env.COINFLIP_TELEGRAM_BOT_TOKEN);
  return bytes.toString(crypto.enc.Utf8);
}
