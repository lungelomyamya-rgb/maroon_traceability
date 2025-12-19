// src/components/dashboard/RoleDashboard.tsx
'use client';

import { UserRole } from '@/types/user';
import { FarmerDashboard } from './farmerDashboard';
import { InspectorDashboard } from './inspectorDashboard';
import { LogisticsDashboard } from './logisticsDashboard';
import { PackagingDashboard } from './packagingDashboard';
import { RetailerDashboard } from './retailerDashboard';
import { ViewerDashboard } from './viewerDashboard';

interface RoleDashboardProps {
  role: UserRole;
}

export function RoleDashboard({ role }: RoleDashboardProps) {
  switch (role) {
    case 'farmer':
      return <FarmerDashboard />;
    case 'inspector':
      return <InspectorDashboard />;
    case 'logistics':
      return <LogisticsDashboard />;
    case 'packaging':
      return <PackagingDashboard />;
    case 'retailer':
      return <RetailerDashboard />;
    case 'viewer':
    default:
      return <ViewerDashboard />;
  }
}