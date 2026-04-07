// Token definitions and types for the swap app

export type TokenSymbol = 'USDC' | 'USDT' | 'ETH' | 'BTC' | 'NEX' | 'DOGE' | 'HYPE';

export interface Token {
  symbol: TokenSymbol;
  name: string;
  icon: string;
  color: string;
  decimals: number;
}

export interface SwapTransaction {
  id: string;
  fromToken: TokenSymbol;
  toToken: TokenSymbol;
  amountIn: number;
  amountOut: number;
  timestamp: number;
  status: 'success' | 'pending' | 'failed';
  blockId?: number;
}

export interface QuoteResponse {
  amount_out: number;
}

export interface TransactionPayload {
  Swap: {
    account: number;
    in_token: TokenSymbol;
    out_token: TokenSymbol;
    amount: number;
  };
}

export interface BlockResponse {
  id: number;
  timestamp: number;
  transactions: Array<{
    Swap?: {
      account: number;
      in_token: TokenSymbol;
      out_token: TokenSymbol;
      amount: number;
    };
  }>;
}

export const TOKENS: Record<TokenSymbol, Token> = {
  NEX: {
    symbol: 'NEX',
    name: 'Nexus',
    icon: '🟣',
    color: '#9945FF',
    decimals: 6,
  },
  ETH: {
    symbol: 'ETH',
    name: 'Ethereum',
    icon: '⟠',
    color: '#627EEA',
    decimals: 18,
  },
  BTC: {
    symbol: 'BTC',
    name: 'Bitcoin',
    icon: '₿',
    color: '#F7931A',
    decimals: 8,
  },
  USDC: {
    symbol: 'USDC',
    name: 'USD Coin',
    icon: '💵',
    color: '#2775CA',
    decimals: 6,
  },
  USDT: {
    symbol: 'USDT',
    name: 'Tether',
    icon: '💴',
    color: '#26A17B',
    decimals: 6,
  },
  DOGE: {
    symbol: 'DOGE',
    name: 'Dogecoin',
    icon: '🐕',
    color: '#BA9F33',
    decimals: 8,
  },
  HYPE: {
    symbol: 'HYPE',
    name: 'Hype',
    icon: '🚀',
    color: '#FF6B6B',
    decimals: 6,
  },
};

export const API_BASE_URL = 'http://127.0.0.1:3000';
export const ACCOUNT_ID = 0; // Default account for swaps
