// src/features/registration/components/SimpleRegistrationForm.tsx
// Simple registration form using basic HTML elements

import React, { useState } from 'react';
import type { RegistrationData, AuthUser } from '../../../core/types/adapter';
import { useRegistrationForm } from '../hooks/useRegistration';

/**
 * Simple registration form component
 * Pure UI component that handles user registration with basic styling
 */
export const RegistrationForm: React.FC<{
  onSuccess?: (user: AuthUser) => void;
  onCancel?: () => void;
  className?: string;
}> = ({ onSuccess, onCancel, className = '' }) => {
  const {
    formData,
    fieldErrors,
    isLoading,
    error,
    isValidForm,
    isDirty,
    updateField,
    validateField,
    handleSubmit,
    resetForm: _resetForm,
    user,
  } = useRegistrationForm();

  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Handle form submission
   */
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting || !isValidForm) {
      return;
    }

    setIsSubmitting(true);

    try {
      const success = await handleSubmit();

      if (success && onSuccess && user) {
        onSuccess(user);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle field change with validation
   */
  const handleFieldChange = (field: keyof RegistrationData, value: string) => {
    updateField(field, value);

    // Validate field on blur
    if (value) {
      validateField(field, value);
    }
  };

  /**
   * Get field error message
   */
  const getFieldError = (field: keyof RegistrationData): string | undefined => {
    return fieldErrors[field];
  };

  /**
   * Role options for select
   */
  const roleOptions = [
    { value: 'farmer', label: 'Farmer' },
    { value: 'inspector', label: 'Inspector' },
    { value: 'logistics', label: 'Logistics' },
    { value: 'packaging', label: 'Packaging' },
    { value: 'retailer', label: 'Retailer' },
    { value: 'public', label: 'Public' },
    { value: 'government', label: 'Government' },
    { value: 'admin', label: 'Administrator' },
  ];

  return (
    <div className={`w-full max-w-md mx-auto p-6 ${className}`}>
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-center text-gray-900">
            Create Account
          </h1>
          <p className="text-center text-gray-600 mt-2">
            Register for the Maroon Traceability System
          </p>
        </div>

        <form onSubmit={onSubmit} className="px-6 py-4 space-y-4">
          {/* Error Alert */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Name Field */}
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => handleFieldChange('name', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                getFieldError('name') ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={isLoading || isSubmitting}
              aria-invalid={!!getFieldError('name')}
              aria-describedby={getFieldError('name') ? 'name-error' : undefined}
            />
            {getFieldError('name') && (
              <p id="name-error" className="text-sm text-red-500">
                {getFieldError('name')}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => handleFieldChange('email', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                getFieldError('email') ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={isLoading || isSubmitting}
              aria-invalid={!!getFieldError('email')}
              aria-describedby={getFieldError('email') ? 'email-error' : undefined}
            />
            {getFieldError('email') && (
              <p id="email-error" className="text-sm text-red-500">
                {getFieldError('email')}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={(e) => handleFieldChange('password', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                getFieldError('password') ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={isLoading || isSubmitting}
              aria-invalid={!!getFieldError('password')}
              aria-describedby={getFieldError('password') ? 'password-error' : undefined}
            />
            {getFieldError('password') && (
              <p id="password-error" className="text-sm text-red-500">
                {getFieldError('password')}
              </p>
            )}
            <p className="text-xs text-gray-500">
              Password must be at least 8 characters with uppercase, lowercase, and numbers.
            </p>
          </div>

          {/* Role Field */}
          <div className="space-y-2">
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              id="role"
              value={formData.role}
              onChange={(e) => handleFieldChange('role', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                getFieldError('role') ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={isLoading || isSubmitting}
            >
              <option value="">Select your role</option>
              {roleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {getFieldError('role') && (
              <p className="text-sm text-red-500">
                {getFieldError('role')}
              </p>
            )}
          </div>

          {/* Form Actions */}
          <div className="pt-4 space-y-2">
            <button
              type="submit"
              className={`w-full px-4 py-2 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${
                !isValidForm || !isDirty || isLoading || isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
              disabled={!isValidForm || !isDirty || isLoading || isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>

            {onCancel && (
              <button
                type="button"
                className="w-full px-4 py-2 text-gray-700 font-medium border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={onCancel}
                disabled={isLoading || isSubmitting}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

/**
 * Registration success component
 */
export const RegistrationSuccess: React.FC<{
  user: AuthUser;
  onContinue?: () => void;
  className?: string;
}> = ({ user: _user, onContinue, className = '' }) => {
  return (
    <div className={`w-full max-w-md mx-auto p-6 ${className}`}>
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <div className="px-6 py-4 text-center">
          <div className="text-green-600 mb-4">
            <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-green-600 mb-2">
            Registration Complete!
          </h1>
          <p className="text-gray-600">
            Your account has been successfully created and verified.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Welcome to the Maroon Traceability System!
          </p>
        </div>

        <div className="px-6 py-4">
          <button
            onClick={onContinue}
            className="w-full px-4 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Continue to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Email verification component
 */
export const EmailVerification: React.FC<{
  email: string;
  onResend?: () => void;
  onCancel?: () => void;
  className?: string;
}> = ({ email, onResend, onCancel, className = '' }) => {
  return (
    <div className={`w-full max-w-md mx-auto p-6 ${className}`}>
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <div className="px-6 py-4 text-center">
          <div className="text-blue-600 mb-4">
            <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Verify Your Email
          </h1>
          <p className="text-gray-600">
            We've sent a verification email to <strong>{email}</strong>
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Please check your email and click the verification link to complete your registration.
          </p>
        </div>

        <div className="px-6 py-4 space-y-2">
          {onResend && (
            <button
              onClick={onResend}
              className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Resend Verification Email
            </button>
          )}

          {onCancel && (
            <button
              type="button"
              className="w-full px-4 py-2 text-gray-700 font-medium border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={onCancel}
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
