import { describe, it, expect } from 'vitest';
import { TOKENS, ACCOUNT_ID, API_BASE_URL, TOKEN_SWAP_ADDRESS, TOKEN_CONTRACTS } from './types';
import type { TokenSymbol, SwapTransaction } from './types';

describe('Types and Constants', () => {
  describe('TOKENS', () => {
    it('should have all 7 tokens defined', () => {
      const tokenSymbols: TokenSymbol[] = ['USDC', 'USDT', 'ETH', 'BTC', 'NEX', 'DOGE', 'HYPE'];
      expect(Object.keys(TOKENS)).toHaveLength(7);
      tokenSymbols.forEach((symbol) => {
        expect(TOKENS[symbol]).toBeDefined();
      });
    });

    it('should have correct token properties', () => {
      const nex = TOKENS.NEX;
      expect(nex.symbol).toBe('NEX');
      expect(nex.name).toBe('Nexus');
      expect(nex.color).toBe('#9945FF');
      expect(nex.decimals).toBe(6);
      expect(nex.icon).toBeDefined();
    });

    it('should have unique colors for each token', () => {
      const colors = Object.values(TOKENS).map((token) => token.color);
      const uniqueColors = new Set(colors);
      expect(uniqueColors.size).toBe(colors.length);
    });
  });

  describe('Contract addresses', () => {
    it('should have the configured TokenSwap contract address', () => {
      expect(TOKEN_SWAP_ADDRESS).toBe('0x25811e8Ef43261fC87d12EBe3ad75B2cE3274D5B');
    });

    it('should include all configured token contract addresses', () => {
      expect(TOKEN_CONTRACTS.NEX).toBe('0x0000000000000000000000000000000000000000');
      expect(TOKEN_CONTRACTS.ETH).toBe('0x6afaAad5aE59698fC3b20B67c0fD6549efcaE39A');
      expect(TOKEN_CONTRACTS.BTC).toBe('0x3eC542a8Dc12Fed02a645d9DD14950594Bf31a8b');
      expect(TOKEN_CONTRACTS.USDC).toBe('0x9586d069a180823D7386cEf01Ec232c7E74F9538');
      expect(TOKEN_CONTRACTS.USDT).toBe('0xf88baD145FE915F3cFB6f62b3fd3fe7Ce9eEd91d');
      expect(TOKEN_CONTRACTS.DOGE).toBe('0x476bF1510AD9cCbf9F4c05fE7E05a3Ce59Cb11Bc');
      expect(TOKEN_CONTRACTS.HYPE).toBe('0x72eAd33588f911422C6Ecb14f39F133Ed20aE1Bf');
      expect(TOKEN_CONTRACTS.USDX).toBe('0x9658B23835BCc7E16d4CaE49a14167547dE54130');
    });
  });

  describe('Constants', () => {
    it('should have correct API base URL', () => {
      expect(API_BASE_URL).toBe('http://127.0.0.1:3000');
    });

    it('should have default account ID', () => {
      expect(ACCOUNT_ID).toBe(0);
    });
  });

  describe('SwapTransaction type', () => {
    it('should create valid swap transaction', () => {
      const transaction: SwapTransaction = {
        id: '1',
        fromToken: 'NEX',
        toToken: 'ETH',
        amountIn: 10,
        amountOut: 9.09,
        timestamp: Date.now(),
        status: 'success',
      };

      expect(transaction.id).toBe('1');
      expect(transaction.fromToken).toBe('NEX');
      expect(transaction.toToken).toBe('ETH');
      expect(transaction.status).toBe('success');
    });
  });
});
