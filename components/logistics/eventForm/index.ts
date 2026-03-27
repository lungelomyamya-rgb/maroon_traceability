// src/components/logistics/eventForm/index.ts

/**
 * Event Form Feature Module
 * 
 * This module provides comprehensive event form functionality with:
 * - Event type selection with visual icons
 * - Dynamic form fields based on event type
 * - Real-time validation display
 * - Photo upload and management
 * - Transport-specific fields for logistics events
 * - Form submission handling with state management
 * 
 * @example
 * ```tsx
 * import { EventForm } from '@/components/logistics/eventForm';
 * 
 * function EventPage() {
 *   return (
 *     <EventForm 
 *       productId="prod-123"
 *       onSubmit={(data) => console.log('Event:', data)}
 *     />
 *   );
 * }
 * ```
 */

// Main component
export { EventForm } from './EventForm';

// Sub-components for granular usage
export { EventTypeSelector } from './EventTypeSelector';
export { FormFields } from './FormFields';
export { ValidationDisplay } from './ValidationDisplay';

// Custom hooks
export { useEventForm } from './hooks/useEventForm';

// Types
export type { EnhancedEventFormData, Vehicle, Driver } from './hooks/useEventForm';

// Feature metadata
export const eventFormFeature = {
  name: 'Event Form',
  description: 'Comprehensive event form with validation and logistics support',
  version: '1.0.0',
  components: {
    EventForm: 'Main event form component',
    EventTypeSelector: 'Event type selection with icons',
    FormFields: 'Dynamic form fields based on event type',
    ValidationDisplay: 'Real-time validation and form status'
  },
  hooks: {
    useEventForm: 'Event form state management and validation'
  },
  dependencies: {
    ui: ['@/components/ui/card', '@/components/ui/button', '@/components/ui/input', '@/components/ui/textarea', '@/components/ui/select', '@/components/ui/label'],
    icons: ['lucide-react'],
    validation: ['react-hook-form', 'zod', '@hookform/resolvers/zod']
  }
};

// Default export for convenience
export { EventForm as default } from './EventForm';
