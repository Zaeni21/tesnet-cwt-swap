import React, { useCallback } from 'react';
import { ScrollView, Text, View, Pressable, Alert, Switch } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { ScreenContainer } from '@/components/screen-container';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ACCOUNT_ID } from '@/lib/types';

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = React.useState(colorScheme === 'dark');

  const handleCopyAccountId = async () => {
    try {
      await Clipboard.setStringAsync(ACCOUNT_ID.toString());
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Copied', `Account ID ${ACCOUNT_ID} copied to clipboard`);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleResetData = () => {
    Alert.alert(
      'Reset Data',
      'Are you sure you want to clear all transaction history? This cannot be undone.',
      [
        { text: 'Cancel', onPress: () => {}, style: 'cancel' },
        {
          text: 'Reset',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('swap_transactions');
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              Alert.alert('Success', 'All data has been cleared');
            } catch (error) {
              console.error('Failed to reset data:', error);
              Alert.alert('Error', 'Failed to reset data');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // In a real app, this would update the theme context
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-4 py-4 border-b border-border">
          <Text className="text-4xl font-bold text-foreground">Settings</Text>
        </View>

        {/* Account Section */}
        <View className="px-4 py-6 gap-4">
          <Text className="text-lg font-bold text-foreground">Account</Text>

          <Pressable
            onPress={handleCopyAccountId}
            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
          >
            <View className="bg-surface rounded-xl p-4 border border-border">
              <Text className="text-sm font-semibold text-muted mb-2">Account ID</Text>
              <View className="flex-row items-center justify-between">
                <Text className="text-lg font-bold text-foreground">{ACCOUNT_ID}</Text>
                <Text className="text-lg text-primary">📋</Text>
              </View>
            </View>
          </Pressable>
        </View>

        {/* Appearance Section */}
        <View className="px-4 py-6 gap-4 border-t border-border">
          <Text className="text-lg font-bold text-foreground">Appearance</Text>

          <View className="bg-surface rounded-xl p-4 border border-border flex-row items-center justify-between">
            <View>
              <Text className="text-base font-semibold text-foreground">Dark Mode</Text>
              <Text className="text-sm text-muted mt-1">Use dark theme</Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={handleThemeToggle}
              trackColor={{ false: '#E5E7EB', true: '#0a7ea4' }}
              thumbColor={isDarkMode ? '#ffffff' : '#f5f5f5'}
            />
          </View>
        </View>

        {/* Data Section */}
        <View className="px-4 py-6 gap-4 border-t border-border">
          <Text className="text-lg font-bold text-foreground">Data</Text>

          <Pressable
            onPress={handleResetData}
            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
          >
            <View className="bg-surface rounded-xl p-4 border border-error">
              <Text className="text-base font-semibold text-error">Clear History</Text>
              <Text className="text-sm text-muted mt-1">Remove all transaction records</Text>
            </View>
          </Pressable>
        </View>

        {/* About Section */}
        <View className="px-4 py-6 gap-4 border-t border-border mb-6">
          <Text className="text-lg font-bold text-foreground">About</Text>

          <View className="bg-surface rounded-xl p-4 border border-border">
            <View className="gap-3">
              <View className="flex-row justify-between">
                <Text className="text-sm text-muted">App Name</Text>
                <Text className="text-sm font-semibold text-foreground">tesnet.cwt.swap</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-sm text-muted">Version</Text>
                <Text className="text-sm font-semibold text-foreground">1.0.0</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-sm text-muted">Network</Text>
                <Text className="text-sm font-semibold text-foreground">Testnet</Text>
              </View>
            </View>
          </View>

          <View className="bg-surface rounded-xl p-4 border border-border">
            <Text className="text-sm text-muted leading-relaxed">
              A token swap application built on a local blockchain simulation. Swap between USDC, USDT, ETH, BTC, NEX, DOGE, and HYPE tokens using an Automated Market Maker.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
