import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Token } from '@/lib/types';
import { cn } from '@/lib/utils';

interface TokenButtonProps {
  token: Token | null;
  onPress: () => void;
  label?: string;
}

export function TokenButton({ token, onPress, label = 'Select' }: TokenButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <View className="flex-row items-center gap-3 rounded-lg bg-surface border border-border p-3">
        {token ? (
          <>
            <Text className="text-2xl">{token.icon}</Text>
            <View className="flex-1">
              <Text className="text-sm font-semibold text-muted">{label}</Text>
              <Text className="text-lg font-bold text-foreground">{token.symbol}</Text>
            </View>
          </>
        ) : (
          <>
            <View className="w-8 h-8 rounded-full bg-border" />
            <View className="flex-1">
              <Text className="text-sm font-semibold text-muted">{label}</Text>
              <Text className="text-lg font-bold text-foreground">Select Token</Text>
            </View>
          </>
        )}
        <Text className="text-lg text-muted">›</Text>
      </View>
    </Pressable>
  );
}
