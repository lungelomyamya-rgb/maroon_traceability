'use client';

import { useRouter, usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useUser } from '@/contexts/userContext';

interface WithAuthProps {
  requiredRole?: string | string[];
  redirectTo?: string;
  fallback?: React.ComponentType;
}

/**
 * Higher-order component for authentication and role-based access control
 *
 * @param requiredRole - Role(s) required to access the component
 * @param redirectTo - Path to redirect to if unauthorized (default: '/login')
 * @param fallback - Component to show while checking authentication
 */
export function withAuth<P extends object>(
  { requiredRole, redirectTo = '/login', fallback: Fallback }: WithAuthProps = {},
) {
  return function AuthenticatedComponent(Component: React.ComponentType<P>) {
    return function AuthenticatedWrapper(props: P) {
      const router = useRouter();
      const pathname = usePathname();
      const { currentUser } = useUser();
      const [isChecking, setIsChecking] = useState(true);
      const [isAuthorized, setIsAuthorized] = useState(false);

      useEffect(() => {
        const checkAuth = () => {
          setIsChecking(false);

          // If user is not logged in, redirect to login
          if (!currentUser) {
            router.push(`${redirectTo}?redirect=${encodeURIComponent(pathname || '/')}`);
            return;
          }

          // Check role-based access
          if (requiredRole) {
            const requiredRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];

            if (!requiredRoles.includes(currentUser.role)) {
              router.push('/unauthorized');
              return;
            }
          }

          setIsAuthorized(true);
        };

        // Small delay to prevent flickering
        const timeoutId = setTimeout(checkAuth, 100);
        return () => clearTimeout(timeoutId);
      }, [currentUser, router, pathname]);

      // Show loading while checking authentication
      if (isChecking) {
        const FallbackComponent = Fallback || DefaultLoadingFallback;
        return <FallbackComponent />;
      }

      // Show unauthorized state if not authorized
      if (!isAuthorized) {
        return <DefaultUnauthorizedFallback />;
      }

      // Render the protected component
      return <Component {...props} />;
    };
  };
}

/**
 * Default loading fallback component
 */
function DefaultLoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Checking authentication...</p>
      </div>
    </div>
  );
}

/**
 * Default unauthorized fallback component
 */
function DefaultUnauthorizedFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-red-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
}

/**
 * Hook for role-based authentication logic
 */
export function useRoleAuth(requiredRole?: string | string[]) {
  const { currentUser } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  const isAuthorized = React.useMemo(() => {
    if (!currentUser) {
      return false;
    }

    if (!requiredRole) {
      return true;
    }

    const requiredRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    return requiredRoles.includes(currentUser.role);
  }, [currentUser, requiredRole]);

  const redirectToLogin = () => {
    router.push(`/login?redirect=${encodeURIComponent(pathname || '/')}`);
  };

  const redirectToUnauthorized = () => {
    router.push('/unauthorized');
  };

  return {
    isAuthorized,
    currentUser,
    redirectToLogin,
    redirectToUnauthorized,
  };
}

/**
 * Specific auth HOCs for common roles
 */
export const withFarmerAuth = withAuth({ requiredRole: 'farmer' });
export const withInspectorAuth = withAuth({ requiredRole: 'inspector' });
export const withLogisticsAuth = withAuth({ requiredRole: 'logistics' });
export const withPackagingAuth = withAuth({ requiredRole: 'packaging' });
export const withRetailerAuth = withAuth({ requiredRole: 'retailer' });
export const withAdminAuth = withAuth({ requiredRole: ['admin', 'system'] });
