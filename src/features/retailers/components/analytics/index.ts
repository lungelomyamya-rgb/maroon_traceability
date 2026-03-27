// src/components/retailers/analytics/index.ts

/**
 * Analytics Feature Module
 * 
 * This module provides comprehensive analytics functionality with:
 * - Revenue and sales performance tracking
 * - Customer metrics and conversion analysis
 * - Product performance insights
 * - Time-based data filtering
 * - Interactive charts and visualizations
 * - Export capabilities for data analysis
 * - Performance insights and recommendations
 * - Category-wise sales breakdown
 * 
 * @example
 * ```tsx
 * import { Analytics } from '@/features/retailers/components/analytics';
 * 
 * function RetailerPage() {
 *   return (
 *     <Analytics 
 *       onExport={(data) => console.log('Exported:', data)}
 *     />
 *   );
 * }
 * ```
 */

// Main component
export { Analytics } from './Analytics';

// Sub-components for granular usage
export { AnalyticsOverview } from './AnalyticsOverview';
export { SalesChart } from './SalesChart';
export { TopProducts } from './TopProducts';

// Custom hooks
export { useAnalytics } from './hooks/useAnalytics';

// Types
export type { AnalyticsData, TimeRange } from './hooks/useAnalytics';

// Feature metadata
export const analyticsFeature = {
  name: 'Analytics Dashboard',
  description: 'Comprehensive business analytics and insights platform',
  version: '1.0.0',
  components: {
    Analytics: 'Main analytics dashboard component',
    AnalyticsOverview: 'Key metrics and overview cards',
    SalesChart: 'Interactive sales charts and graphs',
    TopProducts: 'Top performing products analysis'
  },
  hooks: {
    useAnalytics: 'Analytics data management and calculations'
  },
  dependencies: {
    ui: ['@/components/ui/card', '@/components/ui/button', '@/components/ui/badge', '@/components/ui/select'],
    icons: ['lucide-react']
  }
};

// Default export for convenience
export { Analytics as default } from './Analytics';
