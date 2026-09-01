import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserProfileData {
  id: string;
  name: string;
  phone: string;
  email: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  bloodGroup: string;
  heightCm: number;
  weightKg: number;
  abhaId: string;
  abhaNumber: string;
  isAbhaVerified: boolean;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  subscriptionPlan: {
    name: string;
    badge: string;
    validTill: string;
    features: string[];
  };
  settings: {
    medicineReminders: boolean;
    familyAlerts: boolean;
    voiceGuidance: boolean;
    smsNotifications: boolean;
    biometricLock: boolean;
    preferredLanguage: 'English' | 'Hindi' | 'Tamil' | 'Telugu' | 'Kannada';
    shareDataWithCaregiver: boolean;
  };
}

const PROFILE_KEY = 'cureai_user_profile_data';

const DEFAULT_PROFILE: UserProfileData = {
  id: 'usr_default',
  name: 'Ramesh Sharma',
  phone: '+91 9876543210',
  email: 'ramesh.sharma@gmail.com',
  age: 68,
  gender: 'male',
  bloodGroup: 'B+',
  heightCm: 172,
  weightKg: 74,
  abhaId: 'ramesh.sharma@abdm',
  abhaNumber: '14-5524-8931-4021',
  isAbhaVerified: true,
  emergencyContact: {
    name: 'Amit Sharma',
    relationship: 'Son',
    phone: '+91 9876543210',
  },
  subscriptionPlan: {
    name: 'CureAI Senior Plus Gold Care',
    badge: 'ACTIVE PLAN',
    validTill: '20 Dec 2026',
    features: [
      'Unlimited 24/7 AI Health Consultations',
      'Free Home Sample Collection for All Lab Tests',
      'Dedicated Senior Care Concierge Assistance',
      'Priority Doctor Video Consultations with 10% Off'
    ],
  },
  settings: {
    medicineReminders: true,
    familyAlerts: true,
    voiceGuidance: true,
    smsNotifications: true,
    biometricLock: false,
    preferredLanguage: 'English',
    shareDataWithCaregiver: true,
  }
};

export const profileService = {
  async getProfile(): Promise<UserProfileData> {
    try {
      const raw = await AsyncStorage.getItem(PROFILE_KEY);
      if (!raw) {
        await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(DEFAULT_PROFILE));
        return DEFAULT_PROFILE;
      }
      return JSON.parse(raw);
    } catch {
      return DEFAULT_PROFILE;
    }
  },

  async updateProfile(updates: Partial<UserProfileData>): Promise<UserProfileData> {
    const current = await this.getProfile();
    const updated: UserProfileData = {
      ...current,
      ...updates,
      settings: {
        ...current.settings,
        ...(updates.settings || {}),
      },
    };
    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(updated));
    return updated;
  },

  async toggleSetting(settingKey: keyof UserProfileData['settings']): Promise<UserProfileData> {
    const current = await this.getProfile();
    const currentVal = current.settings[settingKey];
    if (typeof currentVal === 'boolean') {
      (current.settings as Record<string, any>)[settingKey] = !currentVal;
    }
    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(current));
    return current;
  }
};
