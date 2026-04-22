// src/types/user-domain-extensions.ts
// Domain-specific user extensions to be merged into unified types


/**
 * User's farm information (if applicable)
 */
export interface FarmInfo {
  /** Farm name */
  name: string;

  /** Farm location */
  location: {
    latitude: number;
    longitude: number;
    address: string;
    city: string;
    country: string;
  };

  /** Farm size in hectares */
  size: number;

  /** Farm certification details */
  certifications: Array<{
    type: string;
    issuedBy: string;
    issuedDate: string;
    expiryDate: string;
    documentUrl?: string;
  }>;

  /** Farm products */
  products: Array<{
    id: string;
    name: string;
    category: string;
    quantity: number;
    unit: string;
  }>;
}

/**
 * User's inspection information (if applicable)
 */
export interface InspectionInfo {
  /** Inspector ID */
  inspectorId: string;

  /** Inspector certification level */
  certificationLevel: 'basic' | 'intermediate' | 'senior' | 'expert';

  /** Inspector specializations */
  specializations: Array<string>;

  /** Inspection history */
  inspectionHistory: Array<{
    id: string;
    inspectedBy: string;
    inspectedAt: string;
    status: 'passed' | 'failed' | 'pending';
    notes?: string;
    photos?: Array<string>;
  }>;
}

/**
 * User's logistics information (if applicable)
 */
export interface LogisticsInfo {
  /** Logistics company ID */
  companyId: string;

  /** Company name */
  companyName: string;

  /** Driver license number */
  driverLicense: string;

  /** Vehicle information */
  vehicles: Array<{
    id: string;
    type: 'truck' | 'van' | 'motorcycle';
    make: string;
    model: string;
    year: number;
    licensePlate: string;
    capacity: number;
    unit: string;
  }>;

  /** Delivery history */
  deliveryHistory: Array<{
    id: string;
    fromLocation: string;
    toLocation: string;
    status: 'pending' | 'in_transit' | 'delivered' | 'failed';
    estimatedDelivery: string;
    actualDelivery?: string;
    notes?: string;
  }>;
}

/**
 * User's packaging information (if applicable)
 */
export interface PackagingInfo {
  /** Packaging facility ID */
  facilityId: string;

  /** Facility name */
  facilityName: string;

  /** Certifications */
  certifications: Array<{
    type: string;
    standard: string;
    issuedBy: string;
    issuedDate: string;
    expiryDate: string;
  }>;

  /** Packaging operations */
  packagingHistory: Array<{
    id: string;
    productId: string;
    operation: 'packaging' | 'labeling' | 'sealing' | 'quality_check';
    timestamp: string;
    status: 'completed' | 'failed' | 'pending';
    notes?: string;
  }>;
}

/**
 * User's retail information (if applicable)
 */
export interface RetailInfo {
  /** Store ID */
  storeId: string;

  /** Store name */
  storeName: string;

  /** Store location */
  location: {
    address: string;
    city: string;
    country: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };

  /** Store contact information */
  contact: {
    phone: string;
    email: string;
    manager: string;
  };

  /** Sales history */
  salesHistory: Array<{
    id: string;
    productId: string;
    quantity: number;
    price: number;
    currency: string;
    saleDate: string;
    customerInfo?: {
      name: string;
      email: string;
      phone: string;
    };
  }>;
}

/**
 * User's marketplace information
 */
export interface MarketplaceInfo {
  /** Seller rating */
  sellerRating: {
    average: number;
    totalReviews: number;
    rating: number;
  };

  /** Products listed */
  listedProducts: Array<{
    id: string;
    name: string;
    category: string;
    price: number;
    currency: string;
    listedAt: string;
    status: 'active' | 'sold' | 'delisted';
  }>;

  /** Purchase history */
  purchaseHistory: Array<{
    id: string;
    productId: string;
    quantity: number;
    price: number;
    currency: string;
    purchaseDate: string;
    sellerInfo?: {
      name: string;
      email: string;
      rating: number;
    };
  }>;
}

/**
 * User's blockchain information
 */
export interface BlockchainInfo {
  /** Blockchain wallet address */
  walletAddress: string;

  /** Transaction history */
  transactions: Array<{
    id: string;
    type: 'product_creation' | 'transfer' | 'certification';
    timestamp: string;
    hash: string;
    blockNumber: number;
    gasUsed: number;
    status: 'confirmed' | 'pending' | 'failed';
  }>;

  /** Product certifications */
  certifications: Array<{
    productId: string;
    certificationType: string;
    issuedBy: string;
    issuedAt: string;
    blockchainHash: string;
    transactionHash: string;
  }>;
}

/**
 * User's audit trail
 */
export interface AuditTrail {
  id: string;
  action: string;
  timestamp: string;
  userId?: string;
  details: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * User's notification preferences
 */
export interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
  marketing: boolean;
  security: boolean;
  frequency: 'immediate' | 'daily' | 'weekly' | 'monthly';
}

/**
 * User's security settings
 */
export interface SecuritySettings {
  /** Two-factor authentication enabled */
  twoFactorEnabled: boolean;

  /** Session timeout in minutes */
  sessionTimeout: number;

  /** Allowed IP addresses */
  allowedIPs: Array<string>;

  /** Failed login attempts */
  failedLoginAttempts: number;

  /** Account lockout status */
  accountLocked: boolean;

  /** Last password change date */
  lastPasswordChange: Date;

  /** Security questions */
  securityQuestions: Array<{
    question: string;
    answerHash: string;
  }>;
}

/**
 * User's subscription information
 */
export interface SubscriptionInfo {
  /** Subscription plan */
  plan: 'basic' | 'premium' | 'enterprise';

  /** Subscription status */
  status: 'active' | 'cancelled' | 'expired' | 'suspended';

  /** Subscription period */
  period: 'monthly' | 'yearly';

  /** Subscription start date */
  startDate: Date;

  /** Subscription end date */
  endDate: Date;

  /** Auto-renewal enabled */
  autoRenew: boolean;

  /** Features included */
  features: Array<string>;
}

/**
 * User's privacy settings
 */
export interface PrivacySettings {
  /** Profile visibility */
  profileVisibility: 'public' | 'private' | 'connections_only';

  /** Data sharing preferences */
  dataSharing: {
    shareWithPartners: boolean;
    shareWithPublic: boolean;
    shareWithResearchers: boolean;
    anonymizeData: boolean;
  };

  /** Marketing preferences */
  marketingConsent: boolean;
  analyticsConsent: boolean;
  thirdPartyConsent: boolean;
}

/**
 * User account status
 */
export type UserAccountStatus = 'active' | 'inactive' | 'suspended' | 'pending_verification';

/**
 * Profile information
 */
export interface Profile {
  /** Profile bio */
  bio?: string;

  /** Profile phone number */
  phone?: string;

  /** Profile address */
  address?: string;

  /** Profile avatar URL */
  avatarUrl?: string;

  /** Profile preferences */
  preferences?: Record<string, unknown>;
}
