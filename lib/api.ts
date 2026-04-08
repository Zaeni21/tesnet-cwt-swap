import axios from 'axios';
import {
  API_BASE_URL,
  BLOCKSCOUT_ADDRESS,
  BLOCKSCOUT_API_KEY,
  BLOCKSCOUT_BASE_URL,
  BLOCKSCOUT_CHAIN_ID,
  TOKENS,
  TOKEN_CONTRACTS,
  TokenSymbol,
  BlockResponse,
} from './types';

const NEXUS_RPC_URL = process.env.EXPO_PUBLIC_RPC_URL?.trim() || 'https://testnet.rpc.nexus.xyz';
const SWAP_CONTRACT_ADDRESS =
  process.env.EXPO_PUBLIC_SWAP_CONTRACT_ADDRESS?.trim() || '0x25811e8Ef43261fC87d12EBe3ad75B2cE3274D5B';

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

type BrowserEthereumProvider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
};

function getInjectedProvider(): BrowserEthereumProvider {
  const injected = (globalThis as { ethereum?: BrowserEthereumProvider }).ethereum;
  if (!injected) {
    throw new Error('Wallet provider tidak ditemukan. Hubungkan wallet (contoh: MetaMask) terlebih dahulu.');
  }
  return injected;
}

function getTokenContractAddress(symbol: TokenSymbol): string {
  const address = TOKEN_CONTRACTS[symbol];
  if (!address || address === ZERO_ADDRESS) {
    throw new Error(`Token contract untuk ${symbol} belum dikonfigurasi.`);
  }
  return address;
}

function stripHexPrefix(value: string): string {
  return value.startsWith('0x') ? value.slice(2) : value;
}

function toUint256Hex(value: bigint): string {
  return value.toString(16).padStart(64, '0');
}

function padAddress(address: string): string {
  return stripHexPrefix(address).toLowerCase().padStart(64, '0');
}

function parseHexToBigInt(value: unknown): bigint {
  if (typeof value !== 'string' || !value.startsWith('0x')) {
    throw new Error('Invalid hex response from RPC');
  }
  return BigInt(value);
}

function formatUnits(raw: bigint, decimals: number): number {
  const scale = 10 ** decimals;
  return Number(raw) / scale;
}

function parseUnits(amount: number, decimals: number): bigint {
  const normalized = amount.toFixed(Math.min(decimals, 12));
  const [whole, fraction = ''] = normalized.split('.');
  const fractionPadded = fraction.padEnd(decimals, '0').slice(0, decimals);
  return BigInt(`${whole}${fractionPadded}`);
}

async function rpcCall(method: string, params: unknown[]): Promise<unknown> {
  const response = await axios.post(
    NEXUS_RPC_URL,
    {
      jsonrpc: '2.0',
      id: Date.now(),
      method,
      params,
    },
    { timeout: 10000 }
  );

  if (response.data?.error) {
    throw new Error(response.data.error.message || 'RPC request failed');
  }

  return response.data?.result;
}

async function readTokenBalance(tokenAddress: string, ownerAddress: string): Promise<bigint> {
  const data = `0x70a08231${padAddress(ownerAddress)}`; // balanceOf(address)
  const result = await rpcCall('eth_call', [
    { to: tokenAddress, data },
    'latest',
  ]);
  return parseHexToBigInt(result);
}

/**
 * Estimate quote by reading token balances held by swap contract.
 */
export async function getQuote(
  inToken: TokenSymbol,
  outToken: TokenSymbol,
  amount: number
): Promise<number> {
  if (amount <= 0) return 0;

  try {
    const inTokenAddress = getTokenContractAddress(inToken);
    const outTokenAddress = getTokenContractAddress(outToken);

    const [inReserveRaw, outReserveRaw] = await Promise.all([
      readTokenBalance(inTokenAddress, SWAP_CONTRACT_ADDRESS),
      readTokenBalance(outTokenAddress, SWAP_CONTRACT_ADDRESS),
    ]);

    const inReserve = formatUnits(inReserveRaw, TOKENS[inToken].decimals);
    const outReserve = formatUnits(outReserveRaw, TOKENS[outToken].decimals);

    if (inReserve <= 0 || outReserve <= 0) {
      return 0;
    }

    // Constant product AMM estimation without fee.
    return (amount * outReserve) / (inReserve + amount);
  } catch (error) {
    console.error('Failed to fetch quote from contract:', error);
    throw new Error('Gagal mengambil quote dari smart contract Nexus');
  }
}

/**
 * Submit a swap transaction by transferring input token to the swap contract.
 */
export async function submitSwap(
  inToken: TokenSymbol,
  _outToken: TokenSymbol,
  amount: number,
  _accountId: number = 0
): Promise<void> {
  try {
    const provider = getInjectedProvider();
    const accounts = (await provider.request({ method: 'eth_requestAccounts' })) as string[];

    if (!accounts?.[0]) {
      throw new Error('Wallet tidak mengembalikan account aktif.');
    }

    const tokenAddress = getTokenContractAddress(inToken);
    const decimals = TOKENS[inToken].decimals;
    const parsedAmount = parseUnits(amount, decimals);

    const transferData = `0xa9059cbb${padAddress(SWAP_CONTRACT_ADDRESS)}${toUint256Hex(parsedAmount)}`; // transfer(address,uint256)

    const txHash = await provider.request({
      method: 'eth_sendTransaction',
      params: [
        {
          from: accounts[0],
          to: tokenAddress,
          data: transferData,
        },
      ],
    });

    if (typeof txHash !== 'string' || !txHash.startsWith('0x')) {
      throw new Error('Gagal mengirim transaksi swap.');
    }
  } catch (error) {
    console.error('Failed to submit swap via contract:', error);
    throw new Error('Gagal men-submit swap ke smart contract. Pastikan wallet terhubung dan saldo cukup.');
  }
}

/**
 * Fetch recent blocks from the blockchain
 */
export async function getRecentBlocks(count: number = 10): Promise<BlockResponse[]> {
  try {
    const response = await axios.get<BlockResponse[]>(`${API_BASE_URL}/blocks`, {
      params: { n: count },
      timeout: 10000,
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch blocks:', error);
    throw new Error('Failed to fetch transaction history');
  }
}

/**
 * Check if API is available
 */
export async function checkApiHealth(): Promise<boolean> {
  try {
    await axios.get(`${API_BASE_URL}/blocks`, { params: { n: 1 }, timeout: 10000 });
    return true;
  } catch {
    return false;
  }
}

export interface BlockscoutTransaction {
  hash: string;
  timestamp?: string;
  method?: string;
  from?: { hash: string };
  to?: { hash: string };
  value?: string;
}

export async function getBlockscoutAddressTransactions(limit: number = 20): Promise<BlockscoutTransaction[]> {
  if (!BLOCKSCOUT_CHAIN_ID || !BLOCKSCOUT_ADDRESS) {
    return [];
  }

  try {
    const response = await axios.get<{ items?: BlockscoutTransaction[] }>(
      `${BLOCKSCOUT_BASE_URL}/${BLOCKSCOUT_CHAIN_ID}/api/v2/addresses/${BLOCKSCOUT_ADDRESS}/transactions`,
      {
        params: {
          apikey: BLOCKSCOUT_API_KEY || undefined,
          items_count: limit,
        },
        timeout: 10000,
      }
    );

    return response.data.items ?? [];
  } catch (error) {
    console.error('Failed to fetch Blockscout transactions:', error);
    return [];
  }
}
