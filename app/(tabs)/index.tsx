import React, { useState, useCallback, useEffect } from 'react';
import { ScrollView, Text, View, Pressable, TextInput, ActivityIndicator, Alert } from 'react-native';
import * as Haptics from 'expo-haptics';
import { ScreenContainer } from '@/components/screen-container';
import { TokenButton } from '@/components/token-button';
import { TokenModal } from '@/components/token-modal';
import { SwapConfirmationSheet } from '@/components/swap-confirmation-sheet';
import { TOKENS, TokenSymbol, ACCOUNT_ID } from '@/lib/types';
import { getQuote, submitSwap } from '@/lib/api';
import { useSwapContext } from '@/lib/swap-context';

export default function HomeScreen() {
  const { addTransaction } = useSwapContext();

  // Token selection state
  const [fromToken, setFromToken] = useState<TokenSymbol>('NEX');
  const [toToken, setToToken] = useState<TokenSymbol>('ETH');
  const [tokenModalMode, setTokenModalMode] = useState<'from' | 'to' | null>(null);

  // Input state
  const [amountIn, setAmountIn] = useState('');
  const [amountOut, setAmountOut] = useState<number | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);

  // Confirmation sheet state
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [swapLoading, setSwapLoading] = useState(false);

  // Fetch quote when amount or tokens change
  useEffect(() => {
    if (!amountIn || parseFloat(amountIn) <= 0) {
      setAmountOut(null);
      return;
    }

    const fetchQuote = async () => {
      try {
        setQuoteLoading(true);
        const amount = parseFloat(amountIn);
        const quote = await getQuote(fromToken, toToken, amount);
        setAmountOut(quote);
      } catch (error) {
        console.error('Failed to fetch quote:', error);
        setAmountOut(null);
      } finally {
        setQuoteLoading(false);
      }
    };

    const timer = setTimeout(fetchQuote, 500);
    return () => clearTimeout(timer);
  }, [amountIn, fromToken, toToken]);

  const handleTokenSelect = (token: TokenSymbol) => {
    if (tokenModalMode === 'from') {
      setFromToken(token);
    } else if (tokenModalMode === 'to') {
      setToToken(token);
    }
    setTokenModalMode(null);
  };

  const handleSwapTokens = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setFromToken(toToken);
    setToToken(fromToken);
  };

  const handleMaxAmount = () => {
    // In a real app, this would fetch the user's balance
    // For now, we'll just set a demo amount
    setAmountIn('100');
  };

  const handleConfirmSwap = async () => {
    if (!amountIn || !amountOut || amountOut <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount');
      return;
    }

    try {
      setSwapLoading(true);
      const amount = parseFloat(amountIn);

      // Submit swap to blockchain
      await submitSwap(fromToken, toToken, amount, ACCOUNT_ID);

      // Add to transaction history
      addTransaction({
        id: Date.now().toString(),
        fromToken,
        toToken,
        amountIn: amount,
        amountOut,
        timestamp: Date.now(),
        status: 'success',
      });

      // Reset form
      setAmountIn('');
      setAmountOut(null);
      setShowConfirmation(false);

      // Show success feedback
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Swap Successful', `Swapped ${amount} ${fromToken} for ${amountOut.toFixed(6)} ${toToken}`);
    } catch (error) {
      console.error('Swap failed:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Swap Failed', error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setSwapLoading(false);
    }
  };

  const rate = amountIn && amountOut ? (amountOut / parseFloat(amountIn)).toFixed(6) : '0';

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 gap-6 p-4">
          {/* Header */}
          <View className="items-center gap-2">
            <Text className="text-4xl font-bold text-foreground">Swap</Text>
            <Text className="text-base text-muted">Exchange tokens instantly</Text>
          </View>

          {/* Swap Card */}
          <View className="bg-surface rounded-2xl p-6 gap-4 border border-border">
            {/* From Token */}
            <View className="gap-2">
              <Text className="text-sm font-semibold text-muted">From</Text>
              <TokenButton
                token={TOKENS[fromToken]}
                onPress={() => setTokenModalMode('from')}
                label="Send"
              />
            </View>

            {/* Amount Input */}
            <View className="gap-2">
              <Text className="text-sm font-semibold text-muted">Amount</Text>
              <View className="flex-row items-center gap-2 bg-background rounded-lg border border-border px-4 py-3">
                <TextInput
                  placeholder="0.00"
                  placeholderTextColor="#9BA1A6"
                  value={amountIn}
                  onChangeText={setAmountIn}
                  keyboardType="decimal-pad"
                  className="flex-1 text-lg font-semibold text-foreground"
                />
                <Pressable
                  onPress={handleMaxAmount}
                  style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                >
                  <Text className="px-3 py-1 bg-primary rounded-lg text-white font-semibold text-sm">
                    Max
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Swap Direction Button */}
            <View className="items-center">
              <Pressable
                onPress={handleSwapTokens}
                style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
              >
                <View className="bg-primary rounded-full p-3">
                  <Text className="text-2xl text-white">⇅</Text>
                </View>
              </Pressable>
            </View>

            {/* To Token */}
            <View className="gap-2">
              <Text className="text-sm font-semibold text-muted">To</Text>
              <TokenButton
                token={TOKENS[toToken]}
                onPress={() => setTokenModalMode('to')}
                label="Receive"
              />
            </View>

            {/* Output Amount */}
            <View className="gap-2">
              <Text className="text-sm font-semibold text-muted">You Receive</Text>
              <View className="bg-background rounded-lg border border-border px-4 py-3">
                {quoteLoading ? (
                  <ActivityIndicator color="#0a7ea4" />
                ) : (
                  <Text className="text-lg font-semibold text-foreground">
                    {amountOut ? amountOut.toFixed(6) : '0.00'} {toToken}
                  </Text>
                )}
              </View>
            </View>
          </View>

          {/* Rate Info */}
          {amountIn && amountOut && (
            <View className="bg-surface rounded-xl p-4 border border-border">
              <Text className="text-sm text-muted mb-2">Exchange Rate</Text>
              <Text className="text-base font-semibold text-foreground">
                1 {fromToken} = {rate} {toToken}
              </Text>
            </View>
          )}

          {/* Swap Button */}
          <Pressable
            onPress={() => setShowConfirmation(true)}
            disabled={!amountIn || !amountOut || amountOut <= 0}
            style={({ pressed }) => [
              {
                opacity: pressed ? 0.9 : 1,
              },
            ]}
          >
            <View className="bg-primary rounded-xl py-4 items-center justify-center">
              <Text className="text-lg font-bold text-white">Review Swap</Text>
            </View>
          </Pressable>
        </View>
      </ScrollView>

      {/* Token Modal */}
      <TokenModal
        visible={tokenModalMode !== null}
        onClose={() => setTokenModalMode(null)}
        onSelect={handleTokenSelect}
        selectedToken={tokenModalMode === 'from' ? fromToken : toToken}
      />

      {/* Swap Confirmation Sheet */}
      <SwapConfirmationSheet
        visible={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirmSwap}
        fromToken={fromToken}
        toToken={toToken}
        amountIn={parseFloat(amountIn) || 0}
        amountOut={amountOut || 0}
        isLoading={swapLoading}
      />
    </ScreenContainer>
  );
}
