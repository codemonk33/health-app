import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Alert, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useResponsive } from './utils/responsive';

export default function AppointmentsScreen() {
  const router = useRouter();
  const R = useResponsive();
  const { specialty: specialtyParam } = useLocalSearchParams<{ specialty?: string }>();
  const [fullName, setFullName] = useState('');
  const [specialty, setSpecialty] = useState(specialtyParam || 'General Physician');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');

  // Update specialty when route param changes
  useEffect(() => {
    if (specialtyParam) {
      setSpecialty(specialtyParam);
    }
  }, [specialtyParam]);

  const bookAppointment = () => {
    if (!fullName || !date || !time) {
      Alert.alert('Missing details', 'Please fill your name, date and time');
      return;
    }
    Alert.alert(
      'Appointment Requested',
      `Name: ${fullName}\nSpecialty: ${specialty}\nDate: ${date}\nTime: ${time}\nNotes: ${notes || 'N/A'}`,
    );
  };

  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f8f9fa',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: R.spacing(60),
      paddingBottom: R.spacing(20),
      paddingHorizontal: R.spacing(20),
      backgroundColor: '#ffffff',
      borderBottomWidth: 1,
      borderBottomColor: '#e9ecef',
    },
    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: R.spacing(20),
    },
    backText: {
      fontSize: R.font(18),
      color: '#2c3e50',
      marginLeft: R.spacing(8),
      lineHeight: R.font(28),
    },
    title: {
      fontSize: R.font(28),
      fontWeight: 'bold',
      color: '#2c3e50',
      lineHeight: Math.round(R.font(28) * 1.25),
    },
    content: {
      flex: 1,
      padding: R.spacing(20),
    },
    card: {
      backgroundColor: '#ffffff',
      borderRadius: R.size(16),
      padding: R.spacing(16),
      elevation: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
    },
    label: {
      fontSize: R.font(14),
      color: '#7f8c8d',
      marginTop: R.spacing(12),
      marginBottom: R.spacing(6),
      lineHeight: Math.round(R.font(14) * 1.35),
    },
    input: {
      borderWidth: 1,
      borderColor: '#e1e8ed',
      borderRadius: R.size(10),
      paddingHorizontal: R.spacing(12),
      paddingVertical: R.spacing(10),
      fontSize: R.font(16),
      color: '#2c3e50',
    },
    textarea: {
      minHeight: R.size(90),
      textAlignVertical: 'top',
    },
    row: {
      flexDirection: 'row',
      marginTop: R.spacing(8),
    },
    rowItem: { flex: 1 },
    primaryButton: {
      marginTop: R.spacing(16),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#3498db',
      paddingVertical: R.spacing(14),
      borderRadius: R.size(12),
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      gap: R.spacing(10),
    },
    primaryText: {
      color: '#ffffff',
      fontSize: R.font(18),
      fontWeight: '700',
    },
    noteBox: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: R.spacing(8),
      marginTop: R.spacing(16),
      padding: R.spacing(12),
      backgroundColor: '#ecf5ff',
      borderRadius: R.size(10),
    },
    noteText: {
      color: '#2c3e50',
      flex: 1,
    },
  }), [R]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#2c3e50" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Book a Doctor</Text>
      </View>

      {/* Form */}
      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Your full name"
            value={fullName}
            onChangeText={setFullName}
          />

          <Text style={styles.label}>Specialty</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Cardiologist, Dentist"
            value={specialty}
            onChangeText={setSpecialty}
          />

          <View style={styles.row}>
            <View style={[styles.rowItem, { marginRight: 8 }]}> 
              <Text style={styles.label}>Date</Text>
              <TextInput
                style={styles.input}
                placeholder={Platform.OS === 'ios' ? 'MM/DD/YYYY' : 'DD/MM/YYYY'}
                value={date}
                onChangeText={setDate}
              />
            </View>
            <View style={[styles.rowItem, { marginLeft: 8 }]}> 
              <Text style={styles.label}>Time</Text>
              <TextInput
                style={styles.input}
                placeholder="HH:MM"
                value={time}
                onChangeText={setTime}
              />
            </View>
          </View>

          <Text style={styles.label}>Notes (optional)</Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            placeholder="Describe symptoms or preferences"
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
          />

          <TouchableOpacity style={styles.primaryButton} onPress={bookAppointment} activeOpacity={0.9}>
            <Ionicons name="calendar" size={22} color="#ffffff" />
            <Text style={styles.primaryText}>Request Appointment</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.noteBox}>
          <Ionicons name="information-circle" size={20} color="#3498db" />
          <Text style={styles.noteText}>
            This is a demo UI. Provide your API key to enable real booking.
          </Text>
        </View>
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
    padding: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  label: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 12,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e1e8ed',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#2c3e50',
  },
  textarea: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    marginTop: 8,
  },
  rowItem: {
    flex: 1,
  },
  primaryButton: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3498db',
    paddingVertical: 14,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    gap: 10,
  },
  primaryText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  noteBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
    padding: 12,
    backgroundColor: '#ecf5ff',
    borderRadius: 10,
  },
  noteText: {
    color: '#2c3e50',
    flex: 1,
  },
});


