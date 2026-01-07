// src/components/logistics/transportScheduling.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Clock, MapPin, Truck, User, Plus, Edit, Eye, Route, AlertTriangle } from 'lucide-react';
import { TransportSchedule, TransportStatus, Vehicle, Driver } from '@/types/logistics';

interface TransportSchedulingProps {
  onScheduleSelect?: (schedule: TransportSchedule) => void;
  vehicles?: Vehicle[];
  drivers?: Driver[];
}

export function TransportScheduling({ onScheduleSelect, vehicles = [], drivers = [] }: TransportSchedulingProps) {
  const [schedules, setSchedules] = useState<TransportSchedule[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<TransportSchedule | null>(null);
  const [newSchedule, setNewSchedule] = useState({
    vehicleId: '',
    driverId: '',
    productId: '',
    originName: '',
    originAddress: '',
    originContact: '',
    destinationName: '',
    destinationAddress: '',
    destinationContact: '',
    scheduledDate: '',
    estimatedDuration: '',
    priority: 'medium' as const,
    cargoWeight: '',
    cargoVolume: '',
    temperatureRequirements: '',
    specialHandling: [] as string[],
    notes: ''
  });

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

  const specialHandlingOptions = [
    'Temperature Controlled',
    'Fragile',
    'Hazardous Materials',
    'Perishable',
    'High Value',
    'Oversized',
    'Refrigerated',
    'Dry Ice Required'
  ];

  useEffect(() => {
    // Mock data - replace with API call
    const mockSchedules: TransportSchedule[] = [
      {
        id: 'sched1',
        vehicleId: 'veh1',
        driverId: 'driver1',
        productId: 'PRD-2024-001',
        route: {
          origin: {
            name: 'Green Valley Farm',
            address: '123 Farm Road, Stellenbosch',
            lat: -33.9249,
            lng: 18.4241,
            contact: '+27 21 123 4567'
          },
          destination: {
            name: 'Fresh Market Cape Town',
            address: '456 Market St, Cape Town',
            lat: -33.9249,
            lng: 18.4241,
            contact: '+27 21 987 6543'
          }
        },
        scheduledDate: '2025-01-25T08:00:00Z',
        estimatedDuration: 120,
        status: 'scheduled',
        priority: 'high',
        cargoDetails: {
          weight: 500,
          volume: 2,
          temperatureRequirements: '2-4°C',
          specialHandling: ['Refrigerated', 'Perishable']
        },
        documents: [],
        notes: 'Organic apples - handle with care',
        createdAt: '2025-01-20T10:00:00Z',
        updatedAt: '2025-01-20T10:00:00Z'
      },
      {
        id: 'sched2',
        vehicleId: 'veh2',
        driverId: 'driver2',
        productId: 'PRD-2024-002',
        route: {
          origin: {
            name: 'Sunny Acres Farm',
            address: '789 Sunny Lane, Paarl',
            lat: -33.8688,
            lng: 18.5058,
            contact: '+27 21 555 1234'
          },
          destination: {
            name: 'Organic Foods Store',
            address: '321 Health St, Johannesburg',
            lat: -26.2041,
            lng: 28.0473,
            contact: '+27 11 777 8888'
          }
        },
        scheduledDate: '2025-01-26T06:00:00Z',
        estimatedDuration: 480,
        status: 'scheduled',
        priority: 'medium',
        cargoDetails: {
          weight: 300,
          volume: 1.5,
          specialHandling: ['Organic Certified']
        },
        documents: [],
        notes: 'Free range eggs - ensure careful handling',
        createdAt: '2025-01-20T11:00:00Z',
        updatedAt: '2025-01-20T11:00:00Z'
      }
    ];

    setSchedules(mockSchedules);
  }, []);

  const handleAddSchedule = () => {
    const scheduleData: TransportSchedule = {
      id: `sched${Date.now()}`,
      vehicleId: newSchedule.vehicleId,
      driverId: newSchedule.driverId,
      productId: newSchedule.productId,
      route: {
        origin: {
          name: newSchedule.originName,
          address: newSchedule.originAddress,
          lat: -33.9249, // Default coordinates
          lng: 18.4241,
          contact: newSchedule.originContact
        },
        destination: {
          name: newSchedule.destinationName,
          address: newSchedule.destinationAddress,
          lat: -33.9249, // Default coordinates
          lng: 18.4241,
          contact: newSchedule.destinationContact
        }
      },
      scheduledDate: newSchedule.scheduledDate,
      estimatedDuration: parseInt(newSchedule.estimatedDuration),
      status: 'scheduled',
      priority: newSchedule.priority,
      cargoDetails: {
        weight: parseFloat(newSchedule.cargoWeight),
        volume: parseFloat(newSchedule.cargoVolume),
        temperatureRequirements: newSchedule.temperatureRequirements || undefined,
        specialHandling: newSchedule.specialHandling
      },
      documents: [],
      notes: newSchedule.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setSchedules([...schedules, scheduleData]);
    setNewSchedule({
      vehicleId: '',
      driverId: '',
      productId: '',
      originName: '',
      originAddress: '',
      originContact: '',
      destinationName: '',
      destinationAddress: '',
      destinationContact: '',
      scheduledDate: '',
      estimatedDuration: '',
      priority: 'medium',
      cargoWeight: '',
      cargoVolume: '',
      temperatureRequirements: '',
      specialHandling: [],
      notes: ''
    });
    setShowAddForm(false);
  };

  const handleUpdateSchedule = () => {
    if (!editingSchedule) return;

    setSchedules(schedules.map(s => 
      s.id === editingSchedule.id ? editingSchedule : s
    ));
    setEditingSchedule(null);
  };

  const toggleSpecialHandling = (handling: string) => {
    if (showAddForm) {
      setNewSchedule(prev => ({
        ...prev,
        specialHandling: prev.specialHandling.includes(handling)
          ? prev.specialHandling.filter(h => h !== handling)
          : [...prev.specialHandling, handling]
      }));
    } else if (editingSchedule) {
      setEditingSchedule(prev => prev ? {
        ...prev,
        cargoDetails: {
          ...prev.cargoDetails,
          specialHandling: prev.cargoDetails.specialHandling?.includes(handling)
            ? prev.cargoDetails.specialHandling.filter(h => h !== handling)
            : [...(prev.cargoDetails.specialHandling || []), handling]
        }
      } : null);
    }
  };

  const isOverdue = (schedule: TransportSchedule) => {
    const scheduledTime = new Date(schedule.scheduledDate);
    const now = new Date();
    return scheduledTime < now && schedule.status !== 'delivered';
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-700">Transport Scheduling</h2>
        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-cyan-600 hover:bg-cyan-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Schedule Transport
        </Button>
      </div>

      {/* Add/Edit Schedule Form */}
      {(showAddForm || editingSchedule) && (
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">
            {showAddForm ? 'Schedule New Transport' : 'Edit Transport Schedule'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product ID</label>
              <Input
                value={showAddForm ? newSchedule.productId : editingSchedule?.productId}
                onChange={(e) => showAddForm 
                  ? setNewSchedule({...newSchedule, productId: e.target.value})
                  : setEditingSchedule(editingSchedule ? {...editingSchedule, productId: e.target.value} : null)
                }
                placeholder="e.g., PRD-2024-001"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle</label>
              <select
                value={showAddForm ? newSchedule.vehicleId : editingSchedule?.vehicleId}
                onChange={(e) => showAddForm
                  ? setNewSchedule({...newSchedule, vehicleId: e.target.value})
                  : setEditingSchedule(editingSchedule ? {...editingSchedule, vehicleId: e.target.value} : null)
                }
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Select Vehicle</option>
                {vehicles.map(vehicle => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.make} {vehicle.model} ({vehicle.registrationNumber})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Driver</label>
              <select
                value={showAddForm ? newSchedule.driverId : editingSchedule?.driverId}
                onChange={(e) => showAddForm
                  ? setNewSchedule({...newSchedule, driverId: e.target.value})
                  : setEditingSchedule(editingSchedule ? {...editingSchedule, driverId: e.target.value} : null)
                }
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Select Driver</option>
                {drivers.map(driver => (
                  <option key={driver.id} value={driver.id}>
                    {driver.name} ({driver.phone})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                value={showAddForm ? newSchedule.priority : editingSchedule?.priority}
                onChange={(e) => showAddForm
                  ? setNewSchedule({...newSchedule, priority: e.target.value as any})
                  : setEditingSchedule(editingSchedule ? {...editingSchedule, priority: e.target.value as any} : null)
                }
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                {Object.entries(priorityConfig).map(([key, config]) => (
                  <option key={key} value={key}>{config.icon} {config.label}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Origin</label>
              <Input
                value={showAddForm ? newSchedule.originName : editingSchedule?.route.origin.name}
                onChange={(e) => showAddForm
                  ? setNewSchedule({...newSchedule, originName: e.target.value})
                  : setEditingSchedule(editingSchedule ? {
                      ...editingSchedule, 
                      route: {
                        ...editingSchedule.route,
                        origin: { ...editingSchedule.route.origin, name: e.target.value }
                      }
                    } : null)
                }
                placeholder="Origin name"
              />
            </div>

            <div className="md:col-span-2">
              <Input
                value={showAddForm ? newSchedule.originAddress : editingSchedule?.route.origin.address}
                onChange={(e) => showAddForm
                  ? setNewSchedule({...newSchedule, originAddress: e.target.value})
                  : setEditingSchedule(editingSchedule ? {
                      ...editingSchedule, 
                      route: {
                        ...editingSchedule.route,
                        origin: { ...editingSchedule.route.origin, address: e.target.value }
                      }
                    } : null)
                }
                placeholder="Origin address"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
              <Input
                value={showAddForm ? newSchedule.destinationName : editingSchedule?.route.destination.name}
                onChange={(e) => showAddForm
                  ? setNewSchedule({...newSchedule, destinationName: e.target.value})
                  : setEditingSchedule(editingSchedule ? {
                      ...editingSchedule, 
                      route: {
                        ...editingSchedule.route,
                        destination: { ...editingSchedule.route.destination, name: e.target.value }
                      }
                    } : null)
                }
                placeholder="Destination name"
              />
            </div>

            <div className="md:col-span-2">
              <Input
                value={showAddForm ? newSchedule.destinationAddress : editingSchedule?.route.destination.address}
                onChange={(e) => showAddForm
                  ? setNewSchedule({...newSchedule, destinationAddress: e.target.value})
                  : setEditingSchedule(editingSchedule ? {
                      ...editingSchedule, 
                      route: {
                        ...editingSchedule.route,
                        destination: { ...editingSchedule.route.destination, address: e.target.value }
                      }
                    } : null)
                }
                placeholder="Destination address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Scheduled Date</label>
              <Input
                type="datetime-local"
                value={showAddForm ? newSchedule.scheduledDate : editingSchedule?.scheduledDate}
                onChange={(e) => showAddForm
                  ? setNewSchedule({...newSchedule, scheduledDate: e.target.value})
                  : setEditingSchedule(editingSchedule ? {...editingSchedule, scheduledDate: e.target.value} : null)
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Duration (minutes)</label>
              <Input
                type="number"
                value={showAddForm ? newSchedule.estimatedDuration : editingSchedule?.estimatedDuration}
                onChange={(e) => showAddForm
                  ? setNewSchedule({...newSchedule, estimatedDuration: e.target.value})
                  : setEditingSchedule(editingSchedule ? {...editingSchedule, estimatedDuration: parseInt(e.target.value)} : null)
                }
                placeholder="e.g., 120"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cargo Weight (kg)</label>
              <Input
                type="number"
                value={showAddForm ? newSchedule.cargoWeight : editingSchedule?.cargoDetails.weight}
                onChange={(e) => showAddForm
                  ? setNewSchedule({...newSchedule, cargoWeight: e.target.value})
                  : setEditingSchedule(editingSchedule ? {
                      ...editingSchedule,
                      cargoDetails: { ...editingSchedule.cargoDetails, weight: parseFloat(e.target.value) }
                    } : null)
                }
                placeholder="e.g., 500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cargo Volume (m³)</label>
              <Input
                type="number"
                value={showAddForm ? newSchedule.cargoVolume : editingSchedule?.cargoDetails.volume}
                onChange={(e) => showAddForm
                  ? setNewSchedule({...newSchedule, cargoVolume: e.target.value})
                  : setEditingSchedule(editingSchedule ? {
                      ...editingSchedule,
                      cargoDetails: { ...editingSchedule.cargoDetails, volume: parseFloat(e.target.value) }
                    } : null)
                }
                placeholder="e.g., 2.5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Temperature Requirements</label>
              <Input
                value={showAddForm ? newSchedule.temperatureRequirements : editingSchedule?.cargoDetails.temperatureRequirements}
                onChange={(e) => showAddForm
                  ? setNewSchedule({...newSchedule, temperatureRequirements: e.target.value})
                  : setEditingSchedule(editingSchedule ? {
                      ...editingSchedule,
                      cargoDetails: { ...editingSchedule.cargoDetails, temperatureRequirements: e.target.value }
                    } : null)
                }
                placeholder="e.g., 2-4°C"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Special Handling</label>
              <div className="flex flex-wrap gap-2">
                {specialHandlingOptions.map(handling => (
                  <label key={handling} className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={showAddForm 
                        ? newSchedule.specialHandling.includes(handling)
                        : editingSchedule?.cargoDetails?.specialHandling?.includes(handling) || false}
                      onChange={() => toggleSpecialHandling(handling)}
                    />
                    <span className="text-sm">{handling}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <Textarea
                value={showAddForm ? newSchedule.notes : editingSchedule?.notes}
                onChange={(e) => showAddForm
                  ? setNewSchedule({...newSchedule, notes: e.target.value})
                  : setEditingSchedule(editingSchedule ? {...editingSchedule, notes: e.target.value} : null)
                }
                rows={3}
                placeholder="Additional notes about this transport"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => {
              setShowAddForm(false);
              setEditingSchedule(null);
            }}>
              Cancel
            </Button>
            <Button onClick={showAddForm ? handleAddSchedule : handleUpdateSchedule}>
              {showAddForm ? 'Schedule Transport' : 'Update Schedule'}
            </Button>
          </div>
        </Card>
      )}

      {/* Schedule List */}
      <div className="space-y-4">
        {schedules.map((schedule) => {
          const priorityConfigItem = priorityConfig[schedule.priority];
          const statusConfigItem = statusConfig[schedule.status];
          const overdue = isOverdue(schedule);

          return (
            <Card key={schedule.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-sky-100 rounded-lg">
                    <Route className="h-6 w-6 text-sky-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700">{schedule.productId}</h3>
                    <p className="text-sm text-gray-600">
                      {schedule.route.origin.name} → {schedule.route.destination.name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="info" className={priorityConfigItem.color}>
                    {priorityConfigItem.icon} {priorityConfigItem.label}
                  </Badge>
                  <Badge variant="info" className={statusConfigItem.color}>
                    {statusConfigItem.icon} {statusConfigItem.label}
                  </Badge>
                  {overdue && (
                    <Badge className="bg-red-100 text-red-800">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Overdue
                    </Badge>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-gray-600">Scheduled</p>
                    <p className="font-medium">{new Date(schedule.scheduledDate).toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-gray-600">Duration</p>
                    <p className="font-medium">{formatDuration(schedule.estimatedDuration)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-gray-600">Cargo</p>
                    <p className="font-medium">{schedule.cargoDetails.weight}kg, {schedule.cargoDetails.volume}m³</p>
                  </div>
                </div>
              </div>

              {/* Route Details */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                  <div>
                    <p className="text-xs text-gray-600">Origin</p>
                    <p className="text-sm font-medium">{schedule.route.origin.name}</p>
                    <p className="text-xs text-gray-500">{schedule.route.origin.address}</p>
                    <p className="text-xs text-gray-500">{schedule.route.origin.contact}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                  <div>
                    <p className="text-xs text-gray-600">Destination</p>
                    <p className="text-sm font-medium">{schedule.route.destination.name}</p>
                    <p className="text-xs text-gray-500">{schedule.route.destination.address}</p>
                    <p className="text-xs text-gray-500">{schedule.route.destination.contact}</p>
                  </div>
                </div>
              </div>

              {/* Special Requirements */}
              {(schedule.cargoDetails.temperatureRequirements || (schedule.cargoDetails.specialHandling?.length || 0) > 0) && (
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
              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onScheduleSelect?.(schedule)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View Details
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingSchedule(schedule)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {/* Start transport */}}
                  disabled={schedule.status !== 'scheduled'}
                >
                  <Truck className="h-4 w-4 mr-1" />
                  Start Transport
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
