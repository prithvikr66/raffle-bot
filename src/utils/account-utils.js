import { Wallet, ethers, Contract } from 'ethers';
import { encrypt, decrypt } from './encryption-utils';
import { COIN_FLIP_CONTRACT, COIN_FLIP_ABI, CHAIN } from '../config';

// Function to generate an account
export function generateAccount(seedPhrase = '', index = 0) {
  let wallet;

  // If the seed phrase is not provided, generate a random mnemonic
  if (seedPhrase === '') {
    seedPhrase = Wallet.createRandom().mnemonic.phrase;
  }

  // If the seed phrase does not contain spaces, it is likely a private key
  wallet = seedPhrase.includes(' ')
    ? Wallet.fromMnemonic(seedPhrase, `m/44'/60'/0'/0/${index}`)
    : new Wallet(seedPhrase);

  return {
    address: wallet.address,
    privateKey: encrypt(wallet.privateKey),
    mnemonic: encrypt(seedPhrase),
  };
}

// Function to get balance
export async function getBalance(rpcUrl, address) {
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  const balance = await provider.getBalance(address);
  return Number(formatEther(balance));
}

// Function to format balance
export function formatBalance(value, decimalPlaces = 3) {
  const formattedBalance = +parseFloat(value).toFixed(decimalPlaces);

  if (formattedBalance < 0.001) {
    return +value;
  }

  return formattedBalance;
}

// Function to format Ether value
export function formatEther(value) {
  return ethers.utils.formatEther(value ?? 0);
}

// Function to handle flip write
export async function flipWrite(amount, isTail, privateKey) {
  const provider = new ethers.providers.JsonRpcProvider(CHAIN['mumbai-testnet'].rpcUrl);
  const wallet = new ethers.Wallet(decrypt(privateKey), provider);

  const contract = new Contract(COIN_FLIP_CONTRACT, COIN_FLIP_ABI, wallet);
  const transaction = await contract.flip(isTail, {
    gasLimit: 999999,
    value: ethers.utils.parseEther(amount),
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
}

// Function to handle refund write
export async function refundWrite(privateKey) {
  const provider = new ethers.providers.JsonRpcProvider(CHAIN['mumbai-testnet'].rpcUrl);
  const wallet = new ethers.Wallet(decrypt(privateKey), provider);

  const contract = new Contract(COIN_FLIP_CONTRACT, COIN_FLIP_ABI, wallet);
  const transaction = await contract.getRefund({ gasLimit: 999999 });

  return { transaction };
}

// Initialize getter functions
export function initializeGetter() {
  const provider = new ethers.providers.JsonRpcProvider(CHAIN['mumbai-testnet'].rpcUrl);
  const contract = new Contract(COIN_FLIP_CONTRACT, COIN_FLIP_ABI, provider);

  return {
    getMinBet: async function () {
      const data = await contract.minBet();
      return formatEther(data);
    },
    getMaxBet: async function () {
      const data = await contract.maxBet();
      return formatEther(data);
    },
    getPauseStatus: async function () {
      return await contract.pause();
    },
    getPendingGameId: async function (address) {
      const gameId = await contract.addressToFlip(address);

      let pendingNewFlip;
      if (Number(gameId) !== 0) {
        pendingNewFlip = await contract.flipToAddress(gameId);
      }

      return { gameId, pendingNewFlip };
    },
    getRefundDelay: async function () {
      return await contract.refundDelay();
    },
    getHistory: async function () {
      return await contract.getLastFlipResults(20);
    },
  };
}

export default {
  generateAccount,
  getBalance,
  formatBalance,
  formatEther,
  flipWrite,
  refundWrite,
  ...initializeGetter(),
};
