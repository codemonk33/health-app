import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
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
  const [mode, setMode] = useState<'In-clinic' | 'Video'>('In-clinic');
  const [location, setLocation] = useState('Bengaluru');
  const [sortBy, setSortBy] = useState<'Relevance' | 'Experience' | 'Fees' | 'Rating'>('Relevance');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const doctors = [
    {
      id: 'd1',
      name: 'Dr. Aisha Verma',
      specialty: 'General Physician',
      experienceYears: 12,
      rating: 4.8,
      fee: 500,
      clinic: 'HealWell Clinic • 2.1 km',
      slots: ['09:00', '11:30', '14:00', '17:30'],
      modeAvailable: ['In-clinic', 'Video'] as const,
    },
    {
      id: 'd2',
      name: 'Dr. Rohan Kapoor',
      specialty: 'Cardiologist',
      experienceYears: 18,
      rating: 4.9,
      fee: 900,
      clinic: 'City Heart Center • 4.5 km',
      slots: ['10:15', '12:00', '16:00'],
      modeAvailable: ['In-clinic'] as const,
    },
    {
      id: 'd3',
      name: 'Dr. Neha Sharma',
      specialty: 'Dermatologist',
      experienceYears: 9,
      rating: 4.6,
      fee: 650,
      clinic: 'SkinCare Hub • 1.2 km',
      slots: ['09:45', '13:30', '15:00', '18:15'],
      modeAvailable: ['Video'] as const,
    },
  ].filter(d =>
    (specialty ? d.specialty.includes(specialty) : true) &&
    (mode ? (d.modeAvailable as readonly string[]).includes(mode) : true)
  );

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
      marginTop: R.spacing(12),
    },
    label: {
      fontSize: R.font(14),
      color: '#7f8c8d',
      marginTop: R.spacing(12),
      marginBottom: R.spacing(6),
      lineHeight: Math.round(R.font(14) * 1.35),
      fontWeight: '600',
    },
    input: {
      borderWidth: 1,
      borderColor: '#e1e8ed',
      borderRadius: R.size(10),
      paddingHorizontal: R.spacing(12),
      paddingVertical: R.spacing(10),
      fontSize: R.font(16),
      color: '#2c3e50',
      backgroundColor: '#ffffff',
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
    // interactive additions
    chipsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: R.spacing(8),
    },
    chip: {
      borderWidth: 1,
      borderColor: '#e1e8ed',
      paddingVertical: R.spacing(6),
      paddingHorizontal: R.spacing(10),
      borderRadius: R.size(16),
      backgroundColor: '#ffffff',
      marginRight: R.spacing(8),
      marginBottom: R.spacing(8),
    },
    chipSelected: {
      backgroundColor: '#eaf4ff',
      borderColor: '#cfe6ff',
    },
    chipText: { color: '#2c3e50' },
    chipSelectedText: { color: '#1f6fde', fontWeight: '700' },
    quickRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: R.spacing(8),
    },
    quickBtn: {
      borderWidth: 1,
      borderColor: '#e1e8ed',
      paddingVertical: R.spacing(6),
      paddingHorizontal: R.spacing(10),
      borderRadius: R.size(12),
      backgroundColor: '#ffffff',
      marginRight: R.spacing(8),
      marginBottom: R.spacing(8),
    },
    quickText: { color: '#2c3e50', fontSize: R.font(13) },
    // practo-like filters and list
    filterCard: {
      backgroundColor: '#ffffff',
      borderRadius: R.size(16),
      padding: R.spacing(12),
      marginTop: R.spacing(12),
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
      borderTopWidth: 3,
      borderTopColor: '#3498db',
    },
    toggleRow: {
      flexDirection: 'row',
      marginBottom: R.spacing(10),
    },
    toggleBtn: {
      paddingVertical: R.spacing(8),
      paddingHorizontal: R.spacing(12),
      borderRadius: R.size(12),
      borderWidth: 1,
      borderColor: '#e1e8ed',
      backgroundColor: '#ffffff',
      marginRight: R.spacing(8),
    },
    toggleBtnActive: {
      backgroundColor: '#eaf4ff',
      borderColor: '#cfe6ff',
    },
    locationRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: R.spacing(10),
    },
    locationInput: {
      flex: 1,
      borderWidth: 1,
      borderColor: '#e1e8ed',
      borderRadius: R.size(10),
      paddingHorizontal: R.spacing(12),
      paddingVertical: R.spacing(10),
      fontSize: R.font(16),
      color: '#2c3e50',
      backgroundColor: '#ffffff',
    },
    sortRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    sortChip: {
      borderWidth: 1,
      borderColor: '#e1e8ed',
      paddingVertical: R.spacing(6),
      paddingHorizontal: R.spacing(10),
      borderRadius: R.size(16),
      backgroundColor: '#ffffff',
      marginRight: R.spacing(8),
      marginBottom: R.spacing(8),
    },
    sortChipActive: {
      backgroundColor: '#f0fff4',
      borderColor: '#cde9d6',
    },
    list: { marginTop: R.spacing(12) },
    doctorCard: {
      backgroundColor: '#ffffff',
      borderRadius: R.size(16),
      padding: R.spacing(12),
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
      marginBottom: R.spacing(12),
      borderLeftWidth: 4,
      borderLeftColor: '#3498db',
    },
    doctorHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    doctorName: { fontSize: R.font(18), fontWeight: '700', color: '#2c3e50', marginBottom: R.spacing(4) },
    doctorMeta: { color: '#7f8c8d', marginTop: R.spacing(4), fontSize: R.font(13) },
    badgeRow: { flexDirection: 'row', marginTop: R.spacing(8) },
    ratingBadge: { backgroundColor: '#eafaf1', paddingVertical: R.spacing(4), paddingHorizontal: R.spacing(8), borderRadius: R.size(10), marginRight: R.spacing(8) },
    feeBadge: { backgroundColor: '#eef2ff', paddingVertical: R.spacing(4), paddingHorizontal: R.spacing(8), borderRadius: R.size(10) },
    slotRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: R.spacing(10) },
    slotChip: {
      borderWidth: 1,
      borderColor: '#e1e8ed',
      paddingVertical: R.spacing(8),
      paddingHorizontal: R.spacing(12),
      borderRadius: R.size(12),
      backgroundColor: '#ffffff',
      marginRight: R.spacing(8),
      marginBottom: R.spacing(8),
      minWidth: R.size(70),
      alignItems: 'center',
    },
    slotChipSelected: {
      backgroundColor: '#eaf4ff',
      borderColor: '#cfe6ff',
      borderWidth: 2,
    },
    doctorFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: R.spacing(12) },
    bookBtn: {
      backgroundColor: '#3498db',
      paddingVertical: R.spacing(10),
      paddingHorizontal: R.spacing(14),
      borderRadius: R.size(12),
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.15,
      shadowRadius: 2,
    },
    bookText: { color: '#ffffff', fontWeight: '700' },
    confirmBar: {
      marginTop: R.spacing(12),
      padding: R.spacing(12),
      backgroundColor: '#ffffff',
      borderRadius: R.size(12),
      borderWidth: 1,
      borderColor: '#e1e8ed',
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    confirmPrimary: { marginTop: R.spacing(10), backgroundColor: '#2ecc71', paddingVertical: R.spacing(12), borderRadius: R.size(12), alignItems: 'center' },
    confirmPrimaryText: { color: '#ffffff', fontWeight: '700' },
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

      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: R.spacing(8), marginTop: R.spacing(4) }}>
          <Ionicons name="filter" size={20} color="#3498db" />
          <Text style={{ fontSize: R.font(16), fontWeight: '700', color: '#2c3e50', marginLeft: R.spacing(8) }}>Filters & Search</Text>
        </View>
        <View style={styles.filterCard}>
          <View style={styles.toggleRow}>
            {(['In-clinic', 'Video'] as const).map(m => (
              <TouchableOpacity key={m} onPress={() => setMode(m)} style={[styles.toggleBtn, mode === m ? styles.toggleBtnActive : null]} activeOpacity={0.8}>
                <Text style={{ color: mode === m ? '#1f6fde' : '#2c3e50', fontWeight: '700' }}>{m}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.locationRow}>
            <Ionicons name="location" size={18} color="#7f8c8d" />
            <TextInput
              style={styles.locationInput}
              placeholder="Search location"
              value={location}
              onChangeText={setLocation}
            />
            <TouchableOpacity activeOpacity={0.8} onPress={() => setLocation('Current Location')} style={[styles.toggleBtn, { paddingVertical: R.spacing(8) }]}>
              <Ionicons name="navigate" size={18} color="#1f6fde" />
            </TouchableOpacity>
          </View>
          <View style={styles.sortRow}>
            {(['Relevance','Experience','Fees','Rating'] as const).map(s => (
              <TouchableOpacity key={s} onPress={() => setSortBy(s)} style={[styles.sortChip, sortBy === s ? styles.sortChipActive : null]} activeOpacity={0.8}>
                <Text style={{ color: sortBy === s ? '#27ae60' : '#2c3e50' }}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Doctor List */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: R.spacing(16), marginBottom: R.spacing(8) }}>
          <Ionicons name="medical" size={20} color="#3498db" />
          <Text style={{ fontSize: R.font(16), fontWeight: '700', color: '#2c3e50', marginLeft: R.spacing(8) }}>Available Doctors</Text>
        </View>
        <View style={styles.list}>
          {doctors.map(d => (
            <View key={d.id} style={styles.doctorCard}>
              <View style={styles.doctorHeader}>
                <Text style={styles.doctorName}>{d.name}</Text>
                <Text style={{ color: '#7f8c8d' }}>{d.experienceYears} yrs</Text>
              </View>
              <Text style={styles.doctorMeta}>{d.specialty}</Text>
              <Text style={styles.doctorMeta}>{d.clinic}</Text>
              <View style={styles.badgeRow}>
                <View style={styles.ratingBadge}><Text>⭐ {d.rating.toFixed(1)}</Text></View>
                <View style={styles.feeBadge}><Text>₹ {d.fee}</Text></View>
              </View>
              <View style={styles.slotRow}>
                {d.slots.map(s => (
                  <TouchableOpacity key={s} onPress={() => { setSelectedDoctorId(d.id); setSelectedSlot(s); setTime(s); setSpecialty(d.specialty); }} style={[styles.slotChip, selectedDoctorId === d.id && selectedSlot === s ? styles.slotChipSelected : null]} activeOpacity={0.8}>
                    <Text style={{ color: selectedDoctorId === d.id && selectedSlot === s ? '#1f6fde' : '#2c3e50' }}>{s}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.doctorFooter}>
                <Text style={{ color: '#7f8c8d' }}>Today</Text>
                <TouchableOpacity onPress={() => { setSelectedDoctorId(d.id); if (!selectedSlot) setSelectedSlot(d.slots[0]); setTime(selectedSlot || d.slots[0]); setSpecialty(d.specialty); }} style={styles.bookBtn} activeOpacity={0.9}>
                  <Text style={styles.bookText}>Book</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {selectedDoctorId && selectedSlot ? (
          <View style={styles.confirmBar}>
            <Text style={{ fontWeight: '700', color: '#2c3e50' }}>Confirm Booking</Text>
            <Text style={{ color: '#7f8c8d', marginTop: R.spacing(4) }}>
              {doctors.find(d => d.id === selectedDoctorId)?.name} • {specialty} • {selectedSlot}
            </Text>
            <TouchableOpacity
              style={styles.confirmPrimary}
              onPress={() => {
                setDate(date || 'Today');
                bookAppointment();
              }}
              activeOpacity={0.9}
            >
              <Text style={styles.confirmPrimaryText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {/* Form */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: R.spacing(16), marginBottom: R.spacing(8) }}>
          <Ionicons name="person-add" size={20} color="#3498db" />
          <Text style={{ fontSize: R.font(16), fontWeight: '700', color: '#2c3e50', marginLeft: R.spacing(8) }}>Patient Details</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Your full name"
            value={fullName}
            onChangeText={setFullName}
          />

          <Text style={styles.label}>Specialty</Text>
          <View style={styles.chipsRow}>
            {['General Physician','Cardiologist','Dentist','Dermatologist','Orthopedist'].map((s) => (
              <TouchableOpacity
                key={s}
                onPress={() => setSpecialty(s)}
                style={[styles.chip, specialty === s ? styles.chipSelected : null]}
                activeOpacity={0.8}
              >
                <Text style={specialty === s ? styles.chipSelectedText : styles.chipText}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.row}>
            <View style={[styles.rowItem, { marginRight: 8 }]}> 
              <Text style={styles.label}>Date</Text>
              <TextInput
                style={styles.input}
                placeholder={Platform.OS === 'ios' ? 'MM/DD/YYYY' : 'DD/MM/YYYY'}
                value={date}
                onChangeText={setDate}
              />
              <View style={styles.quickRow}>
                {['Today','Tomorrow','In 2 days'].map((d) => (
                  <TouchableOpacity key={d} onPress={() => setDate(d)} style={styles.quickBtn} activeOpacity={0.8}>
                    <Text style={styles.quickText}>{d}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={[styles.rowItem, { marginLeft: 8 }]}> 
              <Text style={styles.label}>Time</Text>
              <TextInput
                style={styles.input}
                placeholder="HH:MM"
                value={time}
                onChangeText={setTime}
              />
              <View style={styles.quickRow}>
                {['09:00','11:00','14:30','17:00'].map((t) => (
                  <TouchableOpacity key={t} onPress={() => setTime(t)} style={styles.quickBtn} activeOpacity={0.8}>
                    <Text style={styles.quickText}>{t}</Text>
                  </TouchableOpacity>
                ))}
              </View>
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


