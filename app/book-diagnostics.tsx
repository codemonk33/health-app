import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState, useEffect } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Modal, Switch } from 'react-native';
import { checkPincodeServiceability } from './utils/medpay-api';
import { fetchCurrentLocation } from './utils/location';
import { Theme } from './utils/theme';
import Header from './components/Header';
import TrackingStepper, { StepItem } from './components/TrackingStepper';
import EmptyState from './components/EmptyState';
import BottomNavBar from './components/BottomNavBar';
import { diagnosticsService, DiagnosticPackage, LabBooking, SampleTrackingStep } from './services/diagnosticsService';
import { useAuth } from './context/AuthContext';

const SAMPLE_TRACKING_STEPS: StepItem[] = [
  { id: 'confirmed', title: 'Booking Confirmed', subtitle: 'Lab order generated & slot reserved' },
  { id: 'phlebotomist_assigned', title: 'Phlebotomist Assigned', subtitle: 'Certified medical technician assigned' },
  { id: 'sample_collected', title: 'Sample Collected', subtitle: 'Blood / urine sample collected at home' },
  { id: 'processing', title: 'Lab Processing', subtitle: 'NABL certified laboratory analysis in progress' },
  { id: 'report_ready', title: 'Report Ready', subtitle: 'Digital report synced with ABHA & AI summary generated' },
];

export default function BookDiagnosticsScreen() {
  const { session } = useAuth();

  const [activeTab, setActiveTab] = useState<'packages' | 'bookings'>('packages');
  const [selectedCategory, setSelectedCategory] = useState<'all' | DiagnosticPackage['category']>('all');
  const [packages] = useState<DiagnosticPackage[]>(() => diagnosticsService.getPackages());
  const [bookings, setBookings] = useState<LabBooking[]>([]);

  // Booking Modal State
  const [selectedPackage, setSelectedPackage] = useState<DiagnosticPackage | null>(null);
  const [patientName, setPatientName] = useState(session?.name || 'Ramesh Sharma');
  const [relationship, setRelationship] = useState<LabBooking['relationship']>('Self');
  const [date, setDate] = useState('2026-08-25');
  const [timeSlot, setTimeSlot] = useState('07:30 AM - 08:30 AM');
  const [isEmergencyCollection, setIsEmergencyCollection] = useState(false);
  const [address, setAddress] = useState('Flat 402, Green Glen Layout, Bellandur, Bengaluru');
  const [pincode, setPincode] = useState('560103');
  const [mobile, setMobile] = useState(session?.phone || '9876543210');
  const [isBooking, setIsBooking] = useState(false);

  // Pincode check
  const [isCheckingPincode, setIsCheckingPincode] = useState(false);
  const [isServiceable, setIsServiceable] = useState<boolean | null>(true);

  useEffect(() => {
    diagnosticsService.getBookings().then(bks => setBookings(bks));
    fetchCurrentLocation().then(loc => {
      if (loc?.pincode) {
        setPincode(loc.pincode);
        handleCheckPincode(loc.pincode);
      }
    });
  }, []);

  const handleCheckPincode = async (code: string) => {
    if (code.length === 6) {
      setIsCheckingPincode(true);
      const res = await checkPincodeServiceability(code);
      setIsCheckingPincode(false);
      setIsServiceable(res.serviceable);
    }
  };

  const filteredPackages = useMemo(() => {
    if (selectedCategory === 'all') return packages;
    return packages.filter(p => p.category === selectedCategory);
  }, [packages, selectedCategory]);

  const handleConfirmBooking = async () => {
    if (!selectedPackage || !address || !pincode || !mobile || !patientName) {
      Alert.alert('Missing Details', 'Please complete all required fields.');
      return;
    }

    setIsBooking(true);
    const newBooking = await diagnosticsService.createBooking({
      package: selectedPackage,
      patientName,
      patientAge: relationship === 'Self' ? 68 : 64,
      patientGender: 'male',
      relationship,
      date,
      timeSlot,
      isEmergencyCollection,
      address,
      pincode,
      mobile,
    });

    setIsBooking(false);
    setSelectedPackage(null);
    setBookings(prev => [newBooking, ...prev]);
    setActiveTab('bookings');

    Alert.alert(
      'Home Collection Scheduled!',
      `Booking ID: ${newBooking.id}\nPhlebotomist assigned: ${newBooking.phlebotomistName}\nSlot: ${date} (${timeSlot})`
    );
  };

  const getStepIndex = (step: SampleTrackingStep) => {
    const map: Record<SampleTrackingStep, number> = {
      confirmed: 0,
      phlebotomist_assigned: 1,
      sample_collected: 2,
      processing: 3,
      report_ready: 4,
    };
    return map[step] ?? 0;
  };

  return (
    <View style={styles.container}>
      <Header
        title="Lab Diagnostics"
        subtitle="Home Sample Pickup & NABL Certified Reports"
        rightAction={{
          icon: 'calendar',
          onPress: () => setActiveTab('bookings'),
          color: '#10b981',
        }}
      />

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'packages' && styles.tabButtonActive]}
          onPress={() => setActiveTab('packages')}
        >
          <Text style={[styles.tabText, activeTab === 'packages' && styles.tabTextActive]}>
            Health Packages ({packages.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'bookings' && styles.tabButtonActive]}
          onPress={() => setActiveTab('bookings')}
        >
          <Text style={[styles.tabText, activeTab === 'bookings' && styles.tabTextActive]}>
            Bookings & Samples ({bookings.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {activeTab === 'packages' && (
          <View>
            {/* Emergency 60-min Home Collection Banner */}
            <View style={styles.emergencyCollectionBanner}>
              <View style={styles.emergencyIconBox}>
                <Ionicons name="flash" size={24} color="#ffffff" />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.emergencyBannerTitle}>60-Min Express Sample Collection</Text>
                <Text style={styles.emergencyBannerSubtitle}>
                  Urgent fever panels, cardiac markers & emergency blood draws at home
                </Text>
              </View>
            </View>

            {/* Category Filter Pills */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryPillsRow}>
              {[
                { id: 'all', label: 'All Tests' },
                { id: 'senior', label: 'Senior Citizen' },
                { id: 'heart', label: 'Cardiac Health' },
                { id: 'diabetes', label: 'Diabetes Care' },
                { id: 'full_body', label: 'Full Body' },
                { id: 'fever', label: 'Monsoon Fever' },
              ].map(cat => (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.catPill, selectedCategory === cat.id && styles.catPillActive]}
                  onPress={() => setSelectedCategory(cat.id as any)}
                >
                  <Text style={[styles.catPillText, selectedCategory === cat.id && styles.catPillTextActive]}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Packages List */}
            {filteredPackages.map(pkg => (
              <View key={pkg.id} style={styles.packageCard}>
                <View style={styles.pkgHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.pkgTitle}>{pkg.name}</Text>
                    <Text style={styles.pkgPartner}>By {pkg.labPartner} • NABL Certified</Text>
                  </View>
                  {pkg.popular && (
                    <View style={styles.popularBadge}>
                      <Text style={styles.popularText}>POPULAR</Text>
                    </View>
                  )}
                </View>

                <Text style={styles.pkgDesc}>{pkg.description}</Text>

                {/* Parameters Preview */}
                <View style={styles.parametersBox}>
                  <Text style={styles.paramTitle}>Includes {pkg.testCount} Critical Health Parameters:</Text>
                  <View style={styles.paramTagsRow}>
                    {pkg.includedParameters.slice(0, 4).map((p, i) => (
                      <View key={i} style={styles.paramBadge}>
                        <Ionicons name="checkmark-circle" size={12} color="#10b981" />
                        <Text style={styles.paramText}>{p}</Text>
                      </View>
                    ))}
                    {pkg.includedParameters.length > 4 && (
                      <Text style={styles.moreParamsText}>+{pkg.includedParameters.length - 4} more tests</Text>
                    )}
                  </View>
                </View>

                {/* Fasting & Report Time */}
                <View style={styles.metaRow}>
                  <View style={styles.metaItem}>
                    <Ionicons name="restaurant-outline" size={14} color={Theme.colors.neutralSecondaryText} />
                    <Text style={styles.metaText}>
                      {pkg.fastingRequired ? `${pkg.fastingHours}h Fasting Required` : 'No Fasting Required'}
                    </Text>
                  </View>

                  <View style={styles.metaItem}>
                    <Ionicons name="time-outline" size={14} color={Theme.colors.neutralSecondaryText} />
                    <Text style={styles.metaText}>Report in {pkg.reportWithinHours} hrs</Text>
                  </View>
                </View>

                {/* Price & Booking Button */}
                <View style={styles.bookingRow}>
                  <View>
                    <Text style={styles.priceText}>₹{pkg.discountPrice || pkg.price}</Text>
                    {pkg.discountPrice && (
                      <Text style={styles.originalPrice}>MRP ₹{pkg.price}</Text>
                    )}
                  </View>

                  <TouchableOpacity
                    style={styles.bookNowBtn}
                    onPress={() => setSelectedPackage(pkg)}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.bookNowBtnText}>Book Home Pickup</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {activeTab === 'bookings' && (
          <View>
            {bookings.length === 0 ? (
              <EmptyState
                icon="pulse-outline"
                title="No Lab Bookings"
                description="Book a home health checkup package to view your schedule and live technician tracking."
                actionText="Explore Packages"
                onActionPress={() => setActiveTab('packages')}
              />
            ) : (
              bookings.map(bk => (
                <View key={bk.id} style={styles.bookingCard}>
                  <View style={styles.bookingCardHeader}>
                    <View>
                      <Text style={styles.bookingIdText}>Booking #{bk.id}</Text>
                      <Text style={styles.bookingDateText}>Slot: {bk.date} • {bk.timeSlot}</Text>
                    </View>
                    <View style={styles.bookingStatusBadge}>
                      <Text style={styles.bookingStatusText}>{bk.status.toUpperCase()}</Text>
                    </View>
                  </View>

                  <Text style={styles.bookingPackageName}>{bk.package.name}</Text>
                  <Text style={styles.bookingPatientInfo}>Patient: {bk.patientName} ({bk.relationship}) • {bk.package.labPartner}</Text>

                  {/* Tracking Stepper */}
                  <View style={styles.sampleTrackerBox}>
                    <Text style={styles.trackerTitle}>Sample Collection & Report Status</Text>
                    <TrackingStepper
                      steps={SAMPLE_TRACKING_STEPS}
                      currentStepIndex={getStepIndex(bk.trackingStep)}
                    />
                  </View>

                  {bk.phlebotomistName && (
                    <View style={styles.technicianBox}>
                      <Ionicons name="medkit" size={18} color="#10b981" />
                      <View style={{ flex: 1, marginLeft: 8 }}>
                        <Text style={styles.techTitle}>Phlebotomist: {bk.phlebotomistName}</Text>
                        <Text style={styles.techSubtitle}>Carries certified sterile vacuum tubes & temperature cooler box</Text>
                      </View>
                    </View>
                  )}
                </View>
              ))
            )}
          </View>
        )}
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <BottomNavBar />

      {/* Booking Modal */}
      <Modal
        visible={!!selectedPackage}
        animationType="slide"
        transparent
        onRequestClose={() => setSelectedPackage(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Book Home Sample Collection</Text>
              <TouchableOpacity onPress={() => setSelectedPackage(null)}>
                <Ionicons name="close" size={24} color={Theme.colors.neutralText} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalPackageName}>{selectedPackage?.name}</Text>
              <Text style={styles.modalPrice}>Total: ₹{selectedPackage?.discountPrice || selectedPackage?.price}</Text>

              {/* Patient Selection */}
              <Text style={styles.inputLabel}>Select Patient</Text>
              <View style={styles.patientPillsRow}>
                {(['Self', 'Father', 'Mother', 'Spouse'] as const).map(rel => (
                  <TouchableOpacity
                    key={rel}
                    style={[styles.patientPill, relationship === rel && styles.patientPillActive]}
                    onPress={() => {
                      setRelationship(rel);
                      setPatientName(rel === 'Self' ? (session?.name || 'Ramesh Sharma') : `${rel} of Ramesh`);
                    }}
                  >
                    <Text style={[styles.patientPillText, relationship === rel && styles.patientPillTextActive]}>
                      {rel}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.inputLabel}>Patient Name</Text>
              <TextInput style={styles.modalInput} value={patientName} onChangeText={setPatientName} />

              <Text style={styles.inputLabel}>Date (YYYY-MM-DD)</Text>
              <TextInput style={styles.modalInput} value={date} onChangeText={setDate} />

              <Text style={styles.inputLabel}>Preferred Morning Slot</Text>
              <TextInput style={styles.modalInput} value={timeSlot} onChangeText={setTimeSlot} />

              <Text style={styles.inputLabel}>Home Collection Address</Text>
              <TextInput style={[styles.modalInput, { height: 60 }]} value={address} onChangeText={setAddress} multiline />

              <Text style={styles.inputLabel}>Pincode</Text>
              <TextInput
                style={styles.modalInput}
                value={pincode}
                onChangeText={(val) => {
                  setPincode(val);
                  handleCheckPincode(val);
                }}
                keyboardType="number-pad"
                maxLength={6}
              />
              {isCheckingPincode && (
                <Text style={{ fontSize: 12, color: Theme.colors.primary, marginBottom: 8 }}>
                  Checking home pickup serviceability...
                </Text>
              )}
              {!isCheckingPincode && isServiceable === true && (
                <Text style={{ fontSize: 12, color: '#10b981', fontWeight: '600', marginBottom: 8 }}>
                  ✓ Home sample collection available in {pincode}
                </Text>
              )}

              <Text style={styles.inputLabel}>Contact Mobile</Text>
              <TextInput
                style={styles.modalInput}
                value={mobile}
                onChangeText={setMobile}
                keyboardType="phone-pad"
                maxLength={10}
              />

              {/* Emergency Collection Toggle */}
              <View style={styles.emergencyToggleRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.emergencyToggleTitle}>Express 60-Min Sample Pickup</Text>
                  <Text style={styles.emergencyToggleSubtitle}>For urgent diagnosis</Text>
                </View>
                <Switch value={isEmergencyCollection} onValueChange={setIsEmergencyCollection} />
              </View>

              <TouchableOpacity
                style={styles.confirmBookingBtn}
                onPress={handleConfirmBooking}
                disabled={isBooking}
              >
                {isBooking ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text style={styles.confirmBookingText}>
                    Confirm Home Pickup (₹{selectedPackage?.discountPrice || selectedPackage?.price})
                  </Text>
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
    backgroundColor: '#E8F8F5',
  },
  tabText: {
    fontWeight: '600',
    color: Theme.colors.neutralSecondaryText,
    fontSize: 13,
  },
  tabTextActive: {
    color: '#10b981',
    fontWeight: '700',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  emergencyCollectionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF5E7',
    borderWidth: 1,
    borderColor: '#F9E79F',
    borderRadius: Theme.rounding.large,
    padding: 14,
    marginBottom: 16,
  },
  emergencyIconBox: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#f39c12',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emergencyBannerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#7D6608',
  },
  emergencyBannerSubtitle: {
    fontSize: 12,
    color: '#9A7D0A',
    marginTop: 2,
  },
  categoryPillsRow: {
    gap: 8,
    marginBottom: 16,
  },
  catPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: Theme.colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  catPillActive: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  catPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: Theme.colors.neutralSecondaryText,
  },
  catPillTextActive: {
    color: '#ffffff',
  },
  packageCard: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.rounding.large,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    ...Theme.shadows.card,
  },
  pkgHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  pkgTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Theme.colors.neutralText,
  },
  pkgPartner: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '600',
    marginTop: 2,
  },
  popularBadge: {
    backgroundColor: '#E8F8F5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  popularText: {
    color: '#10b981',
    fontSize: 10,
    fontWeight: '800',
  },
  pkgDesc: {
    fontSize: 13,
    color: Theme.colors.neutralSecondaryText,
    lineHeight: 18,
    marginBottom: 12,
  },
  parametersBox: {
    backgroundColor: '#F8F9FA',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  paramTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Theme.colors.neutralText,
    marginBottom: 6,
  },
  paramTagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  paramBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    gap: 4,
  },
  paramText: {
    fontSize: 11,
    color: Theme.colors.neutralText,
    fontWeight: '500',
  },
  moreParamsText: {
    fontSize: 11,
    color: Theme.colors.primary,
    fontWeight: '600',
    alignSelf: 'center',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Theme.colors.border,
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 12,
    color: Theme.colors.neutralSecondaryText,
  },
  bookingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 18,
    fontWeight: '800',
    color: Theme.colors.neutralText,
  },
  originalPrice: {
    fontSize: 12,
    color: Theme.colors.neutralSecondaryText,
    textDecorationLine: 'line-through',
  },
  bookNowBtn: {
    backgroundColor: '#10b981',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: Theme.rounding.medium,
  },
  bookNowBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 13,
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
  bookingCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  bookingIdText: {
    fontSize: 16,
    fontWeight: '700',
    color: Theme.colors.neutralText,
  },
  bookingDateText: {
    fontSize: 12,
    color: Theme.colors.neutralSecondaryText,
    marginTop: 2,
  },
  bookingStatusBadge: {
    backgroundColor: '#E8F8F5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  bookingStatusText: {
    color: '#10b981',
    fontWeight: '700',
    fontSize: 11,
  },
  bookingPackageName: {
    fontSize: 15,
    fontWeight: '700',
    color: Theme.colors.neutralText,
    marginBottom: 2,
  },
  bookingPatientInfo: {
    fontSize: 13,
    color: Theme.colors.neutralSecondaryText,
    marginBottom: 12,
  },
  sampleTrackerBox: {
    backgroundColor: '#FAFBFD',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  trackerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Theme.colors.neutralText,
    marginBottom: 8,
  },
  technicianBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F8F5',
    padding: 10,
    borderRadius: 8,
  },
  techTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#065F46',
  },
  techSubtitle: {
    fontSize: 11,
    color: '#047857',
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
  modalPackageName: {
    fontSize: 16,
    fontWeight: '700',
    color: Theme.colors.primary,
    marginBottom: 2,
  },
  modalPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: Theme.colors.neutralText,
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Theme.colors.neutralText,
    marginBottom: 6,
  },
  patientPillsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  patientPill: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  patientPillActive: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  patientPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: Theme.colors.neutralSecondaryText,
  },
  patientPillTextActive: {
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
  emergencyToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    backgroundColor: '#FEF5E7',
    padding: 10,
    borderRadius: 8,
  },
  emergencyToggleTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#7D6608',
  },
  emergencyToggleSubtitle: {
    fontSize: 11,
    color: '#9A7D0A',
  },
  confirmBookingBtn: {
    backgroundColor: '#10b981',
    height: 52,
    borderRadius: Theme.rounding.large,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  confirmBookingText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
});
