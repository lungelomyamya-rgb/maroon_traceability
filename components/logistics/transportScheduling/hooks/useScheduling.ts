// src/components/logistics/transportScheduling/hooks/useScheduling.ts
'use client';

import { useState, useEffect } from 'react';
import { TransportSchedule, Vehicle, Driver } from '@/types/logistics';
import { mockSchedules } from '@/constants/logisticsMockData';

interface UseSchedulingProps {
  vehicles?: Vehicle[];
  drivers?: Driver[];
}

export function useScheduling({ vehicles = [], drivers = [] }: UseSchedulingProps = {}) {
  const [schedules, setSchedules] = useState<TransportSchedule[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<TransportSchedule | null>(null);

  useEffect(() => {
    // Load mock data from consolidated file
    setSchedules(mockSchedules);
  }, []);

  const handleAddSchedule = (scheduleData: TransportSchedule) => {
    setSchedules(prev => [...prev, scheduleData]);
    setShowAddForm(false);
  };

  const handleUpdateSchedule = (updatedSchedule: TransportSchedule) => {
    setSchedules(prev => 
      prev.map(s => s.id === updatedSchedule.id ? updatedSchedule : s)
    );
    setEditingSchedule(null);
  };

  const handleDeleteSchedule = (scheduleId: string) => {
    setSchedules(prev => prev.filter(s => s.id !== scheduleId));
  };

  const startEditing = (schedule: TransportSchedule) => {
    setEditingSchedule(schedule);
    setShowAddForm(false);
  };

  const cancelEditing = () => {
    setEditingSchedule(null);
  };

  const startAdding = () => {
    setShowAddForm(true);
    setEditingSchedule(null);
  };

  const cancelAdding = () => {
    setShowAddForm(false);
  };

  const getScheduleById = (id: string) => {
    return schedules.find(s => s.id === id);
  };

  const getSchedulesByStatus = (status: TransportSchedule['status']) => {
    return schedules.filter(s => s.status === status);
  };

  const getSchedulesByPriority = (priority: TransportSchedule['priority']) => {
    return schedules.filter(s => s.priority === priority);
  };

  const getOverdueSchedules = () => {
    const now = new Date();
    return schedules.filter(s => 
      new Date(s.scheduledDate) < now && s.status !== 'delivered'
    );
  };

  return {
    // State
    schedules,
    showAddForm,
    editingSchedule,
    
    // Actions
    handleAddSchedule,
    handleUpdateSchedule,
    handleDeleteSchedule,
    startEditing,
    cancelEditing,
    startAdding,
    cancelAdding,
    
    // Queries
    getScheduleById,
    getSchedulesByStatus,
    getSchedulesByPriority,
    getOverdueSchedules,
    
    // External data
    vehicles,
    drivers
  };
}
