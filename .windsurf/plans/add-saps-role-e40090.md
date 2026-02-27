# Add SAPS Role for Roadside Inspections and Asset Recovery

## Overview
This plan adds a new "SAPS" (South African Police Service) role to the Maroon Traceability Platform for roadside inspections and asset recovery functionality. Based on the provided specifications, SAPS officers will be able to perform digital verification of livestock ownership, scan QR codes/IoT tags, log inspections on the blockchain, and handle asset recovery protocols.

## Required Changes

### 1. Core Role Definition Updates
**File**: `types/user.ts`
- Add 'saps' to USER_ROLES array
- Add ROLE_PERMISSIONS entry for 'saps' with:
  - canVerify: true (verify assets and ownership)
  - canView: true (access heatmaps, records, reports)
  - allowedEvents: ['roadside-inspection', 'asset-recovery', 'scan-verification', 'theft-report', 'inspection-log']
  - displayName: 'SAPS Officer'
  - icon: '🚔' or '👮'
  - color: 'role-saps'

### 2. Role Permissions Service Updates  
**File**: `services/rolePermissionsService.ts`
- Add 'saps' to UserRole type
- Add SAPS permissions configuration with appropriate event access
- Add SAPS navigation items: Overview, Roadside Inspections, Asset Recovery, Theft Reports, Heatmaps
- Add SAPS-specific events to eventTypes array

### 3. Navigation Component Updates
**File**: `components/layout/navigation.tsx`
- Add 'SAPS' to roles array for role switching
- Add portal title display: "SAPS Portal" with appropriate color
- Add page type detection for SAPS routes
- Update role checking logic in dropdown menus

### 4. Demo User Addition
**File**: `constants/users.ts`
- Add SAPS demo user with appropriate permissions

### 5. SAPS Role Pages Creation
**File Structure**: `app/(roles)/saps/`
- Create subdirectories: inspections/, recovery/, reports/, heatmaps/
- Add page.tsx files for each section
- Implement SAPS-specific functionality for scanning, verification, and recovery

### 6. Access Control Updates (if needed)
**File**: `lib/accessControl.tsx`
- Add SAPS role permissions if additional access rules are required

## SAPS Role Permissions Design

Based on the provided specifications, SAPS officers should have:
- **canCreate**: false (they log inspections but don't create products/events)
- **canVerify**: true (verify ownership, permits, scan assets)
- **canView**: true (access all relevant data for inspections)
- **allowedEvents**: roadside-inspection, asset-recovery, theft-report, inspection-log

## Navigation Structure for SAPS
- Overview/Dashboard
- Roadside Inspections (scan QR codes, verify ownership)
- Asset Recovery (handle theft cases, recovery protocols)
- Theft Reports (view reported thefts, heatmaps)
- Inspection Logs (view past inspections)

## Implementation Order
1. Core type definitions and permissions
2. Navigation and routing updates  
3. Demo user and constants
4. Page creation and functionality
5. Event types and access control

This ensures the SAPS role is fully integrated across all required redirect locations and user interface elements.
