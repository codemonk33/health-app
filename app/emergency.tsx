import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function EmergencyScreen() {
  const router = useRouter();

  const emergencyContacts = [
    {
      name: 'Emergency Ambulance',
      number: '102',
      description: 'Ambulance services - Available nationwide',
      icon: 'medical',
      color: '#e74c3c'
    },
    {
      name: 'Emergency Response',
      number: '108',
      description: 'Emergency Medical Response (State-specific)',
      icon: 'call',
      color: '#e74c3c'
    },
    {
      name: 'Unified Emergency',
      number: '112',
      description: 'Emergency Response Support System (ERSS)',
      icon: 'warning',
      color: '#e74c3c'
    },
    {
      name: 'Health Helpline',
      number: '104',
      description: 'Health information and guidance (State-specific)',
      icon: 'help-circle',
      color: '#3498db'
    },
    {
      name: 'Poison Control',
      number: '1800-116-117',
      description: 'National Poison Information Centre (NPIC)',
      icon: 'warning',
      color: '#f39c12'
    },
    {
      name: 'Mental Health',
      number: '1800-599-0019',
      description: 'Kiran Mental Health Rehabilitation Helpline',
      icon: 'heart',
      color: '#9b59b6'
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
    'Severe burns',
    'Suspected poisoning',
    'Severe allergic reaction'
  ];

  const handleCall = (number: string, name: string) => {
    Alert.alert(
      'Emergency Call',
      `Call ${name} at ${number}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Call', 
          onPress: () => Linking.openURL(`tel:${number.replace(/-/g, '')}`)
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
            For life-threatening emergencies, call 102 (Ambulance) or 108 immediately.
          </Text>
          <Text style={styles.warningSubtext}>
            As per Indian law, no hospital can refuse emergency medical treatment.
          </Text>
        </View>

        {/* Emergency Contacts */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Emergency Contacts (India)</Text>
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
            Call 102 or 108 immediately if you experience:
          </Text>
          {emergencySymptoms.map((symptom, index) => (
            <View key={index} style={styles.symptomItem}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.symptomText}>{symptom}</Text>
            </View>
          ))}
        </View>

        {/* Legal Rights Section */}
        <View style={styles.legalContainer}>
          <Text style={styles.legalTitle}>Your Rights Under Indian Law</Text>
          <View style={styles.legalItem}>
            <Text style={styles.bulletPoint}>•</Text>
            <Text style={styles.legalText}>
              <Text style={styles.legalBold}>Right to Emergency Medical Care:</Text> As per Supreme Court judgment, no hospital (private or public) can refuse emergency medical treatment.{'\n'}
            </Text>
          </View>
          <View style={styles.legalItem}>
            <Text style={styles.bulletPoint}>•</Text>
            <Text style={styles.legalText}>
              <Text style={styles.legalBold}>Free Treatment:</Text> Government hospitals provide free emergency treatment. Private hospitals must provide stabilizing treatment before asking for payment.{'\n'}
            </Text>
          </View>
          <View style={styles.legalItem}>
            <Text style={styles.bulletPoint}>•</Text>
            <Text style={styles.legalText}>
              <Text style={styles.legalBold}>Ambulance Services:</Text> Government ambulances (102/108) are free. Private ambulance charges vary by state regulations.{'\n'}
            </Text>
          </View>
          <View style={styles.legalItem}>
            <Text style={styles.bulletPoint}>•</Text>
            <Text style={styles.legalText}>
              <Text style={styles.legalBold}>Consumer Protection:</Text> You have the right to file a complaint if denied emergency treatment under the Consumer Protection Act.
            </Text>
          </View>
        </View>

        {/* Instructions */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>What to Do in an Emergency (India)</Text>
          <Text style={styles.instructionsText}>
            • <Text style={styles.boldText}>Stay calm</Text> and call 102 (Ambulance) or 108 immediately{'\n'}
            • <Text style={styles.boldText}>Provide clear location</Text> details to the operator (landmark, area, city){'\n'}
            • <Text style={styles.boldText}>Speak in local language</Text> if English is not clear{'\n'}
            • <Text style={styles.boldText}>Follow dispatcher instructions</Text> while waiting for ambulance{'\n'}
            • <Text style={styles.boldText}>Keep Aadhaar or ID card</Text> ready for hospital admission{'\n'}
            • <Text style={styles.boldText}>Don't drive yourself</Text> to hospital if it's serious - wait for ambulance{'\n'}
            • <Text style={styles.boldText}>Know your nearest hospital:</Text> Government hospitals provide free emergency care{'\n'}
            • <Text style={styles.boldText}>Keep emergency contacts</Text> saved on your phone
          </Text>
        </View>

        {/* Government Hospitals Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Government Healthcare Facilities</Text>
          <Text style={styles.infoText}>
            • <Text style={styles.boldText}>Primary Health Centers (PHC):</Text> Basic emergency care{'\n'}
            • <Text style={styles.boldText}>Community Health Centers (CHC):</Text> Advanced emergency services{'\n'}
            • <Text style={styles.boldText}>District Hospitals:</Text> Comprehensive emergency care{'\n'}
            • <Text style={styles.boldText}>Medical College Hospitals:</Text> Tertiary care with specialized emergency departments{'\n'}
            • All government facilities provide <Text style={styles.boldText}>free emergency treatment</Text> as per government policy
          </Text>
        </View>

        {/* Important Notes */}
        <View style={styles.notesContainer}>
          <Text style={styles.notesTitle}>Important Notes</Text>
          <Text style={styles.notesText}>
            • Ambulance services (102/108) are <Text style={styles.boldText}>free</Text> in most states{'\n'}
            • Emergency numbers may vary slightly by state - check local listings{'\n'}
            • Government hospitals cannot refuse emergency treatment{'\n'}
            • Keep your location services ON for faster ambulance dispatch{'\n'}
            • In case of delay, contact nearest police station (100) for assistance
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
    fontWeight: '600',
  },
  warningSubtext: {
    fontSize: 14,
    color: '#c53030',
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 10,
    fontStyle: 'italic',
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
    marginTop: 2,
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
    fontWeight: '500',
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
  legalContainer: {
    backgroundColor: '#e8f4f8',
    padding: 20,
    margin: 20,
    borderRadius: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#3498db',
  },
  legalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  legalItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  legalText: {
    fontSize: 15,
    color: '#34495e',
    lineHeight: 22,
    flex: 1,
  },
  legalBold: {
    fontWeight: 'bold',
    color: '#2c3e50',
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
  boldText: {
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  infoContainer: {
    backgroundColor: '#fff9e6',
    padding: 20,
    margin: 20,
    borderRadius: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#f39c12',
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  infoText: {
    fontSize: 16,
    color: '#34495e',
    lineHeight: 24,
  },
  notesContainer: {
    backgroundColor: '#f0f0f0',
    padding: 20,
    margin: 20,
    marginBottom: 30,
    borderRadius: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#7f8c8d',
  },
  notesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  notesText: {
    fontSize: 16,
    color: '#34495e',
    lineHeight: 24,
  },
}); 