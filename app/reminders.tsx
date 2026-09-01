import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useResponsive } from './utils/responsive';
import { Theme } from './utils/theme';
import Header from './components/Header';
import EmptyState from './components/EmptyState';
import LoadingState from './components/LoadingState';
import BottomNavBar from './components/BottomNavBar';
import { remindersService, SmartReminder, FamilyAlert, ReminderPriority } from './services/remindersService';

export default function RemindersScreen() {
  const R = useResponsive();
  const [reminders, setReminders] = useState<SmartReminder[]>([]);
  const [familyAlerts, setFamilyAlerts] = useState<FamilyAlert[]>([]);
  const [activeTab, setActiveTab] = useState<'pending' | 'completed' | 'alerts'>('pending');
  const [isLoading, setIsLoading] = useState(true);

  // Add Reminder Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newTime, setNewTime] = useState('08:00 AM');
  const [newPriority, setNewPriority] = useState<ReminderPriority>('high');

  const loadData = async () => {
    setIsLoading(false);
    try {
      const [rems, alerts] = await Promise.all([
        remindersService.getReminders(),
        remindersService.getFamilyAlerts()
      ]);
      setReminders(rems);
      setFamilyAlerts(alerts);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleMarkComplete = async (id: string) => {
    const updated = await remindersService.markComplete(id);
    setReminders(updated);
  };

  const handleSnooze = async (id: string) => {
    const updated = await remindersService.snoozeReminder(id, 15);
    setReminders(updated);
    Alert.alert('Reminder Snoozed', 'We will remind you again in 15 minutes.');
  };

  const handleDismiss = async (id: string) => {
    const updated = await remindersService.dismissReminder(id);
    setReminders(updated);
  };

  const handleAddReminder = async () => {
    if (!newTitle.trim()) {
      Alert.alert('Missing Name', 'Please enter a reminder name or medicine');
      return;
    }
    await remindersService.addReminder({
      title: newTitle.trim(),
      subtitle: newSubtitle.trim() || 'Scheduled dose',
      category: 'medication',
      priority: newPriority,
      time: newTime,
      date: new Date().toISOString().split('T')[0],
      isAiAdaptive: false,
    });
    setShowAddModal(false);
    setNewTitle('');
    setNewSubtitle('');
    loadData();
  };

  const filteredReminders = useMemo(() => {
    if (activeTab === 'pending') {
      return reminders.filter(r => r.status === 'pending' || r.status === 'snoozed');
    }
    if (activeTab === 'completed') {
      return reminders.filter(r => r.status === 'completed');
    }
    return [];
  }, [reminders, activeTab]);

  const getPriorityColor = (p: ReminderPriority) => {
    switch (p) {
      case 'high': return Theme.colors.danger;
      case 'medium': return Theme.colors.warning;
      case 'low': return '#10b981';
      default: return Theme.colors.neutralSecondaryText;
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="Smart Reminders"
        subtitle="Adaptive dosage & family alerts"
        rightAction={{
          icon: 'add-circle',
          onPress: () => setShowAddModal(true),
          color: Theme.colors.primary,
        }}
      />

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'pending' && styles.tabButtonActive]}
          onPress={() => setActiveTab('pending')}
        >
          <Text style={[styles.tabText, activeTab === 'pending' && styles.tabTextActive]}>
            Active ({reminders.filter(r => r.status === 'pending' || r.status === 'snoozed').length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'completed' && styles.tabButtonActive]}
          onPress={() => setActiveTab('completed')}
        >
          <Text style={[styles.tabText, activeTab === 'completed' && styles.tabTextActive]}>
            Completed ({reminders.filter(r => r.status === 'completed').length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'alerts' && styles.tabButtonActive]}
          onPress={() => setActiveTab('alerts')}
        >
          <Text style={[styles.tabText, activeTab === 'alerts' && styles.tabTextActive]}>
            Family Alerts ({familyAlerts.length})
          </Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <LoadingState message="Loading smart schedules..." />
      ) : (
        <ScrollView contentContainerStyle={[styles.content, { padding: R.spacing(18) }]} showsVerticalScrollIndicator={false}>
          {activeTab !== 'alerts' && (
            <>
              {/* AI Adaptive Suggestion Banner */}
              <View style={styles.aiOptimizationCard}>
                <View style={styles.aiHeaderRow}>
                  <View style={styles.aiIconBadge}>
                    <Ionicons name="sparkles" size={16} color="#8e44ad" />
                  </View>
                  <Text style={styles.aiTitle}>NEX Adaptive AI Timing Active</Text>
                </View>
                <Text style={styles.aiDesc}>
                  Doses are synchronized with your morning blood pressure and meal intake logs to minimize gastrointestinal discomfort and ensure optimal absorption.
                </Text>
              </View>

              {filteredReminders.length === 0 ? (
                <EmptyState
                  icon="checkmark-done-circle"
                  iconColor="#10b981"
                  title={activeTab === 'pending' ? 'All Reminders Completed!' : 'No Completed History Yet'}
                  description={activeTab === 'pending' ? 'You have taken all scheduled medications for today.' : 'Completed medication doses will show up here.'}
                  actionText="Add New Reminder"
                  onActionPress={() => setShowAddModal(true)}
                />
              ) : (
                filteredReminders.map(rem => (
                  <View key={rem.id} style={styles.reminderCard}>
                    <View style={styles.cardTopRow}>
                      <View style={styles.timeBadge}>
                        <Ionicons name="time-outline" size={14} color="#ffffff" style={{ marginRight: 4 }} />
                        <Text style={styles.timeBadgeText}>{rem.time}</Text>
                      </View>

                      <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(rem.priority) + '15' }]}>
                        <Text style={[styles.priorityBadgeText, { color: getPriorityColor(rem.priority) }]}>
                          {rem.priority.toUpperCase()} PRIORITY
                        </Text>
                      </View>
                    </View>

                    <Text style={styles.cardTitle}>{rem.title}</Text>
                    <Text style={styles.cardSubtitle}>{rem.subtitle}</Text>
                    {rem.instructions && (
                      <View style={styles.instructionBox}>
                        <Ionicons name="information-circle-outline" size={16} color={Theme.colors.neutralSecondaryText} />
                        <Text style={styles.instructionText}>{rem.instructions}</Text>
                      </View>
                    )}

                    {rem.aiRationale && (
                      <View style={styles.aiRationaleBox}>
                        <Ionicons name="bulb-outline" size={14} color="#8e44ad" />
                        <Text style={styles.aiRationaleText}>{rem.aiRationale}</Text>
                      </View>
                    )}

                    {/* Actions */}
                    <View style={styles.actionsRow}>
                      {rem.status === 'completed' ? (
                        <View style={styles.completedBadge}>
                          <Ionicons name="checkmark-circle" size={18} color="#10b981" />
                          <Text style={styles.completedText}>Taken at {rem.completedAt || 'Scheduled Time'}</Text>
                        </View>
                      ) : (
                        <>
                          <TouchableOpacity
                            style={styles.actionBtnComplete}
                            onPress={() => handleMarkComplete(rem.id)}
                          >
                            <Ionicons name="checkmark" size={18} color="#ffffff" />
                            <Text style={styles.actionBtnCompleteText}>Mark Taken</Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={styles.actionBtnSnooze}
                            onPress={() => handleSnooze(rem.id)}
                          >
                            <Ionicons name="alarm-outline" size={18} color={Theme.colors.neutralText} />
                            <Text style={styles.actionBtnSnoozeText}>Snooze 15m</Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={styles.actionBtnDismiss}
                            onPress={() => handleDismiss(rem.id)}
                          >
                            <Ionicons name="close" size={18} color={Theme.colors.neutralSecondaryText} />
                          </TouchableOpacity>
                        </>
                      )}
                    </View>
                  </View>
                ))
              )}
            </>
          )}

          {activeTab === 'alerts' && (
            <View>
              {familyAlerts.map(alert => (
                <View key={alert.id} style={styles.alertCard}>
                  <View style={styles.alertTopRow}>
                    <View style={styles.alertMemberRow}>
                      <Ionicons name="person-circle" size={24} color={Theme.colors.primary} />
                      <Text style={styles.alertMemberName}>{alert.member}</Text>
                    </View>
                    <Text style={styles.alertTime}>{alert.time}</Text>
                  </View>
                  <Text style={styles.alertMessage}>{alert.message}</Text>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      )}

      {/* Bottom Navigation Bar */}
      <BottomNavBar activeTab="reminders" />

      {/* Add Reminder Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Health Reminder</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Ionicons name="close" size={24} color={Theme.colors.neutralText} />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Medicine / Task Name</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. Telmisartan 40mg"
              value={newTitle}
              onChangeText={setNewTitle}
            />

            <Text style={styles.inputLabel}>Instructions / Dosage</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. 1 Tablet after breakfast with water"
              value={newSubtitle}
              onChangeText={setNewSubtitle}
            />

            <Text style={styles.inputLabel}>Time</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. 08:30 AM"
              value={newTime}
              onChangeText={setNewTime}
            />

            <Text style={styles.inputLabel}>Priority Level</Text>
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
              {(['high', 'medium', 'low'] as const).map(p => (
                <TouchableOpacity
                  key={p}
                  style={{
                    flex: 1,
                    paddingVertical: 8,
                    borderRadius: 8,
                    alignItems: 'center',
                    backgroundColor: newPriority === p ? Theme.colors.primary : '#F1F3F5',
                  }}
                  onPress={() => setNewPriority(p)}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: '700',
                      color: newPriority === p ? '#ffffff' : Theme.colors.neutralText,
                      textTransform: 'capitalize',
                    }}
                  >
                    {p}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.saveModalButton}
              onPress={handleAddReminder}
            >
              <Text style={styles.saveModalButtonText}>Save Reminder</Text>
            </TouchableOpacity>
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
    backgroundColor: '#E8F0FE',
  },
  tabText: {
    fontWeight: '600',
    color: Theme.colors.neutralSecondaryText,
    fontSize: 13,
  },
  tabTextActive: {
    color: Theme.colors.primary,
    fontWeight: '700',
  },
  content: {
    paddingBottom: 40,
  },
  aiOptimizationCard: {
    backgroundColor: '#F8F0FE',
    borderWidth: 1,
    borderColor: '#E9D5FF',
    borderRadius: Theme.rounding.large,
    padding: 14,
    marginBottom: 16,
  },
  aiHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  aiIconBadge: {
    backgroundColor: '#ffffff',
    padding: 4,
    borderRadius: 6,
    marginRight: 8,
  },
  aiTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6B21A8',
  },
  aiDesc: {
    fontSize: 12,
    color: '#7E22CE',
    lineHeight: 18,
  },
  reminderCard: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.rounding.large,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    ...Theme.shadows.card,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  timeBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  priorityBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Theme.colors.neutralText,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: Theme.colors.neutralSecondaryText,
    marginBottom: 8,
  },
  instructionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 8,
    borderRadius: 6,
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 12,
    color: Theme.colors.neutralText,
    marginLeft: 6,
    flex: 1,
  },
  aiRationaleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF5FF',
    padding: 8,
    borderRadius: 6,
    marginBottom: 12,
  },
  aiRationaleText: {
    fontSize: 11,
    color: '#7E22CE',
    marginLeft: 6,
    flex: 1,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  actionBtnComplete: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10b981',
    paddingVertical: 10,
    borderRadius: Theme.rounding.medium,
    marginRight: 8,
  },
  actionBtnCompleteText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 13,
    marginLeft: 4,
  },
  actionBtnSnooze: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F3F5',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: Theme.rounding.medium,
    marginRight: 8,
  },
  actionBtnSnoozeText: {
    color: Theme.colors.neutralText,
    fontWeight: '600',
    fontSize: 12,
    marginLeft: 4,
  },
  actionBtnDismiss: {
    backgroundColor: '#F1F3F5',
    padding: 10,
    borderRadius: Theme.rounding.medium,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F9F0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    width: '100%',
  },
  completedText: {
    color: '#065F46',
    fontWeight: '600',
    fontSize: 13,
    marginLeft: 8,
  },
  alertCard: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.rounding.large,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  alertTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  alertMemberRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertMemberName: {
    fontWeight: '700',
    fontSize: 15,
    color: Theme.colors.neutralText,
    marginLeft: 8,
  },
  alertTime: {
    fontSize: 12,
    color: Theme.colors.neutralSecondaryText,
  },
  alertMessage: {
    fontSize: 14,
    color: Theme.colors.neutralSecondaryText,
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.rounding.large,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Theme.colors.neutralText,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Theme.colors.neutralText,
    marginBottom: 6,
  },
  modalInput: {
    height: 46,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    marginBottom: 14,
  },
  saveModalButton: {
    backgroundColor: Theme.colors.primary,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  saveModalButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 15,
  },
});
