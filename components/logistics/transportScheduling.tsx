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
import { mockSchedules } from '@/constants/logisticsMockData';

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
    // Load mock data from consolidated file
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
      {/* Header with Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Transport Scheduling</h2>
        </div>
        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-cyan-600 hover:bg-cyan-700 text-white w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          Schedule Transport
        </Button>
      </div>

      {/* Add/Edit Schedule Form */}
      {(showAddForm || editingSchedule) && (
        <Card className="p-4 sm:p-6">
          <h3 className="text-lg font-medium mb-4">
            {showAddForm ? 'Schedule New Transport' : 'Edit Transport Schedule'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {schedules.map((schedule) => {
          const priorityConfigItem = priorityConfig[schedule.priority];
          const statusConfigItem = statusConfig[schedule.status];
          const overdue = isOverdue(schedule);

          return (
            <Card key={schedule.id} className="p-3 sm:p-4 lg:p-5 hover:shadow-lg transition-all duration-200 hover:scale-[1.02] border-0 shadow-md bg-white rounded-xl w-full min-h-[320px] sm:min-h-[360px] lg:min-h-[400px] flex flex-col">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  <div className="p-1.5 sm:p-2 bg-sky-100 rounded-lg shadow-lg flex-shrink-0">
                    <Route className="h-4 w-4 sm:h-5 lg:h-6 text-sky-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-700 text-sm sm:text-base lg:text-lg break-words">{schedule.productId}</h3>
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

              <div className="space-y-3 text-xs sm:text-sm mb-3 sm:mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3 sm:h-4 text-gray-400" />
                  <div className="flex-1">
                    <p className="text-gray-600">Scheduled</p>
                    <p className="font-medium text-xs">{new Date(schedule.scheduledDate).toLocaleString()}</p>
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
                    <p className="font-medium">{schedule.cargoDetails.weight}kg, {schedule.cargoDetails.volume}m³</p>
                  </div>
                </div>
              </div>

              {/* Route Details */}
              <div className="mt-4 space-y-3">
                <div className="flex items-start gap-2">
                  <MapPin className="h-3 w-3 sm:h-4 text-gray-400 mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-600">Origin</p>
                    <p className="text-xs sm:text-sm font-medium truncate">{schedule.route.origin.name}</p>
                    <p className="text-xs text-gray-500 truncate">{schedule.route.origin.address}</p>
                    <p className="text-xs text-gray-500 truncate">{schedule.route.origin.contact}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <MapPin className="h-3 w-3 sm:h-4 text-gray-400 mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-600">Destination</p>
                    <p className="text-xs sm:text-sm font-medium truncate">{schedule.route.destination.name}</p>
                    <p className="text-xs text-gray-500 truncate">{schedule.route.destination.address}</p>
                    <p className="text-xs text-gray-500 truncate">{schedule.route.destination.contact}</p>
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
              <div className="flex flex-col sm:flex-row gap-2 mt-auto pt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onScheduleSelect?.(schedule)}
                  className="flex-1 text-xs sm:text-sm"
                >
                  <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  View Details
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingSchedule(schedule)}
                  className="flex-1 text-xs sm:text-sm"
                >
                  <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {/* Start tracking */}}
                  className="flex-1 text-xs sm:text-sm"
                >
                  <Route className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  Track
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
