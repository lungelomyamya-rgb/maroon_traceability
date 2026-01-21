// src/components/packaging/BatchProcessingTable.tsx
import React from 'react';
import { DataTable } from '@/components/ui/table';

interface BatchProcessingTableProps {
  data: any[];
  onRowClick?: (row: any) => void;
}

export function BatchProcessingTable({ data, onRowClick }: BatchProcessingTableProps) {
  const columns = [
    { 
      header: 'Batch ID', 
      accessor: 'batchId',
      className: 'hidden sm:table-cell' // Hide on mobile, show on larger screens
    },
    { 
      header: 'Product', 
      accessor: 'product',
      cell: ({ row }: { row: any }) => (
        <div className="max-w-0 sm:max-w-none">
          <div className="font-medium text-sm sm:text-base truncate">{row.original.product}</div>
          <div className="text-xs text-gray-500 sm:hidden truncate">{row.original.batchCode}</div>
        </div>
      )
    },
    { 
      header: 'Status', 
      accessor: 'status',
      cell: ({ row }: { row: any }) => (
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
            row.original.status === 'completed' ? 'bg-green-500' :
            row.original.status === 'processing' ? 'bg-blue-500' :
            row.original.status === 'pending' ? 'bg-yellow-500' : 'bg-gray-500'
          }`}></div>
          <span className="text-xs sm:text-sm font-medium hidden sm:inline">
            {row.original.status.replace('-', ' ').charAt(0).toUpperCase() + row.original.status.slice(1).replace('-', ' ')}
          </span>
          <span className="text-xs sm:hidden">{
            row.original.status === 'completed' ? '✓' :
            row.original.status === 'processing' ? '⏳' :
            row.original.status === 'pending' ? '⏸' : '?'
          }</span>
        </div>
      )
    },
    { 
      header: 'Created', 
      accessor: 'createdAt',
      className: 'hidden sm:table-cell', // Hide on mobile, show on larger screens
      cell: ({ row }: { row: any }) => (
        <div className="text-xs sm:text-sm text-gray-600">
          {new Date(row.original.createdAt).toLocaleDateString()}
        </div>
      )
    },
    {
      header: 'Actions',
      accessor: 'actions',
      cell: ({ row }: { row: any }) => (
        <div className="flex gap-1 sm:gap-2">
          <button
            onClick={() => onRowClick?.(row.original)}
            className="p-1.5 sm:p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors text-xs sm:text-sm"
          >
            View
          </button>
        </div>
      )
    },
  ];

  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0">
      <DataTable
        data={data}
        columns={columns}
        onRowClick={onRowClick}
        className="text-xs sm:text-sm"
        pageSize={5} // Smaller page size for mobile
      />
    </div>
  );
}
