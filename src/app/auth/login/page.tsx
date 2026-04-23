'use client';

import { ArrowLeft, Mail, Lock, Eye, EyeOff, User } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useUser } from '@/contexts/userContext';
import { getAssetPath } from '@/lib/utils/assetPath';
import { UserRole } from '@/types/user';

// Prevent static generation
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default function AuthLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // Handle redirect after successful login
  useEffect(() => {
    if (user) {
      const redirectTo = searchParams?.get('redirect') || `/${user.role}`;
      router.push(redirectTo);
    }
  }, [user, router, searchParams]);

  // Handle success message from verification
  useEffect(() => {
    const verified = searchParams?.get('verified');
    if (verified === 'true') {
      // Show success message briefly
      const timer = setTimeout(() => {
        // Clear the URL parameter
        router.replace('/auth/login');
      }, 3000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [searchParams, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const success = await login(formData.email, formData.password);
      
      if (success) {
        // Redirect will be handled by useEffect
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-md mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push('/intro')}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
          </Button>
        </div>

        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-4">
            <img src={getAssetPath('images/maroonLogo.png')} alt="MAROON" className="h-12 w-12 mr-3" />
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Maroon Traceability
            </h1>
          </div>
          <p className="text-gray-600">Sign in to your account</p>
          
          {searchParams?.get('verified') === 'true' && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 text-green-800 rounded-lg text-sm">
              Email verified successfully! You can now sign in.
            </div>
          )}
        </div>

        <Card className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Mail className="inline h-4 w-4 mr-1" />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Lock className="inline h-4 w-4 mr-1" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
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
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          {/* Demo Access */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center mb-3">
              Want to explore the system without registration?
            </p>
            <Button 
              variant="outline" 
              onClick={() => router.push('/login')}
              className="w-full"
            >
              <User className="mr-2 h-4 w-4" />
              Try Demo Mode
            </Button>
          </div>
        </Card>

        {/* Register Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Button 
              variant="link" 
              onClick={() => router.push('/get-started')}
              className="p-0 h-auto text-blue-600 hover:text-blue-800"
            >
              Sign up here
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}
