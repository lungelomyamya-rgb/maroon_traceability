// src/components/dashboard/constants.ts

export const CHART_COLORS = [
  '#3b82f6',
  '#10b981', 
  '#f59e0b',
  '#ef4444',
  '#6b7280',
  '#22c55e',
  '#f97316',
  '#dc2626',
  '#06b6d4',
] as const;

export const CHART_COLOR_MAP = {
  primary: '#3b82f6',
  secondary: '#10b981',
  tertiary: '#f59e0b',
  quaternary: '#ef4444',
  neutral: '#6b7280',
  success: '#22c55e',
  warning: '#f97316',
  error: '#dc2626',
  info: '#06b6d4',
  background: '#f3f4f6',
  border: '#e5e7eb',
  text: '#111827',
  textSecondary: '#6b7280',
};

export const DASHBOARD_CONFIG = {
  refreshInterval: 30000, // 30 seconds
  maxDataPoints: 50,
  animationDuration: 300,
};

export const METRICS_LABELS = {
  totalProducts: 'Total Products',
  verifiedProducts: 'Verified Products',
  pendingVerifications: 'Pending Verifications',
  activeUsers: 'Active Users',
  systemUptime: 'System Uptime',
  averageResponseTime: 'Avg Response Time',
};
