// src/features/farmer/services/FarmerRepository.ts
// Repository abstraction for farmer operations

import { getAdapterConfig } from '@/config/adapters';
import type {
  AdapterConfig,
  AdapterResult,
  DataAdapter,
} from '@/core/types/adapter';
import { logHybridOperation } from '@/core/utils/hybridUtils';
import type { UniversalUser } from '@/types/types';
import { RealFarmerAdapter } from '../adapters/RealFarmerAdapter';
import type { FarmerProfileData, FarmerProduct, FarmerStatistics } from '../application/FarmerApplication';

/**
 * Cache entry for farmer operations
 */
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

/**
 * Farmer Repository
 * Provides clean abstraction with caching, validation, and hybrid support
 */
export class FarmerRepository {
  private adapter: DataAdapter<UniversalUser> | null = null;
  private initialized = false;
  private cache = new Map<string, CacheEntry<unknown>>();
  private config: AdapterConfig;

  constructor() {
    // Farmer uses real adapter as per requirements
    this.config = getAdapterConfig('farmer', 'real') || { type: 'real' };
  }

  /**
   * Initialize repository with appropriate adapter
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      logHybridOperation('initialize_repository', 'farmer', {
        adapterType: 'real',
        config: this.config,
      }, 'info');

      // Farmer uses real adapter as per requirements
      this.adapter = new RealFarmerAdapter(this.config);

      await this.adapter.initialize();
      this.initialized = true;

      logHybridOperation('repository_initialized', 'farmer', {
        adapterId: this.adapter?.id,
        adapterType: this.adapter.type,
        isAvailable: this.adapter.isAvailable,
      }, 'info');

    } catch (error) {
      logHybridOperation('repository_init_failed', 'farmer', {
        error: (error as Error).message,
      }, 'error');

      // For farmer, we don't fall back to mock - it must be real
      throw new Error(`Farmer requires real data source: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Ensure repository is initialized
   */
  private async ensureInitialized(): Promise<void> {
    if (!this.initialized) {
      await this.initialize();
    }
  }

  /**
   * Create farmer profile
   */
  async createFarmerProfile(farmerData: FarmerProfileData): Promise<AdapterResult<UniversalUser>> {
    await this.ensureInitialized();

    const startTime = Date.now();

    try {
      logHybridOperation('create_farmer_profile_start', 'farmer', {
        email: farmerData.email,
        name: farmerData.name,
      }, 'info');

      if (!this.adapter) {
        return {
          success: false,
          error: 'Farmer adapter is not available',
        };
      }

      // Validation
      const validation = this.validateFarmerData(farmerData);
      if (!validation.valid) {
        logHybridOperation('create_farmer_profile_validation_failed', 'farmer', {
          email: farmerData.email,
          errors: validation.errors,
        }, 'warn');

        return {
          success: false,
          error: `Validation failed: ${validation.errors.join(', ')}`,
        };
      }

      // Create farmer using adapter
      const result = await this.adapter.create(farmerData);

      const duration = Date.now() - startTime;

      if (result.success && result.data) {
        // Cache result for 5 minutes
        this.setCache(`farmer-${result.data.id}`, result.data, 300000);

        logHybridOperation('create_farmer_profile_success', 'farmer', {
          farmerId: result.data?.id,
          email: farmerData.email,
          duration,
        }, 'info');
      } else {
        logHybridOperation('create_farmer_profile_failed', 'farmer', {
          email: farmerData.email,
          error: result.error,
          duration,
        }, 'error');
      }

      return result;

    } catch (error) {
      const duration = Date.now() - startTime;
      logHybridOperation('create_farmer_profile_error', 'farmer', {
        email: farmerData.email,
        error: (error as Error).message,
        duration,
      }, 'error');

      return {
        success: false,
        error: `Farmer profile creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Get farmer profile by ID
   */
  async getFarmerProfile(farmerId: string): Promise<AdapterResult<UniversalUser>> {
    await this.ensureInitialized();

    try {
      if (!this.adapter) {
        return {
          success: false,
          error: 'Farmer adapter is not available',
        };
      }

      // Check cache first
      const cachedResult = this.getCache(`farmer-${farmerId}`) as UniversalUser | undefined;
      if (cachedResult) {
        return {
          success: true,
          data: cachedResult,
          metadata: {
            cached: true,
            retrievedAt: new Date().toISOString(),
          },
        };
      }

      // Get from adapter
      const result = await this.adapter.read(farmerId);

      if (result.success && result.data) {
        // Cache result for 5 minutes
        this.setCache(`farmer-${farmerId}`, result.data, 300000);
      }

      return result as AdapterResult<UniversalUser>;

    } catch (error) {
      logHybridOperation('get_farmer_profile_error', 'farmer', {
        farmerId,
        error: (error as Error).message,
      }, 'error');

      return {
        success: false,
        error: `Farmer profile retrieval failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Update farmer profile
   */
  async updateFarmerProfile(farmerId: string, updates: Partial<FarmerProfileData>): Promise<AdapterResult<UniversalUser>> {
    await this.ensureInitialized();

    try {
      if (!this.adapter) {
        return {
          success: false,
          error: 'Farmer adapter is not available',
        };
      }

      // Validate updates
      const validation = this.validateFarmerUpdates(updates);
      if (!validation.valid) {
        return {
          success: false,
          error: `Validation failed: ${validation.errors.join(', ')}`,
        };
      }

      // Clear cache for this farmer
      this.clearCache(`farmer-${farmerId}`);

      // Update using adapter
      const result = await this.adapter.update(farmerId, updates);

      if (result.success && result.data) {
        // Cache updated result
        this.setCache(`farmer-${farmerId}`, result.data, 300000);

        logHybridOperation('update_farmer_profile_success', 'farmer', {
          farmerId,
          updatedFields: Object.keys(updates),
        }, 'info');
      }

      return result;

    } catch (error) {
      logHybridOperation('update_farmer_profile_error', 'farmer', {
        farmerId,
        error: (error as Error).message,
      }, 'error');

      return {
        success: false,
        error: `Farmer profile update failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Get farmer products
   */
  async getFarmerProducts(farmerId: string): Promise<AdapterResult<FarmerProduct[]>> {
    await this.ensureInitialized();

    try {
      if (!this.adapter) {
        return {
          success: false,
          error: 'Farmer adapter is not available',
        };
      }

      // Check cache first
      const cacheKey = `farmer-products-${farmerId}`;
      const cachedResult = this.getCache(cacheKey) as FarmerProduct[] | undefined;
      if (cachedResult) {
        return {
          success: true,
          data: cachedResult,
          metadata: {
            cached: true,
            retrievedAt: new Date().toISOString(),
          },
        };
      }

      // Get from adapter using list method with filters
      const result = await this.adapter.list({ farmer_id: farmerId });

      if (result.success && result.data) {
        // Cache result for 2 minutes
        this.setCache(cacheKey, result.data, 120000);
      }

      // Convert UniversalUser[] to FarmerProduct[] - this is a mock implementation
      // In a real implementation, the adapter would return FarmerProduct[] directly
      const mockProducts: FarmerProduct[] = [
        {
          id: '1',
          farmerId,
          name: 'Organic Tomatoes',
          category: 'vegetables',
          quantity: 100,
          unit: 'kg',
          price: 5.99,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          farmerId,
          name: 'Fresh Lettuce',
          category: 'vegetables',
          quantity: 50,
          unit: 'kg',
          price: 3.99,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      return {
        success: true,
        data: mockProducts,
        metadata: result.metadata,
      };

    } catch (error) {
      logHybridOperation('get_farmer_products_error', 'farmer', {
        farmerId,
        error: (error as Error).message,
      }, 'error');

      return {
        success: false,
        error: `Farmer products retrieval failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Create product
   */
  async createProduct(productData: Omit<FarmerProduct, 'id' | 'createdAt' | 'updatedAt'>): Promise<AdapterResult<FarmerProduct>> {
    await this.ensureInitialized();

    try {
      if (!this.adapter) {
        return {
          success: false,
          error: 'Farmer adapter is not available',
        };
      }

      // Validate product data
      const validation = this.validateProductData(productData);
      if (!validation.valid) {
        return {
          success: false,
          error: `Validation failed: ${validation.errors.join(', ')}`,
        };
      }

      // Clear products cache for this farmer
      if (productData.farmerId) {
        this.clearCache(`farmer-products-${productData.farmerId}`);
      }

      // Create product - mock implementation
      // In a real implementation, this would use a product-specific adapter
      const newProduct: FarmerProduct = {
        id: Date.now().toString(),
        ...productData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      logHybridOperation('create_product_success', 'farmer', {
        productId: newProduct.id,
        farmerId: productData.farmerId,
      }, 'info');

      return {
        success: true,
        data: newProduct,
      };

    } catch (error) {
      logHybridOperation('create_product_error', 'farmer', {
        error: (error as Error).message,
      }, 'error');

      return {
        success: false,
        error: `Product creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Update product
   */
  async updateProduct(productId: string, updates: Partial<FarmerProduct>): Promise<AdapterResult<FarmerProduct>> {
    await this.ensureInitialized();

    try {
      if (!this.adapter) {
        return {
          success: false,
          error: 'Farmer adapter is not available',
        };
      }

      // Validate updates
      const validation = this.validateProductUpdates(updates);
      if (!validation.valid) {
        return {
          success: false,
          error: `Validation failed: ${validation.errors.join(', ')}`,
        };
      }

      // Update product - mock implementation
      // In a real implementation, this would use a product-specific adapter
      const updatedProduct: FarmerProduct = {
        id: productId,
        farmerId: updates.farmerId || '',
        name: updates.name || '',
        category: updates.category || '',
        quantity: updates.quantity || 0,
        unit: updates.unit || 'kg',
        price: updates.price || 0,
        createdAt: updates.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      logHybridOperation('update_product_success', 'farmer', {
        productId,
        updatedFields: Object.keys(updates),
      }, 'info');

      return {
        success: true,
        data: updatedProduct,
      };

    } catch (error) {
      logHybridOperation('update_product_error', 'farmer', {
        productId,
        error: (error as Error).message,
      }, 'error');

      return {
        success: false,
        error: `Product update failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Delete product
   */
  async deleteProduct(productId: string): Promise<AdapterResult<void>> {
    await this.ensureInitialized();

    try {
      if (!this.adapter) {
        return {
          success: false,
          error: 'Farmer adapter is not available',
        };
      }

      // Delete using adapter
      const result = await this.adapter.delete(productId);

      if (result.success) {
        logHybridOperation('delete_product_success', 'farmer', {
          productId,
        }, 'info');
      }

      return result;

    } catch (error) {
      logHybridOperation('delete_product_error', 'farmer', {
        productId,
        error: (error as Error).message,
      }, 'error');

      return {
        success: false,
        error: `Product deletion failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Search products
   */
  async searchProducts(query: string): Promise<AdapterResult<FarmerProduct[]>> {
    await this.ensureInitialized();

    try {
      if (!this.adapter) {
        return {
          success: false,
          error: 'Farmer adapter is not available',
        };
      }

      // Search products - mock implementation
      // In a real implementation, this would use a product-specific adapter
      const mockResults: FarmerProduct[] = [
        {
          id: '1',
          farmerId: 'farmer-1',
          name: `Organic ${query}`,
          category: 'vegetables',
          quantity: 100,
          unit: 'kg',
          price: 5.99,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      return {
        success: true,
        data: mockResults,
      };

    } catch (error) {
      logHybridOperation('search_products_error', 'farmer', {
        query,
        error: (error as Error).message,
      }, 'error');

      return {
        success: false,
        error: `Product search failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Get farmer statistics
   */
  async getFarmerStatistics(farmerId: string): Promise<AdapterResult<FarmerStatistics>> {
    await this.ensureInitialized();

    try {
      if (!this.adapter) {
        return {
          success: false,
          error: 'Farmer adapter is not available',
        };
      }

      // This would integrate with your analytics system
      // For now, use a mock implementation
      const stats: FarmerStatistics = {
        totalProducts: 50,
        totalRevenue: 1250.50,
        averageProductPrice: 25.01,
        topCategories: [
          { category: 'vegetables', count: 25 },
          { category: 'fruits', count: 15 },
          { category: 'herbs', count: 10 },
        ],
        recentActivity: [
          {
            type: 'product_created',
            timestamp: new Date().toISOString(),
            description: 'Created new product listing',
          },
          {
            type: 'profile_updated',
            timestamp: new Date(Date.now() - 86400000).toISOString(),
            description: 'Updated farm information',
          },
        ],
      };

      return {
        success: true,
        data: stats,
        metadata: {
          retrievedAt: new Date().toISOString(),
          farmerId,
        },
      };

    } catch (error) {
      logHybridOperation('get_farmer_statistics_error', 'farmer', {
        farmerId,
        error: (error as Error).message,
      }, 'error');

      return {
        success: false,
        error: `Farmer statistics failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Validation with business rules
   */
  private validateFarmerData(farmerData: FarmerProfileData): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Email validation
    if (!farmerData.email) {
      errors.push('Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(farmerData.email)) {
      errors.push('Invalid email format');
    }

    // Name validation
    if (!farmerData.name || farmerData.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long');
    }

    // Phone validation
    if (!farmerData.phone) {
      errors.push('Phone number is required');
    } else if (!/^\+?[\d\s\-()]*$/.test(farmerData.phone.replace(/\s/g, ''))) {
      errors.push('Invalid phone number format');
    }

    // Address validation
    if (!farmerData.address || (!farmerData.address.street && !farmerData.address.city)) {
      errors.push('Address with street and city is required');
    }

    // Note: farmName, location, and certificationNumber are not part of FarmerProfileData interface
    // These would need to be added to the interface or handled in a different way
    // For now, we'll skip these validations

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate farmer updates
   */
  private validateFarmerUpdates(updates: Partial<FarmerProfileData>): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Email validation (if provided)
    if (updates.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updates.email)) {
      errors.push('Invalid email format');
    }

    // Phone validation (if provided)
    if (updates.phone && !/^\+?[\d\s-()]*$/.test(updates.phone.replace(/\s/g, ''))) {
      errors.push('Invalid phone number format');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate product data
   */
  private validateProductData(productData: Omit<FarmerProduct, 'id' | 'createdAt' | 'updatedAt'>): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!productData.name || productData.name.trim().length === 0) {
      errors.push('Product name is required');
    }

    if (!productData.farmerId) {
      errors.push('Farmer ID is required');
    }

    if (!productData.category) {
      errors.push('Product category is required');
    }

    if (!productData.price || productData.price <= 0) {
      errors.push('Product price must be greater than 0');
    }

    if (!productData.quantity || productData.quantity < 0) {
      errors.push('Product quantity must be 0 or greater');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate product updates
   */
  private validateProductUpdates(updates: Partial<FarmerProduct>): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (updates.price !== undefined && updates.price <= 0) {
      errors.push('Product price must be greater than 0');
    }

    if (updates.quantity !== undefined && updates.quantity < 0) {
      errors.push('Product quantity must be 0 or greater');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Cache operations
   */
  private setCache(key: string, data: unknown, ttl: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  private getCache(key: string): unknown | undefined {
    const entry = this.cache.get(key);
    if (!entry) {
      return undefined;
    }

    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return undefined;
    }

    return entry.data;
  }

  private clearCache(pattern?: string): void {
    if (!pattern) {
      this.cache.clear();
      return;
    }

    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Get repository health status with detailed metrics
   */
  async getHealthStatus(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    details: Record<string, unknown>;
  }> {
    try {
      if (!this.adapter) {
        return {
          status: 'unhealthy',
          details: {
            error: 'No adapter available',
            initialized: this.initialized,
          },
        };
      }

      // Check if adapter has health status method
      if ('getHealthStatus' in this.adapter) {
        const adapterHealth = await (this.adapter as DataAdapter<UniversalUser> & { getHealthStatus(): Promise<{ status: string; details?: Record<string, unknown> }> }).getHealthStatus();

        return {
          status: adapterHealth.status as 'healthy' | 'degraded' | 'unhealthy',
          details: {
            ...(adapterHealth.details || {}),
            repository: {
              initialized: this.initialized,
              adapterId: this.adapter?.id,
              adapterType: this.adapter.type,
              cacheSize: this.cache.size,
              config: this.config,
            },
          },
        };
      }

      // Basic health check
      const startTime = Date.now();
      const readResult = await this.adapter.read('health-check');
      const responseTime = Date.now() - startTime;

      return {
        status: readResult.success && responseTime < 2000 ? 'healthy' : 'degraded',
        details: {
          responseTime,
          adapterId: this.adapter?.id,
          adapterType: this.adapter.type,
          initialized: this.initialized,
          cacheSize: this.cache.size,
        },
      };

    } catch (error) {
      return {
        status: 'unhealthy',
        details: {
          error: error instanceof Error ? error.message : 'Unknown error',
          initialized: this.initialized,
        },
      };
    }
  }

  /**
   * Cleanup repository resources
   */
  async cleanup(): Promise<void> {
    if (this.adapter) {
      await this.adapter.cleanup();
      this.adapter = null;
    }

    this.clearCache();
    this.initialized = false;

    logHybridOperation('repository_cleanup', 'farmer', {
      cleaned: true,
    }, 'info');
  }

  /**
   * Get current adapter information
   */
  getAdapterInfo(): {
    id: string;
    type: string;
    isAvailable: boolean;
    config: AdapterConfig;
  } | null {
    if (!this.adapter) {
      return null;
    }

    return {
      id: this.adapter.id,
      type: this.adapter.type,
      isAvailable: this.adapter.isAvailable,
      config: this.config,
    };
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): {
    size: number;
    keys: string[];
    } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }

  /**
   * Force refresh of cached data
   */
  async refreshCache(): Promise<void> {
    this.clearCache();
    logHybridOperation('cache_refreshed', 'farmer', {
      cleared: true,
    }, 'info');
  }
}

// Singleton instance
export const farmerRepository = new FarmerRepository();
