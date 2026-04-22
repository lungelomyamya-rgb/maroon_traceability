'use client';

import { Plus, Search } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DataTable, TableColumn, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { TransportSchedule, TransportStatus } from '@/types/logistics';

interface TransportSchedulingProps {
  className?: string;
}

export function TransportScheduling({ className }: TransportSchedulingProps) {
  const [schedules, setSchedules] = useState<TransportSchedule[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<TransportStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Mock data - in real app, this would come from API
  useEffect(() => {
    const mockSchedules: TransportSchedule[] = [
      {
        id: 'schedule-001',
        vehicleId: 'vehicle-001',
        driverId: 'driver-001',
        productId: 'product-001',
        route: {
          origin: {
            name: 'Green Valley Farm',
            address: '123 Farm Road, Cape Town',
            lat: -33.9249,
            lng: 18.4241,
            contact: '+27 21 123 4567',
          },
          destination: {
            name: 'Fresh Market Distribution',
            address: '456 Market Street, Johannesburg',
            lat: -26.1959,
            lng: 28.0311,
            contact: '+27 11 987 6543',
          },
        },
        scheduledDate: '2024-03-29T08:00:00Z',
        estimatedDuration: 480,
        status: 'scheduled',
        priority: 'high',
        cargoDetails: {
          weight: 15000,
          volume: 25,
          temperatureRequirements: 'refrigerated',
          specialHandling: ['fragile', 'perishable'],
        },
        documents: [],
        notes: 'Urgent delivery - premium customer',
        createdAt: '2024-03-28T10:00:00Z',
        updatedAt: '2024-03-28T10:00:00Z',
      },
      {
        id: 'schedule-002',
        vehicleId: 'vehicle-002',
        driverId: 'driver-002',
        productId: 'product-002',
        route: {
          origin: {
            name: 'Sunny Acres Farm',
            address: '789 Country Lane, Stellenbosch',
            lat: -33.9349,
            lng: 18.4341,
            contact: '+27 21 234 5678',
          },
          destination: {
            name: 'City Center Warehouse',
            address: '321 Warehouse Ave, Pretoria',
            lat: -25.7479,
            lng: 28.2293,
            contact: '+27 12 345 6789',
          },
        },
        scheduledDate: '2024-03-29T10:00:00Z',
        estimatedDuration: 360,
        status: 'in-transit',
        priority: 'medium',
        cargoDetails: {
          weight: 8000,
          volume: 15,
          temperatureRequirements: 'ambient',
          specialHandling: [],
        },
        documents: [],
        createdAt: '2024-03-27T14:00:00Z',
        updatedAt: '2024-03-28T09:00:00Z',
      },
    ];

    setTimeout(() => {
      setSchedules(mockSchedules);
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredSchedules = schedules.filter(schedule => {
    const matchesSearch = schedule.route.origin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         schedule.route.destination.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         schedule.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || schedule.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || schedule.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
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
      header: 'Schedule',
      key: 'id',
      label: 'Schedule',
      accessor: (row: unknown) => (row as TransportSchedule).id,
    },
    {
      header: 'Route',
      key: 'route',
      label: 'Route',
      accessor: (row: unknown) => {
        const schedule = row as TransportSchedule;
        return `${schedule.route.origin.name} → ${schedule.route.destination.name}`;
      },
    },
    {
      header: 'Status',
      key: 'status',
      label: 'Status',
      accessor: (row: unknown) => (row as TransportSchedule).status,
    },
    {
      header: 'Priority',
      key: 'priority',
      label: 'Priority',
      accessor: (row: unknown) => (row as TransportSchedule).priority,
    },
    {
      header: 'Cargo',
      key: 'cargoDetails',
      label: 'Cargo',
      accessor: (row: unknown) => {
        const schedule = row as TransportSchedule;
        return `${schedule.cargoDetails.weight}kg, ${schedule.cargoDetails.volume}m³`;
      },
    },
    {
      header: 'Duration',
      key: 'estimatedDuration',
      label: 'Duration',
      accessor: (row: unknown) => (row as TransportSchedule).estimatedDuration,
    },
    {
      header: 'Assignments',
      key: 'vehicleId',
      label: 'Assignments',
      accessor: (row: unknown) => (row as TransportSchedule).vehicleId,
    },
    {
      header: 'Actions',
      key: 'id',
      label: 'Actions',
      accessor: (row: unknown) => (row as TransportSchedule).id,
    },
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Transport Scheduling</h2>
          <p className="text-gray-600">Manage and monitor transport schedules</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Schedule
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{schedules.filter(s => s.status === 'scheduled').length}</div>
            <p className="text-sm text-gray-600">Scheduled</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{schedules.filter(s => s.status === 'in-transit').length}</div>
            <p className="text-sm text-gray-600">In Transit</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{schedules.filter(s => s.status === 'delivered').length}</div>
            <p className="text-sm text-gray-600">Delivered</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-600">{schedules.length}</div>
            <p className="text-sm text-gray-600">Total Schedules</p>
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
                placeholder="Search schedules..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={(value: TransportStatus | 'all') => setStatusFilter(value)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="in-transit">In Transit</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="delayed">Delayed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
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
              {filteredSchedules.map((schedule, index) => (
                <TableRow key={index}>
                  {columns.map((col) => (
                    <TableCell key={col.key}>
                      {col.accessor ? (col.accessor(schedule) as ReactNode) : (((schedule as unknown) as Record<string, unknown>)?.[col.dataIndex || col.key] as string || '') as ReactNode}
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
