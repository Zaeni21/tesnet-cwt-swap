import React, { useCallback, useState } from 'react';
import { FlatList, Text, View, Pressable, RefreshControl, SafeAreaView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { ScreenContainer } from '@/components/screen-container';
import { TOKENS, SwapTransaction } from '@/lib/types';
import { useSwapContext } from '@/lib/swap-context';
import { getRecentBlocks } from '@/lib/api';

export default function HistoryScreen() {
  const { state, loadTransactions } = useSwapContext();
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadTransactions();
    }, [loadTransactions])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      // Fetch recent blocks from blockchain
      const blocks = await getRecentBlocks(10);

      // Parse transactions from blocks
      const newTransactions: SwapTransaction[] = [];
      blocks.forEach((block) => {
        block.transactions.forEach((tx) => {
          if (tx.Swap) {
            newTransactions.push({
              id: `${block.id}-${newTransactions.length}`,
              fromToken: tx.Swap.in_token,
              toToken: tx.Swap.out_token,
              amountIn: tx.Swap.amount,
              amountOut: 0, // Would need to calculate from API
              timestamp: block.timestamp * 1000,
              status: 'success',
              blockId: block.id,
            });
          }
        });
      });

      // Reload local transactions
      await loadTransactions();
    } catch (error) {
      console.error('Failed to refresh history:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const renderTransaction = ({ item }: { item: SwapTransaction }) => {
    const fromTokenData = TOKENS[item.fromToken];
    const toTokenData = TOKENS[item.toToken];
    const date = new Date(item.timestamp);
    const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateString = date.toLocaleDateString();

    return (
      <Pressable
        style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
      >
        <View className="flex-row items-center gap-3 px-4 py-3 border-b border-border">
          {/* Token Icons */}
          <View className="items-center gap-1">
            <Text className="text-2xl">{fromTokenData.icon}</Text>
            <Text className="text-lg">{toTokenData.icon}</Text>
          </View>

          {/* Transaction Details */}
          <View className="flex-1">
            <Text className="text-base font-semibold text-foreground">
              {item.fromToken} → {item.toToken}
            </Text>
            <Text className="text-sm text-muted">
              {dateString} at {timeString}
            </Text>
          </View>

          {/* Amount */}
          <View className="items-end">
            <Text className="text-base font-semibold text-foreground">
              -{item.amountIn.toFixed(6)}
            </Text>
            <Text className="text-sm text-success">
              +{item.amountOut.toFixed(6)}
            </Text>
          </View>

          {/* Status Indicator */}
          <View className="ml-2">
            {item.status === 'success' && <Text className="text-xl text-success">✓</Text>}
            {item.status === 'pending' && <Text className="text-xl text-warning">⏳</Text>}
            {item.status === 'failed' && <Text className="text-xl text-error">✕</Text>}
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <ScreenContainer className="bg-background">
      {/* Header */}
      <View className="px-4 py-4 border-b border-border">
        <Text className="text-4xl font-bold text-foreground">History</Text>
        <Text className="text-base text-muted mt-1">Your recent swaps</Text>
      </View>

      {/* Transaction List */}
      {state.transactions.length > 0 ? (
        <FlatList
          data={state.transactions}
          keyExtractor={(item) => item.id}
          renderItem={renderTransaction}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#0a7ea4"
            />
          }
          contentContainerStyle={{ flexGrow: 1 }}
        />
      ) : (
        <View className="flex-1 items-center justify-center px-4">
          <Text className="text-6xl mb-4">📋</Text>
          <Text className="text-xl font-semibold text-foreground mb-2">No Swaps Yet</Text>
          <Text className="text-base text-muted text-center">
            Your swap history will appear here once you complete your first swap.
          </Text>
        </View>
      )}
    </ScreenContainer>
  );
}
