# Maroon Traceability Demo

A blockchain-based product traceability system for South African farmers and retailers.

## Features

- **Blockchain Integration**: Immutable product records on blockchain
- **Mobile Responsive**: Optimized for all device sizes
- **PWA Support**: Progressive Web App functionality
- **Role-Based Access**: Farmer, Logistics, Inspector, Packaging, Retailer, Viewer
- **Real-time Tracking**: Live product monitoring and updates
- **Traceability**: Complete product journey from farm to retail

## Technology Stack

- **Frontend**: Next.js 16, TypeScript, Tailwind CSS
- **Backend**: Blockchain simulation with mock data
- **Deployment**: GitHub Pages with static export
- **PWA**: Service Worker with offline support

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/lungelomyamya-rgb/maroon_traceability.git
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## Recent Updates

- **Architecture Migration**: Complete migration to feature-based architecture (`src/features/`)
- **Component Organization**: 62+ retailer components modularized and organized
- **Import Standardization**: Unified `@/src/features/` import pattern across codebase
- **Code Quality**: Zero TypeScript errors, enterprise-level type safety
- **Service Worker**: Enhanced error logging and cache handling
- **Mobile Navigation**: Professional hamburger menu with desktop role selector
- **Responsive Design**: Improved layouts for all devices
- **PWA Features**: Development and production manifest support
- **Error Handling**: Comprehensive debugging and monitoring

## Architecture

The application now uses a **feature-based architecture** with all business logic organized in `src/features/`:

```
src/features/
|-- shared/           # Reusable UI components and utilities
|-- Farmer/           # Farmer-specific components and logic
|-- Inspector/        # Inspector functionality
|-- Logistics/         # Logistics management
|-- Packaging/        # Packaging operations
|-- Retailers/        # Retailer operations (62 components)
|-- marketplace/       # Product marketplace
|-- auth/             # Authentication components
|-- traceability/     # Blockchain traceability
```

## Deployment

- **Live Site**: https://lungelomyamya-rgb.github.io/maroon_traceability
- **Status**: Production ready with enhanced error handling

---

*Last deployment retry: 2025-01-07*