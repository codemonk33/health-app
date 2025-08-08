import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function HomePage() {
  const router = useRouter();

  const handleButtonPress = (page: string) => {
    switch (page) {
      case 'symptoms':
        router.push('/symptoms');
        break;
      case 'emergency':
        router.push('/emergency');
        break;
      case 'health-tips':
        router.push('/health-tips');
        break;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Health Assistant</Text>
        <Text style={styles.subtitle}>For Elderly Care</Text>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <Text style={styles.welcomeText}>How can I help you today?</Text>
        
        {/* Buttons Container */}
        <View style={styles.buttonContainer}>
          {/* Symptoms Button */}
          <TouchableOpacity
            style={[styles.button, styles.symptomsButton]}
            onPress={() => handleButtonPress('symptoms')}
            activeOpacity={0.8}
          >
            <View style={styles.buttonContent}>
              <Ionicons name="medical" size={50} color="#ffffff" />
              <Text style={styles.buttonText}>Check Symptoms</Text>
              <Text style={styles.buttonSubtext}>Identify health issues</Text>
            </View>
          </TouchableOpacity>

          {/* Emergency Button */}
          <TouchableOpacity
            style={[styles.button, styles.emergencyButton]}
            onPress={() => handleButtonPress('emergency')}
            activeOpacity={0.8}
          >
            <View style={styles.buttonContent}>
              <Ionicons name="warning" size={50} color="#ffffff" />
              <Text style={styles.buttonText}>Emergency Help</Text>
              <Text style={styles.buttonSubtext}>Urgent medical assistance</Text>
            </View>
          </TouchableOpacity>

          {/* Health Tips Button */}
          <TouchableOpacity
            style={[styles.button, styles.healthTipsButton]}
            onPress={() => handleButtonPress('health-tips')}
            activeOpacity={0.8}
          >
            <View style={styles.buttonContent}>
              <Ionicons name="heart" size={50} color="#ffffff" />
              <Text style={styles.buttonText}>Health Tips</Text>
              <Text style={styles.buttonSubtext}>Daily wellness advice</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Always consult a doctor for serious symptoms</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 20,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 50,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    gap: 25,
  },
  button: {
    width: '100%',
    height: 120,
    borderRadius: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  buttonText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginLeft: 20,
  },
  buttonSubtext: {
    fontSize: 16,
    color: '#ffffff',
    marginLeft: 20,
    opacity: 0.9,
  },
  symptomsButton: {
    backgroundColor: '#3498db',
  },
  emergencyButton: {
    backgroundColor: '#e74c3c',
  },
  healthTipsButton: {
    backgroundColor: '#2ecc71',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 30,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 16,
    color: '#95a5a6',
    fontWeight: '500',
    textAlign: 'center',
  },
}); 