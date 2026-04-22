// src/features/farmer/adapters/RealFarmerAdapter.ts
// Real farmer adapter integrated with hybrid architecture

import type {
  DataAdapter,
  AdapterConfig,
  AdapterResult,
} from '@/core/types/adapter';
import type { UniversalUser } from '@/types/types';
import { toUniversalUser } from '@/types/types';
import type { FarmerProfileData, FarmerProduct } from '../application/FarmerApplication';
import { supabase, isSupabaseAvailable } from '../services/supabaseClient';

/**
 * Real Farmer Adapter
 * Production-ready implementation using Supabase for farmer operations
 */
export class RealFarmerAdapter implements DataAdapter<UniversalUser> {
  readonly id = 'real-farmer';
  readonly type = 'real' as const;
  readonly feature = 'farmer';
  readonly isAvailable: boolean;

  constructor(private config?: AdapterConfig) {
    this.isAvailable = isSupabaseAvailable();
  }

  /**
   * Initialize the adapter
   */
  async initialize(): Promise<void> {
    if (!this.isAvailable) {
      throw new Error('Real farmer adapter is not available. Check Supabase configuration.');
    }

    try {
      // Test Supabase connection
      const supabaseClient = supabase;
      if (!supabaseClient) {
        throw new Error('Supabase client not available');
      }

      const { error } = await supabaseClient.from('farmers').select('id').limit(1);
      if (error && error.code !== 'PGRST116') {
        throw new Error(`Supabase connection failed: ${error.message}`);
      }
    } catch (error) {
      throw new Error(`Failed to initialize real farmer adapter: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Cleanup adapter resources
   */
  async cleanup(): Promise<void> {
    // No specific cleanup needed for Supabase client
  }

  /**
   * Create new record (DataAdapter implementation)
   */
  async create(data: Partial<FarmerProfileData>): Promise<AdapterResult<UniversalUser>> {
    try {
      if (!this.isAvailable) {
        return {
          success: false,
          error: 'Real farmer adapter is not available',
        };
      }

      const supabaseClient = supabase;
      if (!supabaseClient) {
        return {
          success: false,
          error: 'Supabase client not available',
        };
      }

      const { data: result, error } = await supabaseClient
        .from('farmers')
        .insert({
          ...data,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: `Failed to create farmer profile: ${error.message}`,
        };
      }

      // Convert to UniversalUser
      const universalUser = toUniversalUser(result, 'api');

      return {
        success: true,
        data: universalUser as UniversalUser,
        metadata: {
          createdAt: new Date().toISOString(),
          source: 'supabase',
        },
      };

    } catch (error) {
      return {
        success: false,
        error: `Farmer profile creation error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Read record by ID (DataAdapter implementation)
   */
  async read(id: string): Promise<AdapterResult<UniversalUser | null>> {
    try {
      if (!this.isAvailable) {
        return {
          success: false,
          error: 'Real farmer adapter is not available',
        };
      }

      const supabaseClient = supabase;
      if (!supabaseClient) {
        return {
          success: false,
          error: 'Supabase client not available',
        };
      }

      const { data, error } = await supabaseClient
        .from('farmers')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        return {
          success: false,
          error: `Failed to get farmer profile: ${error.message}`,
        };
      }

      // Convert to UniversalUser
      const universalUser = data ? toUniversalUser(data, 'api') : undefined;

      return {
        success: true,
        data: universalUser,
        metadata: {
          retrievedAt: new Date().toISOString(),
          source: 'supabase',
        },
      };

    } catch (error) {
      return {
        success: false,
        error: `Farmer profile retrieval error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Update record (DataAdapter implementation)
   */
  async update(id: string, data: Partial<FarmerProfileData>): Promise<AdapterResult<UniversalUser>> {
    try {
      if (!this.isAvailable) {
        return {
          success: false,
          error: 'Real farmer adapter is not available',
        };
      }

      const supabaseClient = supabase;
      if (!supabaseClient) {
        return {
          success: false,
          error: 'Supabase client not available',
        };
      }

      // Add updated timestamp
      const updatesWithTimestamp = {
        ...data,
        updatedAt: new Date().toISOString(),
      };

      const { data: result, error } = await supabaseClient
        .from('farmers')
        .update(updatesWithTimestamp)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: `Failed to update farmer profile: ${error.message}`,
        };
      }

      // Convert to UniversalUser
      const universalUser = toUniversalUser(result, 'api');

      return {
        success: true,
        data: universalUser as UniversalUser,
        metadata: {
          updatedAt: new Date().toISOString(),
          source: 'supabase',
        },
      };

    } catch (error) {
      return {
        success: false,
        error: `Farmer profile update error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Delete record (DataAdapter implementation)
   */
  async delete(id: string): Promise<AdapterResult<void>> {
    try {
      if (!this.isAvailable) {
        return {
          success: false,
          error: 'Real farmer adapter is not available',
        };
      }

      const supabaseClient = supabase;
      if (!supabaseClient) {
        return {
          success: false,
          error: 'Supabase client not available',
        };
      }

      const { error } = await supabaseClient
        .from('farmers')
        .delete()
        .eq('id', id);

      if (error) {
        return {
          success: false,
          error: `Failed to delete farmer profile: ${error.message}`,
        };
      }

      return {
        success: true,
        metadata: {
          deletedAt: new Date().toISOString(),
          source: 'supabase',
        },
      };

    } catch (error) {
      return {
        success: false,
        error: `Farmer profile deletion error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * List records (DataAdapter implementation)
   */
  async list(filters?: Record<string, unknown>): Promise<AdapterResult<UniversalUser[]>> {
    try {
      if (!this.isAvailable) {
        return {
          success: false,
          error: 'Real farmer adapter is not available',
        };
      }

      const supabaseClient = supabase;
      if (!supabaseClient) {
        return {
          success: false,
          error: 'Supabase client not available',
        };
      }

      let query = supabaseClient.from('farmers').select('*');

      // Apply filters if provided
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            query = query.eq(key, value);
          }
        });
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        return {
          success: false,
          error: `Failed to list farmers: ${error.message}`,
        };
      }

      // Convert all to UniversalUser
      const universalUsers = data?.map(farmer => toUniversalUser(farmer, 'api')).filter((user): user is UniversalUser => user !== null) || [];

      return {
        success: true,
        data: universalUsers,
        metadata: {
          retrievedAt: new Date().toISOString(),
          count: universalUsers.length,
          source: 'supabase',
        },
      };

    } catch (error) {
      return {
        success: false,
        error: `Farmer listing error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Search records (DataAdapter implementation)
   */
  async search(query: string, _options?: unknown): Promise<AdapterResult<UniversalUser[]>> {
    try {
      if (!this.isAvailable) {
        return {
          success: false,
          error: 'Real farmer adapter is not available',
        };
      }

      const supabaseClient = supabase;
      if (!supabaseClient) {
        return {
          success: false,
          error: 'Supabase client not available',
        };
      }

      const { data, error } = await supabaseClient
        .from('farmers')
        .select('*')
        .or(`name.ilike.%${query}%`)
        .or(`email.ilike.%${query}%`)
        .order('created_at', { ascending: false });

      if (error) {
        return {
          success: false,
          error: `Search failed: ${error.message}`,
        };
      }

      // Convert all to UniversalUser
      const universalUsers = data?.map(farmer => toUniversalUser(farmer, 'api')).filter((user): user is UniversalUser => user !== null) || [];

      return {
        success: true,
        data: universalUsers,
        metadata: {
          retrievedAt: new Date().toISOString(),
          query,
          count: universalUsers.length,
          source: 'supabase',
        },
      };

    } catch (error) {
      return {
        success: false,
        error: `Search error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Helper method to convert product to UniversalUser
   */
  private convertProductToUser(product: FarmerProduct): UniversalUser {
    const user = toUniversalUser({
      id: product.id,
      name: product.name,
      email: `${product.farmerId}@farm.local`,
      role: 'farmer' as const,
      isActive: true,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      phone: '',
      address: {
        street: '',
        city: '',
        country: '',
        postalCode: '',
      },
    }, 'api');

    // Since toUniversalUser should always return a valid UniversalUser for valid input,
    // we can safely assert the type here
    return user as UniversalUser;
  }
}

// Export the adapter for registry
export default RealFarmerAdapter;
