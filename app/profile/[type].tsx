import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useResponsive } from '../utils/responsive';
import { Theme } from '../utils/theme';

export default function ProfileScreen() {
  const router = useRouter();
  const R = useResponsive();
  const { type } = useLocalSearchParams<{ type: string }>();

  // Use default fallback if accessed directly without param
  const profileType = type || 'male'; 

  const profileConfigs: Record<string, { title: string, subtitle: string, icon: any, color: string }> = {
    male: {
      title: 'Male Health',
      subtitle: 'Welcome to the male health section',
      icon: 'male',
      color: Theme.colors.primary
    },
    female: {
      title: 'Female Health',
      subtitle: 'Welcome to the female health section',
      icon: 'female',
      color: '#e91e63'
    },
    child: {
      title: 'Child Health',
      subtitle: 'Welcome to the child health section',
      icon: 'happy',
      color: Theme.colors.warning
    }
  };

  const config = profileConfigs[profileType] || profileConfigs.male;

  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Theme.colors.background,
    },
    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: R.spacing(20),
      paddingTop: R.spacing(60),
    },
    backText: {
      fontSize: R.font(Theme.typography.sizes.body),
      color: Theme.colors.neutralText,
      marginLeft: R.spacing(8),
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: R.spacing(30),
    },
    iconContainer: {
      width: R.size(120),
      height: R.size(120),
      borderRadius: R.size(60),
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: R.spacing(30),
      backgroundColor: config.color,
      ...Theme.shadows.card,
    },
    title: {
      fontSize: R.font(Theme.typography.sizes.h1),
      fontWeight: 'bold',
      color: Theme.colors.neutralText,
      marginBottom: R.spacing(10),
      textAlign: 'center',
    },
    subtitle: {
      fontSize: R.font(Theme.typography.sizes.body),
      color: Theme.colors.neutralSecondaryText,
      marginBottom: R.spacing(30),
      textAlign: 'center',
    },
    infoContainer: {
      backgroundColor: Theme.colors.surface,
      padding: R.spacing(20),
      borderRadius: R.size(Theme.rounding.medium),
      ...Theme.shadows.card,
    },
    infoText: {
      fontSize: R.font(Theme.typography.sizes.body),
      color: Theme.colors.neutralText,
      lineHeight: Math.round(R.font(24)),
      textAlign: 'center',
    },
  }), [R, config.color]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color={Theme.colors.neutralText} />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name={config.icon} size={60} color="#ffffff" />
        </View>
        
        <Text style={styles.title}>{config.title}</Text>
        <Text style={styles.subtitle}>{config.subtitle}</Text>
        
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            This section is dedicated to {profileType} health and wellness. 
            Here you can access personalized health information, 
            track relevant health metrics, and get AI-powered health insights.
          </Text>
        </View>
      </View>
    </View>
  );
}
