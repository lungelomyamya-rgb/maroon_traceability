// src/lib/validation/registrationValidation.ts
// Shared validation utilities for all registration forms

/**
 * Validation functions for registration forms
 */
export class RegistrationValidation {
  /**
   * Validate email format
   */
  static validateEmail(email: string): string | null {
    if (!email || !email.trim()) {
      return 'Email is required';
    }
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(email.trim())) {
      return 'Please enter a valid email address';
    }
    return null;
  }

  /**
   * Validate password strength
   */
  static validatePassword(password: string): string | null {
    if (!password) {
      return 'Password is required';
    }
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/(?=.*\d)/.test(password)) {
      return 'Password must contain at least one number';
    }
    return null;
  }

  /**
   * Validate a South African phone number format: 071 234 5678 or +27 71 234 5678
   */
  static validatePhone(phone: string): string | null {
    if (!phone || !phone.trim()) {
      return 'Phone number is required';
    }
    if (!/^[\d\s-+()]+$/.test(phone.trim())) {
      return 'Please enter a valid phone number';
    }
    const digits = phone.replace(/\D/g, '');
    if (!/^0\d{9}$/.test(digits) && !/^27\d{9}$/.test(digits)) {
      return 'Please enter a valid South African phone number, e.g. 071 234 5678 or +27 71 234 5678';
    }
    return null;
  }

  /**
   * Validate postal code format
   */
  static validatePostalCode(postalCode: string): string | null {
    if (!postalCode || !postalCode.trim()) {
      return 'Postal code is required';
    }
    const postalRegex = /^[0-9A-Za-z\s-]+$/;
    if (!postalRegex.test(postalCode.trim())) {
      return 'Please enter a valid postal code';
    }
    return null;
  }

  /**
   * Validate required text field
   */
  static validateRequired(field: string, fieldName: string): string | null {
    if (!field || !field.trim()) {
      return `${fieldName} is required`;
    }
    return null;
  }

  /**
   * Validate a person's name: letters (including accented ones), spaces, apostrophes,
   * hyphens and full stops, starting with a letter. Rejects numbers such as phone numbers.
   * */
  static validatePersonName(name: string, fieldName: string): string | null {
    if (!name || !name.trim()) {
      return `${fieldName} is required`;
    }
    if (!/^[A-Za-zÀ-ÖØ-öø-ÿ][A-Za-zÀ-ÖØ-öø-ÿ\s'.-]*$/.test(name.trim())) {
      return `${fieldName} can only contain letters, spaces, apostrophes and hyphens`;
    }
    return null;
  }

  /**
   * Validate a CIPC company registration number: YYYY/NNNNNN/NN, e.g. 2022/123456/01
   */
  static validateRegistrationNumber(regNumber: string): string | null {
    if (!regNumber || !regNumber.trim()) {
      return 'Registration number is required';
    }
    if (!/^\d{4}\/\d{6}\/\d{2}$/.test(regNumber.trim())) {
      return 'Please enter a valid registration number (format: YYYY/NNNNNN/NN, e.g. 2022/123456/01)';
    }
    return null;
  }

  /**
   * Validate tax number (South African format)
   */
  static validateTaxNumber(taxNumber: string): string | null {
    if (!taxNumber || !taxNumber.trim()) {
      return null;
    } // Tax number is optional in some forms
    // Basic validation for South African tax numbers (10 digits)
    const taxRegex = /^\d{10}$/;
    if (!taxRegex.test(taxNumber.replace(/\s/g, ''))) {
      return 'Please enter a valid tax number (10 digits)';
    }
    return null;
  }

  /**
   * Validate a South African VAT number: 10 digits starting with 4
   */
  static validateVATNumber(vatNumber: string): string | null {
    if (!vatNumber || !vatNumber.trim()) {
      return null; // VAT number is optional
    }
    if (!/^4\d{9}$/.test(vatNumber.replace(/\s/g, ''))) {
      return 'Please enter a valid VAT number (10 digits starting with 4)';
    }
    return null;
  }

  /**
   * Check if password meets strength requirements (for UI feedback)
   */
  static getPasswordStrength(password: string): {
    length: boolean;
    lowercase: boolean;
    uppercase: boolean;
    number: boolean;
    isValid: boolean;
  } {
    return {
      length: password.length >= 8,
      lowercase: /(?=.*[a-z])/.test(password),
      uppercase: /(?=.*[A-Z])/.test(password),
      number: /(?=.*\d)/.test(password),
      isValid: this.validatePassword(password) === null,
    };
  }
}

/**
 * Helper function to get field styling based on validation errors
 */
export function getFieldClassName(hasError: boolean): string {
  return `w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
    hasError ? 'border-red-500' : 'border-gray-300'
  }`;
}

/**
 * Helper function to get checkbox styling based on validation errors
 */
export function getCheckboxClassName(hasError: boolean): string {
  return `mr-2 ${hasError ? 'border-red-500' : ''}`;
}
