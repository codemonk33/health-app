import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserSession {
  id: string;
  phone: string;
  name: string;
  abhaId?: string;
  abhaNumber?: string;
  isAbhaVerified: boolean;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  bloodGroup?: string;
  token: string;
  createdAt: string;
}

const AUTH_STORAGE_KEY = 'cureai_user_session';
const ONBOARDING_COMPLETED_KEY = 'cureai_onboarding_completed';

export const authService = {
  async getSession(): Promise<UserSession | null> {
    try {
      const raw = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      console.error('Failed to read auth session:', e);
      return null;
    }
  },

  async sendOtp(phone: string): Promise<{ success: boolean; message: string }> {
    // Validate Indian 10-digit phone
    if (!/^[6-9]\d{9}$/.test(phone)) {
      return { success: false, message: 'Please enter a valid 10-digit mobile number' };
    }
    // Simulate network delay
    await new Promise(res => setTimeout(res, 800));
    return { success: true, message: 'OTP sent successfully to +91 ' + phone };
  },

  async verifyOtp(phone: string, otp: string): Promise<{ success: boolean; session?: UserSession; message: string }> {
    if (!otp || otp.length !== 4) {
      return { success: false, message: 'Please enter the 4-digit OTP' };
    }
    // Simulate verification (demo OTP '1234' or any 4 digit in test)
    await new Promise(res => setTimeout(res, 800));

    const mockSession: UserSession = {
      id: `usr_${Date.now()}`,
      phone,
      name: 'Ramesh Sharma',
      abhaId: 'ramesh.sharma@abdm',
      abhaNumber: '14-5524-8931-4021',
      isAbhaVerified: true,
      age: 68,
      gender: 'male',
      bloodGroup: 'B+',
      token: `jwt_token_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(mockSession));
    return { success: true, session: mockSession, message: 'Logged in successfully' };
  },

  async verifyAbhaCard(abhaNumberOrAddress: string): Promise<{ success: boolean; abhaDetails?: Partial<UserSession>; message: string }> {
    if (!abhaNumberOrAddress || abhaNumberOrAddress.trim().length < 6) {
      return { success: false, message: 'Please enter a valid 14-digit ABHA Number or ABHA Address' };
    }
    await new Promise(res => setTimeout(res, 1200));

    return {
      success: true,
      abhaDetails: {
        abhaId: abhaNumberOrAddress.includes('@') ? abhaNumberOrAddress : `${abhaNumberOrAddress.replace(/\D/g, '')}@abdm`,
        abhaNumber: '14-8892-4102-9930',
        isAbhaVerified: true,
        name: 'Ramesh Sharma',
        age: 68,
        gender: 'male',
        bloodGroup: 'B+',
      },
      message: 'ABHA Card verified successfully and linked to Ayushman Bharat Digital Mission (ABDM).',
    };
  },

  async logout(): Promise<void> {
    try {
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (e) {
      console.error('Logout error:', e);
    }
  },

  async isOnboardingCompleted(): Promise<boolean> {
    try {
      const val = await AsyncStorage.getItem(ONBOARDING_COMPLETED_KEY);
      return val === 'true';
    } catch {
      return false;
    }
  },

  async setOnboardingCompleted(completed: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(ONBOARDING_COMPLETED_KEY, completed ? 'true' : 'false');
    } catch (e) {
      console.error('Failed to save onboarding state:', e);
    }
  }
};
