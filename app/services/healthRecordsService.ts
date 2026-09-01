import AsyncStorage from '@react-native-async-storage/async-storage';

export type RecordCategory = 'all' | 'prescription' | 'lab_report' | 'scan' | 'discharge_summary' | 'vaccine';

export interface NexAiSummary {
  keyFindings: string[];
  vitalMetrics: { label: string; value: string; status: 'normal' | 'attention' | 'warning' }[];
  doctorAdvice: string;
  recommendedFollowUp?: string;
  riskScore: number; // 0-100
}

export interface HealthRecordItem {
  id: string;
  title: string;
  doctorOrLab: string;
  date: string; // YYYY-MM-DD
  category: Exclude<RecordCategory, 'all'>;
  type: 'image' | 'document' | 'abha';
  uri?: string;
  fileSize?: string;
  tags: string[];
  aiSummary?: NexAiSummary;
  isAiAnalyzed?: boolean;
}

const HEALTH_RECORDS_KEY = 'cureai_health_records_v2';

const SEED_RECORDS: HealthRecordItem[] = [
  {
    id: 'rec_1',
    title: 'Lipid Profile & HbA1c Report',
    doctorOrLab: 'Apollo Diagnostics',
    date: '2026-08-15',
    category: 'lab_report',
    type: 'document',
    fileSize: '1.4 MB',
    tags: ['Cholesterol', 'HbA1c', 'Sugar'],
    isAiAnalyzed: true,
    aiSummary: {
      keyFindings: [
        'Total Cholesterol: 198 mg/dL (Borderline normal < 200)',
        'HbA1c: 6.4% (Pre-diabetic target range, well controlled)',
        'Triglycerides: 142 mg/dL (Normal)'
      ],
      vitalMetrics: [
        { label: 'HbA1c', value: '6.4%', status: 'normal' },
        { label: 'Total Chol.', value: '198 mg/dL', status: 'attention' },
        { label: 'HDL Chol.', value: '44 mg/dL', status: 'normal' }
      ],
      doctorAdvice: 'Maintain low-oil diet, continue Telmisartan and evening walks. Schedule 3-month re-check.',
      recommendedFollowUp: 'November 2026',
      riskScore: 22,
    }
  },
  {
    id: 'rec_2',
    title: 'Hypertension Prescription',
    doctorOrLab: 'Dr. Aisha Verma (Cardiologist)',
    date: '2026-08-02',
    category: 'prescription',
    type: 'image',
    fileSize: '820 KB',
    tags: ['Blood Pressure', 'Telmisartan', 'Cardiology'],
    isAiAnalyzed: true,
    aiSummary: {
      keyFindings: [
        'Prescribed Telmisartan 40mg once daily',
        'Salt restricted diet advised (< 5g/day)',
        'Target BP: < 130/80 mmHg'
      ],
      vitalMetrics: [
        { label: 'Systolic BP', value: '128 mmHg', status: 'normal' },
        { label: 'Diastolic BP', value: '82 mmHg', status: 'normal' }
      ],
      doctorAdvice: 'Take medication strictly after breakfast. Report any dizziness.',
      recommendedFollowUp: 'September 2026',
      riskScore: 18,
    }
  },
  {
    id: 'rec_3',
    title: 'Chest X-Ray (PA View)',
    doctorOrLab: 'City Imaging & Scan Center',
    date: '2026-06-20',
    category: 'scan',
    type: 'image',
    fileSize: '3.2 MB',
    tags: ['Lungs', 'Chest', 'X-Ray'],
    isAiAnalyzed: true,
    aiSummary: {
      keyFindings: [
        'Clear lung fields, no active focal consolidation',
        'Normal cardiac silhouette size (CTR < 0.5)',
        'Bilateral CP angles are clear'
      ],
      vitalMetrics: [
        { label: 'Lung Status', value: 'Clear', status: 'normal' },
        { label: 'Heart Size', value: 'Normal', status: 'normal' }
      ],
      doctorAdvice: 'No acute cardiopulmonary pathology detected.',
      riskScore: 10,
    }
  }
];

export const healthRecordsService = {
  async getRecords(): Promise<HealthRecordItem[]> {
    try {
      const raw = await AsyncStorage.getItem(HEALTH_RECORDS_KEY);
      if (!raw) {
        await AsyncStorage.setItem(HEALTH_RECORDS_KEY, JSON.stringify(SEED_RECORDS));
        return SEED_RECORDS;
      }
      return JSON.parse(raw);
    } catch {
      return SEED_RECORDS;
    }
  },

  async addRecord(record: Omit<HealthRecordItem, 'id'>): Promise<HealthRecordItem> {
    const records = await this.getRecords();
    const newRecord: HealthRecordItem = {
      ...record,
      id: `rec_${Date.now()}`,
    };
    const updated = [newRecord, ...records];
    await AsyncStorage.setItem(HEALTH_RECORDS_KEY, JSON.stringify(updated));
    return newRecord;
  },

  async deleteRecord(id: string): Promise<HealthRecordItem[]> {
    const records = await this.getRecords();
    const updated = records.filter(r => r.id !== id);
    await AsyncStorage.setItem(HEALTH_RECORDS_KEY, JSON.stringify(updated));
    return updated;
  },

  async triggerAiAnalysis(recordId: string): Promise<NexAiSummary> {
    // Simulate AI clinical parsing delay
    await new Promise(res => setTimeout(res, 1800));

    const records = await this.getRecords();
    const record = records.find(r => r.id === recordId);

    const generatedSummary: NexAiSummary = {
      keyFindings: [
        'Document scanned and parsed via NEX Clinical OCR engine',
        'Values detected within safe clinical limits for elderly baseline',
        'No emergency indicators or drug counter-indications found'
      ],
      vitalMetrics: [
        { label: 'Overall Status', value: 'Stable', status: 'normal' },
        { label: 'Risk Factor', value: 'Low', status: 'normal' }
      ],
      doctorAdvice: 'Continue present routine and stay hydrated. Consult your physician for dosage adjustments.',
      riskScore: 15,
    };

    if (record) {
      record.isAiAnalyzed = true;
      record.aiSummary = generatedSummary;
      await AsyncStorage.setItem(HEALTH_RECORDS_KEY, JSON.stringify(records));
    }

    return generatedSummary;
  }
};
