// src/app/farmer/page.tsx
'use client';

import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { FarmerDashboard } from '@/src/features/Farmer';
import { withFarmerAuth } from '@/src/features/shared/auth/withAuth';

/**
 * Farmer page wrapper with authentication
 * 
 * @description Simple route wrapper that handles authentication and renders the FarmerDashboard
 * component. This follows the feature-first architecture pattern where business logic
 * is contained in the feature directory.
 */
function FarmerPage() {
  return (
    <DashboardLayout description="Manage your farm operations from seed to harvest">
      <FarmerDashboard />
    </DashboardLayout>
  );
}

// Export with authentication wrapper
export default withFarmerAuth(FarmerPage);
