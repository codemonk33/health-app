import AsyncStorage from '@react-native-async-storage/async-storage';

export type ReminderCategory = 'medication' | 'vitals' | 'appointment' | 'activity' | 'hydration';
export type ReminderPriority = 'high' | 'medium' | 'low';
export type ReminderStatus = 'pending' | 'completed' | 'snoozed' | 'dismissed';

export interface SmartReminder {
  id: string;
  title: string;
  subtitle: string;
  category: ReminderCategory;
  priority: ReminderPriority;
  time: string; // e.g. '08:00 AM'
  date: string; // YYYY-MM-DD
  dosage?: string;
  instructions?: string;
  status: ReminderStatus;
  isAiAdaptive?: boolean;
  aiRationale?: string;
  familyAlertSent?: boolean;
  completedAt?: string;
}

export interface FamilyAlert {
  id: string;
  member: string;
  relation: string;
  message: string;
  time: string;
  type: 'missed_dose' | 'bp_spike' | 'glucose_alert' | 'check_in';
  severity: 'warning' | 'critical' | 'info';
}

const REMINDERS_KEY = 'cureai_smart_reminders';

const INITIAL_REMINDERS: SmartReminder[] = [
  {
    id: 'rem_1',
    title: 'Telmisartan 40mg',
    subtitle: '1 Tablet after Breakfast',
    category: 'medication',
    priority: 'high',
    time: '08:30 AM',
    date: new Date().toISOString().split('T')[0],
    dosage: '1 tablet (40mg)',
    instructions: 'Take with warm water after food',
    status: 'pending',
    isAiAdaptive: true,
    aiRationale: 'Scheduled 30 mins after usual breakfast based on morning BP log',
  },
  {
    id: 'rem_2',
    title: 'Blood Pressure Check',
    subtitle: 'Log morning readings',
    category: 'vitals',
    priority: 'high',
    time: '09:00 AM',
    date: new Date().toISOString().split('T')[0],
    instructions: 'Sit calmly for 5 mins before taking cuff reading',
    status: 'completed',
    completedAt: '09:05 AM',
  },
  {
    id: 'rem_3',
    title: 'Metformin 500mg',
    subtitle: '1 Tablet with Lunch',
    category: 'medication',
    priority: 'high',
    time: '01:30 PM',
    date: new Date().toISOString().split('T')[0],
    dosage: '1 tablet (500mg)',
    instructions: 'Take in the middle of your meal',
    status: 'pending',
    isAiAdaptive: true,
    aiRationale: 'Synced with predicted lunch window to prevent stomach irritation',
  },
  {
    id: 'rem_4',
    title: 'Evening Hydration & Walk',
    subtitle: '2 Glasses of Water & 20 min garden walk',
    category: 'hydration',
    priority: 'medium',
    time: '05:30 PM',
    date: new Date().toISOString().split('T')[0],
    status: 'pending',
  },
  {
    id: 'rem_5',
    title: 'Atorvastatin 10mg',
    subtitle: '1 Tablet before Sleep',
    category: 'medication',
    priority: 'medium',
    time: '09:30 PM',
    date: new Date().toISOString().split('T')[0],
    dosage: '1 tablet (10mg)',
    instructions: 'Take right before bedtime',
    status: 'pending',
  },
];

const INITIAL_FAMILY_ALERTS: FamilyAlert[] = [
  {
    id: 'fa_1',
    member: 'Papa (Ramesh Sharma)',
    relation: 'Father',
    message: 'Morning BP checked (128/82 mmHg - Normal range)',
    time: '09:05 AM',
    type: 'check_in',
    severity: 'info',
  },
  {
    id: 'fa_2',
    member: 'Maa (Sunita Sharma)',
    relation: 'Mother',
    message: 'Completed afternoon walking goal (2,400 steps)',
    time: 'Yesterday',
    type: 'check_in',
    severity: 'info',
  }
];

export const remindersService = {
  async getReminders(): Promise<SmartReminder[]> {
    try {
      const raw = await AsyncStorage.getItem(REMINDERS_KEY);
      if (!raw) {
        await AsyncStorage.setItem(REMINDERS_KEY, JSON.stringify(INITIAL_REMINDERS));
        return INITIAL_REMINDERS;
      }
      return JSON.parse(raw);
    } catch {
      return INITIAL_REMINDERS;
    }
  },

  async saveReminders(reminders: SmartReminder[]): Promise<void> {
    try {
      await AsyncStorage.setItem(REMINDERS_KEY, JSON.stringify(reminders));
    } catch (e) {
      console.error('Failed to save reminders:', e);
    }
  },

  async markComplete(id: string): Promise<SmartReminder[]> {
    const list = await this.getReminders();
    const updated = list.map(r => r.id === id ? {
      ...r,
      status: 'completed' as ReminderStatus,
      completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } : r);
    await this.saveReminders(updated);
    return updated;
  },

  async snoozeReminder(id: string, minutes: number = 15): Promise<SmartReminder[]> {
    const list = await this.getReminders();
    const updated = list.map(r => r.id === id ? {
      ...r,
      status: 'snoozed' as ReminderStatus,
      subtitle: `Snoozed for ${minutes} mins`
    } : r);
    await this.saveReminders(updated);
    return updated;
  },

  async dismissReminder(id: string): Promise<SmartReminder[]> {
    const list = await this.getReminders();
    const updated = list.map(r => r.id === id ? {
      ...r,
      status: 'dismissed' as ReminderStatus
    } : r);
    await this.saveReminders(updated);
    return updated;
  },

  async addReminder(reminder: Omit<SmartReminder, 'id' | 'status'>): Promise<SmartReminder> {
    const list = await this.getReminders();
    const newRem: SmartReminder = {
      ...reminder,
      id: `rem_${Date.now()}`,
      status: 'pending',
    };
    const updated = [newRem, ...list];
    await this.saveReminders(updated);
    return newRem;
  },

  async getFamilyAlerts(): Promise<FamilyAlert[]> {
    return INITIAL_FAMILY_ALERTS;
  }
};
