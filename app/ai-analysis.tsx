import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming, withSequence, Easing } from 'react-native-reanimated';
import { getAnalysisForSymptom } from './utils/aiAnalysisData';
import { useResponsive } from './utils/responsive';
import { Theme } from './utils/theme';

interface AnalysisResult {
  possibleCauses: string[];
  basicTreatment: string[];
  whenToSeekDoctor: string[];
  recommendedFoods: string[];
  severity: 'low' | 'medium' | 'high';
}

const HINTS = [
  'Comparing symptoms with medical database...',
  'Checking for common Indian weather conditions...',
  'Analyzing severity of pain points...',
  'Looking up nearby specialist info...',
  'Almost done compiling report...'
];

export default function AIAnalysisScreen() {
  const router = useRouter();
  const R = useResponsive();
  const { part, symptom } = useLocalSearchParams<{ part: string; symptom: string }>();
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dots, setDots] = useState('');
  const [hintIndex, setHintIndex] = useState(0);

  useEffect(() => {
    let dotCount = 0;
    const dotInterval = setInterval(() => {
      dotCount = (dotCount + 1) % 4;
      setDots('.'.repeat(dotCount));
    }, 400);

    const hintInterval = setInterval(() => {
      setHintIndex(prev => (prev + 1) % HINTS.length);
    }, 1500);

    return () => { clearInterval(dotInterval); clearInterval(hintInterval); };
  }, []);

  useEffect(() => {
    // Generate AI analysis based on body part and symptom
    const performAnalysis = async () => {
      setIsLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Get dynamic analysis based on body part and symptom from the data file
      const analysisResult = getAnalysisForSymptom(part || '', symptom || '');
      
      setAnalysisResult(analysisResult);
      setIsLoading(false);
    };

    performAnalysis();
  }, [part, symptom]);

  const pulseScale = useSharedValue(1);

  useEffect(() => {
    if (isLoading) {
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.2, { duration: 600, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 600, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
    } else {
      pulseScale.value = 1;
    }
  }, [isLoading, pulseScale]);

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }]
  }));

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return Theme.colors.secondary;
      case 'medium':
        return Theme.colors.warning;
      case 'high':
        return Theme.colors.danger;
      default:
        return Theme.colors.neutralSecondaryText;
    }
  };

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'Low Risk';
      case 'medium':
        return 'Moderate Risk';
      case 'high':
        return 'High Risk';
      default:
        return 'Unknown';
    }
  };

  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Theme.colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: R.spacing(60),
      paddingBottom: R.spacing(20),
      paddingHorizontal: R.spacing(20),
      backgroundColor: Theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: Theme.colors.border,
    },
    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: R.spacing(20),
    },
    backText: {
      fontSize: R.font(Theme.typography.sizes.h3),
      color: Theme.colors.neutralText,
      marginLeft: R.spacing(8),
      lineHeight: R.font(28),
    },
    title: {
      fontSize: R.font(Theme.typography.sizes.h1),
      fontWeight: 'bold',
      color: Theme.colors.neutralText,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: R.spacing(40),
    },
    loadingText: {
      fontSize: R.font(Theme.typography.sizes.h2),
      fontWeight: 'bold',
      color: Theme.colors.neutralText,
      marginTop: R.spacing(20),
      textAlign: 'center',
    },
    loadingSubtext: {
      fontSize: R.font(Theme.typography.sizes.body),
      color: Theme.colors.neutralSecondaryText,
      marginTop: R.spacing(10),
      textAlign: 'center',
    },
    content: {
      flex: 1,
    },
    summaryContainer: {
      backgroundColor: Theme.colors.surface,
      padding: R.spacing(20),
      margin: R.spacing(20),
      borderRadius: R.size(Theme.rounding.large),
      ...Theme.shadows.card,
    },
    summaryTitle: {
      fontSize: R.font(Theme.typography.sizes.h2),
      fontWeight: 'bold',
      color: Theme.colors.neutralText,
      marginBottom: R.spacing(15),
    },
    summaryText: {
      fontSize: R.font(Theme.typography.sizes.h3),
      color: Theme.colors.neutralText,
      marginBottom: R.spacing(8),
    },
    highlight: {
      fontWeight: 'bold',
      color: Theme.colors.primary,
    },
    severityBadge: {
      alignSelf: 'flex-start',
      paddingHorizontal: R.spacing(15),
      paddingVertical: R.spacing(8),
      borderRadius: R.size(Theme.rounding.xl),
      marginTop: R.spacing(10),
    },
    severityText: {
      color: '#ffffff',
      fontSize: R.font(Theme.typography.sizes.body),
      fontWeight: 'bold',
    },
    sectionContainer: {
      backgroundColor: Theme.colors.surface,
      padding: R.spacing(20),
      margin: R.spacing(20),
      borderRadius: R.size(Theme.rounding.large),
      marginTop: 0,
      ...Theme.shadows.card,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: R.spacing(15),
    },
    sectionTitle: {
      fontSize: R.font(Theme.typography.sizes.h3),
      fontWeight: 'bold',
      color: Theme.colors.neutralText,
      marginLeft: R.spacing(10),
    },
    listItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: R.spacing(10),
    },
    bulletPoint: {
      fontSize: R.font(Theme.typography.sizes.h3),
      color: Theme.colors.primary,
      marginRight: R.spacing(10),
      marginTop: R.spacing(2),
    },
    listText: {
      fontSize: R.font(Theme.typography.sizes.body),
      color: Theme.colors.neutralText,
      lineHeight: R.font(22),
      flex: 1,
    },
    disclaimerContainer: {
      backgroundColor: '#fff3cd',
      padding: R.spacing(20),
      margin: R.spacing(20),
      marginTop: 0,
      borderRadius: R.size(Theme.rounding.large),
      borderLeftWidth: 4,
      borderLeftColor: '#ffc107',
    },
    disclaimerTitle: {
      fontSize: R.font(Theme.typography.sizes.h3),
      fontWeight: 'bold',
      color: '#856404',
      marginBottom: R.spacing(10),
    },
    disclaimerText: {
      fontSize: R.font(14),
      color: '#856404',
      lineHeight: R.font(20),
    },
  }), [R]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={28} color={Theme.colors.neutralText} />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>AI Analysis</Text>
        </View>
        <View style={styles.loadingContainer}>
          <Animated.View style={animatedIconStyle}>
            <Ionicons name="medical" size={80} color={Theme.colors.primary} />
          </Animated.View>
          <Text style={styles.loadingText}>Analyzing{dots}</Text>
          <Text style={styles.loadingSubtext}>{HINTS[hintIndex]}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={28} color={Theme.colors.neutralText} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Analysis Report</Text>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Summary */}
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Analysis Summary</Text>
          <Text style={styles.summaryText}>
            Body Part: <Text style={styles.highlight}>{part}</Text>
          </Text>
          <Text style={styles.summaryText}>
            Symptom: <Text style={styles.highlight}>{symptom}</Text>
          </Text>
          <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(analysisResult?.severity || 'medium') }]}>
            <Text style={styles.severityText}>
              {getSeverityText(analysisResult?.severity || 'medium')}
            </Text>
          </View>
        </View>

        {/* Possible Causes */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Ionicons name="warning" size={24} color={Theme.colors.danger} />
            <Text style={styles.sectionTitle}>Possible Causes</Text>
          </View>
          {analysisResult?.possibleCauses.map((cause, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.listText}>{cause}</Text>
            </View>
          ))}
        </View>

        {/* Basic Treatment */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Ionicons name="medical" size={24} color={Theme.colors.primary} />
            <Text style={styles.sectionTitle}>Basic Treatment</Text>
          </View>
          {analysisResult?.basicTreatment.map((treatment, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.listText}>{treatment}</Text>
            </View>
          ))}
        </View>

        {/* When to Seek Doctor */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Ionicons name="alert-circle" size={24} color={Theme.colors.warning} />
            <Text style={styles.sectionTitle}>When to Seek a Doctor</Text>
          </View>
          {analysisResult?.whenToSeekDoctor.map((condition, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.listText}>{condition}</Text>
            </View>
          ))}
        </View>

        {/* Recommended Foods */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Ionicons name="restaurant" size={24} color={Theme.colors.secondary} />
            <Text style={styles.sectionTitle}>Recommended Foods for Recovery</Text>
          </View>
          {analysisResult?.recommendedFoods.map((food, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.listText}>{food}</Text>
            </View>
          ))}
        </View>

        {/* Disclaimer */}
        <View style={styles.disclaimerContainer}>
          <Text style={styles.disclaimerTitle}>Important Disclaimer</Text>
          <Text style={styles.disclaimerText}>
            This analysis is for informational purposes only and should not replace professional medical advice. 
            Always consult with a qualified healthcare provider for proper diagnosis and treatment.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
} 