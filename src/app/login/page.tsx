'use client';

import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/userContext';
import { useEffect, useState } from 'react';
import { UserRole } from '@/types/user';
import { DEMO_USERS } from '@/constants/users';

export default function LoginPage() {
  const router = useRouter();
  const { user, setUser } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Define role descriptions for better UX (excluding viewer since it's not in login)
  const roleDescriptions: Record<UserRole, string> = {
    farmer: 'Manage your farm and track your products',
    retailer: 'Verify and manage product inventory',
    inspector: 'Inspect and verify product quality',
    logistics: 'Track and manage product shipments',
    packaging: 'Handle product packaging and processing',
    viewer: 'View product information and track history' // Included for type compatibility
  };

  // Handle user selection and navigation
  const handleUserSelect = async (role: UserRole) => {
    // Don't process if already loading
    if (isLoading) return;

    try {
      setSelectedRole(role);
      setIsLoading(true);
      setError(null);
      
      // Find the selected user
      const selectedUser = DEMO_USERS.find(u => u.role === role);
      if (!selectedUser) {
        throw new Error('User role not found');
      }

      // Add a small delay to show loading state (min 500ms for better UX)
      await new Promise(resolve => setTimeout(resolve, 500));

      // Update user context with the selected user
      await setUser({
        ...selectedUser,
        permissions: {
          canCreate: ['farmer', 'inspector', 'packaging'].includes(role),
          canVerify: ['retailer', 'inspector'].includes(role)
        }
      });

      // Navigate to the role-specific dashboard
      router.push(`/${role}`);
      
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to log in. Please try again.';
      setError(errorMessage);
      setIsLoading(false);
      setSelectedRole(null);
    }
  };
  
  // Handle card click
  const handleCardClick = (role: UserRole) => {
    if (!isLoading) {
      handleUserSelect(role);
    }
  };

  // Get role from URL query parameter
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const roleParam = urlParams.get('role') as UserRole;
      if (roleParam && roleParam !== 'viewer') {
        setSelectedRole(roleParam);
      }
    }
  }, []);

  // Clear user context when on login page to hide navigation
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const fromNavigation = urlParams.has('role');
      
      if (fromNavigation) {
        setUser(null);
      }
    }
  }, [setUser]);

  // Redirect if already logged in and not coming from navigation
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const fromNavigation = urlParams.has('role');
      
      if (user && !fromNavigation) {
        router.push(`/${user.role}`);
      }
    }
  }, [user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Welcome to Maroon Blockchain</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Select your role to access the traceability dashboard and manage your supply chain
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 text-red-600 bg-red-50 border border-red-200 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DEMO_USERS.map((user) => {
            const isSelected = selectedRole === user.role;
            const isProcessing = isSelected && isLoading;
            const role = user.role as UserRole;
            
            return (
              <div 
                key={role}
                onClick={() => handleCardClick(role)}
                className={`group relative p-6 border-2 rounded-xl transition-all duration-200 cursor-pointer ${
                  isSelected 
                    ? 'border-primary bg-primary/5 shadow-lg scale-105' 
                    : 'border-slate-200 bg-white hover:border-primary/50 hover:shadow-md hover:scale-102'
                } ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCardClick(role);
                  }
                }}
              >
                <div className="flex flex-col items-center text-center">
                  <div className={`mb-4 h-16 w-16 rounded-2xl flex items-center justify-center text-2xl font-bold transition-all ${
                    isSelected 
                      ? 'bg-primary text-white shadow-lg' 
                      : 'bg-slate-100 text-slate-700 group-hover:bg-primary/10 group-hover:text-primary'
                  }`}>
                    {user.name?.charAt(0) || 'U'}
                  </div>
                  <div className="mb-2">
                    <h3 className="text-lg font-semibold text-slate-900 mb-1">
                      {user.name}
                      {isProcessing && (
                        <span className="ml-2 inline-flex">
                          <svg className="animate-spin h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        </span>
                      )}
                    </h3>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      isSelected 
                        ? 'bg-primary text-white' 
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {role}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {roleDescriptions[role] || 'Access your dashboard'}
                    {isProcessing && '...'}
                  </p>
                </div>
                
                {isSelected && (
                  <div className="absolute -top-2 -right-2 h-6 w-6 bg-primary rounded-full flex items-center justify-center">
                    <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-sm text-slate-500">
            Select your role to access the appropriate dashboard and start managing your supply chain
          </p>
        </div>
      </div>
    </div>
  );
}