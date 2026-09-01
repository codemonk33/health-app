import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Theme } from './utils/theme';
import Header from './components/Header';
import { teleconsultService, TeleconsultBooking } from './services/teleconsultService';

export default function WaitingRoomScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();

  const [booking, setBooking] = useState<TeleconsultBooking | null>(null);
  const [queuePosition] = useState(1);
  const [countdownSeconds, setCountdownSeconds] = useState(180); // 3 mins
  const [cameraChecked, setCameraChecked] = useState(true);
  const [micChecked, setMicChecked] = useState(true);
  const [vitalsReady, setVitalsReady] = useState(true);

  useEffect(() => {
    if (id) {
      teleconsultService.joinWaitingRoom(id).then(res => {
        if (res) setBooking(res);
      });
    } else {
      teleconsultService.getBookings().then(bks => {
        if (bks.length > 0) setBooking(bks[0]);
      });
    }
  }, [id]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdownSeconds(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleStartSimulatedCall = () => {
    Alert.alert(
      'Doctor Connected',
      `Dr. Aisha Verma is ready to begin your teleconsultation.\n(Video infrastructure ready for WebRTC integration in production).`,
      [
        { text: 'Complete Visit', onPress: () => router.replace('/appointments') }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title="Teleconsult Waiting Room"
        subtitle="Pre-consultation queue & check"
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Live Queue Banner */}
        <View style={styles.queueCard}>
          <View style={styles.queueIconBox}>
            <Ionicons name="videocam" size={28} color="#ffffff" />
          </View>
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={styles.queuePositionTitle}>You are #{queuePosition} in Queue</Text>
            <Text style={styles.queueDesc}>
              {countdownSeconds > 0
                ? `Dr. Aisha Verma is reviewing your ABHA health history. Estimated wait: ${formatTime(countdownSeconds)}`
                : 'Doctor is ready! Tap below to join.'}
            </Text>
          </View>
        </View>

        {/* Doctor Info */}
        <View style={styles.doctorInfoCard}>
          <View style={styles.docRow}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={32} color={Theme.colors.primary} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.docName}>{booking?.doctorName || 'Dr. Aisha Verma'}</Text>
              <Text style={styles.docSpec}>{booking?.doctorSpecialty || 'Cardiologist'}</Text>
              <Text style={styles.docHospital}>City Heart & Vascular Institute</Text>
            </View>
          </View>
        </View>

        {/* Pre-Call Readiness Checklist */}
        <View style={styles.checklistCard}>
          <Text style={styles.checklistTitle}>Pre-Call Senior Checklist</Text>

          <TouchableOpacity
            style={styles.checkItem}
            onPress={() => setCameraChecked(!cameraChecked)}
            activeOpacity={0.8}
          >
            <Ionicons
              name={cameraChecked ? 'checkmark-circle' : 'ellipse-outline'}
              size={22}
              color={cameraChecked ? '#10b981' : Theme.colors.neutralSecondaryText}
            />
            <Text style={styles.checkText}>Camera & Lighting Checked</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.checkItem}
            onPress={() => setMicChecked(!micChecked)}
            activeOpacity={0.8}
          >
            <Ionicons
              name={micChecked ? 'checkmark-circle' : 'ellipse-outline'}
              size={22}
              color={micChecked ? '#10b981' : Theme.colors.neutralSecondaryText}
            />
            <Text style={styles.checkText}>Microphone & Speaker Tested</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.checkItem}
            onPress={() => setVitalsReady(!vitalsReady)}
            activeOpacity={0.8}
          >
            <Ionicons
              name={vitalsReady ? 'checkmark-circle' : 'ellipse-outline'}
              size={22}
              color={vitalsReady ? '#10b981' : Theme.colors.neutralSecondaryText}
            />
            <Text style={styles.checkText}>Latest Blood Pressure & Sugar Logs Ready</Text>
          </TouchableOpacity>
        </View>

        {/* Call Connect Button */}
        <TouchableOpacity
          style={[styles.joinCallBtn, countdownSeconds > 0 && styles.joinCallBtnWaiting]}
          onPress={handleStartSimulatedCall}
          activeOpacity={0.85}
        >
          {countdownSeconds > 0 ? (
            <>
              <ActivityIndicator color="#ffffff" style={{ marginRight: 8 }} />
              <Text style={styles.joinCallBtnText}>Doctor Joining ({formatTime(countdownSeconds)})...</Text>
            </>
          ) : (
            <>
              <Ionicons name="videocam" size={20} color="#ffffff" style={{ marginRight: 8 }} />
              <Text style={styles.joinCallBtnText}>Join Video Consultation Now</Text>
            </>
          )}
        </TouchableOpacity>

        <Text style={styles.disclaimerText}>
          Your medical records are shared end-to-end securely with the doctor according to Ayushman Bharat Digital Mission guidelines.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  content: {
    padding: 18,
    paddingBottom: 40,
  },
  queueCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF5FF',
    borderWidth: 1,
    borderColor: '#E9D5FF',
    borderRadius: Theme.rounding.large,
    padding: 16,
    marginBottom: 16,
  },
  queueIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#8e44ad',
    justifyContent: 'center',
    alignItems: 'center',
  },
  queuePositionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#6B21A8',
  },
  queueDesc: {
    fontSize: 13,
    color: '#7E22CE',
    lineHeight: 18,
    marginTop: 2,
  },
  doctorInfoCard: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.rounding.large,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    ...Theme.shadows.card,
  },
  docRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E8F0FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  docName: {
    fontSize: 17,
    fontWeight: '700',
    color: Theme.colors.neutralText,
  },
  docSpec: {
    fontSize: 14,
    fontWeight: '600',
    color: Theme.colors.primary,
    marginTop: 2,
  },
  docHospital: {
    fontSize: 12,
    color: Theme.colors.neutralSecondaryText,
    marginTop: 2,
  },
  checklistCard: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.rounding.large,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  checklistTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Theme.colors.neutralText,
    marginBottom: 12,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F5',
  },
  checkText: {
    fontSize: 14,
    fontWeight: '500',
    color: Theme.colors.neutralText,
  },
  joinCallBtn: {
    flexDirection: 'row',
    height: 54,
    borderRadius: Theme.rounding.large,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    ...Theme.shadows.button,
  },
  joinCallBtnWaiting: {
    backgroundColor: '#8e44ad',
  },
  joinCallBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  disclaimerText: {
    fontSize: 12,
    color: Theme.colors.neutralSecondaryText,
    textAlign: 'center',
    lineHeight: 18,
  },
});
