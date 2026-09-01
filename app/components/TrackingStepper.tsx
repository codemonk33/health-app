import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useResponsive } from '../utils/responsive';
import { Theme } from '../utils/theme';

export interface StepItem {
  id: string;
  title: string;
  subtitle?: string;
  time?: string;
}

interface TrackingStepperProps {
  steps: StepItem[];
  currentStepIndex: number;
}

export default function TrackingStepper({
  steps,
  currentStepIndex,
}: TrackingStepperProps) {
  const R = useResponsive();

  return (
    <View style={styles.container}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStepIndex;
        const isCurrent = index === currentStepIndex;
        const isPending = index > currentStepIndex;

        let dotColor = Theme.colors.border;
        let iconName: any = 'ellipse-outline';
        if (isCompleted) {
          dotColor = '#10b981';
          iconName = 'checkmark-circle';
        } else if (isCurrent) {
          dotColor = Theme.colors.primary;
          iconName = 'radio-button-on';
        }

        return (
          <View key={step.id} style={styles.stepRow}>
            {/* Left Indicator & Line */}
            <View style={styles.indicatorColumn}>
              <Ionicons
                name={iconName}
                size={22}
                color={dotColor}
              />
              {index < steps.length - 1 && (
                <View
                  style={[
                    styles.connectorLine,
                    {
                      backgroundColor: isCompleted ? '#10b981' : Theme.colors.border,
                    },
                  ]}
                />
              )}
            </View>

            {/* Step Details */}
            <View style={[styles.stepContent, { marginBottom: R.spacing(16), marginLeft: R.spacing(12) }]}>
              <View style={styles.titleRow}>
                <Text
                  style={[
                    styles.stepTitle,
                    {
                      fontSize: R.font(Theme.typography.sizes.body),
                      fontWeight: isCurrent ? '700' : '600',
                      color: isPending ? Theme.colors.neutralSecondaryText : Theme.colors.neutralText,
                    },
                  ]}
                >
                  {step.title}
                </Text>
                {step.time && (
                  <Text style={[styles.stepTime, { fontSize: R.font(Theme.typography.sizes.small) }]}>
                    {step.time}
                  </Text>
                )}
              </View>
              {step.subtitle && (
                <Text style={[styles.stepSubtitle, { fontSize: R.font(Theme.typography.sizes.small) }]}>
                  {step.subtitle}
                </Text>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  indicatorColumn: {
    alignItems: 'center',
    width: 24,
  },
  connectorLine: {
    width: 2,
    flex: 1,
    minHeight: 28,
    marginVertical: 4,
  },
  stepContent: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepTitle: {
    fontFamily: Theme.typography.fontFamily.bodySemiBold,
  },
  stepTime: {
    color: Theme.colors.neutralSecondaryText,
    fontWeight: '500',
    fontFamily: Theme.typography.fontFamily.bodyMedium,
  },
  stepSubtitle: {
    color: Theme.colors.neutralSecondaryText,
    fontFamily: Theme.typography.fontFamily.body,
    marginTop: 2,
  },
});
