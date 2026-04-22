// src/features/auth/components/HybridAuthPage.tsx
// Complete hybrid authentication page

import React, { useState } from 'react';
import { useHybridAuth } from '../hooks/useHybridAuth';
import { HybridLoginForm } from './HybridLoginForm';

/**
 * Hybrid authentication page
 * Complete authentication system with dual-mode support
 */
export const HybridAuthPage: React.FC<{
  onSuccess?: (user: import('@/types/types').UniversalUser | null) => void;
  onCancel?: () => void;
  initialMode?: 'mock' | 'real';
  showModeSwitch?: boolean;
  title?: string;
}> = ({
  onSuccess,
  onCancel,
  initialMode = 'mock',
  showModeSwitch = true,
  title = 'Authentication',
}) => {
  const [showLogin, setShowLogin] = useState(true);
  const [showRegister, setShowRegister] = useState(false);

  const auth = useHybridAuth({
    initialMode,
    fallbackEnabled: true,
  });

  // Handle successful authentication
  React.useEffect(() => {
    if (auth.isAuthenticated && onSuccess) {
      onSuccess(auth.user);
    }
  }, [auth.isAuthenticated, auth.user, onSuccess]);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="sm:mx-auto sm:w-full sm:max-w-4xl">
        <div className="bg-white shadow sm:rounded-lg sm:px-10 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              {title}
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Experience seamless switching between mock and real authentication modes
            </p>
          </div>

          {/* Mode Tabs */}
          <div className="mb-8">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                <button
                  onClick={() => setShowLogin(true)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    showLogin
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => setShowRegister(true)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    showRegister
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Register
                </button>
              </nav>
            </div>
          </div>

          {/* Content */}
          {showLogin ? (
            <HybridLoginForm
              onSuccess={onSuccess}
              onCancel={onCancel}
              showModeSwitch={showModeSwitch}
            />
          ) : (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Create your account
              </h2>

              {/* Registration info */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <div className="text-sm text-blue-900">
                  <h3 className="font-medium mb-2">Registration Information</h3>
                  <p className="mb-2">
                    In <span className="font-semibold">{auth.mode === 'mock' ? 'Mock' : 'Real'}</span> mode,
                    your account will be created {auth.mode === 'mock' ? 'as a test user' : 'in our production database'}.
                  </p>
                  {auth.mode === 'real' && (
                    <p className="text-xs text-blue-700">
                      Note: Email verification will be required after registration.
                    </p>
                  )}
                </div>
              </div>

              {/* Registration form placeholder */}
              <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                <div className="text-center">
                  <p className="text-gray-600 mb-4">
                    Registration form is coming soon!
                  </p>
                  <p className="text-sm text-gray-500">
                    For now, please use the demo users in the Login tab with Mock mode.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>
              Need help?{' '}
              <button
                type="button"
                className="font-medium text-blue-600 hover:text-blue-500"
                onClick={() => console.log('Contact support clicked')}
              >
                Contact Support
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
