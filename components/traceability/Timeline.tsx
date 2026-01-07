// src/components/traceability/Timeline.tsx
// Reusable timeline component for traceability visualization

import React from 'react';
import { ArrowRight, CheckCircle, Clock, MapPin, User, Calendar, FileText, Image as ImageIcon } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';

export interface TimelineEvent {
  id: string;
  type: string;
  title: string;
  description: string;
  actor: string;
  actorRole: string;
  timestamp: string;
  location?: string;
  notes?: string;
  photos?: string[];
  status: 'completed' | 'pending' | 'failed';
  data?: any;
}

interface TimelineProps {
  events: TimelineEvent[];
  showActions?: boolean;
  onEventClick?: (event: TimelineEvent) => void;
  compact?: boolean;
}

const EVENT_CONFIG: Record<string, { icon: string; color: string; label: string }> = {
  planting: { icon: '🌱', color: 'green', label: 'Planting' },
  'seed-selection': { icon: '🌾', color: 'green', label: 'Seed Selection' },
  'fertiliser-application': { icon: '💧', color: 'blue', label: 'Fertiliser' },
  'growth-monitoring': { icon: '🌿', color: 'green', label: 'Growth' },
  harvest: { icon: '🚜', color: 'orange', label: 'Harvest' },
  'quality-inspection': { icon: '🔍', color: 'purple', label: 'Quality Check' },
  'compliance-check': { icon: '✅', color: 'blue', label: 'Compliance' },
  certification: { icon: '🏆', color: 'gold', label: 'Certification' },
  collection: { icon: '🚚', color: 'blue', label: 'Collection' },
  transport: { icon: '🚛', color: 'blue', label: 'Transport' },
  delivery: { icon: '📦', color: 'orange', label: 'Delivery' },
  packaging: { icon: '📦', color: 'gray', label: 'Packaging' },
  'batch-creation': { icon: '🏷️', color: 'gray', label: 'Batch Creation' },
  'quality-check': { icon: '✅', color: 'green', label: 'Quality Check' }
};

const getStatusColor = (status: TimelineEvent['status']) => {
  switch (status) {
    case 'completed': return 'bg-green-500 border-green-500';
    case 'pending': return 'bg-yellow-500 border-yellow-500';
    case 'failed': return 'bg-red-500 border-red-500';
    default: return 'bg-gray-500 border-gray-500';
  }
};

const getTimelineLineColor = (status: TimelineEvent['status']) => {
  switch (status) {
    case 'completed': return 'bg-green-500';
    case 'pending': return 'bg-yellow-500';
    case 'failed': return 'bg-red-500';
    default: return 'bg-gray-500';
  }
};

export function Timeline({ events, showActions = false, onEventClick, compact = false }: TimelineProps) {
  if (!events || events.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No events recorded yet</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className={`absolute left-6 top-0 bottom-0 w-0.5 ${getTimelineLineColor(events[0]?.status || 'completed')}`}></div>

      {/* Events */}
      <div className="space-y-6">
        {events.map((event, index) => {
          const config = EVENT_CONFIG[event.type] || { 
            icon: '📋', 
            color: 'gray', 
            label: event.type 
          };

          return (
            <div 
              key={event.id} 
              className={`relative flex gap-4 pl-16 ${onEventClick ? 'cursor-pointer hover:bg-gray-50' : ''}`}
              onClick={() => onEventClick?.(event)}
            >
              {/* Timeline dot */}
              <div className={`absolute left-3 top-2 w-6 h-6 rounded-full bg-white border-4 ${getStatusColor(event.status)} shadow-md`}>
                {event.status === 'completed' && (
                  <CheckCircle className="h-3 w-3 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                )}
              </div>

              {/* Event card */}
              <div className={`flex-1 ${compact ? 'p-3' : 'p-4'} bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{config.icon}</span>
                    <div>
                      <h4 className="font-semibold text-gray-800">{config.label}</h4>
                      {!compact && (
                        <p className="text-xs text-gray-500">{config.label}</p>
                      )}
                    </div>
                  </div>
                  {index < events.length - 1 && !compact && (
                    <ArrowRight className="h-5 w-5 text-gray-400" />
                  )}
                </div>

                <div className={`${compact ? 'space-y-1' : 'space-y-2'} text-sm`}>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-700">
                      <strong>{event.actor}</strong> ({event.actorRole})
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-700">{formatDateTime(event.timestamp)}</span>
                  </div>

                  {event.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-700">{event.location}</span>
                    </div>
                  )}

                  {event.notes && !compact && (
                    <div className="flex items-start gap-2 mt-2">
                      <FileText className="h-4 w-4 text-gray-500 mt-0.5" />
                      <p className="text-gray-600 italic">"{event.notes}"</p>
                    </div>
                  )}

                  {event.photos && event.photos.length > 0 && !compact && (
                    <div className="flex items-center gap-2 mt-2">
                      <ImageIcon className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">
                        {event.photos.length} photo{event.photos.length !== 1 ? 's' : ''} attached
                      </span>
                    </div>
                  )}
                </div>

                {/* Status badge */}
                <div className="mt-3">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    event.status === 'completed' 
                      ? 'bg-green-100 text-green-800'
                      : event.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {event.status === 'completed' && <CheckCircle className="h-3 w-3 mr-1" />}
                    {event.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                    {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                  </span>
                </div>

                {/* Action buttons */}
                {showActions && !compact && (
                  <div className="mt-4 flex gap-2">
                    <button className="text-xs text-blue-600 hover:text-blue-800">
                      View Details
                    </button>
                    {event.photos && event.photos.length > 0 && (
                      <button className="text-xs text-green-600 hover:text-green-800">
                        View Photos
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Timeline component specifically for dashboard view details
export function DashboardTimeline({ productId }: { productId: string }) {
  // Mock data - in real implementation, this would fetch from API
  const mockEvents: TimelineEvent[] = [
    {
      id: 'evt1',
      type: 'planting',
      title: 'Planting',
      description: 'Seeds planted',
      actor: 'John Farmer',
      actorRole: 'farmer',
      timestamp: '2025-07-01T09:00:00Z',
      location: 'Field A, Green Valley Farm',
      notes: 'Planted organic maize seeds using sustainable practices',
      status: 'completed',
      photos: ['photo1.jpg', 'photo2.jpg']
    },
    {
      id: 'evt2',
      type: 'growth-monitoring',
      title: 'Growth Monitoring',
      description: 'Plant development check',
      actor: 'John Farmer',
      actorRole: 'farmer',
      timestamp: '2025-08-15T10:30:00Z',
      location: 'Field A, Green Valley Farm',
      notes: 'Healthy growth observed, no pest issues',
      status: 'completed',
      photos: ['photo3.jpg']
    },
    {
      id: 'evt3',
      type: 'harvest',
      title: 'Harvest',
      description: 'Crop harvesting',
      actor: 'John Farmer',
      actorRole: 'farmer',
      timestamp: '2025-09-10T08:30:00Z',
      location: 'Field A, Green Valley Farm',
      notes: 'Harvested 500kg of premium organic maize',
      status: 'completed',
      photos: ['photo4.jpg', 'photo5.jpg']
    },
    {
      id: 'evt4',
      type: 'quality-inspection',
      title: 'Quality Inspection',
      description: 'Third-party quality check',
      actor: 'Inspector Jane',
      actorRole: 'inspector',
      timestamp: '2025-09-10T14:00:00Z',
      location: 'Green Valley Farm',
      notes: 'Passed all quality checks. Grade A+ quality.',
      status: 'completed',
      photos: ['inspection1.jpg']
    },
    {
      id: 'evt5',
      type: 'collection',
      title: 'Collection',
      description: 'Produce collection',
      actor: 'Swift Logistics',
      actorRole: 'logistics',
      timestamp: '2025-09-11T06:00:00Z',
      location: 'Green Valley Farm',
      notes: 'Collected 500kg for transport to packaging facility',
      status: 'completed'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Product Journey</h3>
        <span className="text-sm text-gray-500">5 events</span>
      </div>
      
      <Timeline 
        events={mockEvents} 
        compact={false}
        showActions={true}
        onEventClick={(event) => {
          console.log('Event clicked:', event);
          // Could open a modal with more details
        }}
      />
    </div>
  );
}
