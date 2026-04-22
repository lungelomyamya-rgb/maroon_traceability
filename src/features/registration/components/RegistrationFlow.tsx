// src/features/registration/components/RegistrationFlow.tsx
// Main registration flow orchestrator component

import React, { useState, useEffect, useCallback } from 'react';
import type { AuthUser } from '../../../core/types/adapter';
import { useRegistration } from '../hooks/useRegistration';
import { RegistrationForm, RegistrationSuccess, EmailVerification } from './RegistrationForm';

/**
 * Registration flow states
 */
type RegistrationStep = 'form' | 'verification' | 'success';

/**
 * Registration flow component
 * Orchestrates the complete registration process
 */
export const RegistrationFlow: React.FC<{
  onComplete?: (user: AuthUser) => void;
  onCancel?: () => void;
  className?: string;
}> = ({ onComplete, onCancel, className = '' }) => {
  const {
    isRegistered,
    isEmailVerified,
    user,
    error,
    verifyEmail,
    sendVerificationEmail,
    reset,
  } = useRegistration();

  const [currentStep, setCurrentStep] = useState<RegistrationStep>('form');
  const [isVerifying, setIsVerifying] = useState(false);

  /**
   * Handle successful registration
   */
  const handleRegistrationSuccess = (_userData: AuthUser) => {
    setCurrentStep('verification');
  };

  /**
   * Handle email verification
   */
  const [verificationError, setVerificationError] = useState<string | null>(null);

  const handleVerifyEmail = useCallback(async (token: string) => {
    setIsVerifying(true);
    setVerificationError(null);

    try {
      const result = await verifyEmail(token);

      if (result && isEmailVerified) {
        setCurrentStep('success');
        if (onComplete && user) {
          onComplete(user);
        }
      } else {
        setVerificationError('Email verification failed');
      }
    } catch (error) {
      setVerificationError(error instanceof Error ? error.message : 'Verification failed');
    } finally {
      setIsVerifying(false);
    }
  }, [verifyEmail, onComplete, isEmailVerified, user]);

  /**
   * Handle resend verification email
   */
  const handleResendEmail = async () => {
    if (user?.email) {
      await sendVerificationEmail(user.email);
    }
  };

  /**
   * Handle continue to dashboard
   */
  const handleContinue = () => {
    if (onComplete && user) {
      onComplete(user);
    }
  };

  /**
   * Handle cancel
   */
  const handleCancel = () => {
    reset();
    setCurrentStep('form');

    if (onCancel) {
      onCancel();
    }
  };

  /**
   * Update current step based on registration state
   */
  useEffect(() => {
    if (isRegistered && !isEmailVerified) {
      setCurrentStep('verification');
    } else if (isRegistered && isEmailVerified) {
      setCurrentStep('success');
    } else {
      setCurrentStep('form');
    }
  }, [isRegistered, isEmailVerified]);

  /**
   * Handle URL token for email verification
   */
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token && currentStep === 'verification') {
      handleVerifyEmail(token);
    }
  }, [currentStep, handleVerifyEmail]);

  return (
    <div className={`min-h-screen bg-gray-50 flex items-center justify-center ${className}`}>
      <div className="w-full max-w-md">
        {/* Error Display */}
        {(error || verificationError) && currentStep !== 'form' && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error || verificationError}</p>
              </div>
            </div>
          </div>
        )}

        {/* Step Content */}
        {currentStep === 'form' && (
          <RegistrationForm
            onSuccess={handleRegistrationSuccess}
            onCancel={handleCancel}
          />
        )}

        {currentStep === 'verification' && user?.email && (
          <EmailVerification
            email={user.email}
            onResend={handleResendEmail}
            onCancel={handleCancel}
          />
        )}

        {currentStep === 'success' && user && (
          <RegistrationSuccess
            user={user}
            onContinue={handleContinue}
          />
        )}

        {/* Loading overlay for verification */}
        {isVerifying && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
              <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-gray-700">Verifying email...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Registration page component
 * Full page registration component
 */
export const RegistrationPage: React.FC<{
  onComplete?: (user: AuthUser) => void;
}> = ({ onComplete }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Maroon Traceability
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="/login"
                className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                Sign In
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center py-12">
        <RegistrationFlow onComplete={onComplete} />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-500 text-sm">
            © 2024 Maroon Traceability System. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
