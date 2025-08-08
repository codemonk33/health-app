import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HealthTipsScreen() {
  const router = useRouter();

  const healthTips = [
    {
      category: 'Daily Exercise',
      icon: 'fitness',
      color: '#3498db',
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
      color: '#2ecc71',
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
      color: '#f39c12',
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
      color: '#e74c3c',
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
      color: '#9b59b6',
      tips: [
        'Take medications as prescribed',
        'Keep a medication list updated',
        'Use pill organizers if needed',
        'Ask questions about side effects'
      ]
    }
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={28} color="#2c3e50" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Health Tips</Text>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Welcome Message */}
        <View style={styles.welcomeContainer}>
          <Ionicons name="heart" size={60} color="#2ecc71" />
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
          <Ionicons name="information-circle" size={40} color="#3498db" />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  backText: {
    fontSize: 18,
    color: '#2c3e50',
    marginLeft: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  content: {
    flex: 1,
  },
  welcomeContainer: {
    backgroundColor: '#ffffff',
    padding: 30,
    margin: 20,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 15,
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 22,
  },
  categoryContainer: {
    backgroundColor: '#ffffff',
    margin: 20,
    borderRadius: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  tipsContainer: {
    padding: 20,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  bulletPoint: {
    fontSize: 18,
    color: '#3498db',
    marginRight: 10,
    marginTop: 2,
  },
  tipText: {
    fontSize: 16,
    color: '#34495e',
    lineHeight: 22,
    flex: 1,
  },
  resourcesContainer: {
    backgroundColor: '#e8f5e8',
    padding: 20,
    margin: 20,
    borderRadius: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#2ecc71',
  },
  resourcesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  resourcesText: {
    fontSize: 16,
    color: '#34495e',
    lineHeight: 24,
  },
  reminderContainer: {
    backgroundColor: '#e3f2fd',
    padding: 20,
    margin: 20,
    borderRadius: 15,
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#3498db',
  },
  reminderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 10,
    marginBottom: 10,
  },
  reminderText: {
    fontSize: 14,
    color: '#34495e',
    textAlign: 'center',
    lineHeight: 20,
  },
}); 