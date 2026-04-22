// components/ui/DemoQuickFill.tsx

import React from 'react';

interface DemoQuickFillProps {
  onFill?: (data: Record<string, string>) => void;
  fields?: string[];
  className?: string;
}

export function DemoQuickFill({ onFill, fields = [], className = '' }: DemoQuickFillProps) {
  const generateMockData = () => {
    const mockData: Record<string, string> = {};
    fields.forEach(field => {
      switch (field) {
        case 'name':
          mockData[field] = 'John Doe';
          break;
        case 'email':
          mockData[field] = 'john.doe@example.com';
          break;
        case 'phone':
          mockData[field] = '+1-555-0123';
          break;
        case 'address':
          mockData[field] = '123 Main St, City, State';
          break;
        case 'company':
          mockData[field] = 'Acme Corporation';
          break;
        default:
          mockData[field] = `Sample ${field}`;
      }
    });
    onFill?.(mockData);
  };

  return (
    <button
      onClick={generateMockData}
      className={`px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors ${className}`}
    >
      Quick Fill Demo Data
    </button>
  );
}
