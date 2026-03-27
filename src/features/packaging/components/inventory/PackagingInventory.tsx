// src/components/packaging/inventory/PackagingInventory.tsx
'use client';

import { usePackagingInventory } from './hooks/usePackagingInventory';
import { PackagingOverview } from './PackagingOverview';
import { PackagingList } from './PackagingList';
import { PackagingDetails } from './PackagingDetails';

export function PackagingInventory() {
  const {
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
