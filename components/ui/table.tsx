// src/components/ui/table.tsx
import React from 'react';
import { commonColors } from '@/lib/theme/colors';
import type { TableColumn } from '@/types/common';

interface TableProps {
  children: React.ReactNode;
  className?: string;
}

interface DataTableProps<T = unknown> {
  data: T[];
  columns: TableColumn<T>[];
  onRowClick?: (row: T) => void;
  pageSize?: number;
  className?: string;
}

export function Table({ children, className = '' }: TableProps) {
  return (
    <table className={`min-w-full divide-y ${commonColors.borderGray200} ${className}`}>
      {children}
    </table>
  );
}

export function DataTable<T = unknown>({ data, columns, onRowClick, className = '', pageSize }: DataTableProps<T>) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <Table>
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index} className={`px-6 py-3 text-left text-xs font-medium ${commonColors.gray500} uppercase tracking-wider`}>
                {column.header || column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={`${commonColors.whiteBg} divide-y ${commonColors.borderGray200}`}>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              onClick={() => onRowClick?.(row)}
              className={`${commonColors.gray50} cursor-pointer`}
            >
              {columns.map((column, colIndex) => (
                <td key={colIndex} className={`px-6 py-4 whitespace-nowrap text-sm ${commonColors.gray900}`}>
                  {column.render ? column.render(row[column.key], row) : (column.accessor ? column.accessor(row) : String(row[column.key]))}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
