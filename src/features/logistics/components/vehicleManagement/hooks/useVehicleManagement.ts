// src/components/logistics/vehicleManagement/hooks/useVehicleManagement.ts
'use client';

import { useState, useEffect } from 'react';

interface Vehicle {
  id: string;
  registrationNumber: string;
  make: string;
  model: string;
  year: number;
  type: 'truck' | 'van' | 'refrigerated' | 'flatbed';
  capacity: string;
  features: string[];
  status: 'active' | 'maintenance' | 'inactive' | 'on-route';
  insuranceExpiry: string;
  registrationExpiry: string;
  lastMaintenance: string;
  mileage: number;
  fuelLevel: number;
  currentDriver?: string;
  currentLocation?: string;
}

interface NewVehicle {
  registrationNumber: string;
  make: string;
  model: string;
  year: number;
  type: 'truck' | 'van' | 'refrigerated' | 'flatbed';
  capacity: string;
  features: string[];
  insuranceExpiry: string;
  registrationExpiry: string;
}

export function useVehicleManagement() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const vehicleTypes = [
    { value: 'truck' as const, label: 'Truck' },
    { value: 'van' as const, label: 'Van' },
    { value: 'refrigerated' as const, label: 'Refrigerated Truck' },
    { value: 'flatbed' as const, label: 'Flatbed Truck' }
  ];

  const vehicleFeatures = [
    'GPS Tracking', 'Temperature Control', 'Refrigerated', 'Lift Gate', 
    'Air Suspension', 'Backup Camera', 'Sleeping Cabin', 'Loading Ramp'
  ];

  const statusConfig = {
    active: { color: 'bg-green-100 text-green-800', icon: '🟢', label: 'Active' },
    maintenance: { color: 'bg-yellow-100 text-yellow-800', icon: '🔧', label: 'Maintenance' },
    inactive: { color: 'bg-red-100 text-red-800', icon: '🔴', label: 'Inactive' },
    'on-route': { color: 'bg-blue-100 text-blue-800', icon: '🚚', label: 'On Route' }
  };

  useEffect(() => {
    const loadMockVehicles = async () => {
      const mockVehicles: Vehicle[] = [
        {
          id: 'veh-001',
          registrationNumber: 'TRK-001',
          make: 'Mercedes-Benz',
          model: 'Actros',
          year: 2022,
          type: 'truck',
          capacity: '20 tons',
          features: ['GPS Tracking', 'Air Suspension', 'Sleeping Cabin'],
          status: 'active',
          insuranceExpiry: '2024-12-15',
          registrationExpiry: '2025-03-20',
          lastMaintenance: '2024-03-01',
          mileage: 45000,
          fuelLevel: 85,
          currentDriver: 'John Smith',
          currentLocation: 'Johannesburg'
        },
        {
          id: 'veh-002',
          registrationNumber: 'TRK-002',
          make: 'Volvo',
          model: 'FH16',
          year: 2021,
          type: 'refrigerated',
          capacity: '15 tons',
          features: ['GPS Tracking', 'Temperature Control', 'Refrigerated'],
          status: 'on-route',
          insuranceExpiry: '2024-11-30',
          registrationExpiry: '2025-02-15',
          lastMaintenance: '2024-02-15',
          mileage: 62000,
          fuelLevel: 45,
          currentDriver: 'Maria Garcia',
          currentLocation: 'Pretoria'
        }
      ];

      setVehicles(mockVehicles);
      setIsLoading(false);
    };

    loadMockVehicles();
  }, []);

  const createVehicle = (vehicleData: NewVehicle) => {
    const newVehicle: Vehicle = {
      ...vehicleData,
      id: `veh-${Date.now()}`,
      status: 'inactive',
      lastMaintenance: new Date().toISOString().split('T')[0],
      mileage: 0,
      fuelLevel: 100
    };
    
    setVehicles(prev => [...prev, newVehicle]);
    return newVehicle;
  };

  const updateVehicle = (updatedVehicle: Vehicle) => {
    setVehicles(prev => prev.map(vehicle => 
      vehicle.id === updatedVehicle.id ? updatedVehicle : vehicle
    ));
  };

  const deleteVehicle = (vehicleId: string) => {
    setVehicles(prev => prev.filter(vehicle => vehicle.id !== vehicleId));
  };

  const getVehicleById = (id: string) => {
    return vehicles.find(vehicle => vehicle.id === id);
  };

  const getVehiclesByStatus = (status: Vehicle['status']) => {
    return vehicles.filter(vehicle => vehicle.status === status);
  };

  const updateVehicleStatus = (vehicleId: string, status: Vehicle['status']) => {
    updateVehicle({
      ...getVehicleById(vehicleId)!,
      status
    });
  };

  const assignDriver = (vehicleId: string, driverId: string) => {
    updateVehicle({
      ...getVehicleById(vehicleId)!,
      currentDriver: driverId,
      status: 'on-route'
    });
  };

  const getMaintenanceAlerts = () => {
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    return vehicles.filter(vehicle => {
      const insuranceDate = new Date(vehicle.insuranceExpiry);
      const registrationDate = new Date(vehicle.registrationExpiry);
      return insuranceDate <= thirtyDaysFromNow || registrationDate <= thirtyDaysFromNow;
    });
  };

  const getVehicleStats = () => {
    const total = vehicles.length;
    const active = vehicles.filter(v => v.status === 'active').length;
    const onRoute = vehicles.filter(v => v.status === 'on-route').length;
    const maintenance = vehicles.filter(v => v.status === 'maintenance').length;
    const inactive = vehicles.filter(v => v.status === 'inactive').length;
    const averageMileage = vehicles.reduce((sum, v) => sum + v.mileage, 0) / total;

    return {
      total,
      active,
      onRoute,
      maintenance,
      inactive,
      averageMileage: averageMileage || 0,
      totalMileage: vehicles.reduce((sum, v) => sum + v.mileage, 0)
    };
  };

  return {
    vehicles,
    isLoading,
    vehicleTypes,
    vehicleFeatures,
    statusConfig,
    createVehicle,
    updateVehicle,
    deleteVehicle,
    getVehicleById,
    getVehiclesByStatus,
    updateVehicleStatus,
    assignDriver,
    getMaintenanceAlerts,
    getVehicleStats
  };
}

export type { Vehicle, NewVehicle };
