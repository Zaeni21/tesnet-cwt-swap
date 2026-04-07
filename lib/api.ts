import axios from 'axios';
import {
  API_BASE_URL,
  BLOCKSCOUT_ADDRESS,
  BLOCKSCOUT_API_KEY,
  BLOCKSCOUT_BASE_URL,
  BLOCKSCOUT_CHAIN_ID,
  TokenSymbol,
  QuoteResponse,
  TransactionPayload,
  BlockResponse,
} from './types';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

/**
 * Fetch exchange rate quote for a token swap
 */
export async function getQuote(
  inToken: TokenSymbol,
  outToken: TokenSymbol,
  amount: number
): Promise<number> {
  try {
    const response = await api.get<QuoteResponse>('/rate', {
      params: {
        in: inToken,
        out: outToken,
        amount,
      },
    });
    return response.data.amount_out;
  } catch (error) {
    console.error('Failed to fetch quote:', error);
    if (axios.isAxiosError(error) && !error.response) {
      throw new Error(
        `Cannot reach blockchain API at ${API_BASE_URL}. Check EXPO_PUBLIC_BLOCKCHAIN_API_URL or run the local chain on port 3000.`
      );
    }
    throw new Error('Failed to fetch exchange rate');
  }
}

/**
 * Submit a swap transaction to the blockchain
 */
export async function submitSwap(
  inToken: TokenSymbol,
  outToken: TokenSymbol,
  amount: number,
  accountId: number = 0
): Promise<void> {
  try {
    const payload: TransactionPayload = {
      Swap: {
        account: accountId,
        in_token: inToken,
        out_token: outToken,
        amount,
      },
    };

    await api.post('/transaction', payload);
  } catch (error) {
    console.error('Failed to submit swap:', error);
    if (axios.isAxiosError(error) && !error.response) {
      throw new Error(
        `Cannot reach blockchain API at ${API_BASE_URL}. Check EXPO_PUBLIC_BLOCKCHAIN_API_URL or run the local chain on port 3000.`
      );
    }
    throw new Error('Failed to submit swap transaction');
  }
}

/**
 * Fetch recent blocks from the blockchain
 */
export async function getRecentBlocks(count: number = 10): Promise<BlockResponse[]> {
  try {
    const response = await api.get<BlockResponse[]>('/blocks', {
      params: { n: count },
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
    await api.get('/blocks', { params: { n: 1 } });
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
