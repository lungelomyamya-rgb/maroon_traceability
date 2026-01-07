// src/lib/auth.ts
import { User, UserRole } from '@/types/user';
import { ROLE_PERMISSIONS } from '@/types/user';

// Mock user database for demo
const MOCK_USERS = [
  {
    id: '1',
    name: 'John Farmer',
    email: 'john@farm.com',
    password: 'password123', // In production, this would be hashed
    role: 'farmer' as UserRole,
    address: 'Stellenbosch, Western Cape'
  },
  {
    id: '2',
    name: 'Jane Inspector',
    email: 'jane@inspect.gov',
    password: 'password123',
    role: 'inspector' as UserRole,
    address: 'Cape Town, Western Cape'
  },
  {
    id: '3',
    name: 'Bob Retailer',
    email: 'bob@retail.com',
    password: 'password123',
    role: 'retailer' as UserRole,
    address: 'Johannesburg, Gauteng'
  },
  {
    id: '4',
    name: 'Admin User',
    email: 'admin@system.com',
    password: 'admin123',
    role: 'admin' as UserRole,
    address: 'Pretoria, Gauteng'
  },
  {
    id: '5',
    name: 'Charlie Packaging',
    email: 'charlie@packaging.com',
    password: 'password123',
    role: 'packaging' as UserRole,
    address: 'Durban, KwaZulu-Natal'
  }
];

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  address?: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  error?: string;
  token?: string;
}

class AuthService {
  private users: typeof MOCK_USERS;

  constructor() {
    // Initialize with mock users
    this.users = [...MOCK_USERS];
    // Load any additional users from localStorage (only on client side)
    if (typeof window !== 'undefined') {
      const storedUsers = localStorage.getItem('registeredUsers');
      if (storedUsers) {
        try {
          const parsedUsers = JSON.parse(storedUsers);
          this.users.push(...parsedUsers);
        } catch (error) {
          console.error('Failed to parse stored users:', error);
        }
      }
    }
  }

  // Simulate API delay
  private delay(ms: number = 1000): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Generate JWT-like token (in production, use proper JWT)
  private generateToken(user: User): string {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    };
    return btoa(JSON.stringify(payload));
  }

  // Verify token
  private verifyToken(token: string): User | null {
    try {
      const payload = JSON.parse(atob(token));
      if (payload.exp < Date.now()) {
        return null; // Token expired
      }
      
      const user = this.users.find(u => u.id === payload.id);
      if (!user) return null;

      // Return user without password
      const { password, ...userWithoutPassword } = user;
      return {
        ...userWithoutPassword,
        permissions: {
          canCreate: ROLE_PERMISSIONS[user.role].canCreate,
          canVerify: ROLE_PERMISSIONS[user.role].canVerify,
          canView: ROLE_PERMISSIONS[user.role].canView
        }
      };
    } catch (error) {
      return null;
    }
  }

  // Login method
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    await this.delay(); // Simulate network delay

    const user = this.users.find(u => u.email === credentials.email);
    
    if (!user) {
      return {
        success: false,
        error: 'Invalid email or password'
      };
    }

    if (user.password !== credentials.password) {
      return {
        success: false,
        error: 'Invalid email or password'
      };
    }

    // Remove password from user object
    const { password, ...userWithoutPassword } = user;
    const userWithPermissions = {
      ...userWithoutPassword,
      permissions: {
        canCreate: ROLE_PERMISSIONS[user.role].canCreate,
        canVerify: ROLE_PERMISSIONS[user.role].canVerify,
        canView: ROLE_PERMISSIONS[user.role].canView
      }
    };

    const token = this.generateToken(userWithPermissions);

    // Store session
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(userWithPermissions));
    }

    return {
      success: true,
      user: userWithPermissions,
      token
    };
  }

  // Register method
  async register(data: RegisterData): Promise<AuthResponse> {
    await this.delay(); // Simulate network delay

    // Check if user already exists
    const existingUser = this.users.find(u => u.email === data.email);
    if (existingUser) {
      return {
        success: false,
        error: 'User with this email already exists'
      };
    }

    // Validate password strength
    if (data.password.length < 6) {
      return {
        success: false,
        error: 'Password must be at least 6 characters long'
      };
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      name: data.name,
      email: data.email,
      password: data.password, // In production, hash this
      role: data.role,
      address: data.address || ''
    };

    // Add to users array
    this.users.push(newUser);

    // Save to localStorage for persistence
    if (typeof window !== 'undefined') {
      const registeredUsers = this.users.filter(u => !MOCK_USERS.find(mu => mu.id === u.id));
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
    }

    // Remove password and create user with permissions
    const { password, ...userWithoutPassword } = newUser;
    const userWithPermissions = {
      ...userWithoutPassword,
      permissions: {
        canCreate: ROLE_PERMISSIONS[newUser.role].canCreate,
        canVerify: ROLE_PERMISSIONS[newUser.role].canVerify,
        canView: ROLE_PERMISSIONS[newUser.role].canView
      }
    };

    const token = this.generateToken(userWithPermissions);

    // Store session
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(userWithPermissions));
    }

    return {
      success: true,
      user: userWithPermissions,
      token
    };
  }

  // Logout method
  async logout(): Promise<void> {
    await this.delay(500); // Simulate network delay
    
    // Clear session
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  }

  // Get current user from token
  getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;
    
    const token = localStorage.getItem('authToken');
    if (!token) return null;

    return this.verifyToken(token);
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  // Refresh token
  async refreshToken(): Promise<AuthResponse> {
    if (typeof window === 'undefined') {
      return { success: false, error: 'Not available on server' };
    }

    const token = localStorage.getItem('authToken');
    if (!token) {
      return { success: false, error: 'No token found' };
    }

    const user = this.verifyToken(token);
    if (!user) {
      return { success: false, error: 'Invalid token' };
    }

    const newToken = this.generateToken(user);
    localStorage.setItem('authToken', newToken);

    return {
      success: true,
      user,
      token: newToken
    };
  }

  // Update user profile
  async updateProfile(updates: Partial<User>): Promise<AuthResponse> {
    await this.delay();

    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      return { success: false, error: 'Not authenticated' };
    }

    // Update user in array
    const userIndex = this.users.findIndex(u => u.id === currentUser.id);
    if (userIndex === -1) {
      return { success: false, error: 'User not found' };
    }

    this.users[userIndex] = {
      ...this.users[userIndex],
      ...updates
    };

    // Update stored user
    const updatedUser = { ...currentUser, ...updates };
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }

    return {
      success: true,
      user: updatedUser
    };
  }

  // Change password
  async changePassword(oldPassword: string, newPassword: string): Promise<AuthResponse> {
    await this.delay();

    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      return { success: false, error: 'Not authenticated' };
    }

    // Find user with password
    const userIndex = this.users.findIndex(u => u.id === currentUser.id);
    if (userIndex === -1) {
      return { success: false, error: 'User not found' };
    }

    const user = this.users[userIndex];
    if (user.password !== oldPassword) {
      return { success: false, error: 'Current password is incorrect' };
    }

    // Validate new password
    if (newPassword.length < 6) {
      return { success: false, error: 'New password must be at least 6 characters long' };
    }

    // Update password
    this.users[userIndex] = {
      ...user,
      password: newPassword
    };

    return {
      success: true,
      user: currentUser
    };
  }
}

export const authService = new AuthService();
