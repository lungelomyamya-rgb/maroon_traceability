// src/services/analytics.ts

export interface AnalyticsEvent {
  event: string;
  properties?: Record<string, unknown>;
  timestamp?: number;
}

export class AnalyticsService {
  private static instance: AnalyticsService;

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  track(event: string, properties?: Record<string, unknown>): void {
    // Mock implementation
    console.log('Analytics Event:', { event, properties, timestamp: Date.now() });
  }

  pageView(path: string): void {
    this.track('page_view', { path });
  }

  userAction(action: string, details?: Record<string, unknown>): void {
    this.track('user_action', { action, ...details });
  }

  trackUserAction(action: string, details?: Record<string, unknown>): void {
    this.userAction(action, details);
  }

  trackFeatureUsage(feature: string, details?: Record<string, unknown>): void {
    this.track('feature_usage', { feature, ...details });
  }

  trackConversion(event: string, details?: Record<string, unknown>): void {
    this.track('conversion', { event, ...details });
  }
}

export const analytics = AnalyticsService.getInstance();
