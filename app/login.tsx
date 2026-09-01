import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useResponsive } from './utils/responsive';
import { Theme } from './utils/theme';
import { useAuth } from './context/AuthContext';
import { authService } from './services/authService';

export default function LoginScreen() {
  const router = useRouter();
  const R = useResponsive();
  const { login, verifyAbha } = useAuth();

  const [phone, setPhone] = useState('9876543210');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // ABHA Link Modal
  const [showAbhaModal, setShowAbhaModal] = useState(false);
  const [abhaInput, setAbhaInput] = useState('');
  const [isAbhaLoading, setIsAbhaLoading] = useState(false);

  const handleSendOtp = async () => {
    setErrorMessage('');
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setErrorMessage('Please enter a valid 10-digit Indian mobile number');
      return;
    }

    setIsLoading(true);
    const res = await authService.sendOtp(phone);
    setIsLoading(false);

    if (res.success) {
      setStep('otp');
      setOtp('1234'); // Pre-fill mock OTP for smooth testing
    } else {
      setErrorMessage(res.message);
    }
  };

  const handleVerifyOtp = async () => {
    setErrorMessage('');
    if (!otp || otp.length < 4) {
      setErrorMessage('Please enter the 4-digit OTP');
      return;
    }

    setIsLoading(true);
    const res = await login(phone, otp);
    setIsLoading(false);

    if (res.success) {
      router.replace('/');
    } else {
      setErrorMessage(res.message);
    }
  };

  const handleVerifyAbha = async () => {
    if (!abhaInput.trim()) {
      Alert.alert('Missing Input', 'Please enter your 14-digit ABHA number or ABHA address');
      return;
    }
    setIsAbhaLoading(true);
    const res = await verifyAbha(abhaInput);
    setIsAbhaLoading(false);

    if (res.success) {
      setShowAbhaModal(false);
      Alert.alert('ABHA Verified', res.message);
    } else {
      Alert.alert('Verification Failed', res.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header Icon & Title */}
        <View style={[styles.headerBox, { paddingTop: R.spacing(60), marginBottom: R.spacing(28) }]}>
          <View style={[styles.iconCircle, { width: R.size(72), height: R.size(72), borderRadius: R.size(36) }]}>
            <Ionicons name="lock-closed" size={32} color={Theme.colors.primary} />
          </View>

          <Text style={[styles.title, { fontSize: R.font(Theme.typography.sizes.h1) }]}>
            {step === 'phone' ? 'Sign In to CureAI' : 'Enter Verification Code'}
          </Text>

          <Text style={[styles.subtitle, { fontSize: R.font(Theme.typography.sizes.body) }]}>
            {step === 'phone'
              ? 'Enter your mobile number to access your senior health dashboard and records'
              : `We sent a 4-digit code to +91 ${phone}`}
          </Text>
        </View>

        {/* Error Banner */}
        {errorMessage ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={20} color={Theme.colors.danger} />
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : null}

        {/* Form Fields */}
        {step === 'phone' ? (
          <View style={styles.formContainer}>
            <Text style={styles.inputLabel}>Mobile Number</Text>
            <View style={styles.phoneInputRow}>
              <View style={styles.countryCodeBox}>
                <Text style={styles.countryCodeText}>🇮🇳 +91</Text>
              </View>
              <TextInput
                style={styles.phoneInput}
                placeholder="Enter 10-digit number"
                placeholderTextColor="#95a5a6"
                keyboardType="phone-pad"
                maxLength={10}
                value={phone}
                onChangeText={(text) => {
                  setPhone(text.replace(/[^0-9]/g, ''));
                  setErrorMessage('');
                }}
              />
            </View>

            <TouchableOpacity
              style={[styles.primaryButton, { height: R.size(54), marginTop: R.spacing(20) }]}
              onPress={handleSendOtp}
              activeOpacity={0.85}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <>
                  <Text style={styles.primaryButtonText}>Get OTP</Text>
                  <Ionicons name="arrow-forward" size={18} color="#ffffff" style={{ marginLeft: 6 }} />
                </>
              )}
            </TouchableOpacity>

            {/* ABHA Link Card */}
            <TouchableOpacity
              style={styles.abhaCard}
              onPress={() => setShowAbhaModal(true)}
              activeOpacity={0.8}
            >
              <View style={styles.abhaIconRow}>
                <Ionicons name="card" size={24} color="#10b981" />
                <View style={{ marginLeft: 12, flex: 1 }}>
                  <Text style={styles.abhaCardTitle}>Have an ABHA Card?</Text>
                  <Text style={styles.abhaCardSubtitle}>
                    Link your Ayushman Bharat Health Account for unified national records
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#10b981" />
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.formContainer}>
            <Text style={styles.inputLabel}>4-Digit OTP</Text>
            <TextInput
              style={styles.otpInput}
              placeholder="••••"
              placeholderTextColor="#95a5a6"
              keyboardType="number-pad"
              maxLength={4}
              value={otp}
              onChangeText={(text) => {
                setOtp(text.replace(/[^0-9]/g, ''));
                setErrorMessage('');
              }}
              autoFocus
            />

            <TouchableOpacity
              style={[styles.primaryButton, { height: R.size(54), marginTop: R.spacing(20) }]}
              onPress={handleVerifyOtp}
              activeOpacity={0.85}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.primaryButtonText}>Verify & Login</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.changePhoneButton}
              onPress={() => setStep('phone')}
              activeOpacity={0.7}
            >
              <Text style={styles.changePhoneText}>Change Mobile Number</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* ABHA Link Modal */}
      <Modal
        visible={showAbhaModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowAbhaModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Link ABHA Card</Text>
              <TouchableOpacity onPress={() => setShowAbhaModal(false)}>
                <Ionicons name="close" size={24} color={Theme.colors.neutralText} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              Enter your 14-digit ABHA Number (e.g. 14-8892-4102-9930) or ABHA Address (e.g. name@abdm).
            </Text>

            <TextInput
              style={styles.abhaModalInput}
              placeholder="e.g. 14-8892-4102-9930"
              value={abhaInput}
              onChangeText={setAbhaInput}
              placeholderTextColor="#95a5a6"
            />

            <TouchableOpacity
              style={[styles.primaryButton, { height: 50, marginTop: 16 }]}
              onPress={handleVerifyAbha}
              disabled={isAbhaLoading}
            >
              {isAbhaLoading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.primaryButtonText}>Verify with ABDM</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  scrollContent: {
    padding: 24,
    flexGrow: 1,
    justifyContent: 'center',
  },
  headerBox: {
    alignItems: 'center',
  },
  iconCircle: {
    backgroundColor: '#E8F0FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontWeight: '800',
    color: Theme.colors.neutralText,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    color: Theme.colors.neutralSecondaryText,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 320,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDEDEC',
    borderWidth: 1,
    borderColor: '#FADBD8',
    padding: 12,
    borderRadius: Theme.rounding.medium,
    marginBottom: 16,
  },
  errorText: {
    color: Theme.colors.danger,
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  formContainer: {
    width: '100%',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Theme.colors.neutralText,
    marginBottom: 8,
  },
  phoneInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countryCodeBox: {
    height: 52,
    paddingHorizontal: 14,
    backgroundColor: Theme.colors.surface,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    borderTopLeftRadius: Theme.rounding.medium,
    borderBottomLeftRadius: Theme.rounding.medium,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 0,
  },
  countryCodeText: {
    fontSize: 16,
    fontWeight: '600',
    color: Theme.colors.neutralText,
  },
  phoneInput: {
    flex: 1,
    height: 52,
    backgroundColor: Theme.colors.surface,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    borderTopRightRadius: Theme.rounding.medium,
    borderBottomRightRadius: Theme.rounding.medium,
    paddingHorizontal: 16,
    fontSize: 16,
    color: Theme.colors.neutralText,
  },
  otpInput: {
    height: 56,
    backgroundColor: Theme.colors.surface,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    borderRadius: Theme.rounding.medium,
    paddingHorizontal: 20,
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 12,
    textAlign: 'center',
    color: Theme.colors.neutralText,
  },
  primaryButton: {
    flexDirection: 'row',
    backgroundColor: Theme.colors.primary,
    borderRadius: Theme.rounding.large,
    justifyContent: 'center',
    alignItems: 'center',
    ...Theme.shadows.button,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  changePhoneButton: {
    marginTop: 16,
    alignItems: 'center',
    padding: 8,
  },
  changePhoneText: {
    color: Theme.colors.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  abhaCard: {
    marginTop: 28,
    backgroundColor: '#E6F9F0',
    borderWidth: 1,
    borderColor: '#B8F2D5',
    borderRadius: Theme.rounding.large,
    padding: 16,
  },
  abhaIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  abhaCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#065F46',
  },
  abhaCardSubtitle: {
    fontSize: 13,
    color: '#047857',
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.rounding.large,
    padding: 20,
    ...Theme.shadows.card,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Theme.colors.neutralText,
  },
  modalSubtitle: {
    fontSize: 14,
    color: Theme.colors.neutralSecondaryText,
    marginBottom: 16,
    lineHeight: 20,
  },
  abhaModalInput: {
    height: 50,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    borderRadius: Theme.rounding.medium,
    paddingHorizontal: 14,
    fontSize: 16,
    color: Theme.colors.neutralText,
    backgroundColor: Theme.colors.background,
  },
});
