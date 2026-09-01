export interface InsurancePolicy {
  id: string;
  policyNumber: string;
  provider: string;
  planName: string;
  type: 'government' | 'private' | 'corporate';
  sumInsured: number;
  utilizedAmount: number;
  availableAmount: number;
  validTill: string;
  cashlessHospitalCount: number;
  primaryInsured: string;
  coverageFeatures: string[];
  exclusions: string[];
  status: 'active' | 'expiring_soon' | 'inactive';
}

export interface CoverageGapAlert {
  id: string;
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  suggestedAction: string;
}

export interface RecommendedPlan {
  id: string;
  provider: string;
  planName: string;
  premiumYearly: number;
  sumInsured: string;
  keyBenefits: string[];
  waitingPeriod: string;
  noPrePolicyMedicalCheck: boolean;
}

const POLICIES: InsurancePolicy[] = [
  {
    id: 'pol_1',
    policyNumber: 'PMJAY-ABHA-8821-9901',
    provider: 'Ayushman Bharat (PM-JAY)',
    planName: 'National Health Protection Scheme for Senior Citizens',
    type: 'government',
    sumInsured: 500000,
    utilizedAmount: 45000,
    availableAmount: 455000,
    validTill: '31 Dec 2026',
    cashlessHospitalCount: 28400,
    primaryInsured: 'Ramesh Sharma (Age 68)',
    coverageFeatures: [
      '₹5 Lakhs family floater hospitalization coverage',
      'Free secondary and tertiary healthcare in empanelled hospitals',
      'Pre and post hospitalization expenses (3 days pre & 15 days post)',
      'All pre-existing conditions covered from Day 1'
    ],
    exclusions: ['Outpatient consultation (OPD)', 'Routine dental examinations', 'Cosmetic procedures'],
    status: 'active',
  },
  {
    id: 'pol_2',
    policyNumber: 'STAR-SNR-4402-1823',
    provider: 'Star Health & Allied Insurance',
    planName: 'Senior Citizens Red Carpet Health Insurance',
    type: 'private',
    sumInsured: 1000000,
    utilizedAmount: 0,
    availableAmount: 1000000,
    validTill: '15 Oct 2026',
    cashlessHospitalCount: 14200,
    primaryInsured: 'Ramesh Sharma',
    coverageFeatures: [
      '₹10 Lakhs individual senior health cover',
      'Emergency ambulance charges up to ₹2,000 per hospitalization',
      'Modern treatments including Robotic Surgeries',
      'Direct in-house cashless claim settlement'
    ],
    exclusions: ['Initial 30 days waiting period for non-accidental illness'],
    status: 'active',
  }
];

const GAPS: CoverageGapAlert[] = [
  {
    id: 'gap_1',
    title: 'OPD & Pharmacy Out-of-Pocket Expense',
    description: 'Your existing PM-JAY and Private policies cover inpatient hospitalization, but regular monthly cardiac/diabetic medicines (approx ₹1,800/mo) and doctor OPD visits are not reimbursed.',
    severity: 'medium',
    suggestedAction: 'Consider adding CureAI OPD & Pharmacy Care Rider to save up to 40% on prescriptions.',
  },
  {
    id: 'gap_2',
    title: 'Home Healthcare & Physiotherapy Cover',
    description: 'Post-hospitalization home nursing and physiotherapy are capped at 15 days.',
    severity: 'low',
    suggestedAction: 'Link your ABHA card to activate integrated ABDM claim approvals.',
  }
];

const RECOMMENDED_PLANS: RecommendedPlan[] = [
  {
    id: 'rec_1',
    provider: 'Care Health Insurance',
    planName: 'Care Senior Comprehensive',
    premiumYearly: 24500,
    sumInsured: '₹10 Lakhs',
    keyBenefits: ['Day 1 coverage for hypertension & diabetes with nominal co-pay', 'Unlimited automatic recharge of sum insured', 'Annual health checkup for senior policyholder'],
    waitingPeriod: '24 Months for listed conditions',
    noPrePolicyMedicalCheck: true,
  },
  {
    id: 'rec_2',
    provider: 'Niva Bupa Health Insurance',
    planName: 'Senior First Platinum',
    premiumYearly: 28900,
    sumInsured: '₹15 Lakhs',
    keyBenefits: ['No age restriction for entry', 'Emergency road and air ambulance support', 'Zero co-payment options available'],
    waitingPeriod: '12 Months for pre-existing diseases',
    noPrePolicyMedicalCheck: false,
  }
];

export const insuranceService = {
  getPolicies(): InsurancePolicy[] {
    return POLICIES;
  },

  getCoverageGaps(): CoverageGapAlert[] {
    return GAPS;
  },

  getRecommendedPlans(): RecommendedPlan[] {
    return RECOMMENDED_PLANS;
  }
};
