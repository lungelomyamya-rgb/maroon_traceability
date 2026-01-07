// src/lib/auditTrail.ts

// Comprehensive Audit Trail System for Compliance
import { useCallback } from 'react';

export interface AuditEvent {
  id: string;
  timestamp: string;
  userId?: string;
  userRole?: string;
  action: string;
  resource: string;
  resourceId?: string;
  details: any;
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'authentication' | 'data_access' | 'data_modification' | 'system' | 'security' | 'compliance';
  success: boolean;
  errorMessage?: string;
}

export interface AuditFilter {
  startDate?: string;
  endDate?: string;
  userId?: string;
  userRole?: string;
  action?: string;
  resource?: string;
  severity?: AuditEvent['severity'];
  category?: AuditEvent['category'];
  success?: boolean;
}

export interface AuditReport {
  totalEvents: number;
  eventsByCategory: Record<string, number>;
  eventsBySeverity: Record<string, number>;
  eventsByUser: Record<string, number>;
  failedEvents: number;
  criticalEvents: number;
  timeRange: {
    start: string;
    end: string;
  };
}

class AuditTrailManager {
  private static instance: AuditTrailManager;
  private events: AuditEvent[] = [];
  private maxEvents = 10000; // Keep last 10,000 events
  private storageKey = 'audit_trail';

  private constructor() {
    this.loadEvents();
    this.setupSessionTracking();
  }

  static getInstance(): AuditTrailManager {
    if (!AuditTrailManager.instance) {
      AuditTrailManager.instance = new AuditTrailManager();
    }
    return AuditTrailManager.instance;
  }

  private loadEvents() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        this.events = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load audit events:', error);
      this.events = [];
    }
  }

  private saveEvents() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.events));
    } catch (error) {
      console.warn('Failed to save audit events:', error);
    }
  }

  private setupSessionTracking() {
    // Generate session ID for tracking user sessions
    if (typeof sessionStorage !== 'undefined') {
      if (!sessionStorage.getItem('audit_session_id')) {
        sessionStorage.setItem('audit_session_id', `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
      }
    }
  }

  private getSessionId(): string | undefined {
    if (typeof sessionStorage !== 'undefined') {
      return sessionStorage.getItem('audit_session_id') || undefined;
    }
    return undefined;
  }

  private getClientIP(): string | undefined {
    // In a real implementation, this would come from your server
    // For demo purposes, we'll return undefined
    return undefined;
  }

  private getUserAgent(): string | undefined {
    if (typeof navigator !== 'undefined') {
      return navigator.userAgent;
    }
    return undefined;
  }

  private generateEventId(): string {
    return `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private categorizeAction(action: string): AuditEvent['category'] {
    const lowerAction = action.toLowerCase();
    
    if (lowerAction.includes('login') || lowerAction.includes('logout') || lowerAction.includes('auth')) {
      return 'authentication';
    }
    if (lowerAction.includes('view') || lowerAction.includes('read') || lowerAction.includes('access')) {
      return 'data_access';
    }
    if (lowerAction.includes('create') || lowerAction.includes('update') || lowerAction.includes('delete') || lowerAction.includes('modify')) {
      return 'data_modification';
    }
    if (lowerAction.includes('permission') || lowerAction.includes('role') || lowerAction.includes('security')) {
      return 'security';
    }
    if (lowerAction.includes('audit') || lowerAction.includes('compliance') || lowerAction.includes('gdpr')) {
      return 'compliance';
    }
    
    return 'system';
  }

  private determineSeverity(action: string, success: boolean): AuditEvent['severity'] {
    if (!success) {
      if (action.toLowerCase().includes('delete') || action.toLowerCase().includes('admin')) {
        return 'critical';
      }
      return 'high';
    }
    
    if (action.toLowerCase().includes('delete') || action.toLowerCase().includes('admin')) {
      return 'medium';
    }
    
    return 'low';
  }

  // Main logging method
  logEvent(params: {
    action: string;
    resource: string;
    resourceId?: string;
    details?: any;
    userId?: string;
    userRole?: string;
    success?: boolean;
    errorMessage?: string;
  }): AuditEvent {
    const event: AuditEvent = {
      id: this.generateEventId(),
      timestamp: new Date().toISOString(),
      userId: params.userId,
      userRole: params.userRole,
      action: params.action,
      resource: params.resource,
      resourceId: params.resourceId,
      details: params.details || {},
      ipAddress: this.getClientIP(),
      userAgent: this.getUserAgent(),
      sessionId: this.getSessionId(),
      severity: this.determineSeverity(params.action, params.success !== false),
      category: this.categorizeAction(params.action),
      success: params.success !== false,
      errorMessage: params.errorMessage
    };

    this.addEvent(event);
    return event;
  }

  private addEvent(event: AuditEvent) {
    this.events.push(event);
    
    // Maintain maximum event count
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }
    
    this.saveEvents();
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Audit Event:', event);
    }
    
    // In production, send to audit logging service
    if (process.env.NODE_ENV === 'production' && event.severity === 'critical') {
      this.reportCriticalEvent(event);
    }
  }

  private async reportCriticalEvent(event: AuditEvent) {
    try {
      // In production, send to your audit logging service
      // Example: await fetch('/api/audit/critical', { method: 'POST', body: JSON.stringify(event) });
      console.log('Critical audit event reported:', event);
    } catch (error) {
      console.error('Failed to report critical audit event:', error);
    }
  }

  // Convenience methods for common actions
  logAuthentication(action: 'login' | 'logout' | 'failed_login', userId?: string, userRole?: string, errorMessage?: string) {
    return this.logEvent({
      action,
      resource: 'authentication',
      userId,
      userRole,
      success: action !== 'failed_login',
      errorMessage
    });
  }

  logDataAccess(action: string, resource: string, resourceId?: string, userId?: string, userRole?: string) {
    return this.logEvent({
      action,
      resource,
      resourceId,
      userId,
      userRole,
      success: true
    });
  }

  logDataModification(action: string, resource: string, resourceId?: string, details?: any, userId?: string, userRole?: string) {
    return this.logEvent({
      action,
      resource,
      resourceId,
      details,
      userId,
      userRole,
      success: true
    });
  }

  logSecurityEvent(action: string, details?: any, userId?: string, userRole?: string, success?: boolean) {
    return this.logEvent({
      action,
      resource: 'security',
      details,
      userId,
      userRole,
      success: success !== false
    });
  }

  logComplianceEvent(action: string, details?: any, userId?: string, userRole?: string) {
    return this.logEvent({
      action,
      resource: 'compliance',
      details,
      userId,
      userRole,
      success: true
    });
  }

  // Query methods
  getEvents(filter?: AuditFilter): AuditEvent[] {
    let filteredEvents = [...this.events];

    if (filter) {
      if (filter.startDate) {
        filteredEvents = filteredEvents.filter(event => 
          new Date(event.timestamp) >= new Date(filter.startDate!)
        );
      }

      if (filter.endDate) {
        filteredEvents = filteredEvents.filter(event => 
          new Date(event.timestamp) <= new Date(filter.endDate!)
        );
      }

      if (filter.userId) {
        filteredEvents = filteredEvents.filter(event => 
          event.userId === filter.userId
        );
      }

      if (filter.userRole) {
        filteredEvents = filteredEvents.filter(event => 
          event.userRole === filter.userRole
        );
      }

      if (filter.action) {
        filteredEvents = filteredEvents.filter(event => 
          event.action.toLowerCase().includes(filter.action!.toLowerCase())
        );
      }

      if (filter.resource) {
        filteredEvents = filteredEvents.filter(event => 
          event.resource === filter.resource
        );
      }

      if (filter.severity) {
        filteredEvents = filteredEvents.filter(event => 
          event.severity === filter.severity
        );
      }

      if (filter.category) {
        filteredEvents = filteredEvents.filter(event => 
          event.category === filter.category
        );
      }

      if (filter.success !== undefined) {
        filteredEvents = filteredEvents.filter(event => 
          event.success === filter.success
        );
      }
    }

    // Return sorted by timestamp (newest first)
    return filteredEvents.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  getEventById(id: string): AuditEvent | undefined {
    return this.events.find(event => event.id === id);
  }

  // Analytics and reporting
  generateReport(filter?: AuditFilter): AuditReport {
    const events = this.getEvents(filter);
    
    const eventsByCategory = events.reduce((acc, event) => {
      acc[event.category] = (acc[event.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const eventsBySeverity = events.reduce((acc, event) => {
      acc[event.severity] = (acc[event.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const eventsByUser = events.reduce((acc, event) => {
      if (event.userId) {
        acc[event.userId] = (acc[event.userId] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const failedEvents = events.filter(event => !event.success).length;
    const criticalEvents = events.filter(event => event.severity === 'critical').length;

    const timeRange = {
      start: events.length > 0 ? events[events.length - 1].timestamp : new Date().toISOString(),
      end: events.length > 0 ? events[0].timestamp : new Date().toISOString()
    };

    return {
      totalEvents: events.length,
      eventsByCategory,
      eventsBySeverity,
      eventsByUser,
      failedEvents,
      criticalEvents,
      timeRange
    };
  }

  // Data management
  clearEvents(olderThanDays?: number) {
    if (olderThanDays) {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);
      
      this.events = this.events.filter(event => 
        new Date(event.timestamp) > cutoffDate
      );
    } else {
      this.events = [];
    }
    
    this.saveEvents();
  }

  exportEvents(filter?: AuditFilter): string {
    const events = this.getEvents(filter);
    return JSON.stringify(events, null, 2);
  }

  // Compliance helpers
  getComplianceStatus(): {
    isCompliant: boolean;
    issues: string[];
    lastAuditDate: string;
    totalEvents: number;
    criticalEvents: number;
  } {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentEvents = this.events.filter(event => 
      new Date(event.timestamp) > thirtyDaysAgo
    );

    const criticalEvents = recentEvents.filter(event => event.severity === 'critical');
    const failedAuthEvents = recentEvents.filter(event => 
      event.category === 'authentication' && !event.success
    );

    const issues: string[] = [];
    
    if (criticalEvents.length > 0) {
      issues.push(`${criticalEvents.length} critical events in last 30 days`);
    }
    
    if (failedAuthEvents.length > 10) {
      issues.push(`${failedAuthEvents.length} failed authentication attempts in last 30 days`);
    }

    const lastAuditDate = recentEvents.length > 0 
      ? recentEvents[0].timestamp 
      : 'Never';

    return {
      isCompliant: issues.length === 0,
      issues,
      lastAuditDate,
      totalEvents: recentEvents.length,
      criticalEvents: criticalEvents.length
    };
  }
}

// Export singleton instance
export const auditTrail = AuditTrailManager.getInstance();

// React Hook for Audit Trail
export const useAuditTrail = () => {
  const logEvent = useCallback((params: Parameters<typeof auditTrail.logEvent>[0]) => {
    return auditTrail.logEvent(params);
  }, []);

  const logAuthentication = useCallback((action: 'login' | 'logout' | 'failed_login', userId?: string, userRole?: string, errorMessage?: string) => {
    return auditTrail.logAuthentication(action, userId, userRole, errorMessage);
  }, []);

  const logDataAccess = useCallback((action: string, resource: string, resourceId?: string, userId?: string, userRole?: string) => {
    return auditTrail.logDataAccess(action, resource, resourceId, userId, userRole);
  }, []);

  const logDataModification = useCallback((action: string, resource: string, resourceId?: string, details?: any, userId?: string, userRole?: string) => {
    return auditTrail.logDataModification(action, resource, resourceId, details, userId, userRole);
  }, []);

  const getEvents = useCallback((filter?: AuditFilter) => {
    return auditTrail.getEvents(filter);
  }, []);

  const generateReport = useCallback((filter?: AuditFilter) => {
    return auditTrail.generateReport(filter);
  }, []);

  const getComplianceStatus = useCallback(() => {
    return auditTrail.getComplianceStatus();
  }, []);

  return {
    logEvent,
    logAuthentication,
    logDataAccess,
    logDataModification,
    getEvents,
    generateReport,
    getComplianceStatus,
    clearEvents: auditTrail.clearEvents.bind(auditTrail),
    exportEvents: auditTrail.exportEvents.bind(auditTrail)
  };
};
