import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function EmergencyScreen() {
  const router = useRouter();

  const emergencyContacts = [
    {
      name: 'Emergency Services',
      number: '911',
      description: 'For life-threatening emergencies',
      icon: 'call',
      color: '#e74c3c'
    },
    {
      name: 'Poison Control',
      number: '1-800-222-1222',
      description: 'For poisoning emergencies',
      icon: 'warning',
      color: '#f39c12'
    },
    {
      name: 'Local Hospital',
      number: '555-123-4567',
      description: 'Nearest medical facility',
      icon: 'medical',
      color: '#3498db'
    }
  ];

  const emergencySymptoms = [
    'Chest pain or pressure',
    'Difficulty breathing',
    'Severe bleeding',
    'Loss of consciousness',
    'Sudden severe headache',
    'Weakness or numbness',
    'Severe abdominal pain',
    'Uncontrolled bleeding'
  ];

  const handleCall = (number: string, name: string) => {
    Alert.alert(
      'Emergency Call',
      `Call ${name} at ${number}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Call', 
          onPress: () => Linking.openURL(`tel:${number}`)
        }
      ]
    );
  };

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
        <Text style={styles.title}>Emergency Help</Text>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Emergency Warning */}
        <View style={styles.warningContainer}>
          <Ionicons name="warning" size={60} color="#e74c3c" />
          <Text style={styles.warningTitle}>Emergency Assistance</Text>
          <Text style={styles.warningText}>
            If you are experiencing a medical emergency, call 911 immediately.
          </Text>
        </View>

        {/* Emergency Contacts */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Emergency Contacts</Text>
          {emergencyContacts.map((contact, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.contactCard, { borderLeftColor: contact.color }]}
              onPress={() => handleCall(contact.number, contact.name)}
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

        {/* Emergency Symptoms */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Emergency Symptoms</Text>
          <Text style={styles.symptomsSubtitle}>
            Call 911 immediately if you experience:
          </Text>
          {emergencySymptoms.map((symptom, index) => (
            <View key={index} style={styles.symptomItem}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.symptomText}>{symptom}</Text>
            </View>
          ))}
        </View>

        {/* Instructions */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>What to Do in an Emergency</Text>
          <Text style={styles.instructionsText}>
            • Stay calm and call 911 immediately{'\n'}
            • Follow the dispatcher's instructions{'\n'}
            • If possible, have someone stay with you{'\n'}
            • Keep important medical information handy{'\n'}
            • Don't drive yourself to the hospital if it's serious
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
  warningContainer: {
    backgroundColor: '#fff5f5',
    padding: 30,
    margin: 20,
    borderRadius: 15,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e74c3c',
  },
  warningTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginTop: 15,
    marginBottom: 10,
  },
  warningText: {
    fontSize: 16,
    color: '#c53030',
    textAlign: 'center',
    lineHeight: 22,
  },
  sectionContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
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
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 4,
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  contactDetails: {
    marginLeft: 15,
    flex: 1,
  },
  contactName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  contactNumber: {
    fontSize: 16,
    color: '#3498db',
    fontWeight: '600',
  },
  contactDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 2,
  },
  symptomsSubtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 15,
  },
  symptomItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  bulletPoint: {
    fontSize: 18,
    color: '#e74c3c',
    marginRight: 10,
    marginTop: 2,
  },
  symptomText: {
    fontSize: 16,
    color: '#34495e',
    lineHeight: 22,
    flex: 1,
  },
  instructionsContainer: {
    backgroundColor: '#e8f5e8',
    padding: 20,
    margin: 20,
    borderRadius: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#2ecc71',
  },
  instructionsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  instructionsText: {
    fontSize: 16,
    color: '#34495e',
    lineHeight: 24,
  },
}); 