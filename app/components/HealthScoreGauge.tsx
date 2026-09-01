import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useResponsive } from '../utils/responsive';
import { Theme } from '../utils/theme';

interface HealthScoreGaugeProps {
  score: number;
  label: string;
  subtitle?: string;
  onPress?: () => void;
  showDetailLink?: boolean;
}

export default function HealthScoreGauge({
  score,
  label,
  subtitle = 'Based on vitals, activity & lab tests',
  onPress,
  showDetailLink = true,
}: HealthScoreGaugeProps) {
  const router = useRouter();
  const R = useResponsive();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push('/health-score' as any);
    }
  };

  const getScoreColor = (val: number) => {
    if (val >= 80) return '#10b981'; // vibrant green
    if (val >= 65) return '#f39c12'; // warning amber
    return Theme.colors.danger; // danger red
  };

  const scoreColor = getScoreColor(score);

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          padding: R.spacing(18),
          borderRadius: R.size(Theme.rounding.large),
          marginBottom: R.spacing(16),
        },
      ]}
      onPress={handlePress}
      activeOpacity={0.85}
    >
      <View style={styles.contentRow}>
        <View
          style={[
            styles.gaugeCircle,
            {
              width: R.size(80),
              height: R.size(80),
              borderRadius: R.size(40),
              borderColor: scoreColor,
            },
          ]}
        >
          <Text style={[styles.scoreNumber, { fontSize: R.font(Theme.typography.sizes.h1), color: scoreColor }]}>
            {score}
          </Text>
          <Text style={[styles.maxScore, { fontSize: R.font(10) }]}>/ 100</Text>
        </View>

        <View style={[styles.infoContainer, { marginLeft: R.spacing(16) }]}>
          <View style={styles.tagRow}>
            <View style={[styles.statusBadge, { backgroundColor: scoreColor + '20' }]}>
              <Text style={[styles.statusBadgeText, { color: scoreColor, fontSize: R.font(Theme.typography.sizes.small) }]}>
                {label} Health Status
              </Text>
            </View>
          </View>
          <Text style={[styles.title, { fontSize: R.font(Theme.typography.sizes.h3) }]}>
            Overall Health Score
          </Text>
          <Text style={[styles.subtitle, { fontSize: R.font(Theme.typography.sizes.small) }]}>
            {subtitle}
          </Text>
        </View>
      </View>

      {showDetailLink && (
        <View style={styles.footerRow}>
          <Text style={[styles.linkText, { fontSize: R.font(Theme.typography.sizes.small) }]}>
            View 3-Month Trend & Clinical Insights
          </Text>
          <Ionicons name="chevron-forward" size={16} color={Theme.colors.primary} />
        </View>
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
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gaugeCircle: {
    borderWidth: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFBFD',
  },
  scoreNumber: {
    fontWeight: '800',
    lineHeight: 30,
    fontFamily: Theme.typography.fontFamily.bodyBold,
  },
  maxScore: {
    color: Theme.colors.neutralSecondaryText,
    fontWeight: '600',
    fontFamily: Theme.typography.fontFamily.bodyMedium,
  },
  infoContainer: {
    flex: 1,
  },
  tagRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontWeight: '700',
    fontFamily: Theme.typography.fontFamily.bodyBold,
  },
  title: {
    fontWeight: '700',
    color: Theme.colors.neutralText,
    fontFamily: Theme.typography.fontFamily.bodyBold,
    marginBottom: 2,
  },
  subtitle: {
    color: Theme.colors.neutralSecondaryText,
    fontFamily: Theme.typography.fontFamily.body,
    lineHeight: 18,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.border,
  },
  linkText: {
    color: Theme.colors.primary,
    fontWeight: '600',
    fontFamily: Theme.typography.fontFamily.bodySemiBold,
  },
});
