// src/types/index.ts
import { VerificationStatus } from '@/services/verificationService';

export interface ProductEventPhoto {
  id: string;
  url: string;
  caption?: string;
  timestamp?: string;
}

export interface ProductEvent {
  id: string;
  type: string;
  timestamp: string;
  description: string;
  actor?: string;
  actorRole?: string;
  location?: string;
  notes?: string;
  photos?: ProductEventPhoto[];
  metadata?: Record<string, any>;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  status: 'verified' | 'pending' | 'rejected' | 'draft' | 'published';
  verificationCount: number;
  lastVerified?: string | null;
  imageUrl?: string;
  qrCode?: string;
  farmer?: string;
  origin?: string;
  harvestDate?: string;
  batchNumber?: string;
  certifications?: string[];
  events?: ProductEvent[];
  metadata?: {
    imageUrl?: string;
    qrCode?: string;
    batchNumber?: string;
    certifications?: string[];
    [key: string]: any;
  };
  farmerName?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface VerificationResult {
  success: boolean;
  verificationId: string;
  status: VerificationStatus;
  timestamp: string;
  verifiedBy: string;
  metadata: {
    notes?: string;
    location?: string;
    verificationMethod: string;
    [key: string]: any;
  };
}