import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useResponsive } from '../utils/responsive';
import { Theme } from '../utils/theme';

interface EmptyStateProps {
  icon?: any;
  iconColor?: string;
  title: string;
  description: string;
  actionText?: string;
  onActionPress?: () => void;
}

export default function EmptyState({
  icon = 'folder-open-outline',
  iconColor = Theme.colors.neutralSecondaryText,
  title,
  description,
  actionText,
  onActionPress,
}: EmptyStateProps) {
  const R = useResponsive();

  return (
    <View style={[styles.container, { padding: R.spacing(30) }]}>
      <View style={[styles.iconCircle, { width: R.size(72), height: R.size(72), borderRadius: R.size(36) }]}>
        <Ionicons name={icon} size={36} color={iconColor} />
      </View>
      <Text style={[styles.title, { fontSize: R.font(Theme.typography.sizes.h3) }]}>
        {title}
      </Text>
      <Text style={[styles.description, { fontSize: R.font(Theme.typography.sizes.body) }]}>
        {description}
      </Text>

      {actionText && onActionPress && (
        <TouchableOpacity
          style={[styles.button, { paddingVertical: R.spacing(12), paddingHorizontal: R.spacing(24), borderRadius: R.size(Theme.rounding.medium) }]}
          onPress={onActionPress}
          activeOpacity={0.8}
        >
          <Text style={[styles.buttonText, { fontSize: R.font(Theme.typography.sizes.body) }]}>
            {actionText}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    backgroundColor: '#F0F3F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontWeight: '700',
    color: Theme.colors.neutralText,
    fontFamily: Theme.typography.fontFamily.bodyBold,
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    color: Theme.colors.neutralSecondaryText,
    fontFamily: Theme.typography.fontFamily.body,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  button: {
    backgroundColor: Theme.colors.primary,
    ...Theme.shadows.button,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontFamily: Theme.typography.fontFamily.bodyBold,
  },
});
