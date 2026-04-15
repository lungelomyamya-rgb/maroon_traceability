/**
 * @fileoverview Marketplace Feature - E-commerce and product catalog functionality
 * @version 1.0.0
 * @author Maroon Traceability Team
 * @description 
 * Complete marketplace feature including product catalog, cart management,
 * search functionality, and checkout process. All components are responsive
 * and accessible with comprehensive TypeScript support.
 * 
 * @example
 * ```typescript
 * import Marketplace, { useCart, Product } from '@/features/marketplace';
 * 
 * function App() {
 *   const { cart, addToCart, removeFromCart } = useCart();
 *   
 *   return (
 *     <Marketplace 
 *       products={products}
 *       onProductSelect={handleProductSelect}
 *     />
 *   );
 * }
 * ```
 */

// ============================================================================
// COMPONENT EXPORTS
// ============================================================================

/**
 * Main marketplace component with full e-commerce functionality
 * @component Marketplace
 * @example
 * ```typescript
 * <Marketplace 
 *   products={products}
 *   onProductSelect={handleProductSelect}
 *   showCart={true}
 *   theme="light"
 * />
 * ```
 */
export { default as Marketplace } from './components/Marketplace';

/**
 * Hero section component for marketplace landing page
 * @component HeroSection
 * @example
 * ```typescript
 * <HeroSection 
 *   title="Welcome to Marketplace"
 *   subtitle="Find the best products"
 *   backgroundImage="/hero-bg.jpg"
 * />
 * ```
 */
export { default as HeroSection } from './components/HeroSection';

/**
 * Featured products showcase component
 * @component FeaturedProducts
 * @example
 * ```typescript
 * <FeaturedProducts 
 *   products={featuredProducts}
 *   maxItems={8}
 *   showPrice={true}
 *   showRating={true}
 * />
 * ```
 */
export { default as FeaturedProducts } from './components/FeaturedProducts';

/**
 * Product categories navigation component
 * @component Categories
 * @example
 * ```typescript
 * <Categories 
 *   categories={categories}
 *   onCategorySelect={handleCategorySelect}
 *   layout="grid"
 * />
 * ```
 */
export { default as Categories } from './components/Categories';

/**
 * Trust signals and badges component
 * @component TrustSignals
 * @example
 * ```typescript
 * <TrustSignals 
 *   showSecure={true}
 *   showVerified={true}
 *   showReviews={true}
 * />
 * ```
 */
export { default as TrustSignals } from './components/TrustSignals';

/**
 * QR code scanner section component
 * @component QRScannerSection
 * @example
 * ```typescript
 * <QRScannerSection 
 *   onScan={handleQRScan}
 *   showInstructions={true}
 *   enabled={true}
 * />
 * ```
 */
export { default as QRScannerSection } from './components/QRScannerSection';

/**
 * Advanced search and filter component
 * @component SearchAndFilter
 * @example
 * ```typescript
 * <SearchAndFilter 
 *   onSearch={handleSearch}
 *   onFilter={handleFilter}
 *   categories={categories}
 *   priceRange={[0, 1000]}
 * />
 * ```
 */
export { default as SearchAndFilter } from './components/SearchAndFilter';

/**
 * Lazy loading image component with optimization
 * @component LazyImage
 * @example
 * ```typescript
 * <LazyImage 
 *   src={imageUrl}
 *   alt="Product image"
 *   loading="lazy"
 *   placeholder="blur"
 * />
 * ```
 */
export { default as LazyImage } from './components/LazyImage';

/**
 * Keyboard navigation utilities component
 * @component KeyboardNavigation
 * @example
 * ```typescript
 * <KeyboardNavigation 
 *   items={products}
 *   onSelect={handleSelect}
 *   enabled={true}
 * />
 * ```
 */
// Export all components for convenience
export * from './components';

// ============================================================================
// HOOK EXPORTS
// ============================================================================

/**
 * Cart management hook with state persistence
 * @hook useCart
 * @returns {Object} Cart state and management functions
 * @example
 * ```typescript
 * const { 
 *   cart, 
 *   addToCart, 
 *   removeFromCart, 
 *   updateQuantity, 
 *   clearCart,
 *   totalPrice,
 *   itemCount 
 * } = useCart();
 * ```
 */
export { useCart } from './hooks/useCart';

/**
 * Scroll to top hook for smooth navigation
 * @hook useScrollToTop
 * @returns {Function} Scroll to top function
 * @example
 * ```typescript
 * const scrollToTop = useScrollToTop();
 * 
 * const handleBackToTop = () => {
 *   scrollToTop();
 * };
 * ```
 */
export { useScrollToTop } from './hooks/useScrollToTop';

// ============================================================================
// TYPE EXPORTS
// ============================================================================

/**
 * Cart item interface for shopping cart functionality
 * @interface CartItem
 * @property {string} id - Unique cart item identifier
 * @property {string} productId - Product reference
 * @property {string} name - Product name
 * @property {number} price - Unit price
 * @property {number} quantity - Item quantity
 * @property {string} image - Product image URL
 * @property {Object} metadata - Additional item data
 */
export type { CartItem } from './hooks/useCart';

/**
 * Product interface for marketplace items
 * @interface Product
 * @property {string} id - Unique product identifier
 * @property {string} name - Product name
 * @property {string} description - Product description
 * @property {number} price - Product price
 * @property {string} category - Product category
 * @property {string[]} images - Product image URLs
 * @property {number} rating - Product rating (1-5)
 * @property {number} stock - Available stock quantity
 * @property {Object} metadata - Additional product data
 */
export type { Product } from './types/marketplaceData';

// ============================================================================
// IMPORTS FOR API OBJECT
// ============================================================================

import Categories from './components/Categories';
import FeaturedProducts from './components/FeaturedProducts';
import HeroSection from './components/HeroSection';
import KeyboardNavigation from './components/KeyboardNavigation';
import LazyImage from './components/LazyImage';
import Marketplace from './components/Marketplace';
import QRScannerSection from './components/QRScannerSection';
import SearchAndFilter from './components/SearchAndFilter';
import TrustSignals from './components/TrustSignals';
import { useCart } from './hooks/useCart';
import { useScrollToTop } from './hooks/useScrollToTop';

// ============================================================================
// PUBLIC API
// ============================================================================

/**
 * Marketplace Feature Public API
 * Provides clean, type-safe access to all marketplace functionality
 * 
 * @namespace MarketplaceAPI
 * @example
 * ```typescript
 * import { marketplaceAPI } from '@/features/marketplace';
 * 
 * // Use components
 * const { Marketplace, useCart, Product } = marketplaceAPI;
 * 
 * // Render marketplace
 * <Marketplace />
 * ```
 */
export const marketplaceAPI = {
  // Core Components
  Marketplace,
  HeroSection,
  FeaturedProducts,
  Categories,
  TrustSignals,
  QRScannerSection,
  SearchAndFilter,
  LazyImage,
  KeyboardNavigation,
  
  // Hooks
  useCart,
  useScrollToTop,
  
  // Types are exported separately for tree-shaking
} as const;

// ============================================================================
// FEATURE METADATA
// ============================================================================

/**
 * Marketplace feature metadata
 * @readonly
 * @enum {string}
 */
export const MARKETPLACE_FEATURE = {
  /** Feature version */
  VERSION: '1.0.0',
  /** Feature name */
  NAME: 'Marketplace',
  /** Feature description */
  DESCRIPTION: 'E-commerce marketplace with cart management and product catalog',
  /** Feature dependencies */
  DEPENDENCIES: ['react', 'next', 'typescript'],
  /** Feature tags */
  TAGS: ['ecommerce', 'marketplace', 'cart', 'products', 'search'],
} as const;

// ============================================================================
// RE-EXPORTS FOR CONVENIENCE
// ============================================================================

/**
 * Default export - Main Marketplace component
 * @default
 * @example
 * ```typescript
 * import Marketplace from '@/features/marketplace';
 * 
 * <Marketplace />
 * ```
 */
export { default } from './components/Marketplace';

/**
 * Marketplace page wrapper component
 * @component MarketplacePage
 * @description Simple wrapper for marketplace page that follows feature-first architecture
 */
export { MarketplacePage } from './MarketplacePage';
