// src/components/packaging/inventory/PackagingInventory.tsx
'use client';

import { PackagingDetails } from './PackagingDetails';
import { PackagingList } from './PackagingList';
import { PackagingOverview } from './PackagingOverview';
import { usePackagingInventory } from './hooks/usePackagingInventory';

export function PackagingInventory() {
  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    inventory,
    stockMovements,
    filteredInventory,
    searchTerm,
    categoryFilter,
    statusFilter,
    selectedItem,
    loading,
    computed,
    ...actions
  } = usePackagingInventory();

  return (
    <div className="space-y-6">
      {/* Overview Section */}
      <PackagingOverview 
        computed={computed}
        actions={actions}
        loading={loading}
      />

      {/* List Section */}
      <PackagingList
        filteredInventory={filteredInventory}
        computed={computed}
        actions={actions}
        searchTerm={searchTerm}
        categoryFilter={categoryFilter}
        statusFilter={statusFilter}
      />

      {/* Details Modal */}
      <PackagingDetails
        selectedItem={selectedItem}
        stockMovements={stockMovements}
        actions={actions}
      />
    </div>
  );
}
