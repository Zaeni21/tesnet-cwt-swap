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

export const TOKEN_SWAP_ADDRESS = '0x25811e8Ef43261fC87d12EBe3ad75B2cE3274D5B';

export const TOKEN_CONTRACTS = {
  NEX: 'native',
  ETH: '0x6afaAad5aE59698fC3b20B67c0fD6549efcaE39A',
  BTC: '0x3eC542a8Dc12Fed02a645d9DD14950594Bf31a8b',
  USDC: '0x9586d069a180823D7386cEf01Ec232c7E74F9538',
  USDT: '0xf88baD145FE915F3cFB6f62b3fd3fe7Ce9eEd91d',
  DOGE: '0x476bF1510AD9cCbf9F4c05fE7E05a3Ce59Cb11Bc',
  HYPE: '0x72eAd33588f911422C6Ecb14f39F133Ed20aE1Bf',
  USDX: '0x9658B23835BCc7E16d4CaE49a14167547dE54130',
} as const;


export const API_BASE_URL = 'http://127.0.0.1:3000';
export const ACCOUNT_ID = 0; // Default account for swaps
