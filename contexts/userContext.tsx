// src/contexts/userContext.tsx
import { createContext, 
  useContext, 
  useState, 
  ReactNode, 
  useCallback, 
  useEffect, 
  useMemo } from 'react';
import { User, UserRole, UserContextType } from '@/types/user';
import { ROLE_PERMISSIONS } from '@/types/user';
import { useRouter } from 'next/navigation';
import { authService } from '../lib/auth';
import { DEMO_USERS } from '@/constants/users';

// Create the context with the correct type
export const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const currentUser = user; // Alias for compatibility

  const switchUser = useCallback((userId: string) => {
    // Find user in mock data
    const mockUser = DEMO_USERS.find(u => u.id === userId);
    if (mockUser) {
      setUser(mockUser);
    }
  }, []);

  const setUserWithPersistence = useCallback((newUser: User | null) => {
    setUser(newUser);
    // In-memory state for demo purposes (no localStorage for security)
  }, []);

  const updateUserRole = useCallback((role: UserRole) => {
    setUser(prevUser => {
      if (!prevUser) return null;
      return {
        ...prevUser,
        role,
        permissions: {
          canCreate: ROLE_PERMISSIONS[role].canCreate,
          canVerify: ROLE_PERMISSIONS[role].canVerify,
          canView: ROLE_PERMISSIONS[role].canView
        }
      };
    });
  }, []);

  // Initialize user from auth service on mount
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      // Ensure user has required permissions structure
      const userWithPermissions: User = {
        ...currentUser,
        permissions: {
          canCreate: ROLE_PERMISSIONS[currentUser.role].canCreate,
          canVerify: ROLE_PERMISSIONS[currentUser.role].canVerify,
          canView: ROLE_PERMISSIONS[currentUser.role].canView
        }
      };
      setUser(userWithPermissions);
    } else {
      // For demo purposes, set default viewer user if no user is logged in (public access)
      const viewerUser = DEMO_USERS.find(u => u.role === 'viewer');
      if (viewerUser) {
        setUser(viewerUser);
      }
    }
    setLoading(false);
  }, []);

  const contextValue: UserContextType = useMemo(() => ({
    user,
    currentUser,
    setUser,
    updateUserRole,
    switchUser,
    loading
  }), [user, loading, updateUserRole, switchUser]);

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