// src/contexts/userContext.tsx
'use client';

import React, { 
  createContext, 
  useContext, 
  useState, 
  ReactNode, 
  useCallback, 
  useEffect, 
  useMemo 
} from 'react';
import { User, UserRole, ROLE_PERMISSIONS, UserContextType } from '@/types/user';
import { useRouter } from 'next/navigation';

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const updateUserRole = useCallback((role: UserRole) => {
    setUser(prevUser => {
      const rolePermissions = ROLE_PERMISSIONS[role] || { 
        canCreate: false, 
        canVerify: false 
      };

      if (!prevUser) {
        return { 
          id: 'guest',
          name: 'Guest',
          email: '',
          role,
          permissions: { 
            canCreate: rolePermissions.canCreate || false, 
            canVerify: rolePermissions.canVerify || false 
          }
        };
      }
      return { 
        ...prevUser, 
        role,
        permissions: { 
          canCreate: rolePermissions.canCreate || false, 
          canVerify: rolePermissions.canVerify || false 
        }
      };
    });
    router.push(`/${role}`);
  }, [router]);

  // Initialize loading state
  useEffect(() => {
    // Only run this in the browser
    if (typeof window !== 'undefined') {
      // Check for existing user session or token
      const authToken = document.cookie.split('; ').find(row => row.startsWith('auth-token='));
      setLoading(false);
    } else {
      // For server-side rendering, set loading to false
      setLoading(false);
    }
  }, []);

  // Update user data and set cookie
  const setUserWithPersistence = useCallback((newUser: React.SetStateAction<User | null>) => {
    setUser(prevUser => {
      let updatedUser: User | null;
      
      if (typeof newUser === 'function') {
        updatedUser = newUser(prevUser);
      } else {
        updatedUser = newUser;
      }
      
      // Only run this in the browser
      if (typeof window !== 'undefined') {
        const secureFlag = process.env.NODE_ENV === 'production' ? 'Secure; ' : '';
        
        if (updatedUser) {
          // Set auth cookie when user logs in
          document.cookie = `auth-token=${updatedUser.id}; ` +
            `path=/; ` +
            `max-age=86400; ` + // 1 day
            `${secureFlag}` +
            `SameSite=Strict`;
        } else {
          // Clear auth cookie when user logs out
          document.cookie = 'auth-token=; ' +
            'path=/; ' +
            'expires=Thu, 01 Jan 1970 00:00:00 GMT; ' +
            `${secureFlag}` +
            'SameSite=Strict';
        }
      }
      
      return updatedUser;
    });
  }, []);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    user: user ? { 
      ...user,
      permissions: {
        canCreate: user.role === 'farmer' || user.role === 'packaging' || user.role === 'inspector',
        canVerify: user.role === 'retailer' || user.role === 'inspector'
      }
    } : null,
    setUser: setUserWithPersistence,
    updateUserRole,
    loading
  }), [user, loading, updateUserRole, setUserWithPersistence]);

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}