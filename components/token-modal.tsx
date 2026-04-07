import React, { useState, useMemo } from 'react';
import { Modal, View, Text, FlatList, Pressable, TextInput, SafeAreaView } from 'react-native';
import { TOKENS, TokenSymbol } from '@/lib/types';
import { cn } from '@/lib/utils';

interface TokenModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (token: TokenSymbol) => void;
  selectedToken?: TokenSymbol;
}

export function TokenModal({ visible, onClose, onSelect, selectedToken }: TokenModalProps) {
  const [searchText, setSearchText] = useState('');

  const filteredTokens = useMemo(() => {
    const query = searchText.toLowerCase();
    return Object.entries(TOKENS).filter(
      ([symbol, token]) =>
        symbol.toLowerCase().includes(query) || token.name.toLowerCase().includes(query)
    );
  }, [searchText]);

  const handleSelect = (symbol: TokenSymbol) => {
    onSelect(symbol);
    onClose();
    setSearchText('');
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <SafeAreaView className="flex-1 bg-background">
        {/* Header */}
        <View className="border-b border-border px-4 py-4">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-xl font-bold text-foreground">Select Token</Text>
            <Pressable onPress={onClose}>
              <Text className="text-2xl text-primary">✕</Text>
            </Pressable>
          </View>

          {/* Search Input */}
          <TextInput
            placeholder="Search tokens..."
            placeholderTextColor="#9BA1A6"
            value={searchText}
            onChangeText={setSearchText}
            className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
          />
        </View>

        {/* Token List */}
        <FlatList
          data={filteredTokens}
          keyExtractor={([symbol]) => symbol}
          renderItem={({ item: [symbol, token] }) => (
            <Pressable
              onPress={() => handleSelect(symbol as TokenSymbol)}
              style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
            >
              <View
                className={cn(
                  'flex-row items-center gap-3 px-4 py-4 border-b border-border',
                  selectedToken === symbol && 'bg-surface'
                )}
              >
                <Text className="text-3xl">{token.icon}</Text>
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-foreground">{symbol}</Text>
                  <Text className="text-sm text-muted">{token.name}</Text>
                </View>
                {selectedToken === symbol && (
                  <Text className="text-xl text-primary">✓</Text>
                )}
              </View>
            </Pressable>
          )}
          contentContainerStyle={{ flexGrow: 1 }}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center">
              <Text className="text-muted">No tokens found</Text>
            </View>
          }
        />
      </SafeAreaView>
    </Modal>
  );
}
