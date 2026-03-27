// src/components/logistics/transportScheduling/ScheduleList.tsx
'use client';

import { TransportSchedule } from '@/types/logistics';
import { ScheduleCard } from './ScheduleCard';

interface ScheduleListProps {
  schedules: TransportSchedule[];
  onView?: (schedule: TransportSchedule) => void;
  onEdit?: (schedule: TransportSchedule) => void;
  onTrack?: (schedule: TransportSchedule) => void;
  emptyMessage?: string;
}

export function ScheduleList({ 
  schedules, 
  onView, 
  onEdit, 
  onTrack, 
  emptyMessage = "No schedules found" 
}: ScheduleListProps) {
  if (schedules.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">📅</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {emptyMessage}
        </h3>
        <p className="text-gray-500">
          Create your first transport schedule to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {schedules.map((schedule) => (
        <ScheduleCard
          key={schedule.id}
          schedule={schedule}
          onView={onView}
          onEdit={onEdit}
          onTrack={onTrack}
        />
      ))}
    </div>
  );
}
