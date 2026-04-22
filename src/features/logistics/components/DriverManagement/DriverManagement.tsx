'use client';

import { Plus, Search } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DataTable, TableColumn, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Driver, DriverStatus } from '@/types/logistics';

interface DriverManagementProps {
  className?: string;
}

export function DriverManagement({ className }: DriverManagementProps) {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<DriverStatus | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Mock data - in real app, this would come from API
  useEffect(() => {
    const mockDrivers: Driver[] = [
      {
        id: 'driver-001',
        name: 'John Smith',
        phone: '+27 83 123 4567',
        email: 'john.smith@logistics.co.za',
        licenseNumber: 'DL123456789',
        licenseExpiry: '2025-12-31',
        certifications: ['HAZMAT', 'Refrigerated Transport', 'Defensive Driving'],
        status: 'available',
        experience: 8,
        rating: 4.8,
        totalDeliveries: 1247,
        onTimeDeliveryRate: 96.5,
        currentLocation: { lat: -33.9249, lng: 18.4241 },
        lastMaintenance: '2024-01-15',
        nextMaintenance: '2024-07-15',
        insuranceExpiry: '2025-06-30',
      },
      {
        id: 'driver-002',
        name: 'Maria Rodriguez',
        phone: '+27 72 234 5678',
        email: 'maria.rodriguez@logistics.co.za',
        licenseNumber: 'DL987654321',
        licenseExpiry: '2024-08-15',
        certifications: ['Refrigerated Transport', 'GPS Navigation'],
        status: 'on-delivery',
        experience: 5,
        rating: 4.6,
        totalDeliveries: 892,
        onTimeDeliveryRate: 94.2,
        currentVehicle: 'vehicle-002',
        currentLocation: { lat: -34.6037, lng: -58.3816 },
        lastMaintenance: '2024-02-10',
        nextMaintenance: '2024-08-10',
        insuranceExpiry: '2025-03-15',
      },
      {
        id: 'driver-003',
        name: 'Thabo Mbeki',
        phone: '+27 65 345 6789',
        email: 'thabo.mbeki@logistics.co.za',
        licenseNumber: 'DL456789123',
        licenseExpiry: '2026-03-20',
        certifications: ['Heavy Vehicle', 'International Transport', 'HAZMAT'],
        status: 'unavailable',
        experience: 12,
        rating: 4.9,
        totalDeliveries: 2156,
        onTimeDeliveryRate: 98.1,
        lastMaintenance: '2023-12-01',
        nextMaintenance: '2024-06-01',
        insuranceExpiry: '2025-09-30',
      },
    ];

    setTimeout(() => {
      setDrivers(mockDrivers);
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch = driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         driver.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         driver.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || driver.status === statusFilter;
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
      header: 'Driver',
      key: 'name',
      label: 'Driver',

      accessor: (row: unknown) => (row as Driver).name,
    },
    {
      header: 'Contact',
      key: 'phone',
      label: 'Contact',

      accessor: (row: unknown) => (row as Driver).phone,
    },
    {
      header: 'Status',
      key: 'status',
      label: 'Status',

      accessor: (row: unknown) => (row as Driver).status,
    },
    {
      header: 'Experience',
      key: 'experience',
      label: 'Experience',


      accessor: (row: unknown) => (row as Driver).experience,
    },
    {
      header: 'Rating',
      key: 'rating',
      label: 'Rating',


      accessor: (row: unknown) => (row as Driver).rating,
    },
    {
      header: 'Deliveries',
      key: 'totalDeliveries',
      label: 'Deliveries',


      accessor: (row: unknown) => (row as Driver).totalDeliveries,
    },
    {
      header: 'On-Time Rate',
      key: 'onTimeDeliveryRate',
      label: 'On-Time Rate',


      accessor: (row: unknown) => (row as Driver).onTimeDeliveryRate,
    },
    {
      header: 'Actions',
      key: 'id',
      label: 'Actions',


      accessor: (row: unknown) => (row as Driver).id,
    },
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Driver Management</h2>
          <p className="text-gray-600">Manage your fleet of professional drivers</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Driver
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{drivers.filter(d => d.status === 'available').length}</div>
            <p className="text-sm text-gray-600">Available</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{drivers.filter(d => d.status === 'on-delivery').length}</div>
            <p className="text-sm text-gray-600">On Delivery</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-600">{drivers.length}</div>
            <p className="text-sm text-gray-600">Total Drivers</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">
              {(drivers.reduce((acc, d) => acc + d.onTimeDeliveryRate, 0) / drivers.length).toFixed(1)}%
            </div>
            <p className="text-sm text-gray-600">Avg On-Time Rate</p>
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
                placeholder="Search drivers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={(value: DriverStatus | 'all') => setStatusFilter(value)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="on-delivery">On Delivery</SelectItem>
                <SelectItem value="unavailable">Unavailable</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
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
              {filteredDrivers.map((driver, index) => (
                <TableRow key={index}>
                  {columns.map((col) => (
                    <TableCell key={col.key}>
                      {col.accessor ? (col.accessor(driver) as ReactNode) : (((driver as unknown) as Record<string, unknown>)?.[col.dataIndex || col.key] as string || '') as ReactNode}
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
