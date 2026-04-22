// src/core/types/IAdapter.ts
// Generic adapter interface for type-safe adapter implementations

import type { AdapterResult } from './adapter';

/**
 * Generic adapter interface for any data type
 */
export interface IAdapter<TInput, TOutput> {
  /** Adapter identifier */
  readonly id: string;
  /** Adapter type */
  readonly type: string;
  /** Whether the adapter is currently available */
  readonly isAvailable: boolean;

  /** Transform input to output */
  transform(input: TInput): Promise<AdapterResult<TOutput>>;

  /** Validate input data */
  validate(input: TInput): Promise<AdapterResult<boolean>>;

  /** Initialize the adapter */
  initialize(): Promise<void>;

  /** Cleanup adapter resources */
  cleanup(): Promise<void>;
}
