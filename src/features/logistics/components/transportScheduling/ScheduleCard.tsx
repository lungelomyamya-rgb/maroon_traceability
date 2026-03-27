// src/components/logistics/transportScheduling/ScheduleCard.tsx
'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Truck, Eye, Edit, Route, AlertTriangle } from 'lucide-react';
import { TransportSchedule, TransportStatus } from '@/types/logistics';

interface ScheduleCardProps {
  schedule: TransportSchedule;
  onView?: (schedule: TransportSchedule) => void;
  onEdit?: (schedule: TransportSchedule) => void;
  onTrack?: (schedule: TransportSchedule) => void;
}

const priorityConfig = {
  low: { color: 'bg-gray-100 text-gray-600', icon: '🔹', label: 'Low' },
  medium: { color: 'bg-sky-100 text-sky-800', icon: '🔸', label: 'Medium' },
  high: { color: 'bg-orange-100 text-orange-800', icon: '🔶', label: 'High' },
  urgent: { color: 'bg-red-100 text-red-800', icon: '🔴', label: 'Urgent' }
};

const statusConfig: Record<TransportStatus, { color: string; icon: string; label: string }> = {
  scheduled: { color: 'bg-yellow-100 text-yellow-800', icon: '📅', label: 'Scheduled' },
  'in-transit': { color: 'bg-sky-100 text-sky-800', icon: '🚚', label: 'In Transit' },
  delivered: { color: 'bg-green-100 text-green-800', icon: '✅', label: 'Delivered' },
  delayed: { color: 'bg-red-100 text-red-800', icon: '⏰', label: 'Delayed' },
  cancelled: { color: 'bg-gray-100 text-gray-600', icon: '❌', label: 'Cancelled' }
};

export function ScheduleCard({ schedule, onView, onEdit, onTrack }: ScheduleCardProps) {
  const isOverdue = () => {
    const scheduledTime = new Date(schedule.scheduledDate);
    const now = new Date();
    return scheduledTime < now && schedule.status !== 'delivered';
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const priorityConfigItem = priorityConfig[schedule.priority];
  const statusConfigItem = statusConfig[schedule.status];
  const overdue = isOverdue();

  return (
    <Card className="p-3 sm:p-4 lg:p-5 hover:shadow-lg transition-all duration-200 hover:scale-[1.02] border-0 shadow-md bg-white rounded-xl w-full min-h-[320px] sm:min-h-[360px] lg:min-h-[400px] flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3 mb-3 sm:mb-4">
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
          <div className="p-1.5 sm:p-2 bg-sky-100 rounded-lg shadow-lg flex-shrink-0">
            <Route className="h-4 w-4 sm:h-5 lg:h-6 text-sky-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-700 text-sm sm:text-base lg:text-lg break-words">
              {schedule.productId}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 truncate">
              {schedule.route.origin.name} → {schedule.route.destination.name}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-1 flex-shrink-0">
          <Badge variant="info" className={`${priorityConfigItem.color} text-xs whitespace-nowrap`}>
            {priorityConfigItem.icon} {priorityConfigItem.label}
          </Badge>
          <Badge variant="info" className={`${statusConfigItem.color} text-xs whitespace-nowrap`}>
            {statusConfigItem.icon} {statusConfigItem.label}
          </Badge>
          {overdue && (
            <Badge className="bg-red-100 text-red-800 text-xs whitespace-nowrap">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Overdue
            </Badge>
          )}
        </div>
      </div>

      {/* Schedule Details */}
      <div className="space-y-3 text-xs sm:text-sm mb-3 sm:mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-3 w-3 sm:h-4 text-gray-400" />
          <div className="flex-1">
            <p className="text-gray-600">Scheduled</p>
            <p className="font-medium text-xs">
              {new Date(schedule.scheduledDate).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Clock className="h-3 w-3 sm:h-4 text-gray-400" />
          <div className="flex-1">
            <p className="text-gray-600">Duration</p>
            <p className="font-medium">{formatDuration(schedule.estimatedDuration)}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Truck className="h-3 w-3 sm:h-4 text-gray-400" />
          <div className="flex-1">
            <p className="text-gray-600">Cargo</p>
            <p className="font-medium">
              {schedule.cargoDetails.weight}kg, {schedule.cargoDetails.volume}m³
            </p>
          </div>
        </div>
      </div>

      {/* Route Details */}
      <div className="mt-4 space-y-3">
        <div className="flex items-start gap-2">
          <MapPin className="h-3 w-3 sm:h-4 text-gray-400 mt-1 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-600">Origin</p>
            <p className="text-xs sm:text-sm font-medium truncate">
              {schedule.route.origin.name}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {schedule.route.origin.address}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {schedule.route.origin.contact}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <MapPin className="h-3 w-3 sm:h-4 text-gray-400 mt-1 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-600">Destination</p>
            <p className="text-xs sm:text-sm font-medium truncate">
              {schedule.route.destination.name}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {schedule.route.destination.address}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {schedule.route.destination.contact}
            </p>
          </div>
        </div>
      </div>

      {/* Special Requirements */}
      {(schedule.cargoDetails.temperatureRequirements || 
        (schedule.cargoDetails.specialHandling?.length || 0) > 0) && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex flex-wrap gap-2">
            {schedule.cargoDetails.temperatureRequirements && (
              <Badge variant="outline" className="text-xs">
                🌡️ {schedule.cargoDetails.temperatureRequirements}
              </Badge>
            )}
            {schedule.cargoDetails.specialHandling?.map((handling, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                ⚠️ {handling}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-2 mt-auto pt-3">
        {onView && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView(schedule)}
            className="flex-1 text-xs sm:text-sm"
          >
            <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            View Details
          </Button>
        )}
        {onEdit && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(schedule)}
            className="flex-1 text-xs sm:text-sm"
          >
            <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            Edit
          </Button>
        )}
        {onTrack && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onTrack(schedule)}
            className="flex-1 text-xs sm:text-sm"
          >
            <Route className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            Track
          </Button>
        )}
      </div>
    </Card>
  );
}
