// src/components/logistics/driverManagement/hooks/useDriverManagement.ts
'use client';

import { useState, useEffect } from 'react';

interface Driver {
  id: string;
  name: string;
  phone: string;
  email: string;
  licenseNumber: string;
  licenseExpiry: string;
  certifications: string[];
  experience: number;
  rating: number;
  status: 'available' | 'on-delivery' | 'unavailable' | 'offline';
  currentVehicle?: string;
  totalDeliveries: number;
  joinedDate: string;
  lastActive: string;
}

interface NewDriver {
  name: string;
  phone: string;
  email: string;
  licenseNumber: string;
  licenseExpiry: string;
  certifications: string[];
  experience: number;
  rating: number;
}

export function useDriverManagement() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const certificationOptions = [
    'Commercial Driver License',
    'Hazardous Materials',
    'Refrigerated Goods',
    'Food Safety Handling',
    'First Aid Certificate',
    'Defensive Driving',
    'Heavy Vehicle License',
    'International Driving Permit'
  ];

  const statusConfig = {
    available: { color: 'bg-green-100 text-green-800', icon: '🟢', label: 'Available' },
    'on-delivery': { color: 'bg-sky-100 text-sky-800', icon: '🚚', label: 'On Delivery' },
    unavailable: { color: 'bg-red-100 text-red-800', icon: '🔴', label: 'Unavailable' },
    offline: { color: 'bg-gray-100 text-gray-600', icon: '⚫', label: 'Offline' }
  } as const;

  useEffect(() => {
    // Mock data loading - replace with API calls
    const loadMockDrivers = async () => {
      const mockDrivers: Driver[] = [
        {
          id: 'driver-001',
          name: 'John Smith',
          phone: '+27 83 123 4567',
          email: 'john.smith@logistics.co.za',
          licenseNumber: 'DL123456789',
          licenseExpiry: '2025-06-15',
          certifications: ['Commercial Driver License', 'Refrigerated Goods'],
          experience: 5,
          rating: 4.8,
          status: 'available',
          totalDeliveries: 1247,
          joinedDate: '2019-03-15',
          lastActive: '2024-03-27T10:30:00Z'
        },
        {
          id: 'driver-002',
          name: 'Maria Garcia',
          phone: '+27 72 234 5678',
          email: 'maria.garcia@logistics.co.za',
          licenseNumber: 'DL987654321',
          licenseExpiry: '2024-12-20',
          certifications: ['Commercial Driver License', 'Hazardous Materials', 'Food Safety Handling'],
          experience: 8,
          rating: 4.9,
          status: 'on-delivery',
          currentVehicle: 'TRK-001',
          totalDeliveries: 2156,
          joinedDate: '2016-08-22',
          lastActive: '2024-03-27T09:15:00Z'
        },
        {
          id: 'driver-003',
          name: 'Thabo Mokoena',
          phone: '+27 61 345 6789',
          email: 'thabo.mokoena@logistics.co.za',
          licenseNumber: 'DL456789123',
          licenseExpiry: '2025-09-10',
          certifications: ['Commercial Driver License', 'Heavy Vehicle License'],
          experience: 3,
          rating: 4.6,
          status: 'unavailable',
          totalDeliveries: 892,
          joinedDate: '2021-01-10',
          lastActive: '2024-03-26T16:45:00Z'
        },
        {
          id: 'driver-004',
          name: 'Sarah Johnson',
          phone: '+27 74 456 7890',
          email: 'sarah.johnson@logistics.co.za',
          licenseNumber: 'DL789123456',
          licenseExpiry: '2024-11-30',
          certifications: ['Commercial Driver License', 'First Aid Certificate', 'Defensive Driving'],
          experience: 6,
          rating: 4.7,
          status: 'available',
          totalDeliveries: 1567,
          joinedDate: '2018-05-12',
          lastActive: '2024-03-27T08:00:00Z'
        }
      ];

      setDrivers(mockDrivers);
      setIsLoading(false);
    };

    loadMockDrivers();
  }, []);

  const createDriver = (driverData: NewDriver) => {
    const newDriver: Driver = {
      ...driverData,
      id: `driver-${Date.now()}`,
      status: 'available',
      totalDeliveries: 0,
      joinedDate: new Date().toISOString().split('T')[0],
      lastActive: new Date().toISOString()
    };
    
    setDrivers(prev => [...prev, newDriver]);
    return newDriver;
  };

  const updateDriver = (updatedDriver: Driver) => {
    setDrivers(prev => prev.map(driver => 
      driver.id === updatedDriver.id ? updatedDriver : driver
    ));
  };

  const deleteDriver = (driverId: string) => {
    setDrivers(prev => prev.filter(driver => driver.id !== driverId));
  };

  const getDriverById = (id: string) => {
    return drivers.find(driver => driver.id === id);
  };

  const getDriversByStatus = (status: Driver['status']) => {
    return drivers.filter(driver => driver.status === status);
  };

  const updateDriverStatus = (driverId: string, status: Driver['status']) => {
    updateDriver({
      ...getDriverById(driverId)!,
      status,
      lastActive: new Date().toISOString()
    });
  };

  const assignVehicle = (driverId: string, vehicleId: string) => {
    updateDriver({
      ...getDriverById(driverId)!,
      currentVehicle: vehicleId,
      status: 'on-delivery'
    });
  };

  const unassignVehicle = (driverId: string) => {
    const driver = getDriverById(driverId);
    if (driver) {
      updateDriver({
        ...driver,
        currentVehicle: undefined,
        status: 'available'
      });
    }
  };

  const getLicenseExpiryAlerts = () => {
    const today = new Date();
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(today.getMonth() + 3);

    return drivers.filter(driver => {
      const expiryDate = new Date(driver.licenseExpiry);
      return expiryDate <= threeMonthsFromNow;
    });
  };

  const getDriverStats = () => {
    const total = drivers.length;
    const available = drivers.filter(d => d.status === 'available').length;
    const onDelivery = drivers.filter(d => d.status === 'on-delivery').length;
    const unavailable = drivers.filter(d => d.status === 'unavailable').length;
    const offline = drivers.filter(d => d.status === 'offline').length;
    const averageRating = drivers.reduce((sum, d) => sum + d.rating, 0) / total;

    return {
      total,
      available,
      onDelivery,
      unavailable,
      offline,
      averageRating: averageRating || 0,
      totalDeliveries: drivers.reduce((sum, d) => sum + d.totalDeliveries, 0)
    };
  };

  return {
    drivers,
    isLoading,
    certificationOptions,
    statusConfig,
    createDriver,
    updateDriver,
    deleteDriver,
    getDriverById,
    getDriversByStatus,
    updateDriverStatus,
    assignVehicle,
    unassignVehicle,
    getLicenseExpiryAlerts,
    getDriverStats
  };
}

export type { Driver, NewDriver };
