export interface HealthScoreMetric {
  id: string;
  name: string;
  score: number; // 0-100
  weight: number; // percentage
  status: 'optimal' | 'good' | 'needs_attention';
  statusText: string;
  currentValue: string;
  targetValue: string;
  icon: string;
  color: string;
  summary: string;
}

export interface MonthlyTrendPoint {
  month: string; // e.g. 'Jun', 'Jul', 'Aug'
  score: number;
  avgBp: string;
  avgSteps: number;
  avgSleepHours: number;
}

export interface HealthRecommendation {
  id: string;
  category: 'activity' | 'nutrition' | 'medication' | 'sleep';
  title: string;
  description: string;
  impactScore: string; // e.g. '+3 pts'
  completed: boolean;
}

export interface ComprehensiveHealthScore {
  overallScore: number;
  ratingLabel: 'Optimal' | 'Very Good' | 'Fair' | 'Needs Attention';
  ratingColor: string;
  lastUpdated: string;
  metrics: HealthScoreMetric[];
  trendHistory: MonthlyTrendPoint[];
  recommendations: HealthRecommendation[];
  summaryInsight: string;
}

export const healthScoreService = {
  getHealthScore(): ComprehensiveHealthScore {
    return {
      overallScore: 84,
      ratingLabel: 'Very Good',
      ratingColor: '#10b981', // green
      lastUpdated: 'Today, 08:30 AM',
      summaryInsight: 'Your overall health score has improved by +6 points over the last 90 days, largely driven by consistent blood pressure control and steady daily physical activity.',
      metrics: [
        {
          id: 'metric_lab',
          name: 'Diagnostic & Lab Markers',
          score: 88,
          weight: 35,
          status: 'optimal',
          statusText: 'Optimal Range',
          currentValue: 'HbA1c 6.4% • Chol. 198 mg/dL',
          targetValue: 'HbA1c < 6.5% • Chol. < 200',
          icon: 'pulse',
          color: '#10b981',
          summary: 'Metabolic markers well-managed. Renal and liver indices from latest Apollo panel are completely normal.',
        },
        {
          id: 'metric_vitals',
          name: 'Vital Signs Stability',
          score: 86,
          weight: 30,
          status: 'optimal',
          statusText: 'Well Controlled',
          currentValue: '128/82 mmHg • Pulse 72 bpm',
          targetValue: '< 130/80 mmHg',
          icon: 'heart',
          color: '#0056D2',
          summary: 'Consistent morning systolic and diastolic readings without sudden hypertensive spikes.',
        },
        {
          id: 'metric_activity',
          name: 'Daily Physical Mobility',
          score: 78,
          weight: 20,
          status: 'good',
          statusText: 'Good Consistency',
          currentValue: '3,850 steps / day avg',
          targetValue: '4,500 steps / day',
          icon: 'walk',
          color: '#9b59b6',
          summary: 'Great walking regularity in mornings and evenings. Increasing step count slightly will boost cardiac endurance.',
        },
        {
          id: 'metric_sleep',
          name: 'Sleep Quality & Recovery',
          score: 82,
          weight: 15,
          status: 'good',
          statusText: 'Deep Rest',
          currentValue: '7.2 hrs avg • 88% efficiency',
          targetValue: '7.0 - 8.5 hrs',
          icon: 'moon',
          color: '#f39c12',
          summary: 'Consistent circadian sleep schedule with low wake-frequency during night hours.',
        }
      ],
      trendHistory: [
        { month: 'Jun', score: 78, avgBp: '134/86', avgSteps: 3100, avgSleepHours: 6.8 },
        { month: 'Jul', score: 81, avgBp: '130/84', avgSteps: 3500, avgSleepHours: 7.0 },
        { month: 'Aug', score: 84, avgBp: '128/82', avgSteps: 3850, avgSleepHours: 7.2 },
      ],
      recommendations: [
        {
          id: 'rec_1',
          category: 'activity',
          title: 'Add a 15-min Post-Dinner Stroll',
          description: 'A gentle 15-minute walk after evening meals helps regulate post-prandial glucose and sleep onset.',
          impactScore: '+2 pts',
          completed: false,
        },
        {
          id: 'rec_2',
          category: 'nutrition',
          title: 'Increase Potassium-rich Foods',
          description: 'Incorporate bananas, coconut water, or spinach into lunch to assist natural blood pressure regulation.',
          impactScore: '+2 pts',
          completed: false,
        },
        {
          id: 'rec_3',
          category: 'medication',
          title: 'Maintain 100% Adherence to Telmisartan',
          description: 'Zero missed doses logged for 21 consecutive days! Keep this streak active.',
          impactScore: '+3 pts',
          completed: true,
        }
      ]
    };
  }
};
