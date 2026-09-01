import AsyncStorage from '@react-native-async-storage/async-storage';

export interface CaregiverProfile {
  id: string;
  name: string;
  role: string;
  phone: string;
  experienceYears: number;
  rating: number;
  agency: string;
  shiftHours: string;
  isOnline: boolean;
  avatarIcon: string;
}

export interface CaregiverTask {
  id: string;
  title: string;
  subtitle: string;
  category: 'medication' | 'vitals' | 'meal' | 'exercise' | 'appointment' | 'hygiene';
  scheduledTime: string;
  assignedTo: string; // Caregiver Name
  completed: boolean;
  completedAt?: string;
  notes?: string;
}

export interface SeniorMemberProfile {
  id: string;
  name: string;
  relation: string;
  age: number;
  gender: string;
  bloodGroup: string;
  primaryConditions: string[];
  emergencyContact: string;
  doctorInCharge: string;
  caregiverId: string;
}

const CAREGIVER_TASKS_KEY = 'cureai_caregiver_tasks';

const INITIAL_SENIOR: SeniorMemberProfile = {
  id: 'snr_1',
  name: 'Ramesh Sharma',
  relation: 'Father',
  age: 68,
  gender: 'Male',
  bloodGroup: 'B+',
  primaryConditions: ['Hypertension', 'Pre-diabetes'],
  emergencyContact: '+91 9876543210 (Amit Sharma - Son)',
  doctorInCharge: 'Dr. Aisha Verma (Cardiologist)',
  caregiverId: 'cg_1',
};

const INITIAL_CAREGIVER: CaregiverProfile = {
  id: 'cg_1',
  name: 'Anita Devi',
  role: 'Certified Senior Care Attendant & Nurse',
  phone: '+91 9811223344',
  experienceYears: 8,
  rating: 4.9,
  agency: 'HealWell Senior Care Network',
  shiftHours: '08:00 AM – 08:00 PM (Day Shift)',
  isOnline: true,
  avatarIcon: 'person',
};

const INITIAL_TASKS: CaregiverTask[] = [
  {
    id: 'tsk_1',
    title: 'Morning Telmisartan 40mg Administration',
    subtitle: 'Ensure taken with warm water after oats breakfast',
    category: 'medication',
    scheduledTime: '08:30 AM',
    assignedTo: 'Anita Devi',
    completed: true,
    completedAt: '08:32 AM',
  },
  {
    id: 'tsk_2',
    title: 'Blood Pressure & Pulse Logging',
    subtitle: 'Use digital cuff, record resting BP',
    category: 'vitals',
    scheduledTime: '09:00 AM',
    assignedTo: 'Anita Devi',
    completed: true,
    completedAt: '09:05 AM',
  },
  {
    id: 'tsk_3',
    title: '15-Minute Assisted Garden Walk',
    subtitle: 'Support walking balance on lawn path',
    category: 'exercise',
    scheduledTime: '10:30 AM',
    assignedTo: 'Anita Devi',
    completed: true,
    completedAt: '10:45 AM',
  },
  {
    id: 'tsk_4',
    title: 'Lunch & Metformin 500mg Support',
    subtitle: 'Low-salt vegetable khichdi + salad meal',
    category: 'meal',
    scheduledTime: '01:30 PM',
    assignedTo: 'Anita Devi',
    completed: false,
  },
  {
    id: 'tsk_5',
    title: 'Video Doctor Teleconsultation Prep',
    subtitle: 'Connect to Dr. Aisha Verma call on tablet',
    category: 'appointment',
    scheduledTime: '04:30 PM',
    assignedTo: 'Anita Devi',
    completed: false,
  }
];

export const caregiverService = {
  getSeniorProfile(): SeniorMemberProfile {
    return INITIAL_SENIOR;
  },

  getCaregiver(): CaregiverProfile {
    return INITIAL_CAREGIVER;
  },

  async getTasks(): Promise<CaregiverTask[]> {
    try {
      const raw = await AsyncStorage.getItem(CAREGIVER_TASKS_KEY);
      if (!raw) {
        await AsyncStorage.setItem(CAREGIVER_TASKS_KEY, JSON.stringify(INITIAL_TASKS));
        return INITIAL_TASKS;
      }
      return JSON.parse(raw);
    } catch {
      return INITIAL_TASKS;
    }
  },

  async toggleTask(taskId: string): Promise<CaregiverTask[]> {
    const tasks = await this.getTasks();
    const updated = tasks.map(t => {
      if (t.id === taskId) {
        const nextCompleted = !t.completed;
        return {
          ...t,
          completed: nextCompleted,
          completedAt: nextCompleted ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined,
        };
      }
      return t;
    });
    await AsyncStorage.setItem(CAREGIVER_TASKS_KEY, JSON.stringify(updated));
    return updated;
  },

  async requestEmergencyConcierge(reason: string): Promise<{ success: boolean; referenceId: string; message: string }> {
    // Simulated concierge dispatch
    await new Promise(res => setTimeout(res, 1200));
    return {
      success: true,
      referenceId: `CNC-${Math.floor(100000 + Math.random() * 900000)}`,
      message: `CureAI Senior Concierge notified. A dedicated care manager is reaching out immediately to support: ${reason}`,
    };
  }
};
