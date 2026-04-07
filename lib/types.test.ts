import { describe, it, expect } from 'vitest';
import { TOKENS, ACCOUNT_ID, API_BASE_URL } from './types';
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
