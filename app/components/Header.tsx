import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useResponsive } from '../utils/responsive';
import { Theme } from '../utils/theme';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBackPress?: () => void;
  rightAction?: {
    icon: any;
    onPress: () => void;
    color?: string;
  };
}

export default function Header({
  title,
  subtitle,
  showBack = true,
  onBackPress,
  rightAction,
}: HeaderProps) {
  const router = useRouter();
  const R = useResponsive();

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: R.spacing(56),
          paddingBottom: R.spacing(16),
          paddingHorizontal: R.spacing(20),
        },
      ]}
    >
      <View style={styles.leftRow}>
        {showBack && (
          <TouchableOpacity
            style={[styles.backButton, { marginRight: R.spacing(12) }]}
            onPress={handleBack}
            activeOpacity={0.7}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons name="arrow-back" size={24} color={Theme.colors.neutralText} />
          </TouchableOpacity>
        )}
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { fontSize: R.font(Theme.typography.sizes.h2) }]} numberOfLines={1}>
            {title}
          </Text>
          {subtitle && (
            <Text style={[styles.subtitle, { fontSize: R.font(Theme.typography.sizes.small) }]}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>

      {rightAction && (
        <TouchableOpacity
          style={styles.rightButton}
          onPress={rightAction.onPress}
          activeOpacity={0.7}
        >
          <Ionicons
            name={rightAction.icon}
            size={24}
            color={rightAction.color || Theme.colors.primary}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontWeight: '700',
    color: Theme.colors.neutralText,
    fontFamily: Theme.typography.fontFamily.bodyBold,
  },
  subtitle: {
    color: Theme.colors.neutralSecondaryText,
    marginTop: 2,
    fontWeight: '500',
    fontFamily: Theme.typography.fontFamily.bodyMedium,
  },
  rightButton: {
    padding: 4,
    marginLeft: 12,
  },
});
