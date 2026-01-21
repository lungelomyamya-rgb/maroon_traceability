// src/types/inspector.ts
export type InspectionStatus = 'pending' | 'in-progress' | 'completed' | 'approved' | 'rejected';
export type Grade = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
export type VerificationProvider = 'internal' | 'sgs' | 'bureau-veritas' | 'intertek';

export interface QualityMetrics {
  moistureContent: number; // percentage
  size: string; // e.g., 'Large', 'Medium', 'Small'
  color: string; // color grade
  firmness: number; // 1-10 scale
  sugarContent: number; // Brix percentage
  defects: string[]; // list of detected defects
  weight: number; // grams
  temperature: number; // Celsius
  pesticideResidue: number; // mg/kg
  microbialCount: number; // CFU/g
}

export interface GradeCriteria {
  grade: Grade;
  moistureMin: number;
  moistureMax: number;
  sizeRange: string[];
  colorStandards: string[];
  firmnessMin: number;
  sugarContentMin: number;
  maxDefects: number;
  description: string;
  pricePremium: number; // percentage
}

export interface InspectionRecord {
  id: string;
  productId: string;
  batchId?: string;
  inspectorId: string;
  inspectionDate: string;
  location: string;
  status: InspectionStatus;
  grade?: Grade;
  qualityMetrics: QualityMetrics;
  photos: InspectionPhoto[];
  notes: string;
  recommendations: string[];
  verificationProvider: VerificationProvider;
  verificationReference?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InspectionPhoto {
  id: string;
  url: string;
  caption: string;
  category: 'overall' | 'defect' | 'size' | 'color' | 'documentation';
  uploadedAt: string;
  metadata?: {
    size: number;
    format: string;
    dimensions: { width: number; height: number };
  };
}

export interface InspectorProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  certifications: InspectorCertification[];
  specializations: string[];
  experience: number; // years
  rating: number; // 1-5
  totalInspections: number;
  approvalRate: number; // percentage
  isActive: boolean;
  verifiedProviders: VerificationProvider[];
}

export interface InspectorCertification {
  id: string;
  name: string;
  issuedBy: string;
  issuedDate: string;
  expiryDate: string;
  certificateNumber: string;
  documentUrl?: string;
}

export interface ThirdPartyVerification {
  id: string;
  inspectionId: string;
  provider: VerificationProvider;
  referenceNumber: string;
  verifiedAt: string;
  verifiedBy: string;
  status: 'pending' | 'verified' | 'rejected';
  documents: VerificationDocument[];
  notes?: string;
}

export interface VerificationDocument {
  id: string;
  type: 'certificate' | 'report' | 'photo' | 'receipt';
  title: string;
  url: string;
  uploadedAt: string;
}

export const GRADE_CRITERIA: Record<Grade, GradeCriteria> = {
  'A': {
    grade: 'A',
    moistureMin: 12,
    moistureMax: 14,
    sizeRange: ['Large', 'Medium'],
    colorStandards: ['Deep Red', 'Vibrant'],
    firmnessMin: 8,
    sugarContentMin: 15,
    maxDefects: 0,
    description: 'Premium quality - perfect appearance and taste',
    pricePremium: 25
  },
  'B': {
    grade: 'B',
    moistureMin: 11,
    moistureMax: 15,
    sizeRange: ['Large', 'Medium', 'Small'],
    colorStandards: ['Red', 'Deep Red'],
    firmnessMin: 7,
    sugarContentMin: 13,
    maxDefects: 1,
    description: 'High quality - minor cosmetic imperfections',
    pricePremium: 15
  },
  'C': {
    grade: 'C',
    moistureMin: 10,
    moistureMax: 16,
    sizeRange: ['Medium', 'Small'],
    colorStandards: ['Red', 'Light Red'],
    firmnessMin: 6,
    sugarContentMin: 11,
    maxDefects: 2,
    description: 'Standard quality - suitable for processing',
    pricePremium: 5
  },
  'D': {
    grade: 'D',
    moistureMin: 9,
    moistureMax: 17,
    sizeRange: ['Small', 'Mixed'],
    colorStandards: ['Light Red', 'Pinkish'],
    firmnessMin: 5,
    sugarContentMin: 9,
    maxDefects: 3,
    description: 'Below average - mainly for industrial use',
    pricePremium: 0
  },
  'E': {
    grade: 'E',
    moistureMin: 8,
    moistureMax: 18,
    sizeRange: ['Mixed', 'Irregular'],
    colorStandards: ['Pinkish', 'Pale'],
    firmnessMin: 4,
    sugarContentMin: 7,
    maxDefects: 4,
    description: 'Low quality - limited market value',
    pricePremium: -10
  },
  'F': {
    grade: 'F',
    moistureMin: 0,
    moistureMax: 20,
    sizeRange: ['Irregular', 'Damaged'],
    colorStandards: ['Pale', 'Discolored'],
    firmnessMin: 0,
    sugarContentMin: 0,
    maxDefects: 10,
    description: 'Reject quality - not suitable for sale',
    pricePremium: -25
  }
};

export const VERIFICATION_PROVIDERS = {
  sgs: {
    name: 'SGS South Africa',
    logo: '/maroon_traceability/images/sgs-logo.png',
    website: 'https://www.sgs.co.za',
    services: ['Quality Inspection', 'Certification', 'Laboratory Testing'],
    contact: '+27 11 123 4567',
    email: 'southafrica@sgs.com'
  },
  'bureau-veritas': {
    name: 'Bureau Veritas',
    logo: '/maroon_traceability/images/bv-logo.png',
    website: 'https://www.bureauveritas.co.za',
    services: ['Inspection Services', 'Certification', 'Compliance'],
    contact: '+27 11 987 6543',
    email: 'info@za.bureauveritas.com'
  },
  intertek: {
    name: 'Intertek',
    logo: '/maroon_traceability/images/intertek-logo.png',
    website: 'https://www.intertek.com',
    services: ['Quality Assurance', 'Testing', 'Inspection'],
    contact: '+27 11 555 0123',
    email: 'africa@intertek.com'
  }
} as const;

export const DEFECT_TYPES = [
  'Bruising',
  'Scarring',
  'Insect Damage',
  'Disease Spots',
  'Sunburn',
  'Cracking',
  'Deformation',
  'Mold',
  'Rot',
  'Discoloration',
  'Pest Damage',
  'Mechanical Damage'
];

export const INSPECTION_CATEGORIES = [
  'Visual Inspection',
  'Size Measurement',
  'Color Assessment',
  'Firmness Testing',
  'Sugar Content Analysis',
  'Moisture Content',
  'Defect Assessment',
  'Weight Verification',
  'Temperature Check',
  'Pesticide Residue',
  'Microbial Testing'
];
