// src/components/events/productEventList.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, User, FileText, Camera } from 'lucide-react';
import { ProductEvent, EVENT_CONFIG } from '@/types/events';
import { formatDateTime } from '@/lib/utils';

interface ProductEventListProps {
  productId: string;
}

export function ProductEventList({ productId }: ProductEventListProps) {
  const [events, setEvents] = useState<ProductEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with API call
    const mockEvents: ProductEvent[] = [
      {
        id: 'evt1',
        productId,
        type: 'planting',
        actor: 'John Farmer',
        actorRole: 'farmer',
        timestamp: '2025-01-15T09:00:00Z',
        location: 'Field A, North Farm',
        notes: 'Planted organic tomato seedlings with organic compost',
        photos: [],
        syncStatus: 'synced',
        data: {}
      },
      {
        id: 'evt2',
        productId,
        type: 'growth',
        actor: 'John Farmer',
        actorRole: 'farmer',
        timestamp: '2025-02-01T10:30:00Z',
        location: 'Field A, North Farm',
        notes: 'Healthy growth observed, plants reaching 30cm height',
        photos: [],
        syncStatus: 'synced',
        data: {}
      },
      {
        id: 'evt3',
        productId,
        type: 'harvest',
        actor: 'John Farmer',
        actorRole: 'farmer',
        timestamp: '2025-03-15T08:00:00Z',
        location: 'Field A, North Farm',
        notes: 'Harvested 500kg of premium tomatoes',
        photos: [],
        syncStatus: 'synced',
        data: {}
      }
    ];

    setTimeout(() => {
      setEvents(mockEvents);
      setLoading(false);
    }, 500);
  }, [productId]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <Card className="p-12 text-center">
        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Events Yet</h3>
        <p className="text-gray-500">Start tracking your product journey by adding your first event.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((event, index) => {
        const config = EVENT_CONFIG[event.type];
        return (
          <Card key={event.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{config.icon}</span>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{config.label}</h3>
                  <p className="text-sm text-gray-500">{config.description}</p>
                </div>
              </div>
              <Badge variant={
                event.syncStatus === 'synced' ? 'success' : 
                event.syncStatus === 'pending' ? 'warning' : 
                event.syncStatus === 'failed' ? 'destructive' : 'secondary'
              }>
                {event.syncStatus}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">
                  <strong>By:</strong> {event.actor} ({event.actorRole})
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">
                  <strong>When:</strong> {formatDateTime(event.timestamp)}
                </span>
              </div>

              {event.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">
                    <strong>Where:</strong> {event.location}
                  </span>
                </div>
              )}

              {event.photos && event.photos.length > 0 && (
                <div className="flex items-center gap-2">
                  <Camera className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">
                    <strong>Photos:</strong> {event.photos.length} attached
                  </span>
                </div>
              )}
            </div>

            {event.notes && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-start gap-2">
                  <FileText className="h-4 w-4 text-gray-400 mt-0.5" />
                  <p className="text-sm text-gray-700 italic">"{event.notes}"</p>
                </div>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
