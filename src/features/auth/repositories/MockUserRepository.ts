// src/features/auth/repositories/MockUserRepository.ts
// Mock user repository for development and testing

import type { UniversalUser } from '@/types/types';
import type { IUserRepository } from '@/core/interfaces/services';

/**
 * Mock User Repository Implementation
 * Provides in-memory user data storage for development
 */
export class MockUserRepository implements IUserRepository {
  private users: Map<string, UniversalUser> = new Map();

  constructor() {
    this.initializeMockUsers();
  }

  /**
   * Initialize mock users
   */
  private initializeMockUsers(): void {
    const mockUsers: UniversalUser[] = [
      {
        id: '1',
        name: 'John Farmer',
        email: 'john@farm.com',
        role: 'farmer',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        _source: {
          type: 'mock',
          timestamp: new Date().toISOString(),
        },
        _validation: {
          isValid: true,
          validatedAt: new Date().toISOString(),
        },
        _normalized: true,
      },
      {
        id: '2',
        name: 'Jane Inspector',
        email: 'jane@inspect.gov',
        role: 'inspector',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        _source: {
          type: 'mock',
          timestamp: new Date().toISOString(),
        },
        _validation: {
          isValid: true,
          validatedAt: new Date().toISOString(),
        },
        _normalized: true,
      },
      {
        id: '3',
        name: 'Bob Retailer',
        email: 'bob@retail.com',
        role: 'retailer',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        _source: {
          type: 'mock',
          timestamp: new Date().toISOString(),
        },
        _validation: {
          isValid: true,
          validatedAt: new Date().toISOString(),
        },
        _normalized: true,
      },
    ];

    mockUsers.forEach(user => {
      this.users.set(user.id, user);
    });
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<UniversalUser | null> {
    const user = Array.from(this.users.values()).find(u => u.email === email);
    return user || null;
  }

  /**
   * Find user by ID
   */
  async findById(id: string): Promise<UniversalUser | null> {
    return this.users.get(id) || null;
  }

  /**
   * Create new user
   */
  async create(userData: Partial<UniversalUser>): Promise<UniversalUser> {
    const newUser: UniversalUser = {
      id: Date.now().toString(),
      name: userData.name || '',
      email: userData.email || '',
      role: userData.role || 'public',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      _source: {
        type: 'mock',
        timestamp: new Date().toISOString(),
      },
      _validation: {
        isValid: true,
        validatedAt: new Date().toISOString(),
      },
      _normalized: true,
      ...userData,
    };

    this.users.set(newUser.id, newUser);
    return newUser;
  }

  /**
   * Update existing user
   */
  async update(id: string, updates: Partial<UniversalUser>): Promise<UniversalUser> {
    const existingUser = this.users.get(id);
    if (!existingUser) {
      throw new Error('User not found');
    }

    const updatedUser: UniversalUser = {
      ...existingUser,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.users.set(id, updatedUser);
    return updatedUser;
  }

  /**
   * Delete user
   */
  async delete(id: string): Promise<boolean> {
    const deleted = this.users.delete(id);
    return deleted;
  }

  /**
   * Get all users
   */
  async getAll(): Promise<UniversalUser[]> {
    return Array.from(this.users.values());
  }

  /**
   * Clear all users (for testing)
   */
  clear(): void {
    this.users.clear();
  }
}
