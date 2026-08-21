# Maroon Traceability Platform

> **Enterprise-grade blockchain traceability solution for South African agricultural supply chains**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6+-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16+-black.svg)](https://nextjs.org/)
[![Demo](https://img.shields.io/badge/Status-Demo%20Prototype-blue.svg)](https://www.maroonagri.co.za)

## Overview

Maroon Traceability is a comprehensive supply chain transparency platform that enables South African farmers and retailers to track products from farm to retail using blockchain technology. The system provides complete product journey visibility, ensuring authenticity, quality control, and regulatory compliance throughout the agricultural supply chain.

### Key Features

- **Blockchain Integration**: Immutable product records with tamper-proof tracking
- **Role-Based Access Control**: 8 specialized roles (Farmer, Inspector, Logistics, Packaging, Retailer, etc.)
- **Mobile-First Design**: Progressive Web App with offline capabilities
- **Integrated Marketplace**: Complete e-commerce platform for agricultural products
- **Real-Time Analytics**: Comprehensive dashboard with business intelligence
- **Enterprise Security**: Advanced authentication with Supabase integration
- **Accessibility First**: WCAG 2.1 AA compliant with full screen reader support
- **High Performance**: 90+ Lighthouse score with optimized loading times

## Architecture

### Technology Stack

| Category | Technology | Version |
|----------|------------|---------|
| **Frontend** | Next.js | 16+ |
| **Language** | TypeScript | 5.6+ |
| **Styling** | Tailwind CSS | 3.4+ |
| **UI Components** | Shadcn/ui | Latest |
| **Database** | Supabase (PostgreSQL) | Latest |
| **Authentication** | Supabase Auth | Latest |
| **Blockchain** | Ethereum Simulation | - |
| **Deployment** | Vercel | - |
| **Testing** | Jest + RTL | Latest |

### System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Blockchain    │
│   (Next.js)     │◄──►│   (Supabase)    │◄──►│   Simulation    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   PWA Service   │    │   PostgreSQL    │    │   Smart         │
│   Worker        │    │   Database      │    │   Contracts     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Quick Start

### Prerequisites

- **Node.js** 24.x (see `.nvmrc` and `engines` in `package.json`)
- **npm** 9.0+
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/lungelomyamya-rgb/maroon_traceability.git
   cd maroon_traceability
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env.local
   # Configure your Supabase credentials in .env.local
   ```
   
   **Varydian (GRAP financial reporting)** — add to `.env.local` for cross-app links (pricing / enterprise CTA and government dashboard when configured):
   ```env
   NEXT_PUBLIC_FINANCE_APP_URL=https://varydian-financial-reporting.onrender.com
   ```
   Use your real Render URL if different; **no trailing slash**.  
   **`MAROON_APP_URL` is not used by Maroon** — set that on the Varydian app only so it can link back here. See [`docs/cross-app-varydian-maroon.md`](docs/cross-app-varydian-maroon.md).

   **Supabase (required for real registration)** — in `.env.local` and **Vercel project env**:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```
   Registration uses **`/api/auth/register`** on the server (service role), not browser `signUp`, so CORS from Vercel is avoided. In Supabase **Authentication → URL configuration**, set **Site URL** to your app (e.g. `https://maroontraceabilitydemo.vercel.app`) and add the same under **Redirect URLs**. If signup returns **522**, restore or unpause the project in the Supabase dashboard.

4. **Database setup**
   ```bash
   # Apply database schema to your Supabase project
   psql -h YOUR_DB_HOST -U YOUR_DB_USER -d YOUR_DB_NAME -f database/schema.sql
   ```

5. **Run development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Client demos

This repository is a **demonstration prototype** for stakeholder walkthroughs—not every feature is production-hardened yet. For scope, gaps, and roadmap, see **[`docs/demo-alignment-and-roadmap.md`](docs/demo-alignment-and-roadmap.md)**.

### Golden path (≈15 minutes)

1. Open **`/intro`** → **Start Your Digital Kraal! - Free** → **`/get-started`** (pricing).
2. **Quick demo login** at **`/login`** — pick a role card (no password), **or** sign in at **`/auth/login`** with password accounts below.
3. As **farmer**: certify a product or open **`/farmer/certify`** → generate QR (links to **`BLK003`**).
4. Open **public passport**: [`/public-access/trace/BLK003`](http://localhost:3000/public-access/trace/BLK003) — cattle timeline (tag, vaccination, transit).
5. As **SAPS** (`/login` → saps, or `saps@demo.com`): **`/saps/inspections`** → **Sample: Green** / **Sample: Red**.

**Stable demo product ID:** `BLK003` (Grass-Fed Beef, Karoo Cattle Co.)

### Demo accounts

| Access | Email | Password | Role |
|--------|-------|----------|------|
| Password login (`/auth/login`) | `farmer@demo.com` | `farmer123` | Farmer |
| | `inspector@demo.com` | `inspector123` | Inspector |
| | `logistics@demo.com` | `logistics123` | Logistics |
| | `packaging@demo.com` | `packaging123` | Packaging |
| | `retailer@demo.com` | `retailer123` | Retailer |
| | `saps@demo.com` | `saps123` | SAPS (STU pilot) |
| | `admin@demo.com` | `admin123` | Admin |
| Role picker (`/login`) | — | — | One-click per role (uses seeded demo users) |

**SAPS demo scans:** `MAROON-BLK003-VERIFIED` (green) · `MAROON-STOLEN-FLAGGED` (red)

**Registration:** Creates real accounts in Supabase via **`POST /api/auth/register`** (server-side, service role). Requires `SUPABASE_SERVICE_ROLE_KEY` on Vercel/local. Marketing leads are optionally captured in `maroon_registration_leads` (localStorage) for follow-up only — not used for login.

## Usage

### User Registration

1. **Choose Your Role**: Select from Individual Farmer, Commercial Farmer, SMME/Co-operative, or Retailer
2. **Complete Registration**: Fill in the multi-step form with your business information
3. **Email Verification**: Verify your email address to activate your account
4. **Start Tracking**: Begin adding products to the traceability chain

### Product Traceability

1. **Add Product**: Enter product details including origin, certifications, and handling information
2. **Record Transactions**: Log each step in the supply chain (harvesting, processing, shipping, etc.)
3. **Generate QR Codes**: Create unique QR codes for each product batch
4. **Track Journey**: Monitor the complete product journey from farm to retail

### Marketplace Operations

1. **Browse Products**: Explore available agricultural products in the marketplace
2. **Place Orders**: Purchase products with secure payment processing
3. **Track Orders**: Monitor order status and delivery progress
4. **Manage Inventory**: Keep track of stock levels and product availability

## User Roles & Permissions

| Role | Description | Key Features |
|------|-------------|---------------|
| **Individual Farmer** | Small-scale farmers | Free plan, 5 records/month |
| **Commercial Farmer** | Large agricultural operations | Professional plan, 200 records/month |
| **SMME/Co-operative** | Small to medium enterprises | Trial + Professional plan |
| **Retailer** | Retail businesses | Product certification, retail operations |
| **Inspector** | Quality control inspectors | Audit capabilities, compliance checks |
| **Logistics** | Transportation providers | Shipment tracking, fleet management |
| **Packaging** | Packaging facilities | Batch processing, quality control |
| **Government** | Regulatory authorities | Compliance monitoring, reporting |

## Development

### Project Structure

```
src/
├── app/                    # Next.js App Router pages
├── features/               # Feature-based modules
│   ├── shared/             # Shared utilities (42 items)
│   ├── auth/               # Authentication (26 items)
│   ├── marketplace/        # E-commerce (16 items)
│   ├── traceability/       # Blockchain (5 items)
│   └── [role-specific]/    # Role-specific features
├── components/             # Reusable UI components
├── lib/                    # Pure utilities
├── hooks/                  # Global React hooks
├── types/                  # TypeScript definitions
└── styles/                 # Global styles
```

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
npm run test         # Run test suite

# Performance
npm run analyze      # Bundle analysis
npm run audit        # Dependency audit
npm run optimize     # Performance optimization

# Deployment
npm run deploy       # Deploy to production
```

### Testing

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm run test path/to/test.test.ts
```

## Performance Metrics

- **Lighthouse Score**: 90+ (Performance, Accessibility, Best Practices)
- **Core Web Vitals**: All metrics in green zone
- **Bundle Size**: Optimized with code splitting and lazy loading
- **Load Time**: < 2 seconds on 3G networks
- **Memory Usage**: Optimized with leak prevention

## Configuration

### Environment Variables

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Feature Flags
NEXT_PUBLIC_ENABLE_BLOCKCHAIN=true
NEXT_PUBLIC_ENABLE_MARKETPLACE=true
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

### Feature Flags

The platform supports dynamic feature toggling:

- **Blockchain Integration**: Enable/disable blockchain features
- **Marketplace**: Toggle e-commerce functionality
- **Analytics**: Enable analytics and reporting
- **Debug Mode**: Development debugging tools

## Deployment

### Production Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Export static files**
   ```bash
   npm run export
   ```

3. **Deploy to Vercel**
   ```bash
   npm run deploy
   ```

### Environment Setup

- **Development**: Local development with hot reload
- **Staging**: Preview deployments for testing
- **Production**: Optimized build with performance monitoring

## Contributing

See **[CONTRIBUTING.md](CONTRIBUTING.md)** for branch naming, local quality gates, and PR requirements. Security reporting is covered in **[SECURITY.md](SECURITY.md)**.

Deployment targets (Vercel) are documented in **[docs/setup/deployment.md](docs/setup/deployment.md)**.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

### Getting Help

- **Documentation**: [Comprehensive Development Log](./DEVELOPMENT_LOG.md)
- **Issues**: [GitHub Issues](https://github.com/lungelomyamya-rgb/maroon_traceability/issues)
- **Discussions**: [GitHub Discussions](https://github.com/lungelomyamya-rgb/maroon_traceability/discussions)

### Contact

- **Email**: support@maroontraceability.co.za
- **Website**: [https://maroontraceability.co.za](https://maroontraceability.co.za)
- **Documentation**: [https://docs.maroontraceability.co.za](https://docs.maroontraceability.co.za)

## Acknowledgments

- **Supabase**: For the excellent backend-as-a-service platform
- **Next.js Team**: For the amazing React framework
- **Tailwind CSS**: For the utility-first CSS framework
- **South African Agricultural Community**: For the valuable feedback and requirements

---

<div align="center">

**Empowering South African Agriculture with Blockchain Technology**

[Live Demo](https://www.maroonagri.co.za) • [Documentation](./DEVELOPMENT_LOG.md) • [API Docs](./docs/api/)

</div>