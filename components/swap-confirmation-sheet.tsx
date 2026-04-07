import React from 'react';
import { Modal, View, Text, Pressable, SafeAreaView, ActivityIndicator } from 'react-native';
import { TokenSymbol, TOKENS } from '@/lib/types';

interface SwapConfirmationSheetProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  fromToken: TokenSymbol;
  toToken: TokenSymbol;
  amountIn: number;
  amountOut: number;
  isLoading?: boolean;
}

export function SwapConfirmationSheet({
  visible,
  onClose,
  onConfirm,
  fromToken,
  toToken,
  amountIn,
  amountOut,
  isLoading = false,
}: SwapConfirmationSheetProps) {
  const fromTokenData = TOKENS[fromToken];
  const toTokenData = TOKENS[toToken];
  const rate = amountIn > 0 ? amountOut / amountIn : 0;

  const handleConfirm = async () => {
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error('Swap failed:', error);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <SafeAreaView className="flex-1 bg-black/50">
        <View className="flex-1 justify-end">
          {/* Sheet */}
          <View className="bg-background rounded-t-3xl p-6 gap-6">
            {/* Header */}
            <View className="items-center gap-2">
              <View className="w-12 h-1 bg-border rounded-full" />
              <Text className="text-2xl font-bold text-foreground">Confirm Swap</Text>
            </View>

            {/* Swap Summary */}
            <View className="bg-surface rounded-2xl p-4 gap-4">
              {/* From */}
              <View>
                <Text className="text-sm font-semibold text-muted mb-2">You Send</Text>
                <View className="flex-row items-center gap-2">
                  <Text className="text-3xl">{fromTokenData.icon}</Text>
                  <View className="flex-1">
                    <Text className="text-2xl font-bold text-foreground">
                      {amountIn.toFixed(6)}
                    </Text>
                    <Text className="text-sm text-muted">{fromToken}</Text>
                  </View>
                </View>
              </View>

              {/* Arrow */}
              <View className="items-center">
                <Text className="text-2xl text-primary">↓</Text>
              </View>

              {/* To */}
              <View>
                <Text className="text-sm font-semibold text-muted mb-2">You Receive</Text>
                <View className="flex-row items-center gap-2">
                  <Text className="text-3xl">{toTokenData.icon}</Text>
                  <View className="flex-1">
                    <Text className="text-2xl font-bold text-foreground">
                      {amountOut.toFixed(6)}
                    </Text>
                    <Text className="text-sm text-muted">{toToken}</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Rate Info */}
            <View className="bg-surface rounded-xl p-4">
              <Text className="text-sm text-muted mb-2">Exchange Rate</Text>
              <Text className="text-base font-semibold text-foreground">
                1 {fromToken} = {rate.toFixed(6)} {toToken}
              </Text>
            </View>

            {/* Buttons */}
            <View className="gap-3">
              <Pressable
                onPress={handleConfirm}
                disabled={isLoading}
                style={({ pressed }) => [
                  {
                    opacity: pressed || isLoading ? 0.7 : 1,
                  },
                ]}
              >
                <View className="bg-primary rounded-xl py-4 items-center justify-center">
                  {isLoading ? (
                    <ActivityIndicator color="#ffffff" />
                  ) : (
                    <Text className="text-lg font-bold text-white">Confirm Swap</Text>
                  )}
                </View>
              </Pressable>

              <Pressable
                onPress={onClose}
                disabled={isLoading}
                style={({ pressed }) => [
                  {
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
              >
                <View className="border border-border rounded-xl py-4 items-center">
                  <Text className="text-lg font-semibold text-foreground">Cancel</Text>
                </View>
              </Pressable>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}
