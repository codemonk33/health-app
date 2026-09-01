import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from './utils/theme';
import Header from './components/Header';
import BottomNavBar from './components/BottomNavBar';
import { insuranceService, InsurancePolicy, CoverageGapAlert, RecommendedPlan } from './services/insuranceService';

export default function InsuranceScreen() {
  const [policies] = useState<InsurancePolicy[]>(() => insuranceService.getPolicies());
  const [gaps] = useState<CoverageGapAlert[]>(() => insuranceService.getCoverageGaps());
  const [recommendedPlans] = useState<RecommendedPlan[]>(() => insuranceService.getRecommendedPlans());
  const [activeTab, setActiveTab] = useState<'my_policies' | 'gaps' | 'plans'>('my_policies');

  return (
    <View style={styles.container}>
      <Header
        title="Insurance & Claims"
        subtitle="PM-JAY & Private Senior Policy Coverage"
      />

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'my_policies' && styles.tabButtonActive]}
          onPress={() => setActiveTab('my_policies')}
        >
          <Text style={[styles.tabText, activeTab === 'my_policies' && styles.tabTextActive]}>
            Active Policies ({policies.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'gaps' && styles.tabButtonActive]}
          onPress={() => setActiveTab('gaps')}
        >
          <Text style={[styles.tabText, activeTab === 'gaps' && styles.tabTextActive]}>
            Coverage Gaps ({gaps.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'plans' && styles.tabButtonActive]}
          onPress={() => setActiveTab('plans')}
        >
          <Text style={[styles.tabText, activeTab === 'plans' && styles.tabTextActive]}>
            Compare Plans
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'my_policies' && (
          <View>
            {policies.map(policy => {
              const utilizedPercent = Math.min(100, Math.round((policy.utilizedAmount / policy.sumInsured) * 100));

              return (
                <View key={policy.id} style={styles.policyCard}>
                  {/* Card Header */}
                  <View style={styles.cardHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.providerName}>{policy.provider}</Text>
                      <Text style={styles.planName}>{policy.planName}</Text>
                    </View>
                    <View style={styles.activeBadge}>
                      <Text style={styles.activeBadgeText}>{policy.status.toUpperCase()}</Text>
                    </View>
                  </View>

                  <Text style={styles.policyNum}>Policy No: {policy.policyNumber}</Text>
                  <Text style={styles.insuredPerson}>Primary Insured: {policy.primaryInsured}</Text>

                  {/* Coverage Gauge */}
                  <View style={styles.coverageBox}>
                    <View style={styles.coverageRow}>
                      <Text style={styles.coverageLabel}>Total Sum Insured</Text>
                      <Text style={styles.coverageValue}>₹{(policy.sumInsured / 100000).toFixed(0)} Lakhs</Text>
                    </View>

                    <View style={styles.progressBarBg}>
                      <View style={[styles.progressTrack, { width: `${utilizedPercent}%` }]} />
                    </View>

                    <View style={styles.coverageRow}>
                      <Text style={styles.utilText}>Utilized: ₹{policy.utilizedAmount.toLocaleString()}</Text>
                      <Text style={styles.availText}>Available: ₹{policy.availableAmount.toLocaleString()}</Text>
                    </View>
                  </View>

                  {/* Highlights */}
                  <View style={styles.featuresBox}>
                    <Text style={styles.featuresHeading}>Included Key Benefits:</Text>
                    {policy.coverageFeatures.map((feat, idx) => (
                      <View key={idx} style={styles.featureItem}>
                        <Ionicons name="checkmark-circle" size={14} color="#10b981" />
                        <Text style={styles.featureText}>{feat}</Text>
                      </View>
                    ))}
                  </View>

                  {/* Hospital Network */}
                  <View style={styles.footerRow}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Ionicons name="business-outline" size={16} color={Theme.colors.primary} />
                      <Text style={styles.hospCountText}>
                        {policy.cashlessHospitalCount.toLocaleString()} Cashless Hospitals
                      </Text>
                    </View>
                    <Text style={styles.validTillText}>Valid till {policy.validTill}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* Coverage Gaps Tab */}
        {activeTab === 'gaps' && (
          <View>
            <View style={styles.gapIntroCard}>
              <Ionicons name="shield-outline" size={24} color="#f39c12" />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.gapIntroTitle}>NEX-AI Policy Audit</Text>
                <Text style={styles.gapIntroText}>
                  We scanned your linked PM-JAY and Private insurance records to identify out-of-pocket medical risks for senior care.
                </Text>
              </View>
            </View>

            {gaps.map(gap => (
              <View key={gap.id} style={styles.gapCard}>
                <View style={styles.gapHeader}>
                  <Text style={styles.gapTitle}>{gap.title}</Text>
                  <View style={styles.severityBadge}>
                    <Text style={styles.severityText}>{gap.severity.toUpperCase()} RISK</Text>
                  </View>
                </View>

                <Text style={styles.gapDesc}>{gap.description}</Text>

                <View style={styles.actionBox}>
                  <Ionicons name="bulb" size={16} color="#8e44ad" />
                  <Text style={styles.actionText}>{gap.suggestedAction}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Compare Plans Tab */}
        {activeTab === 'plans' && (
          <View>
            {recommendedPlans.map(plan => (
              <View key={plan.id} style={styles.planCard}>
                <Text style={styles.recProvider}>{plan.provider}</Text>
                <Text style={styles.recPlanName}>{plan.planName}</Text>
                <Text style={styles.recSumInsured}>Coverage: {plan.sumInsured} • ₹{plan.premiumYearly.toLocaleString()} / year</Text>

                <View style={styles.planFeaturesList}>
                  {plan.keyBenefits.map((b, i) => (
                    <View key={i} style={styles.featureItem}>
                      <Ionicons name="checkmark-done" size={14} color="#10b981" />
                      <Text style={styles.featureText}>{b}</Text>
                    </View>
                  ))}
                  <View style={styles.featureItem}>
                    <Ionicons name="time-outline" size={14} color={Theme.colors.neutralSecondaryText} />
                    <Text style={styles.featureText}>Pre-existing waiting: {plan.waitingPeriod}</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.quoteBtn}
                  onPress={() => Alert.alert('Plan Advisor', 'A certified health insurance advisor will assist you with enrollment.')}
                  activeOpacity={0.85}
                >
                  <Text style={styles.quoteBtnText}>Request Advisor Call</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
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
    backgroundColor: '#E6F9F0',
  },
  tabText: {
    fontWeight: '600',
    color: Theme.colors.neutralSecondaryText,
    fontSize: 13,
  },
  tabTextActive: {
    color: '#065F46',
    fontWeight: '700',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  policyCard: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.rounding.large,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    ...Theme.shadows.card,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  providerName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#065F46',
    textTransform: 'uppercase',
  },
  planName: {
    fontSize: 16,
    fontWeight: '700',
    color: Theme.colors.neutralText,
    marginTop: 2,
  },
  activeBadge: {
    backgroundColor: '#E6F9F0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  activeBadgeText: {
    color: '#10b981',
    fontWeight: '700',
    fontSize: 10,
  },
  policyNum: {
    fontSize: 12,
    color: Theme.colors.neutralSecondaryText,
    marginBottom: 2,
  },
  insuredPerson: {
    fontSize: 12,
    color: Theme.colors.neutralSecondaryText,
    marginBottom: 12,
  },
  coverageBox: {
    backgroundColor: '#FAFBFD',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  coverageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  coverageLabel: {
    fontSize: 12,
    color: Theme.colors.neutralSecondaryText,
  },
  coverageValue: {
    fontSize: 16,
    fontWeight: '800',
    color: Theme.colors.primary,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#E9ECEF',
    borderRadius: 3,
    marginVertical: 8,
  },
  progressTrack: {
    height: 6,
    backgroundColor: '#10b981',
    borderRadius: 3,
  },
  utilText: {
    fontSize: 11,
    color: Theme.colors.neutralSecondaryText,
  },
  availText: {
    fontSize: 11,
    color: '#10b981',
    fontWeight: '600',
  },
  featuresBox: {
    marginBottom: 12,
  },
  featuresHeading: {
    fontSize: 12,
    fontWeight: '700',
    color: Theme.colors.neutralText,
    marginBottom: 6,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 6,
  },
  featureText: {
    fontSize: 12,
    color: Theme.colors.neutralText,
    flex: 1,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.border,
  },
  hospCountText: {
    fontSize: 12,
    fontWeight: '600',
    color: Theme.colors.primary,
    marginLeft: 4,
  },
  validTillText: {
    fontSize: 11,
    color: Theme.colors.neutralSecondaryText,
  },
  gapIntroCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF5E7',
    padding: 14,
    borderRadius: Theme.rounding.large,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F9E79F',
  },
  gapIntroTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#7D6608',
  },
  gapIntroText: {
    fontSize: 12,
    color: '#9A7D0A',
    marginTop: 2,
    lineHeight: 18,
  },
  gapCard: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.rounding.large,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  gapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  gapTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Theme.colors.neutralText,
    flex: 1,
  },
  severityBadge: {
    backgroundColor: '#FEF5E7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  severityText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#D35400',
  },
  gapDesc: {
    fontSize: 13,
    color: Theme.colors.neutralSecondaryText,
    lineHeight: 18,
    marginBottom: 10,
  },
  actionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF5FF',
    padding: 10,
    borderRadius: 8,
    gap: 6,
  },
  actionText: {
    fontSize: 12,
    color: '#7E22CE',
    fontWeight: '600',
    flex: 1,
  },
  planCard: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.rounding.large,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  recProvider: {
    fontSize: 12,
    fontWeight: '700',
    color: Theme.colors.primary,
    textTransform: 'uppercase',
  },
  recPlanName: {
    fontSize: 16,
    fontWeight: '700',
    color: Theme.colors.neutralText,
    marginTop: 2,
  },
  recSumInsured: {
    fontSize: 13,
    color: Theme.colors.neutralSecondaryText,
    marginTop: 2,
    marginBottom: 12,
  },
  planFeaturesList: {
    marginBottom: 14,
  },
  quoteBtn: {
    backgroundColor: Theme.colors.primary,
    height: 46,
    borderRadius: Theme.rounding.medium,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quoteBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },
});
