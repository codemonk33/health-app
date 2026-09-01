import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from './utils/theme';
import Header from './components/Header';
import BottomNavBar from './components/BottomNavBar';
import { caregiverService, CaregiverProfile, CaregiverTask, SeniorMemberProfile } from './services/caregiverService';

export default function ElderlyCareScreen() {
  const [senior] = useState<SeniorMemberProfile>(() => caregiverService.getSeniorProfile());
  const [caregiver] = useState<CaregiverProfile>(() => caregiverService.getCaregiver());
  const [tasks, setTasks] = useState<CaregiverTask[]>([]);
  const [isRequestingConcierge, setIsRequestingConcierge] = useState(false);

  useEffect(() => {
    caregiverService.getTasks().then(ts => setTasks(ts));
  }, []);

  const handleToggleTask = async (taskId: string) => {
    const updated = await caregiverService.toggleTask(taskId);
    setTasks(updated);
  };

  const handleEmergencyConcierge = () => {
    Alert.alert(
      'Request Senior Concierge Support',
      'This will dispatch an urgent care coordinator from HealWell Senior Network to assist with home nurse coordination, ambulance escort, or urgent medical supplies.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Request Support',
          style: 'destructive',
          onPress: async () => {
            setIsRequestingConcierge(true);
            const res = await caregiverService.requestEmergencyConcierge('Urgent attendant check & vitals support');
            setIsRequestingConcierge(false);
            Alert.alert('Concierge Dispatched', `${res.message}\nRef: ${res.referenceId}`);
          }
        }
      ]
    );
  };

  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <View style={styles.container}>
      <Header
        title="Elderly Care & Concierge"
        subtitle="Caregiver tasks & family coordination"
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Senior Profile Summary Card */}
        <View style={styles.seniorCard}>
          <View style={styles.seniorHeader}>
            <View style={styles.avatarBox}>
              <Ionicons name="person" size={28} color={Theme.colors.primary} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.seniorName}>{senior.name}</Text>
              <Text style={styles.seniorMeta}>Age {senior.age} • Blood Group: {senior.bloodGroup}</Text>
              <Text style={styles.seniorEmergency}>Emergency Contact: {senior.emergencyContact}</Text>
            </View>
          </View>
        </View>

        {/* Assigned Caregiver Card */}
        <View style={styles.caregiverCard}>
          <View style={styles.cgHeaderRow}>
            <View style={styles.cgAvatarBox}>
              <Ionicons name="shield-checkmark" size={22} color="#10b981" />
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.cgName}>{caregiver.name}</Text>
              <Text style={styles.cgRole}>{caregiver.role}</Text>
            </View>
            <View style={styles.onlineBadge}>
              <Text style={styles.onlineText}>ON DUTY</Text>
            </View>
          </View>

          <View style={styles.cgMetaBox}>
            <Text style={styles.cgShiftText}>⏰ Shift: {caregiver.shiftHours}</Text>
            <Text style={styles.cgAgencyText}>🏢 Agency: {caregiver.agency} (Rating: {caregiver.rating} ★)</Text>
          </View>
        </View>

        {/* Emergency Concierge Action */}
        <TouchableOpacity
          style={styles.conciergeCard}
          onPress={handleEmergencyConcierge}
          activeOpacity={0.85}
          disabled={isRequestingConcierge}
        >
          <View style={styles.conciergeIconBox}>
            <Ionicons name="call" size={22} color="#ffffff" />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.conciergeTitle}>1-Touch Senior Concierge Support</Text>
            <Text style={styles.conciergeSubtitle}>Instant caregiver replacement & urgent home assistance</Text>
          </View>
          {isRequestingConcierge && <ActivityIndicator color="#ffffff" />}
        </TouchableOpacity>

        {/* Daily Care Checklist */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Daily Caregiver Task List</Text>
          <Text style={styles.taskProgressText}>{completedCount} of {tasks.length} Completed</Text>
        </View>

        {tasks.map(task => (
          <TouchableOpacity
            key={task.id}
            style={[styles.taskCard, task.completed && styles.taskCardCompleted]}
            onPress={() => handleToggleTask(task.id)}
            activeOpacity={0.8}
          >
            <View style={styles.taskCheckRow}>
              <Ionicons
                name={task.completed ? 'checkmark-circle' : 'ellipse-outline'}
                size={24}
                color={task.completed ? '#10b981' : Theme.colors.neutralSecondaryText}
              />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={[styles.taskTitle, task.completed && styles.taskTitleCompleted]}>
                  {task.title}
                </Text>
                <Text style={styles.taskSubtitle}>{task.subtitle}</Text>
                <View style={styles.taskMetaRow}>
                  <Text style={styles.taskTime}>⏰ {task.scheduledTime}</Text>
                  {task.completed && task.completedAt && (
                    <Text style={styles.taskCompletedTime}> • Completed at {task.completedAt}</Text>
                  )}
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <BottomNavBar />
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
  seniorCard: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.rounding.large,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    ...Theme.shadows.card,
  },
  seniorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarBox: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#E8F0FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  seniorName: {
    fontSize: 17,
    fontWeight: '700',
    color: Theme.colors.neutralText,
  },
  seniorMeta: {
    fontSize: 13,
    color: Theme.colors.neutralSecondaryText,
    marginTop: 2,
  },
  seniorEmergency: {
    fontSize: 11,
    color: Theme.colors.danger,
    fontWeight: '600',
    marginTop: 4,
  },
  caregiverCard: {
    backgroundColor: '#FAF5FF',
    borderRadius: Theme.rounding.large,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E9D5FF',
  },
  cgHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  cgAvatarBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F8F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cgName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#581C87',
  },
  cgRole: {
    fontSize: 12,
    color: '#7E22CE',
  },
  onlineBadge: {
    backgroundColor: '#E8F8F5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  onlineText: {
    color: '#10b981',
    fontWeight: '700',
    fontSize: 10,
  },
  cgMetaBox: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E9D5FF',
  },
  cgShiftText: {
    fontSize: 12,
    color: '#581C87',
    fontWeight: '500',
  },
  cgAgencyText: {
    fontSize: 12,
    color: '#7E22CE',
    marginTop: 2,
  },
  conciergeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D35400',
    borderRadius: Theme.rounding.large,
    padding: 16,
    marginBottom: 18,
    ...Theme.shadows.button,
  },
  conciergeIconBox: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  conciergeTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  conciergeSubtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 11,
    marginTop: 2,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Theme.colors.neutralText,
  },
  taskProgressText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10b981',
  },
  taskCard: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.rounding.large,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  taskCardCompleted: {
    backgroundColor: '#F8F9FA',
    borderColor: '#E9ECEF',
  },
  taskCheckRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Theme.colors.neutralText,
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: Theme.colors.neutralSecondaryText,
  },
  taskSubtitle: {
    fontSize: 12,
    color: Theme.colors.neutralSecondaryText,
    marginTop: 2,
  },
  taskMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  taskTime: {
    fontSize: 11,
    fontWeight: '600',
    color: Theme.colors.primary,
  },
  taskCompletedTime: {
    fontSize: 11,
    color: '#10b981',
    fontWeight: '600',
  },
});
