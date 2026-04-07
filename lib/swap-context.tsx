import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SwapTransaction, TokenSymbol } from './types';

interface SwapState {
  transactions: SwapTransaction[];
  isLoading: boolean;
  error: string | null;
}

type SwapAction =
  | { type: 'SET_TRANSACTIONS'; payload: SwapTransaction[] }
  | { type: 'ADD_TRANSACTION'; payload: SwapTransaction }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_ERROR' };

const initialState: SwapState = {
  transactions: [],
  isLoading: false,
  error: null,
};

const SwapContext = createContext<{
  state: SwapState;
  addTransaction: (transaction: SwapTransaction) => void;
  loadTransactions: () => Promise<void>;
  clearError: () => void;
} | null>(null);

function swapReducer(state: SwapState, action: SwapAction): SwapState {
  switch (action.type) {
    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload };
    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [action.payload, ...state.transactions],
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
}

export function SwapProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(swapReducer, initialState);

  // Load transactions from AsyncStorage on mount
  useEffect(() => {
    loadTransactionsFromStorage();
  }, []);

  const loadTransactionsFromStorage = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const stored = await AsyncStorage.getItem('swap_transactions');
      if (stored) {
        const transactions = JSON.parse(stored);
        dispatch({ type: 'SET_TRANSACTIONS', payload: transactions });
      }
      dispatch({ type: 'SET_ERROR', payload: null });
    } catch (error) {
      console.error('Failed to load transactions:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load transaction history' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const addTransaction = useCallback(
    async (transaction: SwapTransaction) => {
      try {
        dispatch({ type: 'ADD_TRANSACTION', payload: transaction });

        // Persist to AsyncStorage
        const updated = [transaction, ...state.transactions];
        await AsyncStorage.setItem('swap_transactions', JSON.stringify(updated));
      } catch (error) {
        console.error('Failed to save transaction:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to save transaction' });
      }
    },
    [state.transactions]
  );

  const loadTransactions = useCallback(async () => {
    await loadTransactionsFromStorage();
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  return (
    <SwapContext.Provider
      value={{
        state,
        addTransaction,
        loadTransactions,
        clearError,
      }}
    >
      {children}
    </SwapContext.Provider>
  );
}

export function useSwapContext() {
  const context = useContext(SwapContext);
  if (!context) {
    throw new Error('useSwapContext must be used within SwapProvider');
  }
  return context;
}
