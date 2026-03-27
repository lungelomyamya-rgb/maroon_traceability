// src/components/logistics/eventForm/EventTypeSelector.tsx
'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface EventTypeOption {
  value: string;
  label: string;
  icon: string;
  color: string;
}

interface EventTypeSelectorProps {
  options: EventTypeOption[];
  selectedType: string;
  onSelect: (type: string) => void;
}

export function EventTypeSelector({ options, selectedType, onSelect }: EventTypeSelectorProps) {
  return (
    <Card className="p-4">
      <h3 className="font-semibold text-gray-900 mb-4">Event Type</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onSelect(option.value)}
            className={`p-3 rounded-lg border-2 transition-all ${
              selectedType === option.value
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            <div className="text-2xl mb-1">{option.icon}</div>
            <div className="text-xs font-medium text-gray-900">{option.label}</div>
          </button>
        ))}
      </div>
      {selectedType && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <Badge className={options.find(opt => opt.value === selectedType)?.color}>
            {options.find(opt => opt.value === selectedType)?.icon} {options.find(opt => opt.value === selectedType)?.label}
          </Badge>
        </div>
      )}
    </Card>
  );
}
