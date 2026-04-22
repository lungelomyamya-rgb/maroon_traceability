'use client';

import { Plus, Search } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DataTable, TableColumn, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Vehicle, VehicleStatus } from '@/types/logistics';

interface VehicleManagementProps {
  className?: string;
}

export function VehicleManagement({ className }: VehicleManagementProps) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<VehicleStatus | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Mock data - in real app, this would come from API
  useEffect(() => {
    const mockVehicles: Vehicle[] = [
      {
        id: 'vehicle-001',
        registrationNumber: 'CA 123456',
        make: 'Mercedes-Benz',
        model: 'Actros 1851',
        year: 2021,
        type: 'truck',
        capacity: 32000,
        status: 'active',
        currentDriver: 'driver-001',
        lastMaintenance: '2024-01-15',
        nextMaintenance: '2024-04-15',
        insuranceExpiry: '2024-12-31',
        registrationExpiry: '2025-03-31',
        features: ['refrigerated', 'gps-tracking', 'temperature-control'],
        location: { lat: -33.9249, lng: 18.4241 },
      },
      {
        id: 'vehicle-002',
        registrationNumber: 'GP 789012',
        make: 'Volvo',
        model: 'FH16',
        year: 2020,
        type: 'truck',
        capacity: 28000,
        status: 'maintenance',
        lastMaintenance: '2024-02-20',
        nextMaintenance: '2024-05-20',
        insuranceExpiry: '2024-11-30',
        registrationExpiry: '2025-02-28',
        features: ['gps-tracking', 'sleeping-cabin'],
        location: { lat: -26.2041, lng: 28.0473 },
      },
      {
        id: 'vehicle-003',
        registrationNumber: 'JHB 345678',
        make: 'Iveco',
        model: 'Daily',
        year: 2022,
        type: 'van',
        capacity: 3500,
        status: 'available',
        lastMaintenance: '2024-01-10',
        nextMaintenance: '2024-04-10',
        insuranceExpiry: '2025-01-15',
        registrationExpiry: '2025-06-30',
        features: ['refrigerated', 'urban-delivery'],
        location: { lat: -26.1959, lng: 28.0311 },
      },
    ];

    setTimeout(() => {
      setVehicles(mockVehicles);
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const columns: TableColumn[] = [
    {
      header: 'Vehicle',
      key: 'registrationNumber',
      label: 'Vehicle',

      accessor: (row: unknown) => (row as Vehicle).registrationNumber,
    },
    {
      header: 'Type',
      key: 'type',
      label: 'Type',

      accessor: (row: unknown) => (row as Vehicle).type,
    },
    {
      header: 'Capacity',
      key: 'capacity',
      label: 'Capacity',

      accessor: (row: unknown) => (row as Vehicle).capacity,
    },
    {
      header: 'Status',
      key: 'status',
      label: 'Status',


      accessor: (row: unknown) => (row as Vehicle).status,
    },
    {
      header: 'Current Driver',
      key: 'currentDriver',
      label: 'Current Driver',


      accessor: (row: unknown) => (row as Vehicle).currentDriver,
    },
    {
      header: 'Next Maintenance',
      key: 'nextMaintenance',
      label: 'Next Maintenance',


      accessor: (row: unknown) => (row as Vehicle).nextMaintenance,
    },
    {
      header: 'Features',
      key: 'features',
      label: 'Features',


      accessor: (row: unknown) => (row as Vehicle).features,
    },
    {
      header: 'Actions',
      key: 'id',
      label: 'Actions',


      accessor: (row: unknown) => (row as Vehicle).id,
    },
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Vehicle Management</h2>
          <p className="text-gray-600">Manage your fleet of delivery vehicles</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Vehicle
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{vehicles.filter(v => v.status === 'active').length}</div>
            <p className="text-sm text-gray-600">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{vehicles.filter(v => v.status === 'available').length}</div>
            <p className="text-sm text-gray-600">Available</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{vehicles.filter(v => v.status === 'maintenance').length}</div>
            <p className="text-sm text-gray-600">Maintenance</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-600">{vehicles.length}</div>
            <p className="text-sm text-gray-600">Total Vehicles</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search vehicles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={(value: VehicleStatus | 'all') => setStatusFilter(value)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="out-of-service">Out of Service</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable>
            <TableHeader>
              <TableRow>
                {columns.map((col) => (
                  <TableHead key={col.key}>{col.header || col.title}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVehicles.map((vehicle, index) => (
                <TableRow key={index}>
                  {columns.map((col) => (
                    <TableCell key={col.key}>
                      {col.accessor ? (col.accessor(vehicle) as ReactNode) : (((vehicle as unknown) as Record<string, unknown>)?.[col.dataIndex || col.key] as string || '') as ReactNode}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </DataTable>
        </CardContent>
      </Card>
    </div>
  );
}
