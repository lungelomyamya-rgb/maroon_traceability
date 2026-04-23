'use client';

import { ArrowLeft, User, Mail, Lock, Check, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useRegistration } from '@/src/features/registration/hooks/useRegistration';
import { useUser } from '@/contexts/userContext';
import { USER_ROLES, type UserRole } from '@/types/user';

export default function RegistrationPage() {
  const router = useRouter();
  const { setUser } = useUser();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    role: '' as UserRole,
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });

  const { register, isLoading, error, isRegistered, checkEmailAvailability } = useRegistration();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // Validate required fields
    if (!formData.fullName || !formData.email || !formData.role || !formData.password) {
      alert('Please fill in all required fields');
      return;
    }

    // Check email availability
    try {
      const isEmailAvailable = await checkEmailAvailability(formData.email);
      if (!isEmailAvailable) {
        alert('Email is already registered');
        return;
      }
    } catch (error) {
      console.error('Email availability check error:', error);
      alert('Registration service is not available');
      return;
    }

    // Prepare registration data
    const registrationData = {
      email: formData.email,
      password: formData.password,
      name: formData.fullName,
      role: formData.role,
      additionalData: {
        registrationType: 'simplified',
        registeredAt: new Date().toISOString(),
      },
    };

    const success = await register(registrationData);
    if (success) {
      // For simplified flow, directly redirect to role dashboard
      // In production, you might want to include email verification
      router.push(`/${formData.role}`);
    }
  };

  // Filter roles that should be available for registration (exclude system roles)
  const availableRoles = USER_ROLES.filter(role => 
    !['public', 'government', 'admin', 'viewer'].includes(role)
  );

  const getRoleDisplayName = (role: UserRole): string => {
    const displayNames: Record<UserRole, string> = {
      farmer: 'Farmer',
      inspector: 'Inspector',
      logistics: 'Logistics Provider',
      packaging: 'Packaging Provider',
      retailer: 'Retailer',
      saps: 'SAPS Officer',
      public: 'Public User',
      government: 'Government Official',
      admin: 'Administrator',
      viewer: 'Viewer',
    };
    return displayNames[role] || role;
  };

  const getRoleDescription = (role: UserRole): string => {
    const descriptions: Record<UserRole, string> = {
      farmer: 'Register livestock and manage farm operations',
      inspector: 'Inspect and verify livestock records',
      logistics: 'Manage transportation and logistics',
      packaging: 'Handle packaging and processing operations',
      retailer: 'Manage retail operations and sales',
      saps: 'Law enforcement and investigation',
      public: 'Browse public traceability information',
      government: 'Oversight and compliance monitoring',
      admin: 'System administration and management',
      viewer: 'View-only access to system data',
    };
    return descriptions[role] || '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/get-started')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
          </Button>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Account</h1>
            <p className="text-gray-600">Join the Maroon Traceability platform</p>
          </div>
        </div>

        <Card className="p-6">
          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Success Display */}
          {isRegistered && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md flex items-center">
              <Check className="h-5 w-5 text-green-500 mr-2" />
              <p className="text-sm text-green-800">Registration successful! Please check your email for verification.</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <User className="inline h-4 w-4 mr-1" />
                Full Name *
              </label>
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Mail className="inline h-4 w-4 mr-1" />
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Your Role *
              </label>
              <select
                name="role"
                required
                value={formData.role}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Choose your role...</option>
                {availableRoles.map(role => (
                  <option key={role} value={role}>
                    {getRoleDisplayName(role)}
                  </option>
                ))}
              </select>
              
              {formData.role && (
                <p className="mt-2 text-sm text-gray-600">
                  {getRoleDescription(formData.role)}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Lock className="inline h-4 w-4 mr-1" />
                Password *
              </label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                minLength={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                Minimum 8 characters
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Lock className="inline h-4 w-4 mr-1" />
                Confirm Password *
              </label>
              <input
                type="password"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                minLength={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Terms Agreement */}
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  required
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">
                  I agree to the Terms of Service and Privacy Policy *
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>
        </Card>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Button 
              variant="link" 
              onClick={() => router.push('/login')}
              className="p-0 h-auto text-blue-600 hover:text-blue-800"
            >
              Sign in here
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}
