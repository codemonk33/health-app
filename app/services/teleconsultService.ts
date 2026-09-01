import AsyncStorage from '@react-native-async-storage/async-storage';

export interface DoctorProfile {
  id: string;
  name: string;
  specialty: string;
  qualification: string;
  hospital: string;
  experienceYears: number;
  rating: number;
  reviewCount: number;
  languages: string[];
  fee: number;
  availableModes: ('Video' | 'In-clinic' | 'Audio')[];
  nextAvailableSlot: string;
  availableSlots: string[];
  bio: string;
  image?: string;
}

export interface TeleconsultBooking {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  patientName: string;
  patientAge: number;
  patientGender: 'male' | 'female';
  relationship: 'Self' | 'Father' | 'Mother' | 'Spouse';
  consultationType: 'Video' | 'In-clinic' | 'Audio';
  date: string;
  timeSlot: string;
  symptomsNotes: string;
  shareRecordsWithDoctor: boolean;
  status: 'confirmed' | 'in_waiting_room' | 'in_call' | 'completed' | 'cancelled';
  waitingRoomQueuePosition?: number;
  estimatedWaitMinutes?: number;
  meetingLink?: string;
  createdAt: string;
}

const APPOINTMENTS_STORAGE_KEY = 'cureai_teleconsult_bookings';

export const DOCTORS_DIRECTORY: DoctorProfile[] = [
  {
    id: 'doc_1',
    name: 'Dr. Aisha Verma',
    specialty: 'Cardiologist',
    qualification: 'MD (Cardiology), DM (AIIMS New Delhi)',
    hospital: 'City Heart & Vascular Institute',
    experienceYears: 16,
    rating: 4.9,
    reviewCount: 428,
    languages: ['English', 'Hindi', 'Kannada'],
    fee: 800,
    availableModes: ['Video', 'In-clinic', 'Audio'],
    nextAvailableSlot: 'Today, 04:30 PM',
    availableSlots: ['04:30 PM', '05:00 PM', '05:30 PM', '06:30 PM'],
    bio: 'Senior consultant cardiologist specializing in geriatric hypertension, heart failure management, and preventive cardiovascular wellness for elderly patients.',
  },
  {
    id: 'doc_2',
    name: 'Dr. Rohan Kapoor',
    specialty: 'General Physician & Geriatrician',
    qualification: 'MBBS, MD (Internal Medicine), Fellowship in Geriatrics',
    hospital: 'HealWell Senior Care Clinic',
    experienceYears: 14,
    rating: 4.8,
    reviewCount: 356,
    languages: ['English', 'Hindi', 'Punjabi'],
    fee: 500,
    availableModes: ['Video', 'In-clinic'],
    nextAvailableSlot: 'Today, 03:00 PM',
    availableSlots: ['03:00 PM', '03:45 PM', '04:15 PM', '07:00 PM'],
    bio: 'Dedicated primary care physician focused on holistic elderly chronic disease management, multi-medication reviews, and diabetes care.',
  },
  {
    id: 'doc_3',
    name: 'Dr. Vikram Singh',
    specialty: 'Orthopedist & Joint Care',
    qualification: 'MS (Orthopedics), M.Ch (UK)',
    hospital: 'Bone & Joint Super Speciality Center',
    experienceYears: 19,
    rating: 4.9,
    reviewCount: 512,
    languages: ['English', 'Hindi', 'Bengali'],
    fee: 900,
    availableModes: ['Video', 'In-clinic'],
    nextAvailableSlot: 'Tomorrow, 10:00 AM',
    availableSlots: ['10:00 AM', '11:30 AM', '02:00 PM', '03:30 PM'],
    bio: 'Specialist in osteoarthritis management, non-surgical knee care, and mobility enhancement for seniors.',
  },
  {
    id: 'doc_4',
    name: 'Dr. Neha Sharma',
    specialty: 'Neurologist',
    qualification: 'MD, DM (Neurology, NIMHANS)',
    hospital: 'Brain & Spine Institute',
    experienceYears: 12,
    rating: 4.7,
    reviewCount: 290,
    languages: ['English', 'Hindi', 'Marathi'],
    fee: 1000,
    availableModes: ['Video', 'In-clinic'],
    nextAvailableSlot: 'Tomorrow, 02:30 PM',
    availableSlots: ['02:30 PM', '04:00 PM', '05:30 PM'],
    bio: 'Expert in memory wellness, Parkinson’s management, neuropathy, and stroke recovery support.',
  },
  {
    id: 'doc_5',
    name: 'Dr. Priya Patel',
    specialty: 'Dermatologist',
    qualification: 'MD (Dermatology, Venereology & Leprosy)',
    hospital: 'SkinCare Hub Clinic',
    experienceYears: 9,
    rating: 4.8,
    reviewCount: 210,
    languages: ['English', 'Hindi', 'Gujarati'],
    fee: 600,
    availableModes: ['Video', 'In-clinic', 'Audio'],
    nextAvailableSlot: 'Today, 06:00 PM',
    availableSlots: ['06:00 PM', '06:30 PM', '07:00 PM'],
    bio: 'Specializes in senior skin health, diabetic dermopathy, eczema, and allergy treatments.',
  }
];

const INITIAL_BOOKINGS: TeleconsultBooking[] = [
  {
    id: 'APT-10492',
    doctorId: 'doc_1',
    doctorName: 'Dr. Aisha Verma',
    doctorSpecialty: 'Cardiologist',
    patientName: 'Ramesh Sharma',
    patientAge: 68,
    patientGender: 'male',
    relationship: 'Self',
    consultationType: 'Video',
    date: new Date().toISOString().split('T')[0],
    timeSlot: '04:30 PM',
    symptomsNotes: 'Follow-up on blood pressure fluctuation and reviewing morning medication dosage.',
    shareRecordsWithDoctor: true,
    status: 'confirmed',
    waitingRoomQueuePosition: 2,
    estimatedWaitMinutes: 10,
    meetingLink: 'https://teleconsult.cureai.health/room/apt-10492',
    createdAt: new Date().toISOString(),
  }
];

export const teleconsultService = {
  getDoctors(): DoctorProfile[] {
    return DOCTORS_DIRECTORY;
  },

  getDoctorById(id: string): DoctorProfile | undefined {
    return DOCTORS_DIRECTORY.find(d => d.id === id);
  },

  async getBookings(): Promise<TeleconsultBooking[]> {
    try {
      const raw = await AsyncStorage.getItem(APPOINTMENTS_STORAGE_KEY);
      if (!raw) {
        await AsyncStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(INITIAL_BOOKINGS));
        return INITIAL_BOOKINGS;
      }
      return JSON.parse(raw);
    } catch {
      return INITIAL_BOOKINGS;
    }
  },

  async createBooking(bookingData: Omit<TeleconsultBooking, 'id' | 'status' | 'waitingRoomQueuePosition' | 'estimatedWaitMinutes' | 'meetingLink' | 'createdAt'>): Promise<TeleconsultBooking> {
    const bookings = await this.getBookings();
    const newBooking: TeleconsultBooking = {
      ...bookingData,
      id: `APT-${Math.floor(10000 + Math.random() * 90000)}`,
      status: 'confirmed',
      waitingRoomQueuePosition: 3,
      estimatedWaitMinutes: 15,
      meetingLink: `https://teleconsult.cureai.health/room/apt-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [newBooking, ...bookings];
    await AsyncStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(updated));
    return newBooking;
  },

  async cancelBooking(bookingId: string): Promise<TeleconsultBooking[]> {
    const bookings = await this.getBookings();
    const updated = bookings.map(b => b.id === bookingId ? { ...b, status: 'cancelled' as const } : b);
    await AsyncStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  async joinWaitingRoom(bookingId: string): Promise<TeleconsultBooking | null> {
    const bookings = await this.getBookings();
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return null;

    booking.status = 'in_waiting_room';
    booking.waitingRoomQueuePosition = 1;
    booking.estimatedWaitMinutes = 4;
    await AsyncStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(bookings));
    return booking;
  }
};
