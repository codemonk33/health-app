import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Theme } from '../utils/theme';
import Header from '../components/Header';
import BottomNavBar from '../components/BottomNavBar';
import { profileService, UserProfileData } from '../services/profileService';
import { useAuth } from '../context/AuthContext';

export default function UserProfileScreen() {
  const router = useRouter();
  const { session, logout } = useAuth();
  const [profile, setProfile] = useState<UserProfileData | null>(null);

  useEffect(() => {
    profileService.getProfile().then(p => setProfile(p));
  }, []);

  const handleToggleSetting = async (key: keyof UserProfileData['settings']) => {
    const updated = await profileService.toggleSetting(key);
    setProfile(updated);
  };

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out of your account?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/login' as any);
        }
      }
    ]);
  };

  if (!profile) return null;

  return (
    <View style={styles.container}>
      <Header
        title="My Profile & Settings"
        subtitle="Health summary & account controls"
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Card */}
        <View style={styles.userCard}>
          <View style={styles.avatarCircle}>
            <Ionicons name="person" size={36} color={Theme.colors.primary} />
          </View>
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={styles.userName}>{session?.name || profile.name}</Text>
            <Text style={styles.userContact}>{session?.phone || profile.phone}</Text>
            <Text style={styles.userVitals}>Age {profile.age} • Blood Group: {profile.bloodGroup} • {profile.weightKg} kg</Text>
          </View>
        </View>

        {/* ABHA ID Card */}
        <View style={styles.abhaCard}>
          <View style={styles.abhaHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="card" size={20} color="#065F46" style={{ marginRight: 6 }} />
              <Text style={styles.abhaCardTitle}>Ayushman Bharat Health Account</Text>
            </View>
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedText}>ABDM VERIFIED</Text>
            </View>
          </View>

          <Text style={styles.abhaIdText}>ABHA Address: {session?.abhaId || profile.abhaId}</Text>
          <Text style={styles.abhaNumText}>ABHA Number: {session?.abhaNumber || profile.abhaNumber}</Text>
        </View>

        {/* Subscription Plan */}
        <View style={styles.subscriptionCard}>
          <View style={styles.subHeader}>
            <Text style={styles.subTitle}>{profile.subscriptionPlan.name}</Text>
            <View style={styles.activePlanBadge}>
              <Text style={styles.activePlanText}>{profile.subscriptionPlan.badge}</Text>
            </View>
          </View>
          <Text style={styles.subValidity}>Valid through {profile.subscriptionPlan.validTill}</Text>

          <View style={styles.featuresList}>
            {profile.subscriptionPlan.features.map((feat, idx) => (
              <View key={idx} style={styles.subFeatureRow}>
                <Ionicons name="checkmark-circle" size={14} color="#10b981" />
                <Text style={styles.subFeatureText}>{feat}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Care Preferences & Settings */}
        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>Elderly Care & Notification Settings</Text>
        </View>

        <View style={styles.settingsCard}>
          <View style={styles.settingRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingTitle}>Medication Reminders</Text>
              <Text style={styles.settingSubtitle}>Audible voice alerts and notification banners</Text>
            </View>
            <Switch
              value={profile.settings.medicineReminders}
              onValueChange={() => handleToggleSetting('medicineReminders')}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingTitle}>Family Monitoring Alerts</Text>
              <Text style={styles.settingSubtitle}>Notify family members on completed doses or missed logs</Text>
            </View>
            <Switch
              value={profile.settings.familyAlerts}
              onValueChange={() => handleToggleSetting('familyAlerts')}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingTitle}>Bilingual Voice Guidance</Text>
              <Text style={styles.settingSubtitle}>Hindi and English audio voice instruction for seniors</Text>
            </View>
            <Switch
              value={profile.settings.voiceGuidance}
              onValueChange={() => handleToggleSetting('voiceGuidance')}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingTitle}>Share Health Data with Caregiver</Text>
              <Text style={styles.settingSubtitle}>Sync daily tasks with nurse attendant</Text>
            </View>
            <Switch
              value={profile.settings.shareDataWithCaregiver}
              onValueChange={() => handleToggleSetting('shareDataWithCaregiver')}
            />
          </View>
        </View>

        {/* Emergency Contact */}
        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>Emergency Contact Information</Text>
        </View>

        <View style={styles.emergencyContactCard}>
          <Ionicons name="call" size={22} color={Theme.colors.danger} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.contactName}>{profile.emergencyContact.name} ({profile.emergencyContact.relationship})</Text>
            <Text style={styles.contactPhone}>{profile.emergencyContact.phone}</Text>
          </View>
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleLogout}
          activeOpacity={0.85}
        >
          <Ionicons name="log-out-outline" size={20} color={Theme.colors.danger} />
          <Text style={styles.logoutBtnText}>Sign Out from CureAI</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <BottomNavBar activeTab="profile" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.rounding.large,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    ...Theme.shadows.card,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E8F0FE',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Theme.colors.primary,
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: Theme.colors.neutralText,
  },
  userContact: {
    fontSize: 13,
    color: Theme.colors.neutralSecondaryText,
    marginTop: 2,
  },
  userVitals: {
    fontSize: 12,
    color: Theme.colors.primary,
    fontWeight: '600',
    marginTop: 4,
  },
  abhaCard: {
    backgroundColor: '#E6F9F0',
    borderRadius: Theme.rounding.large,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#B8F2D5',
  },
  abhaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  abhaCardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#065F46',
  },
  verifiedBadge: {
    backgroundColor: '#10b981',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  verifiedText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '800',
  },
  abhaIdText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#065F46',
  },
  abhaNumText: {
    fontSize: 12,
    color: '#047857',
    marginTop: 2,
  },
  subscriptionCard: {
    backgroundColor: '#FAF5FF',
    borderRadius: Theme.rounding.large,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E9D5FF',
  },
  subHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#581C87',
  },
  activePlanBadge: {
    backgroundColor: '#8e44ad',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  activePlanText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
  },
  subValidity: {
    fontSize: 12,
    color: '#7E22CE',
    marginTop: 2,
    marginBottom: 10,
  },
  featuresList: {
    gap: 4,
  },
  subFeatureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  subFeatureText: {
    fontSize: 12,
    color: '#4A044E',
  },
  sectionTitleRow: {
    marginTop: 6,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Theme.colors.neutralText,
  },
  settingsCard: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.rounding.large,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F5',
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Theme.colors.neutralText,
  },
  settingSubtitle: {
    fontSize: 11,
    color: Theme.colors.neutralSecondaryText,
    marginTop: 2,
  },
  emergencyContactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDEDEC',
    borderRadius: Theme.rounding.large,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FADBD8',
  },
  contactName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#922B21',
  },
  contactPhone: {
    fontSize: 12,
    color: '#C0392B',
    marginTop: 2,
  },
  logoutBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FDEDEC',
    paddingVertical: 14,
    borderRadius: Theme.rounding.large,
    borderWidth: 1,
    borderColor: '#FADBD8',
    gap: 8,
  },
  logoutBtnText: {
    color: Theme.colors.danger,
    fontSize: 15,
    fontWeight: '700',
  },
});
