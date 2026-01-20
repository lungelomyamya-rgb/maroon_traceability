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
        timestamp: '2025-01-20T08:30:00Z',
        location: 'Field A, North Farm',
        notes: 'Planted 200 organic tomato seedlings with organic compost and proper spacing',
        photos: ['planting_photo_1.jpg', 'seedling_tray.jpg'],
        syncStatus: 'synced',
        data: {
          seedVariety: 'Celebrity Tomato',
          quantity: 200,
          method: 'organic',
          weather: 'Sunny, 22°C'
        }
      },
      {
        id: 'evt2',
        productId,
        type: 'growth',
        actor: 'John Farmer',
        actorRole: 'farmer',
        timestamp: '2025-01-22T06:00:00Z',
        location: 'Field A, North Farm',
        notes: 'First watering after planting, soil moisture levels good',
        photos: ['watering_setup.jpg'],
        syncStatus: 'synced',
        data: {
          waterAmount: '500L',
          method: 'drip irrigation',
          time: 'Early morning'
        }
      },
      {
        id: 'evt3',
        productId,
        type: 'growth',
        actor: 'John Farmer',
        actorRole: 'farmer',
        timestamp: '2025-01-28T14:15:00Z',
        location: 'Field A, North Farm',
        notes: 'Applied organic compost tea to boost growth and soil health',
        photos: ['fertiliser_application.jpg'],
        syncStatus: 'synced',
        data: {
          fertiliserType: 'Organic Compost',
          amount: '50kg',
          npkRatio: '2-1-2',
          method: 'broadcast'
        }
      },
      {
        id: 'evt4',
        productId,
        type: 'growth',
        actor: 'John Farmer',
        actorRole: 'farmer',
        timestamp: '2025-02-05T09:00:00Z',
        location: 'Field A, North Farm',
        notes: 'Plants showing healthy growth, reaching 25cm height. No pests detected.',
        photos: ['growth_measurement.jpg', 'plant_health_check.jpg'],
        syncStatus: 'synced',
        data: {
          height: '25cm',
          health: 'Excellent',
          stage: 'vegetative',
          temperature: '24°C'
        }
      },
      {
        id: 'evt5',
        productId,
        type: 'growth',
        actor: 'John Farmer',
        actorRole: 'farmer',
        timestamp: '2025-02-12T16:30:00Z',
        location: 'Field A, North Farm',
        notes: 'Applied organic neem oil spray as preventive measure against aphids',
        photos: ['pest_control_application.jpg'],
        syncStatus: 'synced',
        data: {
          treatment: 'Neem Oil',
          concentration: '5%',
          coverage: 'Full field'
        }
      },
      {
        id: 'evt6',
        productId,
        type: 'harvest',
        actor: 'John Farmer',
        actorRole: 'farmer',
        timestamp: '2025-03-15T07:00:00Z',
        location: 'Field A, North Farm',
        notes: 'Harvested 450kg of premium quality tomatoes. Excellent color and firmness.',
        photos: ['harvesting_process.jpg', 'harvested_tomatoes.jpg'],
        syncStatus: 'synced',
        data: {
          quantity: '450kg',
          quality: 'Premium',
          averageWeight: '250g',
          marketPrice: 'R25/kg'
        }
      },
      {
        id: 'evt7',
        productId,
        type: 'quality-inspection',
        actor: 'Quality Inspector',
        actorRole: 'inspector',
        timestamp: '2025-03-16T10:00:00Z',
        location: 'Quality Lab, Processing Center',
        notes: 'Quality inspection passed. All tomatoes meet premium standards.',
        photos: ['quality_inspection.jpg', 'lab_results.jpg'],
        syncStatus: 'synced',
        data: {
          grade: 'Premium',
          sugarContent: '4.2%',
          acidity: '0.6%',
          shelfLife: '14 days'
        }
      },
      {
        id: 'evt8',
        productId,
        type: 'packaging',
        actor: 'Packaging Team',
        actorRole: 'packaging',
        timestamp: '2025-03-16T14:00:00Z',
        location: 'Packaging Facility',
        notes: 'Packaged in eco-friendly cardboard boxes with proper labeling',
        photos: ['packaging_process.jpg', 'boxed_tomatoes.jpg'],
        syncStatus: 'synced',
        data: {
          packagingType: 'Cardboard',
          boxSize: '1kg',
          labels: ['Organic', 'Premium', 'Traceable']
        }
      },
      {
        id: 'evt9',
        productId,
        type: 'transport',
        actor: 'Logistics Team',
        actorRole: 'logistics',
        timestamp: '2025-03-17T09:00:00Z',
        location: 'Distribution Center',
        notes: 'Shipped to local markets and restaurants',
        photos: ['loading_truck.jpg', 'shipping_manifest.jpg'],
        syncStatus: 'synced',
        data: {
          destination: 'Local Markets',
          transport: 'Refrigerated Truck',
          temperature: '4°C'
        }
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
