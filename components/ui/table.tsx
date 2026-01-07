// src/components/ui/table.tsx
import React from 'react';
import { commonColors } from '@/lib/theme/colors';

interface TableProps {
  children: React.ReactNode;
  className?: string;
}

interface DataTableProps {
  data: any[];
  columns: any[];
  onRowClick?: (row: any) => void;
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

export function DataTable({ data, columns, onRowClick, className = '', pageSize }: DataTableProps) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <Table>
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index} className={`px-6 py-3 text-left text-xs font-medium ${commonColors.gray500} uppercase tracking-wider`}>
                {column.header}
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
                  {row[column.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
