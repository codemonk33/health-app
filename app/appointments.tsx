import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Alert, ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Modal, Switch } from 'react-native';
import { Theme } from './utils/theme';
import Header from './components/Header';
import EmptyState from './components/EmptyState';
import BottomNavBar from './components/BottomNavBar';
import { teleconsultService, DoctorProfile, TeleconsultBooking } from './services/teleconsultService';
import { useAuth } from './context/AuthContext';

const SPECIALTIES = [
  'All Specialties',
  'Cardiologist',
  'General Physician',
  'Orthopedist',
  'Neurologist',
  'Dermatologist',
];

export default function AppointmentsScreen() {
  const router = useRouter();
  const { session } = useAuth();
  const { specialty: specialtyParam } = useLocalSearchParams<{ specialty?: string }>();

  const [activeTab, setActiveTab] = useState<'doctors' | 'history'>('doctors');
  const [doctors] = useState<DoctorProfile[]>(() => teleconsultService.getDoctors());
  const [selectedSpecialty, setSelectedSpecialty] = useState(specialtyParam || 'All Specialties');
  const [selectedMode, setSelectedMode] = useState<'Video' | 'In-clinic' | 'Audio'>('Video');
  const [bookings, setBookings] = useState<TeleconsultBooking[]>([]);

  // Booking Modal State
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorProfile | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string>('04:30 PM');
  const [patientName, setPatientName] = useState(session?.name || 'Ramesh Sharma');
  const [relationship, setRelationship] = useState<TeleconsultBooking['relationship']>('Self');
  const [symptomsNotes, setSymptomsNotes] = useState('Follow-up on blood pressure regulation and morning dizziness');
  const [shareRecords, setShareRecords] = useState(true);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    teleconsultService.getBookings().then(bks => setBookings(bks));
  }, []);

  useEffect(() => {
    if (specialtyParam && SPECIALTIES.includes(specialtyParam)) {
      setSelectedSpecialty(specialtyParam);
    }
  }, [specialtyParam]);

  const filteredDoctors = useMemo(() => {
    return doctors.filter(doc => {
      const matchSpec = selectedSpecialty === 'All Specialties' || doc.specialty.toLowerCase().includes(selectedSpecialty.toLowerCase());
      const matchMode = doc.availableModes.includes(selectedMode);
      return matchSpec && matchMode;
    });
  }, [doctors, selectedSpecialty, selectedMode]);

  const handleOpenBooking = (doc: DoctorProfile) => {
    setSelectedDoctor(doc);
    setSelectedSlot(doc.availableSlots[0] || '04:30 PM');
  };

  const handleConfirmBooking = async () => {
    if (!selectedDoctor || !patientName) {
      Alert.alert('Missing Info', 'Please enter patient name and choose a slot.');
      return;
    }

    setIsBooking(true);
    const newBooking = await teleconsultService.createBooking({
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      doctorSpecialty: selectedDoctor.specialty,
      patientName,
      patientAge: 68,
      patientGender: 'male',
      relationship,
      consultationType: selectedMode,
      date: new Date().toISOString().split('T')[0],
      timeSlot: selectedSlot,
      symptomsNotes,
      shareRecordsWithDoctor: shareRecords,
    });

    setIsBooking(false);
    setSelectedDoctor(null);
    setBookings(prev => [newBooking, ...prev]);

    Alert.alert(
      'Consultation Confirmed',
      `Booked with ${newBooking.doctorName} for ${newBooking.timeSlot}.\nWould you like to enter the pre-call waiting room now?`,
      [
        { text: 'View Appointments', onPress: () => setActiveTab('history') },
        { text: 'Enter Waiting Room', style: 'default', onPress: () => router.push(`/waiting-room?id=${newBooking.id}` as any) }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title="Doctor Consultation"
        subtitle="Verified Geriatric & Specialist Care"
        rightAction={{
          icon: 'calendar',
          onPress: () => setActiveTab('history'),
          color: Theme.colors.purple,
        }}
      />

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'doctors' && styles.tabButtonActive]}
          onPress={() => setActiveTab('doctors')}
        >
          <Text style={[styles.tabText, activeTab === 'doctors' && styles.tabTextActive]}>
            Find Doctors ({filteredDoctors.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'history' && styles.tabButtonActive]}
          onPress={() => setActiveTab('history')}
        >
          <Text style={[styles.tabText, activeTab === 'history' && styles.tabTextActive]}>
            My Consultations ({bookings.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {activeTab === 'doctors' && (
          <View>
            {/* Consultation Mode Selector */}
            <View style={styles.modeSelector}>
              {(['Video', 'In-clinic', 'Audio'] as const).map(m => (
                <TouchableOpacity
                  key={m}
                  style={[styles.modeButton, selectedMode === m && styles.modeButtonActive]}
                  onPress={() => setSelectedMode(m)}
                >
                  <Ionicons
                    name={m === 'Video' ? 'videocam' : m === 'In-clinic' ? 'business' : 'call'}
                    size={16}
                    color={selectedMode === m ? '#ffffff' : Theme.colors.neutralSecondaryText}
                    style={{ marginRight: 6 }}
                  />
                  <Text style={[styles.modeButtonText, selectedMode === m && styles.modeButtonTextActive]}>
                    {m} Call
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Specialty Pills */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.specialtyScroll}>
              {SPECIALTIES.map(spec => (
                <TouchableOpacity
                  key={spec}
                  style={[styles.specPill, selectedSpecialty === spec && styles.specPillActive]}
                  onPress={() => setSelectedSpecialty(spec)}
                >
                  <Text style={[styles.specPillText, selectedSpecialty === spec && styles.specPillTextActive]}>
                    {spec}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Doctor Cards */}
            {filteredDoctors.map(doc => (
              <View key={doc.id} style={styles.doctorCard}>
                <View style={styles.docHeader}>
                  <View style={styles.docAvatar}>
                    <Ionicons name="person" size={28} color={Theme.colors.primary} />
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Text style={styles.docName}>{doc.name}</Text>
                      <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                    </View>
                    <Text style={styles.docSpecialty}>{doc.specialty}</Text>
                    <Text style={styles.docQual}>{doc.qualification}</Text>
                  </View>
                </View>

                <Text style={styles.docBio} numberOfLines={2}>{doc.bio}</Text>

                <View style={styles.docMetaRow}>
                  <View style={styles.metaBadge}>
                    <Ionicons name="star" size={14} color="#f39c12" />
                    <Text style={styles.metaBadgeText}>{doc.rating} ({doc.reviewCount})</Text>
                  </View>
                  <View style={styles.metaBadge}>
                    <Ionicons name="briefcase-outline" size={14} color={Theme.colors.neutralSecondaryText} />
                    <Text style={styles.metaBadgeText}>{doc.experienceYears} yrs exp</Text>
                  </View>
                  <View style={styles.metaBadge}>
                    <Ionicons name="language-outline" size={14} color={Theme.colors.neutralSecondaryText} />
                    <Text style={styles.metaBadgeText}>{doc.languages.slice(0, 2).join(', ')}</Text>
                  </View>
                </View>

                <View style={styles.docFooter}>
                  <View>
                    <Text style={styles.feeText}>₹{doc.fee}</Text>
                    <Text style={styles.nextSlotText}>⚡ {doc.nextAvailableSlot}</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.consultBtn}
                    onPress={() => handleOpenBooking(doc)}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.consultBtnText}>Book Consultation</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Appointments History Tab */}
        {activeTab === 'history' && (
          <View>
            {bookings.length === 0 ? (
              <EmptyState
                icon="calendar-outline"
                title="No Upcoming Consultations"
                description="Book a teleconsultation with top geriatricians and cardiologists."
                actionText="Find Doctors"
                onActionPress={() => setActiveTab('doctors')}
              />
            ) : (
              bookings.map(bk => (
                <View key={bk.id} style={styles.bookingCard}>
                  <View style={styles.bookingHeader}>
                    <View>
                      <Text style={styles.bookingId}>Appointment #{bk.id}</Text>
                      <Text style={styles.bookingTime}>{bk.date} • {bk.timeSlot} ({bk.consultationType})</Text>
                    </View>
                    <View style={styles.statusBadge}>
                      <Text style={styles.statusBadgeText}>{bk.status.toUpperCase()}</Text>
                    </View>
                  </View>

                  <Text style={styles.bookingDoctorName}>{bk.doctorName}</Text>
                  <Text style={styles.bookingSpec}>{bk.doctorSpecialty} • Patient: {bk.patientName} ({bk.relationship})</Text>

                  {bk.symptomsNotes && (
                    <Text style={styles.bookingNotes}>📝 Notes: {bk.symptomsNotes}</Text>
                  )}

                  {/* Join Waiting Room Action */}
                  <TouchableOpacity
                    style={styles.waitingRoomBtn}
                    onPress={() => router.push(`/waiting-room?id=${bk.id}` as any)}
                    activeOpacity={0.85}
                  >
                    <Ionicons name="videocam" size={18} color="#ffffff" />
                    <Text style={styles.waitingRoomBtnText}>Enter Video Waiting Room</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>
        )}
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <BottomNavBar activeTab="appointments" />

      {/* Booking Modal */}
      <Modal
        visible={!!selectedDoctor}
        animationType="slide"
        transparent
        onRequestClose={() => setSelectedDoctor(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Book Video Consultation</Text>
              <TouchableOpacity onPress={() => setSelectedDoctor(null)}>
                <Ionicons name="close" size={24} color={Theme.colors.neutralText} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalDocName}>{selectedDoctor?.name}</Text>
              <Text style={styles.modalDocSpec}>{selectedDoctor?.specialty} • Fee: ₹{selectedDoctor?.fee}</Text>

              {/* Time Slots */}
              <Text style={styles.inputLabel}>Available Slots Today</Text>
              <View style={styles.slotsRow}>
                {(selectedDoctor?.availableSlots || ['04:30 PM', '05:00 PM']).map(slot => (
                  <TouchableOpacity
                    key={slot}
                    style={[styles.slotPill, selectedSlot === slot && styles.slotPillActive]}
                    onPress={() => setSelectedSlot(slot)}
                  >
                    <Text style={[styles.slotPillText, selectedSlot === slot && styles.slotPillTextActive]}>
                      {slot}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Patient Selection */}
              <Text style={styles.inputLabel}>Patient Name</Text>
              <TextInput style={styles.modalInput} value={patientName} onChangeText={setPatientName} />

              <Text style={styles.inputLabel}>Relationship</Text>
              <View style={styles.slotsRow}>
                {(['Self', 'Father', 'Mother', 'Spouse'] as const).map(rel => (
                  <TouchableOpacity
                    key={rel}
                    style={[styles.slotPill, relationship === rel && styles.slotPillActive]}
                    onPress={() => setRelationship(rel)}
                  >
                    <Text style={[styles.slotPillText, relationship === rel && styles.slotPillTextActive]}>
                      {rel}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.inputLabel}>Symptoms & Reason for Visit</Text>
              <TextInput
                style={[styles.modalInput, { height: 60 }]}
                value={symptomsNotes}
                onChangeText={setSymptomsNotes}
                multiline
              />

              {/* Share Health Records Switch */}
              <View style={styles.shareRecordsRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.shareRecordsTitle}>Share Health Records & ABHA History</Text>
                  <Text style={styles.shareRecordsSubtitle}>Enables doctor to view recent lab reports & vitals</Text>
                </View>
                <Switch value={shareRecords} onValueChange={setShareRecords} />
              </View>

              <TouchableOpacity
                style={styles.confirmBookingBtn}
                onPress={handleConfirmBooking}
                disabled={isBooking}
              >
                {isBooking ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text style={styles.confirmBookingBtnText}>Confirm Consultation (₹{selectedDoctor?.fee})</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: Theme.colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabButtonActive: {
    backgroundColor: '#EEF2FF',
  },
  tabText: {
    fontWeight: '600',
    color: Theme.colors.neutralSecondaryText,
    fontFamily: Theme.typography.fontFamily.bodyMedium,
    fontSize: 13,
  },
  tabTextActive: {
    color: Theme.colors.primary,
    fontWeight: '700',
    fontFamily: Theme.typography.fontFamily.bodyBold,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  modeSelector: {
    flexDirection: 'row',
    backgroundColor: Theme.colors.surface,
    padding: 4,
    borderRadius: Theme.rounding.medium,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  modeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 6,
  },
  modeButtonActive: {
    backgroundColor: Theme.colors.primary,
  },
  modeButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: Theme.colors.neutralSecondaryText,
    fontFamily: Theme.typography.fontFamily.bodyMedium,
  },
  modeButtonTextActive: {
    color: '#ffffff',
    fontFamily: Theme.typography.fontFamily.bodyBold,
  },
  specialtyScroll: {
    gap: 8,
    marginBottom: 16,
  },
  specPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: Theme.colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  specPillActive: {
    backgroundColor: Theme.colors.primary,
    borderColor: Theme.colors.primary,
  },
  specPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: Theme.colors.neutralSecondaryText,
    fontFamily: Theme.typography.fontFamily.bodyMedium,
  },
  specPillTextActive: {
    color: '#ffffff',
    fontFamily: Theme.typography.fontFamily.bodyBold,
  },
  doctorCard: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.rounding.large,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    ...Theme.shadows.card,
  },
  docHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  docAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  docName: {
    fontSize: 16,
    fontWeight: '700',
    color: Theme.colors.neutralText,
    fontFamily: Theme.typography.fontFamily.bodyBold,
  },
  docSpecialty: {
    fontSize: 13,
    color: Theme.colors.primary,
    fontWeight: '600',
    fontFamily: Theme.typography.fontFamily.bodySemiBold,
  },
  docQual: {
    fontSize: 11,
    color: Theme.colors.neutralSecondaryText,
    fontFamily: Theme.typography.fontFamily.body,
  },
  docBio: {
    fontSize: 12,
    color: Theme.colors.neutralSecondaryText,
    fontFamily: Theme.typography.fontFamily.body,
    lineHeight: 18,
    marginBottom: 10,
  },
  docMetaRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    gap: 4,
  },
  metaBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: Theme.colors.neutralText,
    fontFamily: Theme.typography.fontFamily.bodyMedium,
  },
  docFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.border,
  },
  feeText: {
    fontSize: 18,
    fontWeight: '800',
    color: Theme.colors.neutralText,
    fontFamily: Theme.typography.fontFamily.bodyBold,
  },
  nextSlotText: {
    fontSize: 11,
    color: '#10b981',
    fontWeight: '600',
    fontFamily: Theme.typography.fontFamily.bodyMedium,
  },
  consultBtn: {
    backgroundColor: Theme.colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: Theme.rounding.medium,
    ...Theme.shadows.button,
  },
  consultBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 13,
    fontFamily: Theme.typography.fontFamily.bodyBold,
  },
  bookingCard: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.rounding.large,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    ...Theme.shadows.card,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bookingId: {
    fontSize: 15,
    fontWeight: '700',
    color: Theme.colors.neutralText,
  },
  bookingTime: {
    fontSize: 12,
    color: Theme.colors.neutralSecondaryText,
    marginTop: 2,
  },
  statusBadge: {
    backgroundColor: '#E8F8F5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  statusBadgeText: {
    color: '#10b981',
    fontSize: 10,
    fontWeight: '700',
  },
  bookingDoctorName: {
    fontSize: 16,
    fontWeight: '700',
    color: Theme.colors.neutralText,
  },
  bookingSpec: {
    fontSize: 13,
    color: Theme.colors.neutralSecondaryText,
    marginBottom: 8,
  },
  bookingNotes: {
    fontSize: 12,
    color: Theme.colors.neutralText,
    marginBottom: 12,
    backgroundColor: '#F8F9FA',
    padding: 8,
    borderRadius: 6,
  },
  waitingRoomBtn: {
    flexDirection: 'row',
    backgroundColor: Theme.colors.purple,
    paddingVertical: 12,
    borderRadius: Theme.rounding.medium,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  waitingRoomBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Theme.colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '90%',
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
  modalDocName: {
    fontSize: 16,
    fontWeight: '700',
    color: Theme.colors.primary,
  },
  modalDocSpec: {
    fontSize: 13,
    color: Theme.colors.neutralSecondaryText,
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Theme.colors.neutralText,
    marginBottom: 6,
  },
  slotsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  slotPill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  slotPillActive: {
    backgroundColor: Theme.colors.primary,
    borderColor: Theme.colors.primary,
  },
  slotPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: Theme.colors.neutralText,
  },
  slotPillTextActive: {
    color: '#ffffff',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: Theme.colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    marginBottom: 10,
  },
  shareRecordsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    backgroundColor: '#E6F9F0',
    padding: 10,
    borderRadius: 8,
  },
  shareRecordsTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#065F46',
  },
  shareRecordsSubtitle: {
    fontSize: 11,
    color: '#047857',
  },
  confirmBookingBtn: {
    backgroundColor: Theme.colors.primary,
    height: 52,
    borderRadius: Theme.rounding.large,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  confirmBookingBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
});
