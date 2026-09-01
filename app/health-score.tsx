import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from './utils/theme';
import Header from './components/Header';
import { healthScoreService, ComprehensiveHealthScore } from './services/healthScoreService';

export default function HealthScoreDetailScreen() {
  const [data] = useState<ComprehensiveHealthScore>(() => healthScoreService.getHealthScore());

  return (
    <View style={styles.container}>
      <Header
        title="Health Score Breakdown"
        subtitle="Clinical analysis & 90-day trajectory"
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Top Score Banner */}
        <View style={styles.scoreHeroCard}>
          <View style={styles.scoreCircle}>
            <Text style={styles.scoreNumber}>{data.overallScore}</Text>
            <Text style={styles.maxScore}>/ 100</Text>
          </View>

          <View style={{ flex: 1, marginLeft: 16 }}>
            <View style={styles.badgeRow}>
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingText}>{data.ratingLabel} Health</Text>
              </View>
            </View>
            <Text style={styles.lastUpdatedText}>Updated: {data.lastUpdated}</Text>
            <Text style={styles.heroInsightText}>{data.summaryInsight}</Text>
          </View>
        </View>

        {/* 3-Month Trend Visualization */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>3-Month Health Trajectory</Text>
          <Text style={styles.sectionSubtitle}>Tracking monthly vital trends & activity scores</Text>

          <View style={styles.trendRow}>
            {data.trendHistory.map((point, idx) => (
              <View key={idx} style={styles.trendBarCol}>
                <Text style={styles.trendScoreVal}>{point.score}</Text>
                <View style={styles.trendBarTrack}>
                  <View style={[styles.trendBarFill, { height: `${point.score}%` }]} />
                </View>
                <Text style={styles.trendMonthText}>{point.month}</Text>
                <Text style={styles.trendBpText}>BP: {point.avgBp}</Text>
                <Text style={styles.trendStepsText}>{point.avgSteps} steps</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Metric Breakdown Cards */}
        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>Category Score Breakdown</Text>
        </View>

        {data.metrics.map(metric => (
          <View key={metric.id} style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <View style={[styles.metricIconBox, { backgroundColor: metric.color + '15' }]}>
                <Ionicons name={metric.icon as any} size={20} color={metric.color} />
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.metricName}>{metric.name}</Text>
                <Text style={styles.metricValues}>{metric.currentValue}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={[styles.metricScoreNum, { color: metric.color }]}>{metric.score}</Text>
                <Text style={styles.metricWeightText}>Weight {metric.weight}%</Text>
              </View>
            </View>

            {/* Metric Progress Bar */}
            <View style={styles.metricProgressBg}>
              <View style={[styles.metricProgressFill, { width: `${metric.score}%`, backgroundColor: metric.color }]} />
            </View>

            <Text style={styles.metricSummary}>{metric.summary}</Text>
          </View>
        ))}

        {/* Actionable Recommendations */}
        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>Personalized Senior Care Actions</Text>
        </View>

        {data.recommendations.map(rec => (
          <View key={rec.id} style={styles.recCard}>
            <View style={styles.recHeader}>
              <View style={styles.recImpactBadge}>
                <Text style={styles.recImpactText}>{rec.impactScore}</Text>
              </View>
              <Text style={styles.recTitle}>{rec.title}</Text>
            </View>
            <Text style={styles.recDesc}>{rec.description}</Text>
          </View>
        ))}
      </ScrollView>
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
  scoreHeroCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.rounding.large,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    ...Theme.shadows.card,
  },
  scoreCircle: {
    width: 86,
    height: 86,
    borderRadius: 43,
    borderWidth: 5,
    borderColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFBFD',
  },
  scoreNumber: {
    fontSize: 28,
    fontWeight: '800',
    color: '#10b981',
    lineHeight: 32,
  },
  maxScore: {
    fontSize: 10,
    color: Theme.colors.neutralSecondaryText,
    fontWeight: '600',
  },
  badgeRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  ratingBadge: {
    backgroundColor: '#E6F9F0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  ratingText: {
    color: '#10b981',
    fontWeight: '700',
    fontSize: 12,
  },
  lastUpdatedText: {
    fontSize: 11,
    color: Theme.colors.neutralSecondaryText,
    marginBottom: 4,
  },
  heroInsightText: {
    fontSize: 12,
    color: Theme.colors.neutralText,
    lineHeight: 18,
  },
  sectionCard: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.rounding.large,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  sectionTitleRow: {
    marginBottom: 10,
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Theme.colors.neutralText,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: Theme.colors.neutralSecondaryText,
    marginBottom: 16,
  },
  trendRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 160,
    paddingBottom: 8,
  },
  trendBarCol: {
    alignItems: 'center',
    width: '28%',
  },
  trendScoreVal: {
    fontSize: 14,
    fontWeight: '800',
    color: Theme.colors.primary,
    marginBottom: 6,
  },
  trendBarTrack: {
    width: 24,
    height: 90,
    backgroundColor: '#F1F3F5',
    borderRadius: 12,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  trendBarFill: {
    backgroundColor: Theme.colors.primary,
    borderRadius: 12,
  },
  trendMonthText: {
    fontSize: 12,
    fontWeight: '700',
    color: Theme.colors.neutralText,
    marginTop: 8,
  },
  trendBpText: {
    fontSize: 10,
    color: Theme.colors.neutralSecondaryText,
    marginTop: 2,
  },
  trendStepsText: {
    fontSize: 10,
    color: '#10b981',
    fontWeight: '600',
  },
  metricCard: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.rounding.large,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    ...Theme.shadows.card,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  metricName: {
    fontSize: 15,
    fontWeight: '700',
    color: Theme.colors.neutralText,
  },
  metricValues: {
    fontSize: 12,
    color: Theme.colors.neutralSecondaryText,
    marginTop: 2,
  },
  metricScoreNum: {
    fontSize: 18,
    fontWeight: '800',
  },
  metricWeightText: {
    fontSize: 10,
    color: Theme.colors.neutralSecondaryText,
  },
  metricProgressBg: {
    height: 6,
    backgroundColor: '#F1F3F5',
    borderRadius: 3,
    marginVertical: 8,
  },
  metricProgressFill: {
    height: 6,
    borderRadius: 3,
  },
  metricSummary: {
    fontSize: 12,
    color: Theme.colors.neutralSecondaryText,
    lineHeight: 18,
  },
  recCard: {
    backgroundColor: '#FAF5FF',
    borderWidth: 1,
    borderColor: '#E9D5FF',
    borderRadius: Theme.rounding.large,
    padding: 14,
    marginBottom: 10,
  },
  recHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  recImpactBadge: {
    backgroundColor: '#8e44ad',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  recImpactText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800',
  },
  recTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6B21A8',
    flex: 1,
  },
  recDesc: {
    fontSize: 12,
    color: '#7E22CE',
    lineHeight: 18,
  },
});
