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
    if (!email || !email.trim()) return 'Email is required';
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(email.trim())) return 'Please enter a valid email address';
    return null;
  }

  /**
   * Validate password strength
   */
  static validatePassword(password: string): string | null {
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters long';
    if (!/(?=.*[a-z])/.test(password)) return 'Password must contain at least one lowercase letter';
    if (!/(?=.*[A-Z])/.test(password)) return 'Password must contain at least one uppercase letter';
    if (!/(?=.*\d)/.test(password)) return 'Password must contain at least one number';
    return null;
  }

  /**
   * Validate phone number format
   */
  static validatePhone(phone: string): string | null {
    if (!phone || !phone.trim()) return 'Phone number is required';
    const phoneRegex = /^[\d\s-+()]+$/;
    if (!phoneRegex.test(phone.trim())) return 'Please enter a valid phone number';
    if (phone.replace(/\D/g, '').length < 10) return 'Phone number must be at least 10 digits';
    return null;
  }

  /**
   * Validate postal code format
   */
  static validatePostalCode(postalCode: string): string | null {
    if (!postalCode || !postalCode.trim()) return 'Postal code is required';
    const postalRegex = /^[0-9A-Za-z\s-]+$/;
    if (!postalRegex.test(postalCode.trim())) return 'Please enter a valid postal code';
    return null;
  }

  /**
   * Validate required text field
   */
  static validateRequired(field: string, fieldName: string): string | null {
    if (!field || !field.trim()) return `${fieldName} is required`;
    return null;
  }

  /**
   * Validate company registration number (South African format)
   */
  static validateRegistrationNumber(regNumber: string): string | null {
    if (!regNumber || !regNumber.trim()) return 'Registration number is required';
    // Basic validation for South African company registration numbers
    const regRegex = /^\d{4}\/\d{4}\/\d{2}$/;
    if (!regRegex.test(regNumber.trim())) return 'Please enter a valid registration number (format: YYYY/NNNN/NN)';
    return null;
  }

  /**
   * Validate tax number (South African format)
   */
  static validateTaxNumber(taxNumber: string): string | null {
    if (!taxNumber || !taxNumber.trim()) return null; // Tax number is optional in some forms
    // Basic validation for South African tax numbers (10 digits)
    const taxRegex = /^\d{10}$/;
    if (!taxRegex.test(taxNumber.replace(/\s/g, ''))) return 'Please enter a valid tax number (10 digits)';
    return null;
  }

  /**
   * Validate VAT number (South African format)
   */
  static validateVATNumber(vatNumber: string): string | null {
    if (!vatNumber || !vatNumber.trim()) return null; // VAT number is optional
    // Basic validation for South African VAT numbers (4 digits)
    const vatRegex = /^\d{4}$/;
    if (!vatRegex.test(vatNumber.replace(/\s/g, ''))) return 'Please enter a valid VAT number (4 digits)';
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

  /**
   * Validate individual registration form
   */
  static validateIndividualForm(formData: any): Record<string, string> {
    const errors: Record<string, string> = {};

    // Personal Information
    if (!formData.firstName?.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName?.trim()) errors.lastName = 'Last name is required';
    
    const emailError = this.validateEmail(formData.email);
    if (emailError) errors.email = emailError;
    
    const phoneError = this.validatePhone(formData.phone);
    if (phoneError) errors.phone = phoneError;
    
    if (!formData.role) errors.role = 'Please select a role';

    // Farm Information
    if (!formData.address?.trim()) errors.address = 'Address is required';
    if (!formData.city?.trim()) errors.city = 'City is required';
    if (!formData.province) errors.province = 'Please select a province';
    
    const postalError = this.validatePostalCode(formData.postalCode);
    if (postalError) errors.postalCode = postalError;

    // Security
    const passwordError = this.validatePassword(formData.password);
    if (passwordError) errors.password = passwordError;
    
    if (!formData.confirmPassword) errors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Passwords do not match';
    
    if (!formData.agreeToTerms) errors.agreeToTerms = 'You must agree to the terms and conditions';

    return errors;
  }

  /**
   * Validate commercial registration form
   */
  static validateCommercialForm(formData: any): Record<string, string> {
    const errors: Record<string, string> = {};

    // Business Information
    if (!formData.companyName?.trim()) errors.companyName = 'Company name is required';
    
    const regError = this.validateRegistrationNumber(formData.registrationNumber);
    if (regError) errors.registrationNumber = regError;
    
    const taxError = this.validateTaxNumber(formData.taxNumber);
    if (taxError) errors.taxNumber = taxError;
    
    const vatError = this.validateVATNumber(formData.vatNumber);
    if (vatError) errors.vatNumber = vatError;
    
    if (!formData.contactPerson?.trim()) errors.contactPerson = 'Contact person is required';
    
    const emailError = this.validateEmail(formData.email);
    if (emailError) errors.email = emailError;
    
    const phoneError = this.validatePhone(formData.phone);
    if (phoneError) errors.phone = phoneError;
    
    if (!formData.role) errors.role = 'Please select a role';
    if (!formData.numberOfEmployees) errors.numberOfEmployees = 'Please select company size';

    // Financial & Location Details
    if (!formData.annualRevenue) errors.annualRevenue = 'Please select annual revenue range';
    if (!formData.businessType) errors.businessType = 'Please select business type';
    if (!formData.address?.trim()) errors.address = 'Business address is required';
    if (!formData.city?.trim()) errors.city = 'City is required';
    if (!formData.province) errors.province = 'Please select a province';
    
    const postalError = this.validatePostalCode(formData.postalCode);
    if (postalError) errors.postalCode = postalError;

    // Security
    const passwordError = this.validatePassword(formData.password);
    if (passwordError) errors.password = passwordError;
    
    if (!formData.confirmPassword) errors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Passwords do not match';
    
    if (!formData.agreeToTerms) errors.agreeToTerms = 'You must agree to the terms and conditions';

    return errors;
  }

  /**
   * Validate SMME registration form
   */
  static validateSMMEForm(formData: any): Record<string, string> {
    const errors: Record<string, string> = {};

    // Business Information
    if (!formData.companyName?.trim()) errors.companyName = 'Company/Co-op name is required';
    
    const regError = this.validateRegistrationNumber(formData.registrationNumber);
    if (regError) errors.registrationNumber = regError;
    
    const taxError = this.validateTaxNumber(formData.taxNumber);
    if (taxError) errors.taxNumber = taxError;
    
    if (!formData.contactPerson?.trim()) errors.contactPerson = 'Contact person is required';
    
    const emailError = this.validateEmail(formData.email);
    if (emailError) errors.email = emailError;
    
    const phoneError = this.validatePhone(formData.phone);
    if (phoneError) errors.phone = phoneError;
    
    if (!formData.role) errors.role = 'Please select a role';

    // Location & Business Type
    if (!formData.address?.trim()) errors.address = 'Business address is required';
    if (!formData.city?.trim()) errors.city = 'City is required';
    if (!formData.province) errors.province = 'Please select a province';
    
    const postalError = this.validatePostalCode(formData.postalCode);
    if (postalError) errors.postalCode = postalError;
    
    if (!formData.numberOfMembers) errors.numberOfMembers = 'Please select number of members';
    if (!formData.businessType) errors.businessType = 'Please select business type';

    // Security
    const passwordError = this.validatePassword(formData.password);
    if (passwordError) errors.password = passwordError;
    
    if (!formData.confirmPassword) errors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Passwords do not match';
    
    if (!formData.agreeToTerms) errors.agreeToTerms = 'You must agree to the terms and conditions';

    return errors;
  }

  /**
   * Validate retailer registration form
   */
  static validateRetailerForm(formData: any): Record<string, string> {
    const errors: Record<string, string> = {};

    // Business Information
    if (!formData.companyName?.trim()) errors.companyName = 'Company name is required';
    
    const regError = this.validateRegistrationNumber(formData.registrationNumber);
    if (regError) errors.registrationNumber = regError;
    
    const emailError = this.validateEmail(formData.email);
    if (emailError) errors.email = emailError;
    
    const phoneError = this.validatePhone(formData.phone);
    if (phoneError) errors.phone = phoneError;
    
    if (!formData.role) errors.role = 'Please select a role';

    // Location
    if (!formData.address?.trim()) errors.address = 'Business address is required';
    if (!formData.city?.trim()) errors.city = 'City is required';
    
    const postalError = this.validatePostalCode(formData.postalCode);
    if (postalError) errors.postalCode = postalError;

    // Security
    const passwordError = this.validatePassword(formData.password);
    if (passwordError) errors.password = passwordError;
    
    if (!formData.confirmPassword) errors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Passwords do not match';
    
    if (!formData.agreeToTerms) errors.agreeToTerms = 'You must agree to the terms and conditions';

    return errors;
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
