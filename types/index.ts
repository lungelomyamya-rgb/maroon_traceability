// src/types/index.ts
import { VerificationStatus } from '@/services/verificationService';

import { JsonObject } from './common';

// Export common types
export * from './common';
export * from './user';

// Explicit re-exports to avoid conflicts
export type { LoadingState, TableColumn, ApiResponse } from './common';
export type { 
  BaseComponentProps, 
  SizeVariant, 
  ColorVariant, 
  StatusVariant,
  LoadingState as UILoadingState,
  FormFieldProps,
  SelectOption,
  SelectProps,
  CheckboxProps,
  SwitchProps,
  ModalProps,
  TableProps,
  CardProps,
  AlertProps,
  BadgeProps,
  AvatarProps,
  ProgressProps,
  SkeletonProps,
  TooltipProps,
  PopoverProps,
  DropdownProps,
  BreadcrumbItem,
  BreadcrumbProps,
  MenuItemProps,
  MenuProps,
  StepProps,
  StepsProps,
  TimelineItem,
  TimelineProps,
  UploadProps,
  UploadFile,
  Theme,
} from './ui';

export type {
  BaseError,
  NetworkError,
  ValidationError,
  AuthenticationError,
  DatabaseError,
  BusinessError,
  ErrorResponse,
  SuccessResponse,
  ApiResponse as ApiResponseWrapper,
  ErrorBoundaryProps,
  ErrorContext,
  ErrorHandlingConfig,
  ErrorFactory,
  ErrorUtils,
  ErrorReportingService,
  ErrorMetrics,
  ErrorNotification,
  ErrorToast,
  ErrorTracker,
  RecoveryStrategy,
  ErrorRecoveryManager,
  UseErrorBoundaryReturn,
  UseErrorLoggerReturn,
  UseErrorMonitoringReturn,
} from './error-handling';

export interface ProductEventPhoto {
  id: string;
  url: string;
  caption?: string;
  timestamp?: string;
}

export interface ProductEvent {
  id: string;
  type: string;
  timestamp: string;
  description: string;
  actor?: string;
  actorRole?: string;
  location?: string;
  notes?: string;
  photos?: ProductEventPhoto[];
  metadata?: JsonObject;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  status: 'verified' | 'pending' | 'rejected' | 'draft' | 'published';
  verificationCount: number;
  lastVerified?: string | null;
  imageUrl?: string;
  qrCode?: string;
  farmer?: string;
  origin?: string;
  harvestDate?: string;
  batchNumber?: string;
  certifications?: string[];
  events?: ProductEvent[];
  metadata?: JsonObject;
  farmerName?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface VerificationResult {
  success: boolean;
  verificationId: string;
  status: VerificationStatus;
  timestamp: string;
  verifiedBy: string;
  metadata: JsonObject;
}