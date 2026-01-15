'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/userContext';
import { textColors } from '@/lib/theme/colors';
import { useState } from 'react';
import { UserRole } from '@/types/user';
import { DEMO_USERS } from '@/constants/users';
import { PermissionService } from '@/services/permissionService';
import { getAssetPath } from '@/lib/utils/assetPath';

// Prevent static generation
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default function LoginPage() {
  const router = useRouter();
  const { currentUser, switchUser } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Handle user selection and navigation
  const handleUserSelect = async (role: UserRole) => {
    if (isLoading) return;

    try {
      setSelectedRole(role);
      setIsLoading(true);
      
      // Update user context first, then navigate
      const user = DEMO_USERS.find((u: any) => u.role === role);
      if (user) {
        switchUser(user.id);
        // Small delay to ensure context updates before navigation
        setTimeout(() => {
          window.location.href = '/public';
        }, 100);
      } else {
        // Fallback if public user not found
        window.location.href = '/public';
      }
    } catch (err) {
      setError('Failed to switch user. Please try again.');
      console.error('User selection error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex justify-center items-center mb-6">
            <img src={getAssetPath("/images/maroon-logo.png")} alt="MAROON" className="h-16 w-16 mr-4" />
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              Maroon Traceability
            </h1>
          </div>
          <p className="text-xl text-gray-600 font-medium">
            Select your role to access the system
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Blockchain-powered supply chain transparency
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries({
            farmer: 'Manage your farm and track your products from seed to harvest',
            inspector: 'Inspect and verify product quality with detailed assessments',
            logistics: 'Track and manage product shipments and delivery logistics',
            packaging: 'Handle product packaging, processing, and batch management',
            retailer: 'Sell products on marketplace and manage your e-commerce store',
            public: 'Browse marketplace and view complete product traceability'
          }).map(([role, description]) => (
            <div 
              key={role} 
              className={`p-6 bg-white border-2 rounded-xl transition-all hover:shadow-lg hover:scale-105 cursor-pointer ${
                selectedRole === role ? 'border-blue-500 shadow-lg' : 'border-gray-200'
              }`}
              onClick={() => handleUserSelect(role as UserRole)}
            >
              <div className="mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-3 mx-auto">
                  <span className="text-white text-xl font-bold">
                    {role === 'farmer' ? '👨‍🌾' : 
                     role === 'inspector' ? '🔍' : 
                     role === 'logistics' ? '🚚' : 
                     role === 'packaging' ? '📦' : 
                     role === 'retailer' ? '🏪' : '👁️'}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 capitalize mb-2 text-center">{role}</h3>
                <p className="text-sm text-gray-600 leading-relaxed text-center">{description}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleUserSelect(role as UserRole);
                }}
                disabled={isLoading}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium transition-all"
              >
                {isLoading && selectedRole === role ? (
                  <span className="mr-2">⏳</span>
                ) : null}
                {isLoading && selectedRole === role ? 'Logging in...' : `Log in as ${role}`}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-full">
            <span className="text-sm text-blue-700 font-medium">
              🔒 Demo Mode - Select any role to explore the platform
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
