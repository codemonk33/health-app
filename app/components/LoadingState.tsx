import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useResponsive } from '../utils/responsive';
import { Theme } from '../utils/theme';

interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({ message = 'Loading health data...' }: LoadingStateProps) {
  const R = useResponsive();

  return (
    <View style={[styles.container, { padding: R.spacing(40) }]}>
      <ActivityIndicator size="large" color={Theme.colors.primary} />
      <Text style={[styles.message, { fontSize: R.font(Theme.typography.sizes.body), marginTop: R.spacing(16) }]}>
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    color: Theme.colors.neutralSecondaryText,
    fontFamily: Theme.typography.fontFamily.bodyMedium,
    fontWeight: '500',
    textAlign: 'center',
  },
});
