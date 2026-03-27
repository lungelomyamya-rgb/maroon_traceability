// src/components/logistics/transportScheduling/ScheduleHeader.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface ScheduleHeaderProps {
  onAddSchedule: () => void;
  title?: string;
}

export function ScheduleHeader({ onAddSchedule, title = "Transport Scheduling" }: ScheduleHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">{title}</h2>
      </div>
      <Button 
        onClick={onAddSchedule}
        className="bg-cyan-600 hover:bg-cyan-700 text-white w-full sm:w-auto"
      >
        <Plus className="h-4 w-4 mr-2" />
        Schedule Transport
      </Button>
    </div>
  );
}
