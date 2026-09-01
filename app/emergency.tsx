import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useEffect } from 'react';
import { Alert, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming, withSequence, Easing } from 'react-native-reanimated';
import { useResponsive } from './utils/responsive';
import { Theme } from './utils/theme';

export default function EmergencyScreen() {
  const router = useRouter();
  const R = useResponsive();

  const pulseScale = useSharedValue(1);

  useEffect(() => {
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.03, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, [pulseScale]);

  const animatedWarningStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pulseScale.value }]
    };
  });

  const emergencyContacts = [
    {
      name: 'Ambulance & Emergency',
      number: '108',
      description: 'Unified Medical Emergency Response',
      icon: 'medical',
      color: Theme.colors.danger
    },
    {
      name: 'Unified Emergency Support',
      number: '112',
      description: 'Emergency Response Support System (ERSS)',
      icon: 'warning',
      color: Theme.colors.danger
    },
    {
      name: 'Health Helpline',
      number: '104',
      description: 'Health information and guidance',
      icon: 'help-circle',
      color: Theme.colors.secondary
    },
    {
      name: 'Poison Control',
      number: '1800-116-117',
      description: 'National Poison Information Centre',
      icon: 'warning',
      color: Theme.colors.warning
    },
    {
      name: 'Mental Health',
      number: '1800-599-0019',
      description: 'Kiran Mental Health Rehabilitation',
      icon: 'heart',
      color: Theme.colors.purple
    },
    {
      name: 'iCall Mental Health',
      number: '9152987821',
      description: 'TISS — Free counselling, Mon–Sat 8am–10pm',
      icon: 'heart-outline',
      color: Theme.colors.purple
    },
    {
      name: 'Vandrevala Foundation',
      number: '18602662345',
      description: '24/7 free mental health helpline',
      icon: 'call',
      color: Theme.colors.purple
    },
    {
      name: 'National Child Helpline',
      number: '1098',
      description: 'CHILDLINE — for child-related emergencies',
      icon: 'people',
      color: Theme.colors.secondary
    }
  ];

  const emergencySymptoms = [
    'Chest pain or pressure',
    'Difficulty breathing or choking',
    'Severe bleeding that won\'t stop',
    'Loss of consciousness or fainting',
    'Sudden severe headache or stroke symptoms',
    'Weakness or numbness on one side',
    'Severe abdominal pain',
    'Uncontrolled seizures',
  ];

  const handleCall = (number: string, name: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert(
      'Emergency Call',
      `Call ${name} at ${number}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call', onPress: () => Linking.openURL(`tel:${number.replace(/-/g, '')}`) }
      ]
    );
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
    },
    title: {
      fontSize: R.font(Theme.typography.sizes.h1),
      fontWeight: 'bold',
      color: Theme.colors.danger,
    },
    content: {
      flex: 1,
    },
    warningContainer: {
      backgroundColor: '#fff5f5',
      padding: R.spacing(30),
      margin: R.spacing(20),
      borderRadius: R.size(Theme.rounding.large),
      alignItems: 'center',
      borderWidth: 2,
      borderColor: Theme.colors.danger,
    },
    warningTitle: {
      fontSize: R.font(Theme.typography.sizes.h1),
      fontWeight: 'bold',
      color: Theme.colors.danger,
      marginTop: R.spacing(15),
      marginBottom: R.spacing(10),
    },
    warningText: {
      fontSize: R.font(Theme.typography.sizes.h3),
      color: '#c53030',
      textAlign: 'center',
      lineHeight: R.font(Theme.typography.sizes.h3 * 1.4),
      fontWeight: '600',
    },
    warningSubtext: {
      fontSize: R.font(Theme.typography.sizes.small),
      color: '#c53030',
      textAlign: 'center',
      marginTop: R.spacing(10),
      fontStyle: 'italic',
    },
    sectionContainer: {
      backgroundColor: Theme.colors.surface,
      padding: R.spacing(20),
      margin: R.spacing(20),
      borderRadius: R.size(Theme.rounding.large),
      ...Theme.shadows.card,
    },
    sectionTitle: {
      fontSize: R.font(Theme.typography.sizes.h2),
      fontWeight: 'bold',
      color: Theme.colors.neutralText,
      marginBottom: R.spacing(15),
    },
    contactCard: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: R.spacing(15),
      backgroundColor: Theme.colors.background,
      borderRadius: R.size(Theme.rounding.medium),
      marginBottom: R.spacing(10),
      borderLeftWidth: 4,
    },
    contactInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    contactDetails: {
      marginLeft: R.spacing(15),
      flex: 1,
    },
    contactName: {
      fontSize: R.font(Theme.typography.sizes.h3),
      fontWeight: 'bold',
      color: Theme.colors.neutralText,
    },
    contactNumber: {
      fontSize: R.font(Theme.typography.sizes.body),
      color: Theme.colors.primary,
      fontWeight: '600',
      marginTop: R.spacing(2),
    },
    contactDescription: {
      fontSize: R.font(Theme.typography.sizes.small),
      color: Theme.colors.neutralSecondaryText,
      marginTop: R.spacing(2),
    },
    symptomsSubtitle: {
      fontSize: R.font(Theme.typography.sizes.body),
      color: Theme.colors.neutralSecondaryText,
      marginBottom: R.spacing(15),
      fontWeight: '500',
    },
    symptomItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: R.spacing(10),
    },
    bulletPoint: {
      fontSize: R.font(Theme.typography.sizes.h3),
      color: Theme.colors.danger,
      marginRight: R.spacing(10),
      marginTop: R.spacing(2),
    },
    symptomText: {
      fontSize: R.font(Theme.typography.sizes.body),
      color: Theme.colors.neutralText,
      flex: 1,
    },
    legalContainer: {
      backgroundColor: '#e8f4f8',
      padding: R.spacing(20),
      margin: R.spacing(20),
      borderRadius: R.size(Theme.rounding.large),
      borderLeftWidth: 4,
      borderLeftColor: Theme.colors.secondary,
    },
    legalTitle: {
      fontSize: R.font(Theme.typography.sizes.h2),
      fontWeight: 'bold',
      color: Theme.colors.neutralText,
      marginBottom: R.spacing(15),
    },
    legalItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: R.spacing(12),
    },
    legalText: {
      fontSize: R.font(Theme.typography.sizes.body),
      color: Theme.colors.neutralText,
      flex: 1,
    },
    legalBold: {
      fontWeight: 'bold',
      color: Theme.colors.neutralText,
    },
    instructionsContainer: {
      backgroundColor: '#e8f5e8',
      padding: R.spacing(20),
      margin: R.spacing(20),
      borderRadius: R.size(Theme.rounding.large),
      borderLeftWidth: 4,
      borderLeftColor: '#2ecc71',
    },
    instructionsTitle: {
      fontSize: R.font(Theme.typography.sizes.h2),
      fontWeight: 'bold',
      color: Theme.colors.neutralText,
      marginBottom: R.spacing(15),
    },
    instructionsText: {
      fontSize: R.font(Theme.typography.sizes.body),
      color: Theme.colors.neutralText,
      lineHeight: R.font(24),
    },
    boldText: {
      fontWeight: 'bold',
      color: Theme.colors.neutralText,
    },
  }), [R]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color={Theme.colors.neutralText} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Emergency Help</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.warningContainer, animatedWarningStyle]}>
          <Ionicons name="warning" size={60} color={Theme.colors.danger} />
          <Text style={styles.warningTitle}>Emergency Assistance</Text>
          <Text style={styles.warningText}>
            For life-threatening emergencies, call 108 immediately.
          </Text>
          <Text style={styles.warningSubtext}>
            As per Indian law, no hospital can refuse emergency medical treatment.
          </Text>
          <Text style={[styles.warningText, { marginTop: R.spacing(12), fontSize: R.font(Theme.typography.sizes.body) }]}>
            जीवन के खतरे में तुरंत 108 पर कॉल करें
          </Text>
        </Animated.View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Emergency Contacts (India)</Text>
          {emergencyContacts.map((contact, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.contactCard, { borderLeftColor: contact.color }]}
              onPress={() => handleCall(contact.number, contact.name)}
              activeOpacity={0.8}
            >
              <View style={styles.contactInfo}>
                <Ionicons name={contact.icon as any} size={32} color={contact.color} />
                <View style={styles.contactDetails}>
                  <Text style={styles.contactName}>{contact.name}</Text>
                  <Text style={styles.contactNumber}>{contact.number}</Text>
                  <Text style={styles.contactDescription}>{contact.description}</Text>
                </View>
              </View>
              <Ionicons name="call" size={24} color={contact.color} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Emergency Symptoms</Text>
          <Text style={styles.symptomsSubtitle}>
            Call 108 immediately if you experience:
          </Text>
          {emergencySymptoms.map((symptom, index) => (
            <View key={index} style={styles.symptomItem}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.symptomText}>{symptom}</Text>
            </View>
          ))}
        </View>

        <View style={styles.legalContainer}>
          <Text style={styles.legalTitle}>Your Rights Under Indian Law</Text>
          <View style={styles.legalItem}>
            <Text style={styles.bulletPoint}>•</Text>
            <Text style={styles.legalText}>
              <Text style={styles.legalBold}>Right to Care:</Text> No hospital can refuse emergency treatment.
            </Text>
          </View>
          <View style={styles.legalItem}>
            <Text style={styles.bulletPoint}>•</Text>
            <Text style={styles.legalText}>
              <Text style={styles.legalBold}>Free Treatment:</Text> Government hospitals provide free emergency care. Private must stabilize first.
            </Text>
          </View>
        </View>

        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>What to Do</Text>
          <Text style={styles.instructionsText}>
            • <Text style={styles.boldText}>Stay calm</Text> and call 108 immediately{'\n'}
            • <Text style={styles.boldText}>Provide exact location</Text> to the operator{'\n'}
            • <Text style={styles.boldText}>Speak clearly</Text> and share main symptoms{'\n'}
            • <Text style={styles.boldText}>Follow dispatcher directions</Text> while waiting
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}