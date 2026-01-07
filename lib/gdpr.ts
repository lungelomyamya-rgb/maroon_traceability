// src/lib/gdpr.ts

// GDPR Compliance Utilities
import { useState, useCallback, useEffect } from 'react';

export interface ConsentRecord {
  id: string;
  timestamp: string;
  email: string;
  consentGiven: boolean;
  consentType: 'analytics' | 'marketing' | 'functional' | 'all';
  version: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface DataSubjectRequest {
  id: string;
  type: 'access' | 'rectification' | 'erasure' | 'portability' | 'restriction';
  email: string;
  requestDate: string;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  details?: string;
}

export interface PrivacyPolicy {
  version: string;
  effectiveDate: string;
  lastUpdated: string;
  sections: {
    dataCollection: string;
    dataUsage: string;
    dataSharing: string;
    userRights: string;
    cookies: string;
    retention: string;
  };
}

class GDPRManager {
  private static instance: GDPRManager;
  private consentKey = 'gdpr_consent';
  private requestsKey = 'gdpr_requests';
  private policyKey = 'gdpr_policy';

  private constructor() {
    this.initializeDefaultPolicy();
  }

  static getInstance(): GDPRManager {
    if (!GDPRManager.instance) {
      GDPRManager.instance = new GDPRManager();
    }
    return GDPRManager.instance;
  }

  private initializeDefaultPolicy() {
    const existingPolicy = this.getPrivacyPolicy();
    if (!existingPolicy) {
      const defaultPolicy: PrivacyPolicy = {
        version: '1.0',
        effectiveDate: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        sections: {
          dataCollection: 'We collect personal information necessary for providing our blockchain traceability services, including name, email, role, and location data.',
          dataUsage: 'Your data is used to provide traceability services, authenticate users, and improve our platform. We do not sell your personal information to third parties.',
          dataSharing: 'We only share data with trusted partners when necessary for service delivery, and never sell your personal information.',
          userRights: 'You have the right to access, correct, delete, or restrict your personal data. Contact us to exercise these rights.',
          cookies: 'We use essential cookies for platform functionality and analytics cookies to improve our services.',
          retention: 'We retain your data only as long as necessary to provide our services, unless required by law to retain it longer.'
        }
      };
      this.savePrivacyPolicy(defaultPolicy);
    }
  }

  // Consent Management
  recordConsent(consentType: ConsentRecord['consentType'], consentGiven: boolean, email: string): ConsentRecord {
    const consent: ConsentRecord = {
      id: `consent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      email,
      consentGiven,
      consentType,
      version: '1.0',
      ipAddress: this.getClientIP(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined
    };

    const existingConsents = this.getConsents();
    existingConsents.push(consent);
    
    // Keep only last 50 consent records
    if (existingConsents.length > 50) {
      existingConsents.splice(0, existingConsents.length - 50);
    }

    localStorage.setItem(this.consentKey, JSON.stringify(existingConsents));
    return consent;
  }

  getConsents(): ConsentRecord[] {
    try {
      const stored = localStorage.getItem(this.consentKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.warn('Failed to load consents:', error);
      return [];
    }
  }

  hasConsent(consentType: ConsentRecord['consentType']): boolean {
    const consents = this.getConsents();
    const latestConsent = consents
      .filter(c => c.consentType === consentType)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
    
    return latestConsent?.consentGiven || false;
  }

  // Data Subject Rights
  createDataSubjectRequest(
    type: DataSubjectRequest['type'],
    email: string,
    details?: string
  ): DataSubjectRequest {
    const request: DataSubjectRequest = {
      id: `request_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      email,
      requestDate: new Date().toISOString(),
      status: 'pending',
      details
    };

    const existingRequests = this.getDataSubjectRequests();
    existingRequests.push(request);
    
    // Keep only last 100 requests
    if (existingRequests.length > 100) {
      existingRequests.splice(0, existingRequests.length - 100);
    }

    localStorage.setItem(this.requestsKey, JSON.stringify(existingRequests));
    return request;
  }

  getDataSubjectRequests(): DataSubjectRequest[] {
    try {
      const stored = localStorage.getItem(this.requestsKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.warn('Failed to load data subject requests:', error);
      return [];
    }
  }

  updateRequestStatus(requestId: string, status: DataSubjectRequest['status']): void {
    const requests = this.getDataSubjectRequests();
    const requestIndex = requests.findIndex(r => r.id === requestId);
    
    if (requestIndex !== -1) {
      requests[requestIndex].status = status;
      localStorage.setItem(this.requestsKey, JSON.stringify(requests));
    }
  }

  // Data Anonymization
  anonymizeUserData(userData: any): any {
    const anonymized = { ...userData };
    
    // Remove or hash personal identifiers
    if (anonymized.email) {
      anonymized.email = this.hashEmail(anonymized.email);
    }
    
    if (anonymized.name) {
      anonymized.name = this.hashString(anonymized.name);
    }
    
    if (anonymized.address) {
      anonymized.address = this.hashString(anonymized.address);
    }
    
    // Remove sensitive fields
    delete anonymized.ipAddress;
    delete anonymized.userAgent;
    delete anonymized.phoneNumber;
    
    return anonymized;
  }

  // Data Retention
  cleanupExpiredData(retentionDays: number = 365): void {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    // Clean up old consents
    const consents = this.getConsents();
    const validConsents = consents.filter(c => new Date(c.timestamp) > cutoffDate);
    localStorage.setItem(this.consentKey, JSON.stringify(validConsents));

    // Clean up old requests
    const requests = this.getDataSubjectRequests();
    const validRequests = requests.filter(r => new Date(r.requestDate) > cutoffDate);
    localStorage.setItem(this.requestsKey, JSON.stringify(validRequests));
  }

  // Privacy Policy Management
  getPrivacyPolicy(): PrivacyPolicy | null {
    try {
      const stored = localStorage.getItem(this.policyKey);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.warn('Failed to load privacy policy:', error);
      return null;
    }
  }

  savePrivacyPolicy(policy: PrivacyPolicy): void {
    policy.lastUpdated = new Date().toISOString();
    localStorage.setItem(this.policyKey, JSON.stringify(policy));
  }

  // Cookie Management
  setCookieConsent(consentGiven: boolean): void {
    this.recordConsent('analytics', consentGiven, 'user@example.com');
    
    // Set cookie for tracking
    if (consentGiven) {
      document.cookie = 'analytics_consent=true; max-age=31536000; path=/';
    } else {
      document.cookie = 'analytics_consent=false; max-age=0; path=/';
    }
  }

  hasCookieConsent(): boolean {
    if (typeof document === 'undefined') return false;
    
    const cookies = document.cookie.split(';');
    const analyticsCookie = cookies.find(cookie => 
      cookie.trim().startsWith('analytics_consent=')
    );
    
    return analyticsCookie?.split('=')[1] === 'true';
  }

  // Utility Methods
  private getClientIP(): string | undefined {
    // In a real implementation, you would get this from your server
    // For demo purposes, we'll return undefined
    return undefined;
  }

  private hashEmail(email: string): string {
    // Simple hashing for demo - in production, use proper cryptographic hashing
    const hash = this.hashString(email);
    return `${hash.substring(0, 6)}@${hash.substring(6, 12)}.anonymized`;
  }

  private hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  // Compliance Reporting
  generateComplianceReport(): {
    totalConsents: number;
    consentBreakdown: Record<string, number>;
    pendingRequests: number;
    completedRequests: number;
    lastPolicyUpdate: string;
  } {
    const consents = this.getConsents();
    const requests = this.getDataSubjectRequests();
    const policy = this.getPrivacyPolicy();

    const consentBreakdown = consents.reduce((acc, consent) => {
      acc[consent.consentType] = (acc[consent.consentType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalConsents: consents.length,
      consentBreakdown,
      pendingRequests: requests.filter(r => r.status === 'pending').length,
      completedRequests: requests.filter(r => r.status === 'completed').length,
      lastPolicyUpdate: policy?.lastUpdated || 'Never'
    };
  }

  // Export Data (Right to Data Portability)
  exportUserData(email: string): any {
    // In a real implementation, this would collect all user data
    // For demo, we'll return a structured format
    const consents = this.getConsents();
    const requests = this.getDataSubjectRequests();
    
    return {
      email,
      consents: consents.filter(c => c.email === email),
      requests: requests.filter(r => r.email === email),
      exportDate: new Date().toISOString(),
      format: 'JSON'
    };
  }

  // Delete Data (Right to Erasure)
  deleteUserData(email: string): boolean {
    try {
      // Remove consents
      const consents = this.getConsents();
      const filteredConsents = consents.filter(c => c.email !== email);
      localStorage.setItem(this.consentKey, JSON.stringify(filteredConsents));

      // Remove requests
      const requests = this.getDataSubjectRequests();
      const filteredRequests = requests.filter(r => r.email !== email);
      localStorage.setItem(this.requestsKey, JSON.stringify(filteredRequests));

      // In a real implementation, you would also delete from your database
      return true;
    } catch (error) {
      console.error('Failed to delete user data:', error);
      return false;
    }
  }
}

// Export singleton instance
export const gdprManager = GDPRManager.getInstance();

// React Hook for GDPR compliance
export const useGDPR = () => {
  const [consentStatus, setConsentStatus] = useState<Record<string, boolean>>({});

  const checkConsent = useCallback((consentType: ConsentRecord['consentType']) => {
    return gdprManager.hasConsent(consentType);
  }, []);

  const giveConsent = useCallback((consentType: ConsentRecord['consentType']) => {
    const consent = gdprManager.recordConsent(consentType, true, 'user@example.com');
    setConsentStatus(prev => ({ ...prev, [consentType]: true }));
    return consent;
  }, []);

  const withdrawConsent = useCallback((consentType: ConsentRecord['consentType']) => {
    const consent = gdprManager.recordConsent(consentType, false, 'user@example.com');
    setConsentStatus(prev => ({ ...prev, [consentType]: false }));
    return consent;
  }, []);

  const requestDataAccess = useCallback((email: string, details?: string) => {
    return gdprManager.createDataSubjectRequest('access', email, details);
  }, []);

  const requestDataDeletion = useCallback((email: string, details?: string) => {
    return gdprManager.createDataSubjectRequest('erasure', email, details);
  }, []);

  useEffect(() => {
    // Initialize consent status
    const consentTypes: ConsentRecord['consentType'][] = ['analytics', 'marketing', 'functional', 'all'];
    const initialStatus: Record<string, boolean> = {};
    
    consentTypes.forEach(type => {
      initialStatus[type] = gdprManager.hasConsent(type);
    });
    
    setConsentStatus(initialStatus);
  }, []);

  return {
    consentStatus,
    checkConsent,
    giveConsent,
    withdrawConsent,
    requestDataAccess,
    requestDataDeletion,
    getPrivacyPolicy: gdprManager.getPrivacyPolicy.bind(gdprManager),
    generateComplianceReport: gdprManager.generateComplianceReport.bind(gdprManager)
  };
};
