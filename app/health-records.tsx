import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useMemo, useState, useEffect } from 'react';
import { Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View, Modal, TextInput, ActivityIndicator, ScrollView } from 'react-native';
import { Theme } from './utils/theme';
import Header from './components/Header';
import EmptyState from './components/EmptyState';
import LoadingState from './components/LoadingState';
import BottomNavBar from './components/BottomNavBar';
import { healthRecordsService, HealthRecordItem, RecordCategory } from './services/healthRecordsService';
import { useAuth } from './context/AuthContext';

const CATEGORIES: { key: RecordCategory; label: string; icon: any }[] = [
  { key: 'all', label: 'All Records', icon: 'grid' },
  { key: 'lab_report', label: 'Lab Reports', icon: 'pulse' },
  { key: 'prescription', label: 'Prescriptions', icon: 'medkit' },
  { key: 'scan', label: 'Scans & X-Rays', icon: 'image' },
  { key: 'discharge_summary', label: 'Discharge', icon: 'document-text' },
];

export default function HealthRecordsScreen() {
  const { session } = useAuth();

  const [records, setRecords] = useState<HealthRecordItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<RecordCategory>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Upload Progress State
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Detail Modal & AI Analysis State
  const [selectedRecord, setSelectedRecord] = useState<HealthRecordItem | null>(null);
  const [isAnalyzingAi, setIsAnalyzingAi] = useState(false);

  // ABHA Sync Modal
  const [abhaModalVisible, setAbhaModalVisible] = useState(false);
  const [abhaInput, setAbhaInput] = useState(session?.abhaId || 'ramesh.sharma@abdm');
  const [isAbhaSyncing, setIsAbhaSyncing] = useState(false);

  const loadRecords = async () => {
    setIsLoading(true);
    try {
      const data = await healthRecordsService.getRecords();
      setRecords(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, []);

  const filteredRecords = useMemo(() => {
    if (selectedCategory === 'all') return records;
    return records.filter(r => r.category === selectedCategory);
  }, [records, selectedCategory]);

  const handleDeleteRecord = (id: string) => {
    Alert.alert('Delete Record', 'Are you sure you want to remove this clinical record?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const updated = await healthRecordsService.deleteRecord(id);
          setRecords(updated);
          if (selectedRecord?.id === id) setSelectedRecord(null);
        }
      }
    ]);
  };

  const handleScanDocument = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Camera permission is needed to scan medical records.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      await simulateUploadAndSave(result.assets[0].uri, 'Scanned Doctor Report', 'prescription');
    }
  };

  const handleUploadFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      await simulateUploadAndSave(result.assets[0].uri, 'Uploaded Lab Report', 'lab_report');
    }
  };

  const simulateUploadAndSave = async (uri: string, title: string, category: HealthRecordItem['category']) => {
    setIsUploading(true);
    setUploadProgress(20);
    await new Promise(r => setTimeout(r, 400));
    setUploadProgress(65);
    await new Promise(r => setTimeout(r, 500));
    setUploadProgress(100);

    const newRecord = await healthRecordsService.addRecord({
      title,
      doctorOrLab: 'Uploaded Document',
      date: new Date().toISOString().split('T')[0],
      category,
      type: 'image',
      uri,
      fileSize: '1.2 MB',
      tags: ['Uploaded', 'Pending Analysis'],
      isAiAnalyzed: false,
    });

    setIsUploading(false);
    setUploadProgress(0);
    setRecords(prev => [newRecord, ...prev]);
    Alert.alert('Upload Successful', 'Document securely stored and ready for AI clinical parsing.');
  };

  const handleTriggerAiAnalysis = async (recordId: string) => {
    setIsAnalyzingAi(true);
    try {
      const summary = await healthRecordsService.triggerAiAnalysis(recordId);
      setRecords(prev => prev.map(r => r.id === recordId ? { ...r, isAiAnalyzed: true, aiSummary: summary } : r));
      if (selectedRecord?.id === recordId) {
        setSelectedRecord(prev => prev ? { ...prev, isAiAnalyzed: true, aiSummary: summary } : null);
      }
      Alert.alert('NEX-AI Analysis Complete', 'Key clinical markers and doctor advice extracted.');
    } catch {
      Alert.alert('Error', 'Could not complete AI analysis at this moment.');
    } finally {
      setIsAnalyzingAi(false);
    }
  };

  const handleAbhaSync = async () => {
    setIsAbhaSyncing(true);
    await new Promise(r => setTimeout(r, 1500));
    setIsAbhaSyncing(false);
    setAbhaModalVisible(false);
    Alert.alert('ABHA Sync Complete', 'Retrieved 3 verified diagnostic records from Ayushman Bharat Digital Health Network.');
  };

  return (
    <View style={styles.container}>
      <Header
        title="Health Records"
        subtitle="ABHA Locker & AI Clinical Summaries"
        rightAction={{
          icon: 'cloud-download-outline',
          onPress: () => setAbhaModalVisible(true),
          color: '#10b981',
        }}
      />

      {/* Upload Progress Bar */}
      {isUploading && (
        <View style={styles.uploadProgressBar}>
          <Text style={styles.uploadProgressText}>Uploading & Validating Encrypted File... {uploadProgress}%</Text>
          <View style={[styles.progressTrack, { width: `${uploadProgress}%` }]} />
        </View>
      )}

      {/* Action Buttons Row */}
      <View style={[styles.actionsBar, { paddingHorizontal: 16, paddingVertical: 12 }]}>
        <TouchableOpacity style={styles.uploadBtn} onPress={handleScanDocument} activeOpacity={0.8}>
          <Ionicons name="camera" size={18} color="#ffffff" />
          <Text style={styles.uploadBtnText}>Scan Record</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.galleryBtn} onPress={handleUploadFromGallery} activeOpacity={0.8}>
          <Ionicons name="cloud-upload" size={18} color={Theme.colors.primary} />
          <Text style={styles.galleryBtnText}>Upload File</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.abhaBtn} onPress={() => setAbhaModalVisible(true)} activeOpacity={0.8}>
          <Ionicons name="sync" size={18} color="#065F46" />
          <Text style={styles.abhaBtnText}>ABHA Sync</Text>
        </TouchableOpacity>
      </View>

      {/* Category Pills */}
      <View style={styles.categoriesContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesScroll}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat.key}
              style={[styles.categoryPill, selectedCategory === cat.key && styles.categoryPillActive]}
              onPress={() => setSelectedCategory(cat.key)}
            >
              <Ionicons
                name={cat.icon}
                size={16}
                color={selectedCategory === cat.key ? '#ffffff' : Theme.colors.neutralSecondaryText}
                style={{ marginRight: 6 }}
              />
              <Text style={[styles.categoryPillText, selectedCategory === cat.key && styles.categoryPillTextActive]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {isLoading ? (
        <LoadingState message="Loading encrypted records..." />
      ) : (
        <FlatList
          data={filteredRecords}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[styles.listContainer, { padding: 16 }]}
          ListEmptyComponent={
            <EmptyState
              icon="document-text-outline"
              title="No Records Found"
              description="Scan or upload medical prescriptions, lab reports, and scans to view automatic AI summaries."
              actionText="Scan Document"
              onActionPress={handleScanDocument}
            />
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.recordCard}
              onPress={() => setSelectedRecord(item)}
              activeOpacity={0.85}
            >
              <View style={styles.recordTopRow}>
                <View style={styles.recordIconBox}>
                  <Ionicons
                    name={item.category === 'lab_report' ? 'pulse' : item.category === 'prescription' ? 'medkit' : 'document-text'}
                    size={22}
                    color={Theme.colors.primary}
                  />
                </View>

                <View style={styles.recordDetails}>
                  <Text style={styles.recordTitle}>{item.title}</Text>
                  <Text style={styles.recordDoctor}>{item.doctorOrLab} • {item.date}</Text>
                  <View style={styles.tagRow}>
                    {item.tags.map((tag, i) => (
                      <View key={i} style={styles.tagBadge}>
                        <Text style={styles.tagText}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => handleDeleteRecord(item.id)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="trash-outline" size={20} color={Theme.colors.danger} />
                </TouchableOpacity>
              </View>

              {/* NEX AI Summary Preview */}
              {item.isAiAnalyzed && item.aiSummary ? (
                <View style={styles.aiSummaryBox}>
                  <View style={styles.aiSummaryHeader}>
                    <Ionicons name="sparkles" size={14} color="#8e44ad" />
                    <Text style={styles.aiSummaryTitle}>NEX-AI Summary</Text>
                  </View>
                  <Text style={styles.aiSummaryText} numberOfLines={2}>
                    {item.aiSummary.keyFindings[0]}
                  </Text>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.triggerAiBtn}
                  onPress={() => handleTriggerAiAnalysis(item.id)}
                >
                  <Ionicons name="sparkles-outline" size={14} color={Theme.colors.primary} />
                  <Text style={styles.triggerAiText}>Analyze with NEX-AI</Text>
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          )}
        />
      )}

      {/* Bottom Navigation Bar */}
      <BottomNavBar activeTab="records" />

      {/* Record Details & Full AI Analysis Modal */}
      <Modal
        visible={!!selectedRecord}
        animationType="slide"
        onRequestClose={() => setSelectedRecord(null)}
      >
        <View style={styles.modalFullContainer}>
          <Header
            title={selectedRecord?.title || 'Record Details'}
            subtitle={selectedRecord?.doctorOrLab}
            showBack={true}
            onBackPress={() => setSelectedRecord(null)}
          />

          <ScrollView contentContainerStyle={styles.modalScrollContent} showsVerticalScrollIndicator={false}>
            {selectedRecord?.uri && (
              <Image source={{ uri: selectedRecord.uri }} style={styles.previewImage} resizeMode="contain" />
            )}

            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>Document Metadata</Text>
              <Text style={styles.detailMetaText}>Date: {selectedRecord?.date}</Text>
              <Text style={styles.detailMetaText}>Source: {selectedRecord?.doctorOrLab}</Text>
              <Text style={styles.detailMetaText}>Size: {selectedRecord?.fileSize || '1.1 MB'}</Text>
            </View>

            {/* Full NEX AI Summary */}
            {selectedRecord?.isAiAnalyzed && selectedRecord?.aiSummary ? (
              <View style={styles.fullAiBox}>
                <View style={styles.fullAiHeader}>
                  <Ionicons name="sparkles" size={20} color="#8e44ad" />
                  <Text style={styles.fullAiTitle}>NEX-AI Clinical Analysis</Text>
                </View>

                <Text style={styles.aiSubHeading}>Key Clinical Findings:</Text>
                {selectedRecord.aiSummary.keyFindings.map((finding, idx) => (
                  <View key={idx} style={styles.bulletRow}>
                    <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                    <Text style={styles.bulletText}>{finding}</Text>
                  </View>
                ))}

                <Text style={[styles.aiSubHeading, { marginTop: 14 }]}>Doctor & Lifestyle Advice:</Text>
                <Text style={styles.adviceText}>{selectedRecord.aiSummary.doctorAdvice}</Text>

                {selectedRecord.aiSummary.recommendedFollowUp && (
                  <View style={styles.followUpBox}>
                    <Ionicons name="calendar-outline" size={16} color="#0056D2" />
                    <Text style={styles.followUpText}>
                      Recommended Follow-Up: {selectedRecord.aiSummary.recommendedFollowUp}
                    </Text>
                  </View>
                )}
              </View>
            ) : (
              <TouchableOpacity
                style={styles.modalAiTriggerBtn}
                onPress={() => selectedRecord && handleTriggerAiAnalysis(selectedRecord.id)}
                disabled={isAnalyzingAi}
              >
                {isAnalyzingAi ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <>
                    <Ionicons name="sparkles" size={18} color="#ffffff" />
                    <Text style={styles.modalAiTriggerText}>Run Full NEX-AI Analysis</Text>
                  </>
                )}
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
      </Modal>

      {/* ABHA Sync Modal */}
      <Modal
        visible={abhaModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setAbhaModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.abhaModalContent}>
            <View style={styles.abhaModalHeader}>
              <Text style={styles.abhaModalTitle}>Ayushman Bharat (ABHA) Sync</Text>
              <TouchableOpacity onPress={() => setAbhaModalVisible(false)}>
                <Ionicons name="close" size={24} color={Theme.colors.neutralText} />
              </TouchableOpacity>
            </View>

            <Text style={styles.abhaModalSubtitle}>
              Fetch verified health records, lab reports, and hospital discharge summaries linked to your ABHA ID.
            </Text>

            <TextInput
              style={styles.abhaInput}
              value={abhaInput}
              onChangeText={setAbhaInput}
              placeholder="e.g. name@abdm or 14-digit number"
            />

            <TouchableOpacity
              style={styles.abhaSubmitBtn}
              onPress={handleAbhaSync}
              disabled={isAbhaSyncing}
            >
              {isAbhaSyncing ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.abhaSubmitText}>Fetch from ABDM Registry</Text>
              )}
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
  uploadProgressBar: {
    backgroundColor: '#E8F0FE',
    padding: 8,
  },
  uploadProgressText: {
    fontSize: 12,
    color: Theme.colors.primary,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  progressTrack: {
    height: 4,
    backgroundColor: Theme.colors.primary,
    borderRadius: 2,
  },
  actionsBar: {
    flexDirection: 'row',
    backgroundColor: Theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
    gap: 8,
  },
  uploadBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Theme.colors.primary,
    paddingVertical: 10,
    borderRadius: Theme.rounding.medium,
    gap: 6,
  },
  uploadBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 13,
  },
  galleryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8F0FE',
    paddingVertical: 10,
    borderRadius: Theme.rounding.medium,
    gap: 6,
  },
  galleryBtnText: {
    color: Theme.colors.primary,
    fontWeight: '700',
    fontSize: 13,
  },
  abhaBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E6F9F0',
    paddingVertical: 10,
    borderRadius: Theme.rounding.medium,
    gap: 6,
  },
  abhaBtnText: {
    color: '#065F46',
    fontWeight: '700',
    fontSize: 13,
  },
  categoriesContainer: {
    backgroundColor: Theme.colors.surface,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  categoriesScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F1F3F5',
  },
  categoryPillActive: {
    backgroundColor: Theme.colors.primary,
  },
  categoryPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: Theme.colors.neutralSecondaryText,
  },
  categoryPillTextActive: {
    color: '#ffffff',
  },
  listContainer: {
    paddingBottom: 40,
  },
  recordCard: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.rounding.large,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    ...Theme.shadows.card,
  },
  recordTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  recordIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E8F0FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  recordDetails: {
    flex: 1,
  },
  recordTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Theme.colors.neutralText,
    marginBottom: 2,
  },
  recordDoctor: {
    fontSize: 13,
    color: Theme.colors.neutralSecondaryText,
    marginBottom: 6,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  tagBadge: {
    backgroundColor: '#F1F3F5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tagText: {
    fontSize: 11,
    color: Theme.colors.neutralSecondaryText,
    fontWeight: '500',
  },
  deleteBtn: {
    padding: 6,
  },
  aiSummaryBox: {
    marginTop: 12,
    backgroundColor: '#FAF5FF',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E9D5FF',
  },
  aiSummaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 4,
  },
  aiSummaryTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B21A8',
  },
  aiSummaryText: {
    fontSize: 12,
    color: '#7E22CE',
    lineHeight: 16,
  },
  triggerAiBtn: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    backgroundColor: '#E8F0FE',
    borderRadius: 6,
    gap: 4,
  },
  triggerAiText: {
    fontSize: 12,
    fontWeight: '700',
    color: Theme.colors.primary,
  },
  modalFullContainer: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  modalScrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  previewImage: {
    width: '100%',
    height: 240,
    borderRadius: Theme.rounding.large,
    backgroundColor: '#000000',
    marginBottom: 16,
  },
  detailSection: {
    backgroundColor: Theme.colors.surface,
    padding: 16,
    borderRadius: Theme.rounding.large,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  detailSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Theme.colors.neutralText,
    marginBottom: 8,
  },
  detailMetaText: {
    fontSize: 14,
    color: Theme.colors.neutralSecondaryText,
    marginBottom: 4,
  },
  fullAiBox: {
    backgroundColor: '#FAF5FF',
    padding: 16,
    borderRadius: Theme.rounding.large,
    borderWidth: 1,
    borderColor: '#E9D5FF',
  },
  fullAiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  fullAiTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#6B21A8',
  },
  aiSubHeading: {
    fontSize: 14,
    fontWeight: '700',
    color: '#581C87',
    marginBottom: 8,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
    gap: 6,
  },
  bulletText: {
    flex: 1,
    fontSize: 13,
    color: '#4A044E',
    lineHeight: 18,
  },
  adviceText: {
    fontSize: 13,
    color: '#4A044E',
    lineHeight: 20,
  },
  followUpBox: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F0FE',
    padding: 10,
    borderRadius: 8,
    gap: 8,
  },
  followUpText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0056D2',
  },
  modalAiTriggerBtn: {
    flexDirection: 'row',
    backgroundColor: '#8e44ad',
    height: 52,
    borderRadius: Theme.rounding.large,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  modalAiTriggerText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  abhaModalContent: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.rounding.large,
    padding: 20,
  },
  abhaModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  abhaModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Theme.colors.neutralText,
  },
  abhaModalSubtitle: {
    fontSize: 13,
    color: Theme.colors.neutralSecondaryText,
    marginBottom: 16,
    lineHeight: 18,
  },
  abhaInput: {
    height: 48,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 15,
    marginBottom: 16,
  },
  abhaSubmitBtn: {
    backgroundColor: '#065F46',
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  abhaSubmitText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
});
