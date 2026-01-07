// src/types/packaging.ts
export type PackagingType = 
  | 'cardboard-box'
  | 'plastic-crate'
  | 'wooden-crate'
  | 'vacuum-sealed'
  | 'bulk-bag'
  | 'paper-bag'
  | 'plastic-pouch'
  | 'glass-jar'
  | 'metal-can'
  | 'custom';

export type BatchStatus = 'pending' | 'processing' | 'completed' | 'qc-pending' | 'qc-approved' | 'shipped';

export interface PackagingRecord {
  id: string;
  batchId: string;
  productId: string;
  productName: string;
  packagingType: PackagingType;
  quantity: number;
  unitOfMeasure: string;
  packagingDate: string;
  location: string;
  operator: string;
  status: BatchStatus;
  batchCode: string;
  qrCodes: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BatchProcessingItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitOfMeasure: string;
  packagingType: PackagingType;
  status: BatchStatus;
  batchCode?: string;
  qrGenerated?: boolean;
  packagingDate?: string;
}

export interface PackagingEvent {
  id: string;
  batchId: string;
  type: 'packaging-started' | 'packaging-completed' | 'qr-generated' | 'quality-check' | 'labeling-completed';
  timestamp: string;
  operator: string;
  location: string;
  details: Record<string, any>;
  photos?: string[];
}

export const PACKAGING_TYPES = {
  'cardboard-box': {
    label: 'Cardboard Box',
    description: 'Standard corrugated cardboard packaging',
    icon: '📦',
    typicalUnits: ['boxes', 'pieces'] as string[],
    defaultCapacity: 50
  },
  'plastic-crate': {
    label: 'Plastic Crate',
    description: 'Reusable plastic crate for transport',
    icon: '🗃️',
    typicalUnits: ['crates', 'pieces'] as string[],
    defaultCapacity: 100
  },
  'wooden-crate': {
    label: 'Wooden Crate',
    description: 'Traditional wooden crate for bulk items',
    icon: '📦',
    typicalUnits: ['crates', 'pieces'] as string[],
    defaultCapacity: 200
  },
  'vacuum-sealed': {
    label: 'Vacuum Sealed',
    description: 'Vacuum packaging for freshness',
    icon: '🥫',
    typicalUnits: ['packages', 'kg', 'lbs'] as string[],
    defaultCapacity: 10
  },
  'bulk-bag': {
    label: 'Bulk Bag',
    description: 'Large bulk packaging bags',
    icon: '👜',
    typicalUnits: ['bags', 'kg', 'tons'] as string[],
    defaultCapacity: 1000
  },
  'paper-bag': {
    label: 'Paper Bag',
    description: 'Eco-friendly paper packaging',
    icon: '🛍️',
    typicalUnits: ['bags', 'pieces'] as string[],
    defaultCapacity: 25
  },
  'plastic-pouch': {
    label: 'Plastic Pouch',
    description: 'Flexible plastic pouch packaging',
    icon: '🛍️',
    typicalUnits: ['pouches', 'pieces'] as string[],
    defaultCapacity: 20
  },
  'glass-jar': {
    label: 'Glass Jar',
    description: 'Glass jar packaging for premium products',
    icon: '🫙',
    typicalUnits: ['jars', 'ml', 'oz'] as string[],
    defaultCapacity: 500
  },
  'metal-can': {
    label: 'Metal Can',
    description: 'Metal can packaging for preservation',
    icon: '🥫',
    typicalUnits: ['cans', 'ml', 'oz'] as string[],
    defaultCapacity: 400
  },
  'custom': {
    label: 'Custom Packaging',
    description: 'Specialized packaging solution',
    icon: '📋',
    typicalUnits: ['units', 'pieces', 'custom'] as string[],
    defaultCapacity: 1
  }
} as const;

export const BATCH_STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  'qc-pending': 'bg-orange-100 text-orange-800',
  'qc-approved': 'bg-emerald-100 text-emerald-800',
  shipped: 'bg-purple-100 text-purple-800'
} as const;

// Batch code generation utility
export const generateBatchCode = (packagingType: PackagingType, location?: string): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  const typeCode = PACKAGING_TYPES[packagingType].label.substring(0, 3).toUpperCase();
  const locationCode = location ? location.substring(0, 3).toUpperCase() : 'GEN';
  const randomSuffix = Math.random().toString(36).substring(2, 5).toUpperCase();
  
  return `BATCH-${year}-${typeCode}-${locationCode}-${randomSuffix}`;
};

// Unit of measure options based on packaging type
export const getUnitsForPackagingType = (packagingType: PackagingType): string[] => {
  return PACKAGING_TYPES[packagingType].typicalUnits;
};
