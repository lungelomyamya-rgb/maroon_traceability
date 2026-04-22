// src/types/index.ts
// Consolidated type definitions - Single source of truth for all types

// Common utility types
export type JsonObject = Record<string, unknown>;

// Import core unified types
export * from './user';

// Import domain-specific extensions
export * from './user-domain-extensions';

// Import domain-specific types
export * from './api';
export * from './blockchain';
export * from './database';
export type { ValidationResult } from './form';
export * from './events';
export type { InspectionStatus as InspectorInspectionStatus } from './inspector';
export * from './logistics';
export * from './metrics';
export * from './packaging';
export * from './performanceMonitor';
export * from './product';
export type { Product as ViewerProduct } from './viewer';

// Import API response types
export type { ApiResponse, PaginatedResponse } from './apiResponseUnified';

// Import common UI types
export type {
  BaseComponentProps,
  SizeVariant,
  ColorVariant,
  StatusVariant,
  LoadingState,
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
  JsonValue,
  JsonArray,
  GenericRecord,
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

export enum VerificationStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired'
}

export interface VerificationResult {
  success: boolean;
  verificationId: string;
  status: VerificationStatus;
  timestamp: string;
  verifiedBy: string;
  metadata: JsonObject;
}