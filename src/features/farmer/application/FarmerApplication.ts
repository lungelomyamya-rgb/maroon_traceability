// src/features/farmer/application/FarmerApplication.ts
// Farmer application integrated with hybrid architecture

import { adapterRegistry } from '@/core/adapters/AdapterRegistry';
import type { AdapterConstructor } from '@/core/adapters/AdapterRegistry';
import { healthMonitor } from '@/core/infrastructure/HealthMonitor';
import { hybridModeManager } from '@/core/infrastructure/HybridModeManager';
import type { AdapterResult } from '@/core/types/adapter';
import type { UniversalUser , FarmInfo } from '@/types/types';
import { farmerRepository } from '../services/FarmerRepository';

// Farmer data interface for type safety
export interface FarmerProfileData {
  name: string;
  email: string;
  phone?: string;
  farmInfo: FarmInfo;
  address?: {
    street: string;
    city: string;
    country: string;
    postalCode?: string;
  };
}

// Product interface for type safety
export interface FarmerProduct {
  id: string;
  farmerId: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  price?: number;
  description?: string;
  harvestDate?: string;
  certifications?: Array<{
    type: string;
    issuedBy: string;
    issuedDate: string;
  }>;
  createdAt?: string;
  updatedAt?: string;
}

// Farmer statistics interface
export interface FarmerStatistics {
  totalProducts: number;
  totalRevenue?: number;
  averageProductPrice?: number;
  topCategories: Array<{
    category: string;
    count: number;
  }>;
  recentActivity: Array<{
    type: 'product_created' | 'product_updated' | 'profile_updated';
    timestamp: string;
    description: string;
  }>;
}

// System health interface
export interface SystemHealth {
  farmer: { status: string; details: Record<string, unknown> };
  overall: 'healthy' | 'degraded' | 'unhealthy';
}

/**
 * Farmer Application Service
 * Orchestrates farmer workflows with hybrid architecture integration
 */
export class FarmerApplication {
  private initialized = false;

  /**
   * Initialize the farmer application with hybrid architecture
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      // Initialize farmer repository (always uses real adapter)
      await farmerRepository.initialize();

      // Register adapters with the global registry
      await this.registerAdapters();

      // Setup health monitoring
      await this.setupHealthMonitoring();

      this.initialized = true;
      // Farmer Application initialized successfully

    } catch (error: unknown) {
      // Failed to initialize Farmer Application:
      throw new Error(`Initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Create farmer profile
   */
  async createFarmerProfile(farmerData: FarmerProfileData): Promise<AdapterResult<UniversalUser>> {
    await this.ensureInitialized();

    const startTime = Date.now();

    try {
      // Starting farmer profile creation:

      // Step 1: Validate input data
      const validation = this.validateFarmerData(farmerData);
      if (!validation.isValid) {
        return {
          success: false,
          error: `Validation failed: ${validation.errors.join(', ')}`,
        };
      }

      // Step 2: Check hybrid mode (farmer should use real mode)
      const currentMode = hybridModeManager.getMode('farmer');
      if (currentMode !== 'real') {
        // Farmer requires real mode, forcing real mode
        // Note: In a real implementation, you would switch the mode here
      }

      // Step 3: Check adapter health
      const healthStatus = await this.getFarmerAdapterHealth();
      if (healthStatus.status === 'unhealthy') {
        return {
          success: false,
          error: 'Farmer service is currently unavailable. Please try again later.',
        };
      }

      // Step 4: Create farmer using repository
      const result = await farmerRepository.createFarmerProfile(farmerData);

      const duration = Date.now() - startTime;

      if (result.success && result.data) {
        // Step 5: Log creation event
        await this.logFarmerEvent('farmer_profile_created', {
          farmerId: result.data.id,
          email: farmerData.email,
          mode: currentMode,
          duration,
          adapterId: 'real-farmer',
        });

        // Farmer profile created successfully:

        return {
          success: true,
          data: result.data,
          metadata: {
            ...result.metadata,
            processingTime: duration,
            adapterUsed: 'real-farmer',
            hybridMode: currentMode,
          },
        };
      } else {
        await this.logFarmerEvent('farmer_profile_creation_failed', {
          email: farmerData.email,
          error: result.error,
          duration,
          mode: currentMode,
        });

        return result;
      }

    } catch (error) {
      const duration = Date.now() - startTime;
      // Farmer profile creation failed:

      await this.logFarmerEvent('farmer_profile_creation_error', {
        email: farmerData.email,
        error: error instanceof Error ? error.message : 'Unknown error',
        duration,
      });

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

    const startTime = Date.now();

    try {
      // Getting farmer profile:

      const result = await farmerRepository.getFarmerProfile(farmerId);
      const duration = Date.now() - startTime;

      if (result.success) {
        await this.logFarmerEvent('farmer_profile_retrieved', {
          farmerId,
          duration,
          adapterId: 'real-farmer',
        });
      }

      return result;

    } catch (error) {
      // Failed to get farmer profile:

      return {
        success: false,
        error: `Failed to get farmer profile: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Update farmer profile
   */
  async updateFarmerProfile(farmerId: string, updates: Partial<FarmerProfileData>): Promise<AdapterResult<UniversalUser>> {
    await this.ensureInitialized();

    const startTime = Date.now();

    try {
      // Updating farmer profile:

      const result = await farmerRepository.updateFarmerProfile(farmerId, updates);
      const duration = Date.now() - startTime;

      if (result.success) {
        await this.logFarmerEvent('farmer_profile_updated', {
          farmerId,
          updatedFields: Object.keys(updates),
          duration,
          adapterId: 'real-farmer',
        });
      }

      return result;

    } catch (error) {
      // Failed to update farmer profile:

      return {
        success: false,
        error: `Failed to update farmer profile: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Get farmer products
   */
  async getFarmerProducts(farmerId: string): Promise<AdapterResult<FarmerProduct[]>> {
    await this.ensureInitialized();

    const startTime = Date.now();

    try {
      // Getting farmer products:

      const result = await farmerRepository.getFarmerProducts(farmerId);
      const duration = Date.now() - startTime;

      if (result.success) {
        await this.logFarmerEvent('farmer_products_retrieved', {
          farmerId,
          productCount: result.data?.length || 0,
          duration,
          adapterId: 'real-farmer',
        });
      }

      return result;

    } catch (error) {
      // Failed to get farmer products:

      return {
        success: false,
        error: `Failed to get farmer products: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Create product
   */
  async createProduct(productData: Omit<FarmerProduct, 'id' | 'createdAt' | 'updatedAt'>): Promise<AdapterResult<FarmerProduct>> {
    await this.ensureInitialized();

    const startTime = Date.now();

    try {
      // Creating product:

      const result = await farmerRepository.createProduct(productData);
      const duration = Date.now() - startTime;

      if (result.success) {
        await this.logFarmerEvent('product_created', {
          productId: result.data?.id,
          farmerId: productData.farmerId,
          name: productData.name,
          duration,
          adapterId: 'real-farmer',
        });
        // Product created successfully:
      }

      return result;

    } catch (error) {
      // Failed to create product:

      return {
        success: false,
        error: `Failed to create product: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Update product
   */
  async updateProduct(productId: string, updates: Partial<FarmerProduct>): Promise<AdapterResult<FarmerProduct>> {
    await this.ensureInitialized();

    const startTime = Date.now();

    try {
      // Updating product:

      const result = await farmerRepository.updateProduct(productId, updates);
      const duration = Date.now() - startTime;

      if (result.success) {
        await this.logFarmerEvent('product_updated', {
          productId,
          updatedFields: Object.keys(updates),
          duration,
          adapterId: 'real-farmer',
        });
      }

      return result;

    } catch (error) {
      // Failed to update product:

      return {
        success: false,
        error: `Failed to update product: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Delete product
   */
  async deleteProduct(productId: string): Promise<AdapterResult<void>> {
    await this.ensureInitialized();

    const startTime = Date.now();

    try {
      // Deleting product:

      const result = await farmerRepository.deleteProduct(productId);
      const duration = Date.now() - startTime;

      if (result.success) {
        await this.logFarmerEvent('product_deleted', {
          productId,
          duration,
          adapterId: 'real-farmer',
        });
      }

      return result;

    } catch (error) {
      // Failed to delete product:

      return {
        success: false,
        error: `Failed to delete product: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Search products
   */
  async searchProducts(query: string): Promise<AdapterResult<FarmerProduct[]>> {
    await this.ensureInitialized();

    const startTime = Date.now();

    try {
      // Searching products:

      const result = await farmerRepository.searchProducts(query);
      const duration = Date.now() - startTime;

      if (result.success) {
        await this.logFarmerEvent('products_searched', {
          query,
          resultCount: result.data?.length || 0,
          duration,
          adapterId: 'real-farmer',
        });
      }

      return result;

    } catch (error) {
      // Failed to search products:

      return {
        success: false,
        error: `Failed to search products: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Get farmer statistics
   */
  async getFarmerStatistics(farmerId: string): Promise<AdapterResult<FarmerStatistics>> {
    await this.ensureInitialized();

    try {
      // Getting farmer statistics:

      const result = await farmerRepository.getFarmerStatistics(farmerId);

      if (result.success) {
        await this.logFarmerEvent('farmer_statistics_retrieved', {
          farmerId,
          adapterId: 'real-farmer',
        });
      }

      return result;

    } catch (error) {
      // Failed to get farmer statistics:

      return {
        success: false,
        error: `Failed to get farmer statistics: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Get farmer system health and status
   */
  async getSystemHealth(): Promise<SystemHealth> {
    await this.ensureInitialized();

    try {
      // Get farmer adapter health
      const farmerHealth = await this.getFarmerAdapterHealth();

      // Determine overall health
      let overall: 'healthy' | 'degraded' | 'unhealthy';
      if (farmerHealth.status === 'unhealthy') {
        overall = 'unhealthy';
      } else if (farmerHealth.status === 'degraded') {
        overall = 'degraded';
      } else {
        overall = 'healthy';
      }

      return {
        farmer: farmerHealth,
        overall,
      };

    } catch (error) {
      // Failed to get system health:
      return {
        farmer: { status: 'unhealthy', details: { error: error instanceof Error ? error.message : 'Unknown error' } },
        overall: 'unhealthy',
      };
    }
  }

  /**
   * Ensure application is initialized
   */
  private async ensureInitialized(): Promise<void> {
    if (!this.initialized) {
      await this.initialize();
    }
  }

  /**
   * Register adapters with the global registry
   */
  private async registerAdapters(): Promise<void> {
    // Register real farmer adapter
    const { RealFarmerAdapter } = await import('../adapters/RealFarmerAdapter');
    const realAdapter = new RealFarmerAdapter();
    await adapterRegistry.registerAdapter('farmer-real', realAdapter as unknown as AdapterConstructor);
    // Farmer adapters registered with global registry
  }

  /**
   * Setup health monitoring
   */
  private async setupHealthMonitoring(): Promise<void> {
    // Subscribe to health monitor updates
    healthMonitor.subscribe((healthStatus) => {
      const farmerHealth = healthStatus['farmer/real'];
      if (farmerHealth && farmerHealth.status === 'unhealthy') {
        // Farmer adapter health degraded:
      }
    });

    // Start health monitoring if not already running
    if (!healthMonitor.getHealthStats().monitoringActive) {
      healthMonitor.startMonitoring(30000); // Check every 30 seconds
    }
  }

  /**
   * Get farmer adapter health
   */
  private async getFarmerAdapterHealth(): Promise<{ status: string; details: Record<string, unknown> }> {
    try {
      return await farmerRepository.getHealthStatus();
    } catch (error) {
      return {
        status: 'unhealthy',
        details: { error: error instanceof Error ? error.message : 'Unknown error' },
      };
    }
  }

  /**
   * Validate farmer data
   */
  private validateFarmerData(farmerData: FarmerProfileData): { isValid: boolean; errors: string[] } {
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

    // Farm validation
    if (!farmerData.farmInfo.name || farmerData.farmInfo.name.trim().length < 2) {
      errors.push('Farm name is required');
    }

    if (!farmerData.farmInfo.location.address || farmerData.farmInfo.location.address.trim().length < 2) {
      errors.push('Location is required');
    }

    // Address validation (optional)
    if (farmerData.address && (!farmerData.address.street || farmerData.address.street.trim().length < 2)) {
      errors.push('Street address is required when address is provided');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Log farmer events to hybrid system
   */
  private async logFarmerEvent(_event: string, _data: Record<string, unknown>): Promise<void> {
    try {
      // This would integrate with your audit logging system
      // Farmer event:
      // mode: hybridModeManager.getMode('farmer'),

      // For now, just log to console - in production, this would go to your audit system
      // await auditLogger.log('farmer', _event, _data);
    } catch (_error) {
      // Failed to log farmer event:
    }
  }
  /**
   * Cleanup application resources
   */
  async cleanup(): Promise<void> {
    try {
      await farmerRepository.cleanup();
      this.initialized = false;
      // Farmer Application cleaned up
    } catch (_error) {
      // Failed to cleanup Farmer Application:
    }
  }
}


// Singleton instance
export const farmerApplication = new FarmerApplication();
