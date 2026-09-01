import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useResponsive } from './utils/responsive';
import { Theme } from './utils/theme';
import BottomNavBar from './components/BottomNavBar';
import HealthScoreGauge from './components/HealthScoreGauge';
import StatCard from './components/StatCard';
import { useAuth } from './context/AuthContext';
import { healthScoreService } from './services/healthScoreService';
import { remindersService, SmartReminder } from './services/remindersService';

const NAV_ITEMS = [
  { id: 'symptoms', title: 'Check Symptoms', subtitle: 'Anatomical check', icon: 'medical', color: Theme.colors.primary, route: '/symptoms' },
  { id: 'reminders', title: 'Smart Reminders', subtitle: 'Pill & vitals alerts', icon: 'alarm', color: '#8e44ad', route: '/reminders' },
  { id: 'appointments', title: 'Doctor Consult', subtitle: 'Video & in-clinic', icon: 'videocam', color: Theme.colors.purple, route: '/appointments' },
  { id: 'order-medicine', title: 'Order Medicine', subtitle: '2-hr home delivery', icon: 'cart', color: Theme.colors.warning, route: '/order-medicine' },
  { id: 'book-diagnostics', title: 'Lab Diagnostics', subtitle: 'Home sample pickup', icon: 'pulse', color: '#10b981', route: '/book-diagnostics' },
  { id: 'health-records', title: 'Health Records', subtitle: 'ABHA & AI summary', icon: 'folder-open', color: '#3498db', route: '/health-records' },
  { id: 'insurance', title: 'Insurance Care', subtitle: 'PM-JAY & claims', icon: 'shield-checkmark', color: '#27ae60', route: '/insurance' },
  { id: 'elderly-care', title: 'Elderly Concierge', subtitle: 'Caregiver tasks', icon: 'people', color: '#d35400', route: '/elderly-care' },
  { id: 'health-tips', title: 'Health Tips', subtitle: 'Daily elder advice', icon: 'heart', color: Theme.colors.secondary, route: '/health-tips' },
  { id: 'chat', title: 'NEX-AI Chat', subtitle: 'Clinical assistant', icon: 'chatbubbles', color: '#2980b9', route: '/chat' },
] as const;

export default function HomePage() {
  const router = useRouter();
  const R = useResponsive();
  const { session } = useAuth();

  const [healthScore] = useState(() => healthScoreService.getHealthScore());
  const [activeReminders, setActiveReminders] = useState<SmartReminder[]>([]);

  const emergencyScale = useRef(new Animated.Value(1)).current;
  const animations = useRef(NAV_ITEMS.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    remindersService.getReminders().then(rems => {
      setActiveReminders(rems.filter(r => r.status === 'pending').slice(0, 2));
    });
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(emergencyScale, { toValue: 1.08, duration: 900, useNativeDriver: true }),
        Animated.timing(emergencyScale, { toValue: 1, duration: 900, useNativeDriver: true })
      ])
    ).start();

    Animated.stagger(40, animations.map(a =>
      Animated.timing(a, { toValue: 1, duration: 300, useNativeDriver: true })
    )).start();
  }, [animations, emergencyScale]);

  const handleEmergencyPress = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).then(() => {
      router.push('/emergency');
    });
  };

  const handleCardPress = (route: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).then(() => {
      router.push(route as any);
    });
  };

  const userName = session?.name || 'Ramesh Sharma';

  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Theme.colors.background,
    },
    header: {
      paddingTop: R.spacing(16),
      paddingBottom: R.spacing(18),
      paddingHorizontal: R.spacing(20),
      backgroundColor: Theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: Theme.colors.border,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    headerLeft: {
      flex: 1,
    },
    greeting: {
      fontSize: R.font(Theme.typography.sizes.body),
      color: Theme.colors.neutralSecondaryText,
      fontFamily: Theme.typography.fontFamily.bodyMedium,
    },
    title: {
      fontSize: R.font(Theme.typography.sizes.h1),
      fontWeight: '800',
      color: Theme.colors.neutralText,
      fontFamily: Theme.typography.fontFamily.bodyBold,
      marginTop: 2,
    },
    profileAvatar: {
      width: R.size(46),
      height: R.size(46),
      borderRadius: R.size(23),
      backgroundColor: '#E8F0FE',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: Theme.colors.primary,
    },
    content: {
      flex: 1,
    },
    contentContainer: {
      paddingHorizontal: R.spacing(20),
      paddingTop: R.spacing(20),
      paddingBottom: R.spacing(36),
    },
    emergencyCard: {
      backgroundColor: Theme.colors.danger,
      height: R.size(86),
      borderRadius: R.size(Theme.rounding.large),
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: R.spacing(20),
      marginBottom: R.spacing(20),
      ...Theme.shadows.card,
    },
    emergencyIconContainer: {
      marginRight: R.spacing(16),
      justifyContent: 'center',
      alignItems: 'center',
    },
    emergencyTitle: {
      fontSize: R.font(Theme.typography.sizes.h3),
      fontWeight: 'bold',
      color: '#ffffff',
      fontFamily: Theme.typography.fontFamily.bodyBold,
      marginBottom: R.spacing(2),
    },
    emergencySubtitle: {
      fontSize: R.font(Theme.typography.sizes.small),
      color: '#ffffff',
      fontFamily: Theme.typography.fontFamily.body,
      opacity: 0.95,
    },
    sectionTitleRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: R.spacing(12),
      marginTop: R.spacing(8),
    },
    sectionTitle: {
      fontSize: R.font(Theme.typography.sizes.h3),
      fontWeight: '700',
      color: Theme.colors.neutralText,
      fontFamily: Theme.typography.fontFamily.bodyBold,
    },
    seeAllText: {
      fontSize: R.font(Theme.typography.sizes.small),
      color: Theme.colors.primary,
      fontWeight: '600',
      fontFamily: Theme.typography.fontFamily.bodySemiBold,
    },
    vitalsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginBottom: R.spacing(8),
    },
    remindersBanner: {
      backgroundColor: '#FBF5FF',
      borderWidth: 1,
      borderColor: '#E8D2FC',
      borderRadius: R.size(Theme.rounding.large),
      padding: R.spacing(16),
      marginBottom: R.spacing(20),
    },
    reminderItemRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 6,
    },
    reminderTimeBadge: {
      backgroundColor: '#8e44ad',
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 6,
      marginRight: 10,
    },
    reminderTimeText: {
      color: '#ffffff',
      fontSize: 11,
      fontWeight: '700',
    },
    reminderTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: Theme.colors.neutralText,
      flex: 1,
    },
    abhaBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#E6F9F0',
      borderWidth: 1,
      borderColor: '#B8F2D5',
      borderRadius: R.size(Theme.rounding.large),
      padding: R.spacing(16),
      marginBottom: R.spacing(20),
    },
    abhaBannerTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: '#065F46',
    },
    abhaBannerSubtitle: {
      fontSize: 12,
      color: '#047857',
      marginTop: 2,
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    cardWrapper: {
      width: '48%',
      marginBottom: R.spacing(14),
    },
    card: {
      height: R.size(130),
      borderRadius: R.size(Theme.rounding.large),
      padding: R.spacing(14),
      justifyContent: 'space-between',
      ...Theme.shadows.card,
    },
    iconContainer: {
      width: R.size(42),
      height: R.size(42),
      borderRadius: R.size(21),
      backgroundColor: 'rgba(255,255,255,0.25)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    cardTitle: {
      fontSize: R.font(16),
      fontWeight: '700',
      color: '#ffffff',
      lineHeight: 20,
      marginBottom: 2,
    },
    cardSubtitle: {
      fontSize: R.font(12),
      color: 'rgba(255,255,255,0.92)',
    },
    footerContainer: {
      alignItems: 'center',
      paddingVertical: R.spacing(20),
    },
    footerText: {
      fontSize: R.font(Theme.typography.sizes.small),
      color: Theme.colors.neutralSecondaryText,
      textAlign: 'center',
    }
  }), [R]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.greeting}>Namaste 👋</Text>
          <Text style={styles.title}>{userName}</Text>
        </View>
        <TouchableOpacity
          style={styles.profileAvatar}
          onPress={() => router.push('/profile' as any)}
          activeOpacity={0.8}
        >
          <Ionicons name="person" size={22} color={Theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Emergency SOS Banner */}
        <TouchableOpacity onPress={handleEmergencyPress} activeOpacity={0.85}>
          <View style={styles.emergencyCard}>
            <Animated.View style={[styles.emergencyIconContainer, { transform: [{ scale: emergencyScale }] }]}>
              <Ionicons name="warning" size={30} color="#ffffff" />
            </Animated.View>
            <View style={{ flex: 1 }}>
              <Text style={styles.emergencyTitle}>Emergency SOS (Call 108)</Text>
              <Text style={styles.emergencySubtitle}>Instant ambulance & 24/7 urgent medical help</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ffffff" />
          </View>
        </TouchableOpacity>

        {/* Overall Health Score Card */}
        <HealthScoreGauge
          score={healthScore.overallScore}
          label={healthScore.ratingLabel}
          onPress={() => router.push('/health-score' as any)}
        />

        {/* Vitals & Wearable Statistics */}
        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>Daily Vitals & Activity</Text>
          <TouchableOpacity onPress={() => router.push('/health-score' as any)}>
            <Text style={styles.seeAllText}>Detailed View</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.vitalsGrid}>
          <StatCard
            icon="heart"
            iconColor="#e74c3c"
            iconBgColor="#FDEDEC"
            label="Blood Pressure"
            value="128/82"
            unit="mmHg"
            statusBadge="Normal"
            statusColor="#10b981"
            subtitle="Logged today at 09:05 AM"
            onPress={() => router.push('/health-records' as any)}
          />
          <StatCard
            icon="pulse"
            iconColor="#0056D2"
            iconBgColor="#E8F0FE"
            label="Resting Heart Rate"
            value="72"
            unit="bpm"
            statusBadge="Optimal"
            statusColor="#10b981"
            subtitle="Stable rhythm"
            onPress={() => router.push('/health-records' as any)}
          />
          <StatCard
            icon="walk"
            iconColor="#8e44ad"
            iconBgColor="#F4ECF7"
            label="Daily Steps"
            value="3,850"
            unit="steps"
            statusBadge="85% Goal"
            statusColor="#f39c12"
            subtitle="Target: 4,500 steps"
            onPress={() => router.push('/health-score' as any)}
          />
          <StatCard
            icon="water"
            iconColor="#e67e22"
            iconBgColor="#FEF5E7"
            label="Fasting Glucose"
            value="104"
            unit="mg/dL"
            statusBadge="Controlled"
            statusColor="#10b981"
            subtitle="HbA1c: 6.4%"
            onPress={() => router.push('/health-records' as any)}
          />
        </View>

        {/* Next Smart Reminders Snapshot */}
        {activeReminders.length > 0 && (
          <TouchableOpacity
            style={styles.remindersBanner}
            onPress={() => router.push('/reminders' as any)}
            activeOpacity={0.85}
          >
            <View style={styles.sectionTitleRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="alarm" size={18} color="#8e44ad" style={{ marginRight: 6 }} />
                <Text style={[styles.sectionTitle, { fontSize: 16 }]}>Upcoming Medication Reminders</Text>
              </View>
              <Text style={styles.seeAllText}>View All ({activeReminders.length})</Text>
            </View>

            {activeReminders.map(rem => (
              <View key={rem.id} style={styles.reminderItemRow}>
                <View style={styles.reminderTimeBadge}>
                  <Text style={styles.reminderTimeText}>{rem.time}</Text>
                </View>
                <Text style={styles.reminderTitle} numberOfLines={1}>{rem.title} • {rem.subtitle}</Text>
                <Ionicons name="chevron-forward" size={16} color="#8e44ad" />
              </View>
            ))}
          </TouchableOpacity>
        )}

        {/* ABHA Link Card */}
        <TouchableOpacity
          style={styles.abhaBanner}
          onPress={() => router.push('/health-records')}
          activeOpacity={0.85}
        >
          <Ionicons name="card" size={26} color="#10b981" style={{ marginRight: 12 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.abhaBannerTitle}>ABHA Digital Health Card Linked</Text>
            <Text style={styles.abhaBannerSubtitle}>ABHA ID: ramesh.sharma@abdm • 14-5524-8931-4021</Text>
          </View>
          <Ionicons name="checkmark-circle" size={20} color="#10b981" />
        </TouchableOpacity>

        {/* Core Feature Grid */}
        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>Healthcare Services</Text>
        </View>

        <View style={styles.grid}>
          {NAV_ITEMS.map((item, index) => (
            <Animated.View
              key={item.id}
              style={[styles.cardWrapper, {
                opacity: animations[index],
                transform: [{
                  translateY: animations[index].interpolate({
                    inputRange: [0, 1],
                    outputRange: [16, 0]
                  })
                }]
              }]}
            >
              <TouchableOpacity
                style={[styles.card, { backgroundColor: item.color }]}
                onPress={() => handleCardPress(item.route)}
                activeOpacity={0.82}
              >
                <View style={styles.iconContainer}>
                  <Ionicons name={item.icon as any} size={22} color="#ffffff" />
                </View>
                <View>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardSubtitle} numberOfLines={1}>{item.subtitle}</Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>CureAI is designed for elderly support. Always consult a certified physician for critical medical conditions.</Text>
        </View>
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <BottomNavBar activeTab="home" />
    </SafeAreaView>
  );
}