import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useResponsive } from './utils/responsive';
import { Theme } from './utils/theme';
import { useAuth } from './context/AuthContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface OnboardingSlide {
  id: string;
  stepNumber: number;
  icon: any;
  iconColor: string;
  bgColor: string;
  title: string;
  subtitle: string;
  description: string;
}

const SLIDES: OnboardingSlide[] = [
  {
    id: 'slide_1',
    stepNumber: 1,
    icon: 'body',
    iconColor: Theme.colors.primary,
    bgColor: '#E8F0FE',
    title: 'Symptom & Vitals Checker',
    subtitle: 'Bilingual voice guidance in Hindi & English',
    description: 'Touch any anatomical body part or speak your symptoms to get immediate clinical guidance and tailored home-care advice.',
  },
  {
    id: 'slide_2',
    stepNumber: 2,
    icon: 'medkit',
    iconColor: '#f39c12',
    bgColor: '#FEF5E7',
    title: 'Smart Prescription & Medicine Refills',
    subtitle: 'Camera scan detection with dosage alerts',
    description: 'Snap a picture of your doctor’s prescription to auto-detect medicines, setup adaptive dose reminders, and order home delivery.',
  },
  {
    id: 'slide_3',
    stepNumber: 3,
    icon: 'people',
    iconColor: '#9b59b6',
    bgColor: '#F4ECF7',
    title: 'Senior Concierge & Family Monitoring',
    subtitle: 'Dedicated daily caregiver task lists',
    description: 'Keep your loved ones in the loop with daily vital checks, caregiver shift logs, and instant 1-touch emergency SOS coordination.',
  },
  {
    id: 'slide_4',
    stepNumber: 4,
    icon: 'shield-checkmark',
    iconColor: '#10b981',
    bgColor: '#E8F8F5',
    title: 'ABHA Health Locker & Teleconsultations',
    subtitle: 'Unified government health record storage',
    description: 'Securely link your 14-digit ABHA card to retrieve lab reports automatically and consult top verified doctors over secure video calls.',
  }
];

export default function OnboardingScreen() {
  const router = useRouter();
  const R = useResponsive();
  const { completeOnboarding } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / SCREEN_WIDTH);
    if (index >= 0 && index < SLIDES.length && index !== currentIndex) {
      setCurrentIndex(index);
    }
  };

  const handleNext = async () => {
    if (currentIndex < SLIDES.length - 1) {
      scrollRef.current?.scrollTo({ x: (currentIndex + 1) * SCREEN_WIDTH, animated: true });
      setCurrentIndex(currentIndex + 1);
    } else {
      await finishOnboarding();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      scrollRef.current?.scrollTo({ x: (currentIndex - 1) * SCREEN_WIDTH, animated: true });
      setCurrentIndex(currentIndex - 1);
    }
  };

  const finishOnboarding = async () => {
    await completeOnboarding();
    router.replace('/login' as any);
  };

  return (
    <View style={styles.container}>
      {/* Top Header Row with Skip & Step Indicator */}
      <View style={[styles.header, { paddingTop: R.spacing(56), paddingHorizontal: R.spacing(20) }]}>
        <View style={styles.stepBadge}>
          <Text style={[styles.stepBadgeText, { fontSize: R.font(Theme.typography.sizes.small) }]}>
            Step {currentIndex + 1} of {SLIDES.length}
          </Text>
        </View>

        <TouchableOpacity onPress={finishOnboarding} activeOpacity={0.7}>
          <Text style={[styles.skipText, { fontSize: R.font(Theme.typography.sizes.body) }]}>
            Skip
          </Text>
        </TouchableOpacity>
      </View>

      {/* Horizontal Slides */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        style={styles.scrollView}
      >
        {SLIDES.map((slide) => (
          <View key={slide.id} style={[styles.slideContainer, { width: SCREEN_WIDTH, padding: R.spacing(24) }]}>
            <View
              style={[
                styles.illustrationBox,
                {
                  backgroundColor: slide.bgColor,
                  width: R.size(160),
                  height: R.size(160),
                  borderRadius: R.size(80),
                  marginBottom: R.spacing(32),
                },
              ]}
            >
              <Ionicons name={slide.icon} size={R.size(72)} color={slide.iconColor} />
            </View>

            <Text style={[styles.slideTitle, { fontSize: R.font(Theme.typography.sizes.h1) }]}>
              {slide.title}
            </Text>

            <Text style={[styles.slideSubtitle, { fontSize: R.font(Theme.typography.sizes.body) }]}>
              {slide.subtitle}
            </Text>

            <Text style={[styles.slideDesc, { fontSize: R.font(Theme.typography.sizes.body) }]}>
              {slide.description}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Bottom Navigation & Dots */}
      <View style={[styles.footer, { paddingHorizontal: R.spacing(24), paddingBottom: R.spacing(32) }]}>
        {/* Progress Dots */}
        <View style={styles.dotsContainer}>
          {SLIDES.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                {
                  backgroundColor: index === currentIndex ? Theme.colors.primary : Theme.colors.border,
                  width: index === currentIndex ? 24 : 8,
                },
              ]}
            />
          ))}
        </View>

        {/* Buttons Row */}
        <View style={styles.buttonsRow}>
          {currentIndex > 0 ? (
            <TouchableOpacity
              style={[
                styles.prevButton,
                {
                  height: R.size(52),
                  borderRadius: R.size(Theme.rounding.large),
                  paddingHorizontal: R.spacing(18),
                  marginRight: R.spacing(12),
                },
              ]}
              onPress={handlePrev}
              activeOpacity={0.8}
            >
              <Ionicons name="arrow-back" size={20} color={Theme.colors.neutralText} />
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity
            style={[
              styles.nextButton,
              {
                height: R.size(52),
                borderRadius: R.size(Theme.rounding.large),
              },
            ]}
            onPress={handleNext}
            activeOpacity={0.85}
          >
            <Text style={[styles.nextButtonText, { fontSize: R.font(Theme.typography.sizes.body) }]}>
              {currentIndex === SLIDES.length - 1 ? 'Get Started' : 'Next'}
            </Text>
            <Ionicons name="arrow-forward" size={18} color="#ffffff" style={{ marginLeft: 6 }} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepBadge: {
    backgroundColor: Theme.colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  stepBadgeText: {
    fontWeight: '600',
    color: Theme.colors.neutralSecondaryText,
  },
  skipText: {
    color: Theme.colors.neutralSecondaryText,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  slideContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustrationBox: {
    justifyContent: 'center',
    alignItems: 'center',
    ...Theme.shadows.card,
  },
  slideTitle: {
    fontWeight: '800',
    color: Theme.colors.neutralText,
    textAlign: 'center',
    marginBottom: 8,
  },
  slideSubtitle: {
    fontWeight: '600',
    color: Theme.colors.primary,
    textAlign: 'center',
    marginBottom: 16,
  },
  slideDesc: {
    color: Theme.colors.neutralSecondaryText,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 320,
  },
  footer: {
    width: '100%',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  buttonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  prevButton: {
    backgroundColor: Theme.colors.surface,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: Theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Theme.shadows.button,
  },
  nextButtonText: {
    color: '#ffffff',
    fontWeight: '700',
  },
});
