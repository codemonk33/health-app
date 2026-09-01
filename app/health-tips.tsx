import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useResponsive } from './utils/responsive';
import { Theme } from './utils/theme';

export default function HealthTipsScreen() {
  const router = useRouter();
  const R = useResponsive();

  const healthTips = [
    {
      category: 'Daily Exercise',
      icon: 'fitness',
      color: Theme.colors.primary,
      tips: [
        'Take a 30-minute walk daily',
        'Do gentle stretching exercises',
        'Practice balance exercises',
        'Stay active with light activities'
      ]
    },
    {
      category: 'Nutrition',
      icon: 'restaurant',
      color: Theme.colors.secondary,
      tips: [
        'Eat plenty of fruits and vegetables',
        'Stay hydrated with 8 glasses of water',
        'Include protein in every meal',
        'Limit processed foods and sugar'
      ]
    },
    {
      category: 'Mental Health',
      icon: 'happy',
      color: Theme.colors.warning,
      tips: [
        'Stay socially connected',
        'Practice mindfulness or meditation',
        'Engage in hobbies you enjoy',
        'Get adequate sleep (7-9 hours)'
      ]
    },
    {
      category: 'Safety',
      icon: 'shield-checkmark',
      color: Theme.colors.danger,
      tips: [
        'Keep emergency contacts handy',
        'Install grab bars in bathroom',
        'Remove trip hazards at home',
        'Have regular medical check-ups'
      ]
    },
    {
      category: 'Medication',
      icon: 'medical',
      color: Theme.colors.purple,
      tips: [
        'Take medications as prescribed',
        'Keep a medication list updated',
        'Use pill organizers if needed',
        'Ask questions about side effects'
      ]
    },
    {
      category: 'Ayurveda',
      icon: 'leaf',
      color: Theme.colors.success,
      tips: [
        'Drink warm Tulsi & Ginger tea daily',
        'Use Triphala for digestive wellness',
        'Practice gentle morning yoga',
        'Have Ashwagandha for stress relief'
      ]
    },
    {
      category: 'Monsoon Safety',
      icon: 'water',
      color: '#0288D1', // fallback logic color if theme primary does not match theme idea
      tips: [
        'Boil drinking water thoroughly',
        'Avoid street foods during rains',
        'Use mosquito repellents and nets',
        'Keep skin dry to prevent infections'
      ]
    }
  ];

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
      color: Theme.colors.neutralText,
    },
    content: {
      flex: 1,
    },
    welcomeContainer: {
      backgroundColor: Theme.colors.surface,
      padding: R.spacing(30),
      margin: R.spacing(20),
      borderRadius: R.size(Theme.rounding.xl),
      alignItems: 'center',
      ...Theme.shadows.card,
    },
    welcomeTitle: {
      fontSize: R.font(Theme.typography.sizes.h2),
      fontWeight: 'bold',
      color: Theme.colors.neutralText,
      marginTop: R.spacing(15),
      marginBottom: R.spacing(10),
    },
    welcomeText: {
      fontSize: R.font(Theme.typography.sizes.body),
      color: Theme.colors.neutralSecondaryText,
      textAlign: 'center',
      lineHeight: R.font(22),
    },
    categoryContainer: {
      backgroundColor: Theme.colors.surface,
      margin: R.spacing(20),
      borderRadius: R.size(Theme.rounding.xl),
      ...Theme.shadows.card,
    },
    categoryHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: R.spacing(20),
      borderBottomWidth: 1,
      borderBottomColor: Theme.colors.border,
    },
    categoryIcon: {
      width: R.size(60),
      height: R.size(60),
      borderRadius: R.size(30),
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: R.spacing(15),
    },
    categoryTitle: {
      fontSize: R.font(Theme.typography.sizes.h2),
      fontWeight: 'bold',
      color: Theme.colors.neutralText,
    },
    tipsContainer: {
      padding: R.spacing(20),
    },
    tipItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: R.spacing(12),
    },
    bulletPoint: {
      fontSize: R.font(Theme.typography.sizes.h3),
      color: Theme.colors.primary,
      marginRight: R.spacing(10),
      marginTop: R.spacing(2),
    },
    tipText: {
      fontSize: R.font(Theme.typography.sizes.body),
      color: Theme.colors.neutralText,
      lineHeight: R.font(22),
      flex: 1,
    },
    resourcesContainer: {
      backgroundColor: '#e8f5e8',
      padding: R.spacing(20),
      margin: R.spacing(20),
      borderRadius: R.size(Theme.rounding.xl),
      borderLeftWidth: 4,
      borderLeftColor: Theme.colors.secondary,
    },
    resourcesTitle: {
      fontSize: R.font(Theme.typography.sizes.h2),
      fontWeight: 'bold',
      color: Theme.colors.neutralText,
      marginBottom: R.spacing(15),
    },
    resourcesText: {
      fontSize: R.font(Theme.typography.sizes.body),
      color: Theme.colors.neutralText,
      lineHeight: R.font(24),
    },
    reminderContainer: {
      backgroundColor: '#e3f2fd',
      padding: R.spacing(20),
      margin: R.spacing(20),
      borderRadius: R.size(Theme.rounding.xl),
      alignItems: 'center',
      borderLeftWidth: 4,
      borderLeftColor: Theme.colors.primary,
    },
    reminderTitle: {
      fontSize: R.font(Theme.typography.sizes.h2),
      fontWeight: 'bold',
      color: Theme.colors.neutralText,
      marginTop: R.spacing(10),
      marginBottom: R.spacing(10),
    },
    reminderText: {
      fontSize: R.font(Theme.typography.sizes.small),
      color: Theme.colors.neutralText,
      textAlign: 'center',
      lineHeight: R.font(20),
    },
  }), [R]);

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
        <Text style={styles.title}>Health Tips</Text>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Welcome Message */}
        <View style={styles.welcomeContainer}>
          <Ionicons name="heart" size={60} color={Theme.colors.secondary} />
          <Text style={styles.welcomeTitle}>Daily Wellness Tips</Text>
          <Text style={styles.welcomeText}>
            Simple tips to help you stay healthy and active every day.
          </Text>
        </View>

        {/* Health Tips Categories */}
        {healthTips.map((category, index) => (
          <View key={index} style={styles.categoryContainer}>
            <View style={styles.categoryHeader}>
              <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
                <Ionicons name={category.icon as any} size={32} color="#ffffff" />
              </View>
              <Text style={styles.categoryTitle}>{category.category}</Text>
            </View>
            
            <View style={styles.tipsContainer}>
              {category.tips.map((tip, tipIndex) => (
                <View key={tipIndex} style={styles.tipItem}>
                  <Text style={styles.bulletPoint}>•</Text>
                  <Text style={styles.tipText}>{tip}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* Additional Resources */}
        <View style={styles.resourcesContainer}>
          <Text style={styles.resourcesTitle}>Additional Resources</Text>
          <Text style={styles.resourcesText}>
            • Talk to your doctor about personalized health advice{'\n'}
            • Join local senior activity groups{'\n'}
            • Consider a fitness class designed for seniors{'\n'}
            • Stay informed about health news and updates
          </Text>
        </View>

        {/* Reminder */}
        <View style={styles.reminderContainer}>
          <Ionicons name="information-circle" size={40} color={Theme.colors.primary} />
          <Text style={styles.reminderTitle}>Remember</Text>
          <Text style={styles.reminderText}>
            These tips are general guidelines. Always consult with your healthcare provider 
            for personalized medical advice and before starting any new exercise or diet program.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}