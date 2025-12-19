// src/types/events.ts
export type EventType = 
  | 'planting'
  | 'growth'
  | 'harvest'
  | 'quality-inspection'
  | 'compliance-check'
  | 'collection'
  | 'transport'
  | 'delivery'
  | 'packaging'
  | 'labeling'
  | 'qr-generation'
  | 'retail-verification';

  export interface EventData {
  [key: string]: unknown; // Or define specific fields if known
}

export interface ProductEvent {
  id: string;
  productId: string;
  type: EventType;
  actor: string;
  actorRole: string;
  timestamp: string;
  location?: string;
  notes?: string;
  photos?: string[];
  metadata?: Record<string, unknown>;
  syncStatus: 'synced' | 'pending' | 'failed';
  data: EventData;
}

export const EVENT_CONFIG: Record<EventType, {
  label: string;
  icon: string;
  color: string;
  description: string;
}> = {
  'planting': {
    label: 'Planting',
    icon: '🌱',
    color: 'green',
    description: 'Seeds planted in field',
  },
  'growth': {
    label: 'Growth Update',
    icon: '🌿',
    color: 'lime',
    description: 'Crop growth monitoring',
  },
  'harvest': {
    label: 'Harvest',
    icon: '🌾',
    color: 'yellow',
    description: 'Crop harvested',
  },
  'quality-inspection': {
    label: 'Quality Inspection',
    icon: '✅',
    color: 'blue',
    description: 'Quality standards verified',
  },
  'compliance-check': {
    label: 'Compliance Check',
    icon: '📋',
    color: 'indigo',
    description: 'Regulatory compliance verified',
  },
  'collection': {
    label: 'Collection',
    icon: '📥',
    color: 'orange',
    description: 'Product collected from farm',
  },
  'transport': {
    label: 'In Transit',
    icon: '🚛',
    color: 'amber',
    description: 'Product in transport',
  },
  'delivery': {
    label: 'Delivery',
    icon: '📍',
    color: 'red',
    description: 'Product delivered',
  },
  'packaging': {
    label: 'Packaging',
    icon: '📦',
    color: 'purple',
    description: 'Product packaged',
  },
  'labeling': {
    label: 'Labeling',
    icon: '🏷️',
    color: 'violet',
    description: 'Labels applied',
  },
  'qr-generation': {
    label: 'QR Generated',
    icon: '⬛',
    color: 'gray',
    description: 'QR code generated',
  },
  'retail-verification': {
    label: 'Retail Verification',
    icon: '🛍️',
    color: 'pink',
    description: 'Verified by retailer',
  },
};