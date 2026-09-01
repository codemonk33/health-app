import AsyncStorage from '@react-native-async-storage/async-storage';

export interface DiagnosticPackage {
  id: string;
  name: string;
  category: 'senior' | 'heart' | 'diabetes' | 'full_body' | 'fever';
  description: string;
  testCount: number;
  fastingRequired: boolean;
  fastingHours?: number;
  price: number;
  discountPrice?: number;
  reportWithinHours: number;
  labPartner: string;
  includedParameters: string[];
  popular?: boolean;
}

export type SampleTrackingStep = 'confirmed' | 'phlebotomist_assigned' | 'sample_collected' | 'processing' | 'report_ready';

export interface LabBooking {
  id: string;
  package: DiagnosticPackage;
  patientName: string;
  patientAge: number;
  patientGender: 'male' | 'female';
  relationship: 'Self' | 'Father' | 'Mother' | 'Spouse';
  date: string;
  timeSlot: string;
  isEmergencyCollection: boolean;
  address: string;
  pincode: string;
  mobile: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  trackingStep: SampleTrackingStep;
  phlebotomistName?: string;
  phlebotomistPhone?: string;
  reportUri?: string;
}

const DIAGNOSTICS_BOOKINGS_KEY = 'cureai_lab_bookings';

export const DIAGNOSTIC_PACKAGES: DiagnosticPackage[] = [
  {
    id: 'pkg_senior_gold',
    name: 'Senior Citizen Comprehensive Health Check',
    category: 'senior',
    description: 'Designed specifically for elders 60+ to evaluate cardiac, metabolic, renal and liver health.',
    testCount: 68,
    fastingRequired: true,
    fastingHours: 10,
    price: 2499,
    discountPrice: 1299,
    reportWithinHours: 24,
    labPartner: 'Apollo Diagnostics',
    includedParameters: ['HbA1c & Fasting Glucose', 'Complete Lipid Profile', 'Kidney Function Test (Creatinine, Urea)', 'Liver Function Test (SGOT/SGPT)', 'Vitamin D & B12', 'Thyroid Profile (TSH)', 'Complete Blood Count (CBC)', 'Urine Routine'],
    popular: true,
  },
  {
    id: 'pkg_heart_plus',
    name: 'Advanced Cardiac Risk Profile',
    category: 'heart',
    description: 'Comprehensive evaluation of heart health, lipid abnormalities, and inflammation markers.',
    testCount: 42,
    fastingRequired: true,
    fastingHours: 12,
    price: 1999,
    discountPrice: 999,
    reportWithinHours: 24,
    labPartner: 'Metropolis Healthcare',
    includedParameters: ['Lipid Profile', 'High Sensitivity CRP (hs-CRP)', 'Homocysteine', 'Apolipoprotein A1 & B', 'ECG (Home Visit Available)'],
    popular: true,
  },
  {
    id: 'pkg_diabetes_care',
    name: 'Diabetes Monitoring & Organ Safety Panel',
    category: 'diabetes',
    description: 'Complete quarterly test for diabetic patients to prevent diabetic nephropathy and retinopathy.',
    testCount: 35,
    fastingRequired: true,
    fastingHours: 8,
    price: 1499,
    discountPrice: 799,
    reportWithinHours: 18,
    labPartner: 'Lal PathLabs',
    includedParameters: ['HbA1c with Average Blood Sugar', 'Fasting & Post-Prandial Glucose', 'Microalbuminuria', 'Serum Creatinine & eGFR', 'Lipid Screening'],
  },
  {
    id: 'pkg_full_body',
    name: 'Full Body Wellness Assessment',
    category: 'full_body',
    description: 'Total preventive wellness check for vital organs, vitamins, and immunity.',
    testCount: 82,
    fastingRequired: true,
    fastingHours: 10,
    price: 3499,
    discountPrice: 1799,
    reportWithinHours: 24,
    labPartner: 'Thyrocare',
    includedParameters: ['CBC', 'LFT', 'KFT', 'Lipid', 'Thyroid', 'Vitamins B12 & D3', 'Iron Deficiency Profile', 'Calcium & Electrolytes'],
  },
  {
    id: 'pkg_fever_panel',
    name: 'Express Monsoon Fever Panel',
    category: 'fever',
    description: 'Same day rapid identification for Dengue, Malaria, Typhoid, and Viral Infections.',
    testCount: 15,
    fastingRequired: false,
    price: 1200,
    discountPrice: 850,
    reportWithinHours: 6,
    labPartner: 'SRL Diagnostics',
    includedParameters: ['CBC with Platelet Count', 'Dengue NS1 Antigen & IgM/IgG', 'Malaria Parasite Smear', 'Typhoid (Widal)', 'Urine Routine'],
  }
];

const INITIAL_BOOKINGS: LabBooking[] = [
  {
    id: 'LAB-54021',
    package: DIAGNOSTIC_PACKAGES[0],
    patientName: 'Ramesh Sharma',
    patientAge: 68,
    patientGender: 'male',
    relationship: 'Self',
    date: '2026-08-25',
    timeSlot: '07:30 AM - 08:30 AM',
    isEmergencyCollection: false,
    address: 'Flat 402, Green Glen Layout, Bellandur, Bengaluru',
    pincode: '560103',
    mobile: '9876543210',
    status: 'scheduled',
    trackingStep: 'phlebotomist_assigned',
    phlebotomistName: 'Vikram Yadav',
    phlebotomistPhone: '9845012345',
  }
];

export const diagnosticsService = {
  getPackages(): DiagnosticPackage[] {
    return DIAGNOSTIC_PACKAGES;
  },

  async getBookings(): Promise<LabBooking[]> {
    try {
      const raw = await AsyncStorage.getItem(DIAGNOSTICS_BOOKINGS_KEY);
      if (!raw) {
        await AsyncStorage.setItem(DIAGNOSTICS_BOOKINGS_KEY, JSON.stringify(INITIAL_BOOKINGS));
        return INITIAL_BOOKINGS;
      }
      return JSON.parse(raw);
    } catch {
      return INITIAL_BOOKINGS;
    }
  },

  async createBooking(bookingData: Omit<LabBooking, 'id' | 'status' | 'trackingStep' | 'phlebotomistName' | 'phlebotomistPhone'>): Promise<LabBooking> {
    const bookings = await this.getBookings();
    const newBooking: LabBooking = {
      ...bookingData,
      id: `LAB-${Math.floor(10000 + Math.random() * 90000)}`,
      status: 'scheduled',
      trackingStep: 'confirmed',
      phlebotomistName: 'Ravi Kumar (Certified Phlebotomist)',
      phlebotomistPhone: '9871234560',
    };
    const updated = [newBooking, ...bookings];
    await AsyncStorage.setItem(DIAGNOSTICS_BOOKINGS_KEY, JSON.stringify(updated));
    return newBooking;
  },

  async cancelBooking(bookingId: string): Promise<LabBooking[]> {
    const bookings = await this.getBookings();
    const updated = bookings.map(b => b.id === bookingId ? { ...b, status: 'cancelled' as const } : b);
    await AsyncStorage.setItem(DIAGNOSTICS_BOOKINGS_KEY, JSON.stringify(updated));
    return updated;
  }
};
