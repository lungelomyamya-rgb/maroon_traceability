// Inspector Feature Types
export interface Inspector {
  id: string;
  name: string;
  email: string;
  badge: string;
  department: string;
}

export interface Inspection {
  id: string;
  inspectorId: string;
  productId: string;
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  scheduledDate: Date;
  completedDate?: Date;
  notes: string;
  photos: string[];
}

export interface QualityMetrics {
  id: string;
  inspectionId: string;
  metric: string;
  value: number;
  unit: string;
  standard: string;
  passed: boolean;
}
