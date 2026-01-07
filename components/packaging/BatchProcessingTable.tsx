// src/components/packaging/BatchProcessingTable.tsx
import React from 'react';
import { DataTable } from '@/components/ui/table';

interface BatchProcessingTableProps {
  data: any[];
  onRowClick?: (row: any) => void;
}

export function BatchProcessingTable({ data, onRowClick }: BatchProcessingTableProps) {
  const columns = [
    { header: 'Batch ID', accessor: 'batchId' },
    { header: 'Product', accessor: 'product' },
    { header: 'Status', accessor: 'status' },
    { header: 'Created', accessor: 'createdAt' },
  ];

  return (
    <DataTable
      data={data}
      columns={columns}
      onRowClick={onRowClick}
    />
  );
}
