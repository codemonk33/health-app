import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useResponsive } from '../utils/responsive';
import { Theme } from '../utils/theme';

interface StatCardProps {
  icon: any;
  iconColor?: string;
  iconBgColor?: string;
  label: string;
  value: string;
  unit?: string;
  statusBadge?: string;
  statusColor?: string;
  subtitle?: string;
  onPress?: () => void;
  width?: string | number;
}

export default function StatCard({
  icon,
  iconColor = Theme.colors.primary,
  iconBgColor = '#E8F0FE',
  label,
  value,
  unit,
  statusBadge,
  statusColor = '#10b981',
  subtitle,
  onPress,
  width = '48%',
}: StatCardProps) {
  const R = useResponsive();

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          width: width as any,
          padding: R.spacing(14),
          borderRadius: R.size(Theme.rounding.large),
          marginBottom: R.spacing(12),
        },
      ]}
      onPress={onPress}
      activeOpacity={onPress ? 0.75 : 1}
      disabled={!onPress}
    >
      <View style={styles.topRow}>
        <View style={[styles.iconBox, { backgroundColor: iconBgColor, width: R.size(36), height: R.size(36), borderRadius: R.size(18) }]}>
          <Ionicons name={icon} size={20} color={iconColor} />
        </View>
        {statusBadge && (
          <View style={[styles.badge, { backgroundColor: statusColor + '15' }]}>
            <Text style={[styles.badgeText, { color: statusColor, fontSize: R.font(10) }]}>
              {statusBadge}
            </Text>
          </View>
        )}
      </View>

      <Text style={[styles.label, { fontSize: R.font(Theme.typography.sizes.small) }]}>
        {label}
      </Text>

      <View style={styles.valueRow}>
        <Text style={[styles.value, { fontSize: R.font(Theme.typography.sizes.h2) }]}>
          {value}
        </Text>
        {unit && (
          <Text style={[styles.unit, { fontSize: R.font(Theme.typography.sizes.small) }]}>
            {' '}{unit}
          </Text>
        )}
      </View>

      {subtitle && (
        <Text style={[styles.subtitle, { fontSize: R.font(11) }]} numberOfLines={1}>
          {subtitle}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Theme.colors.surface,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    ...Theme.shadows.card,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconBox: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    fontWeight: '700',
    fontFamily: Theme.typography.fontFamily.bodyBold,
  },
  label: {
    color: Theme.colors.neutralSecondaryText,
    fontWeight: '500',
    fontFamily: Theme.typography.fontFamily.bodyMedium,
    marginBottom: 4,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  value: {
    fontWeight: '800',
    color: Theme.colors.neutralText,
    fontFamily: Theme.typography.fontFamily.bodyBold,
  },
  unit: {
    color: Theme.colors.neutralSecondaryText,
    fontWeight: '600',
    fontFamily: Theme.typography.fontFamily.bodySemiBold,
  },
  subtitle: {
    color: Theme.colors.neutralSecondaryText,
    fontFamily: Theme.typography.fontFamily.body,
    marginTop: 4,
  },
});
