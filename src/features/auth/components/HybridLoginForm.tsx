// src/features/auth/components/HybridLoginForm.tsx
// Hybrid login form component with mode switching

import React, { useState } from 'react';
import type { UniversalUser } from '../../../core/types/adapter';
import { useHybridAuth } from '../hooks/useHybridAuth';

/**
 * Hybrid login form component
 * Supports both mock and real authentication modes
 */

export const HybridLoginForm: React.FC<{
  onSuccess?: (user: UniversalUser) => void;
  onCancel?: () => void;
  showModeSwitch?: boolean;
}> = ({ onSuccess, onCancel, showModeSwitch = true }) => {
  const auth = useHybridAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  // Validate email
  const validateEmail = (email: string): string => {
    if (!email) {
      return 'Email is required';
    }
    if (!email.includes('@')) {
      return 'Invalid email format';
    }
    return '';
  };

  // Validate password
  const validatePassword = (password: string): string => {
    if (!password) {
      return 'Password is required';
    }
    if (password.length < 6) {
      return 'Password must be at least 6 characters';
    }
    return '';
  };

  // Handle field changes
  const handleFieldChange = (field: 'email' | 'password', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear error for this field
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);

    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError });
      return;
    }

    // Attempt login
    const success = await auth.login(formData.email, formData.password);

    if (success && onSuccess && auth.user) {
      onSuccess(auth.user);
    }
  };

  // Handle demo user login (mock mode)
  const handleDemoLogin = async (userType: 'farmer' | 'inspector' | 'retailer' | 'logistics' | 'packaging' | 'admin') => {
    const demoUsers = {
      farmer: { email: 'farmer@example.com', password: 'password' },
      inspector: { email: 'inspector@example.com', password: 'password' },
      retailer: { email: 'retailer@example.com', password: 'password' },
      logistics: { email: 'logistics@example.com', password: 'password' },
      packaging: { email: 'packaging@example.com', password: 'password' },
      admin: { email: 'admin@example.com', password: 'password' },
    };

    const demoUser = demoUsers[userType];
    if (demoUser) {
      const success = await auth.login(demoUser.email, demoUser.password);
      if (success && onSuccess && auth.user) {
        onSuccess(auth.user);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Sign in to your account
            </h2>

            {/* Mode Switcher */}
            {showModeSwitch && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-700">
                    Authentication Mode:
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => auth.switchMode('mock')}
                      className={`px-3 py-2 text-sm font-medium rounded-md ${
                        auth.mode === 'mock'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-700 border border-gray-300'
                      }`}
                    >
                      Mock
                    </button>
                    <button
                      onClick={() => auth.switchMode('real')}
                      className={`px-3 py-2 text-sm font-medium rounded-md ${
                        auth.mode === 'real'
                          ? 'bg-green-600 text-white'
                          : 'bg-white text-gray-700 border border-gray-300'
                      }`}
                    >
                      Real
                    </button>
                  </div>
                </div>

                <div className="text-xs text-gray-500 mb-4">
                  Current mode: <span className="font-semibold">{auth.mode}</span>
                  {auth.fallbackEnabled && (
                    <span className="ml-2">• Fallback enabled</span>
                  )}
                </div>

                {/* Health Status */}
                {auth.healthStatus && (
                  <div className="text-xs p-2 bg-gray-100 rounded">
                    <div className="flex items-center justify-between">
                      <span>Health: </span>
                      <span className={`font-semibold ${
                        auth.healthStatus.status === 'healthy' ? 'text-green-600' :
                          auth.healthStatus.status === 'degraded' ? 'text-yellow-600' :
                            'text-red-600'
                      }`}>
                        {auth.healthStatus.status}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Error Display */}
            {auth.lastError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <div className="text-sm text-red-600">
                  {auth.lastError}
                </div>
              </div>
            )}

            {/* Demo User Buttons (Mock Mode) */}
            {auth.mode === 'mock' && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <div className="text-sm font-medium text-blue-900 mb-3">
                  Quick Login (Demo Users):
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleDemoLogin('farmer')}
                    className="px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Farmer
                  </button>
                  <button
                    onClick={() => handleDemoLogin('inspector')}
                    className="px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Inspector
                  </button>
                  <button
                    onClick={() => handleDemoLogin('retailer')}
                    className="px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Retailer
                  </button>
                  <button
                    onClick={() => handleDemoLogin('logistics')}
                    className="px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Logistics
                  </button>
                  <button
                    onClick={() => handleDemoLogin('packaging')}
                    className="px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Packaging
                  </button>
                  <button
                    onClick={() => handleDemoLogin('admin')}
                    className="px-3 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Admin
                  </button>
                </div>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter your email"
                  />
                </div>
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={(e) => handleFieldChange('password', e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm pr-10"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 12a2 2 0 100-2 2v-3a2 2 0 00-2 2v3a2 2 0 00-2 2zm3-4h3v3h-3a1 1 0 00-1 1v3a1 1 0 001 1zm1-9a1 1 0 00-1-1v3a1 1 0 001 1zm5-3a1 1 0 00-1-1v3a1 1 0 001 1z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l4-4a1 1 0 00-1.414 1.414V7a1 1 0 001.414 1.414l4-4a1 1 0 001.414 1.414V5a1 1 0 001.414 1.414z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <button
                    type="button"
                    className="font-medium text-blue-600 hover:text-blue-500"
                    onClick={() => console.log('Forgot password clicked')}
                  >
                    Forgot your password?
                  </button>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={auth.isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {auth.isLoading ? 'Signing in...' : 'Sign in'}
                </button>
              </div>

              {onCancel && (
                <div className="mt-4 text-center">
                  <button
                    type="button"
                    onClick={onCancel}
                    className="text-sm text-gray-600 hover:text-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
