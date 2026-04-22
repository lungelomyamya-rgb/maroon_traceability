// In src/types/form.ts
export interface FormState {
  [key: string]: string | number | boolean | null;
}

export interface FormErrors {
  [key: string]: string;
}

export interface ValidationResult<T = unknown> {
  success: boolean;
  errors?: FormErrors;
  data?: T;
}