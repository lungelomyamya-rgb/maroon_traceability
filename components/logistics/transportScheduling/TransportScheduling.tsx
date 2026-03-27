// src/components/logistics/transportScheduling/TransportScheduling.tsx
'use client';

import { TransportSchedule, Vehicle, Driver } from '@/types/logistics';
import { ScheduleHeader } from './ScheduleHeader';
import { ScheduleForm } from './ScheduleForm';
import { ScheduleList } from './ScheduleList';
import { useScheduling } from './hooks/useScheduling';

interface TransportSchedulingProps {
  onScheduleSelect?: (schedule: TransportSchedule) => void;
  vehicles?: Vehicle[];
  drivers?: Driver[];
  title?: string;
}

export function TransportScheduling({ 
  onScheduleSelect, 
  vehicles = [], 
  drivers = [],
  title
}: TransportSchedulingProps) {
  const {
    schedules,
    showAddForm,
    editingSchedule,
    handleAddSchedule,
    handleUpdateSchedule,
    startAdding,
    startEditing,
    cancelAdding
  } = useScheduling({ vehicles, drivers });

  const handleViewSchedule = (schedule: TransportSchedule) => {
    onScheduleSelect?.(schedule);
  };

  const handleTrackSchedule = (schedule: TransportSchedule) => {
    // TODO: Implement tracking functionality
    console.log('Track schedule:', schedule.id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <ScheduleHeader 
        onAddSchedule={startAdding}
        title={title}
      />

      {/* Add/Edit Schedule Form */}
      {(showAddForm || editingSchedule) && (
        <ScheduleForm
          schedule={editingSchedule || undefined}
          vehicles={vehicles}
          drivers={drivers}
          onSubmit={showAddForm ? handleAddSchedule : handleUpdateSchedule}
          onCancel={cancelAdding}
        />
      )}

      {/* Schedule List */}
      <ScheduleList
        schedules={schedules}
        onView={handleViewSchedule}
        onEdit={startEditing}
        onTrack={handleTrackSchedule}
      />
    </div>
  );
}
