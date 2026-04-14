
export enum RiskLevel {
  High = 'High',
  Medium = 'Medium',
  Low = 'Low',
}

export interface RiskHistoryEntry {
  timestamp: string;
  updatedBy?: string;
  changeSummary?: string;
  data: Omit<Risk, 'history'>;
}

export interface ECCControl {
  id: string;
  domainCode: string;
  domainName: string;
  subDomainCode: string;
  subDomainName: string;
  controlCode: string;
  controlName: string;
}

export enum ControlStatus {
    Implemented = 'Implemented',
    PartiallyImplemented = 'Partially Implemented',
    NotImplemented = 'Not Implemented',
    NotApplicable = 'Not Applicable',
    NotAssessed = 'Not Assessed',
}

export enum MaturityRating {
    Level0 = '0 - Incomplete',
    Level1 = '1 - Initial',
    Level2 = '2 - Managed',
    Level3 = '3 - Defined',
    Level4 = '4 - Quantitatively Managed',
    Level5 = '5 - Optimizing',
    NotAssessed = 'Not Assessed',
}

export interface ECCAssessment extends ECCControl {
    status: ControlStatus;
    maturity: MaturityRating;
    recommendation: string;
    managementResponse: string;
    targetDate: string;
}

// Type for batch updating an ECC assessment, used by the AI assistant.
export type BatchEccUpdate = Partial<Pick<ECCAssessment, 'status' | 'maturity' | 'recommendation' | 'managementResponse' | 'targetDate'>>;


export enum UserRole {
  Admin = 'Admin',
  User = 'User',
  Auditor = 'Auditor',
}

export interface License {
  id: string;
  key: string;
  clientId: string;
  expiryDate: string;
  type: 'Web' | 'AirGap' | 'Hardware';
  status: 'Active' | 'Expired' | 'Revoked';
  issuedAt: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  organization: string;
  licenses: string[]; // License IDs
}

export interface Risk {
  id: string;
  RiskID: string;
  RiskTitle: string;
  Type: string;
  Description: string;
  RiskRating: string;
  Likelihood: string;
  Impact: string;
  MitigatingActions: string;
  RiskOwner: string;
  Stakeholders?: string;
  Status: string;
  RiskLevel: RiskLevel;
  // New fields for Gap Assessment
  ControlEffectiveness?: string;
  GapDescription?: string;
  RemediationPlan?: string;
  history?: RiskHistoryEntry[];
  // New field for ECC Control linking
  linkedControls?: string[];
  // New field for evidence upload
  evidenceFile?: {
    name: string;
    type: string;
    data: string; // base64 encoded
    analysis?: string; // AI analysis result
  };
  // New field for AI Risk Analysis
  aiAnalysis?: string;
  DescriptionEN?: string;
  DescriptionAR?: string;
  KRI?: string;
  LeadTrigger?: string;
  LagTrigger?: string;
  RPN?: number;
  isVitalFew?: boolean;
  // Identification Tools
  fishbone?: {
    people?: string;
    process?: string;
    technology?: string;
    environment?: string;
    management?: string;
    materials?: string;
  };
  fiveWhys?: string[];
  // Monitoring & Review
  incidents?: {
    id: string;
    date: string;
    description: string;
    impact: string;
    actionTaken: string;
  }[];
  kpiTarget?: string;
  kpiActual?: string;
}

// Type for batch updating a risk, used by the AI assistant.
export type BatchRiskUpdate = Partial<Pick<Risk, 'Likelihood' | 'Impact' | 'MitigatingActions' | 'RemediationPlan' | 'RiskOwner' | 'Stakeholders' | 'Status' | 'ControlEffectiveness' | 'GapDescription' | 'linkedControls' | 'aiAnalysis'>>;

// Type for storing conversation history for the live assistant.
export interface ConversationLogEntry {
    speaker: 'user' | 'assistant';
    text: string;
}


// --- Risk Assessment Criteria Data ---

export const riskCategories = [
    'Access Control', 'AI & Analytics', 'AI Security', 'Architecture', 'Blockchain', 'Business Continuity', 'Cloud Security', 
    'Compliance & Legal', 'Cyber Risk', 'Cyber Threat', 'Cybercrime', 'Cybersecurity', 'Data Governance', 'Development', 
    'Development & Security', 'Device Management', 'Digital Engineering', 'Digital Operations', 'Digital Transformation', 
    'Digital Workplace', 'Emerging Tech Risk', 'Emerging Technology', 'Endpoint Security', 'Engineering', 'Ethical AI', 
    'External Threat', 'Financial', 'Financial & Strategy', 'Financial Risk', 'Governance', 'Governance & Compliance', 
    'HR & Continuity', 'Human Factor', 'Identity & Access', 'Identity Management', 'IT Infrastructure', 'IT Obsolescence', 
    'IT Operations', 'IT Risk', 'Innovation', 'Innovation Governance', 'Infrastructure & Ops', 'Integration & DevOps', 
    'Integration & Security', 'Legal & Compliance', 'Legal & Security', 'Marketing & UX', 'Operational', 'Performance Risk', 
    'Platform Governance', 'Product & Innovation', 'Project Risk', 'Quality Assurance', 'Regulatory', 'Regulatory Compliance', 
    'Regulatory Risk', 'Service Management', 'Shadow IT', 'Software Development', 'Strategic', 'Strategic & Financial', 
    'Strategic Alignment', 'Strategic Planning', 'Strategic Risk', 'Sustainability', 'Technology', 'Technology Integration', 
    'Technology Risk', 'Third-Party Management', 'Third-Party Risk', 'Transformation on Risk', 'Vendor Risk', 'Workforce', 
    'Workforce & Analytics', 'Workforce Capability'
];


export const riskStatuses = ['Open', 'In Progress', 'Closed', 'On Hold', 'Mitigated'];

export const likelihoods = [
  { name: 'Very Unlikely (1)', value: '1', weight: 1, description: '1%–5% - Once in 2–3 years' },
  { name: 'Unlikely (2)', value: '2', weight: 2, description: '5%–10% - Once every few years' },
  { name: 'Possible (3)', value: '3', weight: 3, description: '10%–50% - Once a year' },
  { name: 'Very Likely (4)', value: '4', weight: 4, description: '50%–75% - Several times a year' },
  { name: 'Almost Certain (5)', value: '5', weight: 5, description: '75%–100% - Likely to occur frequently' },
];

export const impacts = [
  { name: 'Minor (1)', value: '1', weight: 1, description: 'Insignificant' },
  { name: 'Medium (2)', value: '2', weight: 2, description: 'Minor, manageable' },
  { name: 'Serious (3)', value: '3', weight: 3, description: 'Moderate impact' },
  { name: 'Major (4)', value: '4', weight: 4, description: 'High impact' },
  { name: 'Catastrophic (5)', value: '5', weight: 5, description: 'Disastrous impact' },
];

export const controlEffectivenessOptions = [
    "Effective", "Partially Effective", "Ineffective", "Not Implemented", "Not Assessed"
];

/**
 * Calculates risk level and rating based on the defined criteria.
 * High: 15-25, Medium: 5-14, Low: 1-4
 */
export const calculateRiskMetrics = (likelihood: string, impact: string): { riskRating: string, riskLevel: RiskLevel } => {
    const likelihoodValue = parseInt(likelihood, 10);
    const impactValue = parseInt(impact, 10);

    if (isNaN(likelihoodValue) || isNaN(impactValue) || likelihoodValue === 0 || impactValue === 0) {
        return { riskRating: '', riskLevel: RiskLevel.Low };
    }

    const score = likelihoodValue * impactValue;
    
    let riskLevel: RiskLevel;
    let riskRating: string;

    if (score >= 15) { // 15-25 -> High
        riskLevel = RiskLevel.High;
        riskRating = 'Critical';
    } else if (score >= 5) { // 5-14 -> Medium
        riskLevel = RiskLevel.Medium;
        riskRating = 'Medium';
    } else { // 1-4 -> Low
        riskLevel = RiskLevel.Low;
        riskRating = 'Low';
    }
    
    return { riskRating, riskLevel };
};
