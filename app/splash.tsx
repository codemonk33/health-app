import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useResponsive } from './utils/responsive';
import { Theme } from './utils/theme';
import { useAuth } from './context/AuthContext';

export default function SplashScreenComponent() {
  const router = useRouter();
  const R = useResponsive();
  const { session, isOnboarded, isLoading } = useAuth();

  const logoScale = useRef(new Animated.Value(0.8)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(logoScale, { toValue: 1, friction: 6, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
    ]).start();
  }, [fadeAnim, logoScale]);

  const handleGetStarted = () => {
    if (session) {
      router.replace('/' as any);
    } else if (isOnboarded) {
      router.replace('/login' as any);
    } else {
      router.replace('/onboarding' as any);
    }
  };

  return (
    <View style={[styles.container, { padding: R.spacing(24) }]}>
      <Animated.View style={[styles.contentBox, { opacity: fadeAnim, transform: [{ scale: logoScale }] }]}>
        {/* Brand Icon */}
        <View
          style={[
            styles.logoCircle,
            {
              width: R.size(120),
              height: R.size(120),
              borderRadius: R.size(60),
              marginBottom: R.spacing(24),
              overflow: 'hidden',
              backgroundColor: '#ffffff',
            },
          ]}
        >
          <Image
            source={require('../assets/images/icon.png')}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
        </View>

        {/* Brand Name */}
        <Text style={[styles.brandTitle, { fontSize: R.font(Theme.typography.sizes.hero) }]}>
          CureAI
        </Text>

        {/* Brand Tagline */}
        <Text style={[styles.tagline, { fontSize: R.font(Theme.typography.sizes.h3) }]}>
          Your Personal Health & Senior Care Assistant
        </Text>

        {/* ABDM Trust Badge */}
        <View style={[styles.abdmBadge, { paddingHorizontal: R.spacing(14), paddingVertical: R.spacing(8) }]}>
          <Ionicons name="shield-checkmark" size={18} color="#10b981" />
          <Text style={[styles.abdmText, { fontSize: R.font(Theme.typography.sizes.small) }]}>
            Integrated with ABHA & ABDM
          </Text>
        </View>
      </Animated.View>

      {/* Footer CTA */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.getStartedButton,
            {
              height: R.size(56),
              borderRadius: R.size(Theme.rounding.large),
              marginBottom: R.spacing(16),
            },
          ]}
          onPress={handleGetStarted}
          activeOpacity={0.85}
          disabled={isLoading}
        >
          <Text style={[styles.buttonText, { fontSize: R.font(Theme.typography.sizes.body) }]}>
            {session ? 'Enter Dashboard' : 'Get Started'}
          </Text>
          <Ionicons name="arrow-forward" size={20} color="#ffffff" style={{ marginLeft: 8 }} />
        </TouchableOpacity>

        <Text style={[styles.disclaimer, { fontSize: R.font(Theme.typography.sizes.small) }]}>
          Empowering elderly care with secure digital health records & AI
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contentBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoCircle: {
    backgroundColor: Theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Theme.shadows.button,
  },
  brandTitle: {
    fontWeight: '800',
    color: Theme.colors.neutralText,
    fontFamily: Theme.typography.fontFamily.serif,
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  tagline: {
    color: Theme.colors.neutralSecondaryText,
    textAlign: 'center',
    maxWidth: 300,
    fontFamily: Theme.typography.fontFamily.bodyMedium,
    fontWeight: '500',
    lineHeight: 28,
    marginBottom: 20,
  },
  abdmBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F9F0',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#B8F2D5',
  },
  abdmText: {
    color: '#065F46',
    fontWeight: '600',
    fontFamily: Theme.typography.fontFamily.bodySemiBold,
    marginLeft: 6,
  },
  footer: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 24,
  },
  getStartedButton: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: Theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Theme.shadows.button,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontFamily: Theme.typography.fontFamily.bodyBold,
  },
  disclaimer: {
    color: Theme.colors.neutralSecondaryText,
    fontFamily: Theme.typography.fontFamily.body,
    textAlign: 'center',
  },
});
