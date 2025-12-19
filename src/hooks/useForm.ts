// src/hooks/useForm.ts
import { useState } from 'react';
import type { ValidationResult } from '@/lib/validation';
import { FormState, FormErrors } from '@/types/form';
export function useForm<T extends FormState>(
  initialState: T,
  validate: (data: T) => ValidationResult
) {
  const [values, setValues] = useState<T>(initialState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): ValidationResult => {
    const result = validate(values);
    if (!result.success) {
      setErrors(result.errors);
    } else {
      setErrors({});
    }
    return result;
  };

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    validateForm,
    setValues,
    setErrors,
    setIsSubmitting,
  };
}