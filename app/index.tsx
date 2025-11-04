import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useResponsive } from './utils/responsive';
import ChatBot from './components/ChatBot';


export default function HomePage() {
  const router = useRouter();
  const R = useResponsive();

  const handleButtonPress = useCallback((page: string) => {
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
      case 'appointments':
        router.push('/appointments');
        break;
      case 'order-medicine':
        router.push('/order-medicine');
        break;
    }
  }, [router]);

  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f8f9fa',
    },
    header: {
      alignItems: 'center',
      paddingTop: R.spacing(20),
      paddingBottom: R.spacing(24),
      backgroundColor: '#ffffff',
      borderBottomWidth: 1,
      borderBottomColor: '#e9ecef',
      gap: R.spacing(6),
    },
    title: {
      fontSize: R.font(42),
      fontWeight: 'bold',
      color: '#2c3e50',
      marginBottom: R.spacing(8),
    },
    subtitle: {
      fontSize: R.font(20),
      color: '#7f8c8d',
      fontWeight: '500',
    },
    content: {
      flex: 1,
    },
    contentContainer: {
      alignItems: 'center',
      paddingHorizontal: R.spacing(20),
      paddingTop: R.spacing(24),
      paddingBottom: R.spacing(24),
    },
    welcomeText: {
      fontSize: R.font(28),
      fontWeight: '600',
      color: '#2c3e50',
      marginBottom: R.spacing(50),
      textAlign: 'center',
    },
    buttonContainer: {
      width: '100%',
      gap: R.spacing(25),
    },
    button: {
      width: '100%',
      height: R.size(120),
      borderRadius: R.size(20),
      elevation: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    },
    buttonContent: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: R.spacing(30),
    },
    textGroup: {
      marginLeft: R.spacing(20),
      alignItems: 'flex-start',
      flexShrink: 1,
    },
    buttonText: {
      fontSize: R.font(24),
      fontWeight: '700',
      color: '#ffffff',
      lineHeight: Math.round(R.font(24) * 1.3),
    },
    buttonSubtext: {
      fontSize: R.font(16),
      color: '#ffffff',
      opacity: 0.9,
      lineHeight: Math.round(R.font(16) * 1.35),
    },
    symptomsButton: { backgroundColor: '#3498db' },
    emergencyButton: { backgroundColor: '#e74c3c' },
    healthTipsButton: { backgroundColor: '#2ecc71' },
    appointmentsButton: { backgroundColor: '#9b59b6' },
    orderButton: { backgroundColor: '#e67e22' },
    footer: {
      alignItems: 'center',
      paddingBottom: R.spacing(30),
      paddingTop: R.spacing(20),
      paddingHorizontal: R.spacing(20),
    },
    footerText: {
      fontSize: R.font(16),
      color: '#95a5a6',
      fontWeight: '500',
      textAlign: 'center',
    },
  }), [R]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Health Assistant</Text>
        <Text style={styles.subtitle}>For Elderly Care</Text>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
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
              <View style={styles.textGroup}>
                <Text style={styles.buttonText}>Check Symptoms</Text>
                <Text style={styles.buttonSubtext}>Identify health issues</Text>
              </View>
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
              <View style={styles.textGroup}>
                <Text style={styles.buttonText}>Emergency Help</Text>
                <Text style={styles.buttonSubtext}>Urgent medical assistance</Text>
              </View>
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
              <View style={styles.textGroup}>
                <Text style={styles.buttonText}>Health Tips</Text>
                <Text style={styles.buttonSubtext}>Daily wellness advice</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Appointments Button */}
          <TouchableOpacity
            style={[styles.button, styles.appointmentsButton]}
            onPress={() => handleButtonPress('appointments')}
            activeOpacity={0.8}
          >
            <View style={styles.buttonContent}>
              <Ionicons name="calendar" size={50} color="#ffffff" />
              <View style={styles.textGroup}>
                <Text style={styles.buttonText}>Book Appointment</Text>
                <Text style={styles.buttonSubtext}>Find and schedule doctors</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Order Medicine Button */}
          <TouchableOpacity
            style={[styles.button, styles.orderButton]}
            onPress={() => handleButtonPress('order-medicine')}
            activeOpacity={0.8}
          >
            <View style={styles.buttonContent}>
              <Ionicons name="cart" size={50} color="#ffffff" />
              <View style={styles.textGroup}>
                <Text style={styles.buttonText}>Order Medicine</Text>
                <Text style={styles.buttonSubtext}>Fast delivery to your door</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Always consult a doctor for serious symptoms</Text>
      </View>

      {/* ChatBot */}
      <ChatBot />
    </SafeAreaView>
  );
}