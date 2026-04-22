// Farmer Feature Index - with Hybrid Architecture
// Barrel exports for all Farmer components

// ============================================================================
// SERVICES (Hybrid Architecture Integration)
// ============================================================================

/**
 * Farmer Application
 * Production-ready farmer operations with hybrid architecture integration
 */
export { FarmerApplication, farmerApplication } from './application/FarmerApplication';

/**
 * Farmer Repository
 * Repository abstraction with caching and validation
 */
export { farmerRepository } from './services/FarmerRepository';

/**
 * Real Farmer Adapter
 * Production-ready Supabase adapter for farmer operations
 */
export { RealFarmerAdapter } from './adapters/RealFarmerAdapter';

// ============================================================================
// LEGACY COMPONENTS
// ============================================================================

// Main dashboard
export { FarmerDashboard } from './FarmerDashboard';

// Component exports
export { ComplianceStatus } from './components/complianceStatus';
export { FertiliserLog } from './components/fertiliserLog';
export { GrowthStageMonitor } from './components/growthStageMonitor';
export { SeedVarietyTracker } from './components/seedVarietyTracker';
export { ProductForm } from './components/ProductForm';
