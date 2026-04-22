'use client';

import { Plus, Search } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DataTable, TableColumn, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { TransportDocument, DocumentType } from '@/types/logistics';

interface TransportDocumentationProps {
  className?: string;
}

export function TransportDocumentation({ className }: TransportDocumentationProps) {
  const [documents, setDocuments] = useState<TransportDocument[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<DocumentType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Mock data - in real app, this would come from API
  useEffect(() => {
    const mockDocuments: TransportDocument[] = [
      {
        id: 'doc-001',
        type: 'bill-of-lading',
        title: 'Bill of Lading - CA123456',
        fileUrl: '/documents/bol-ca123456.pdf',
        uploadedAt: '2024-03-28T10:00:00Z',
        uploadedBy: 'john.smith@logistics.co.za',
        status: 'approved',
        metadata: {
          billOfLadingNumber: 'BOL-2024-001',
        },
      },
      {
        id: 'doc-002',
        type: 'delivery-confirmation',
        title: 'Delivery Confirmation - Order #1234',
        fileUrl: '/documents/delivery-1234.pdf',
        uploadedAt: '2024-03-27T15:30:00Z',
        uploadedBy: 'maria.rodriguez@logistics.co.za',
        status: 'approved',
        metadata: {
          deliveryConfirmationNumber: 'DC-2024-1234',
        },
      },
      {
        id: 'doc-003',
        type: 'vehicle-inspection',
        title: 'Vehicle Inspection - GP789012',
        fileUrl: '/documents/inspection-gp789012.pdf',
        uploadedAt: '2024-03-26T09:15:00Z',
        uploadedBy: 'thabo.mbeki@logistics.co.za',
        status: 'pending',
        metadata: {
          inspectionDate: '2024-03-26',
        },
      },
      {
        id: 'doc-004',
        type: 'insurance',
        title: 'Insurance Policy - Fleet Coverage',
        fileUrl: '/documents/insurance-fleet.pdf',
        uploadedAt: '2024-03-25T14:20:00Z',
        uploadedBy: 'admin@logistics.co.za',
        status: 'approved',
        metadata: {},
      },
    ];

    setTimeout(() => {
      setDocuments(mockDocuments);
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || doc.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
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
      header: 'Document',
      key: 'title',
      label: 'Document',


      accessor: (row: unknown) => (row as TransportDocument).title,
    },
    {
      header: 'Type',
      key: 'type',
      label: 'Type',


      accessor: (row: unknown) => (row as TransportDocument).type,
    },
    {
      header: 'Status',
      key: 'status',
      label: 'Status',


      accessor: (row: unknown) => (row as TransportDocument).status,
    },
    {
      header: 'Uploaded By',
      key: 'uploadedBy',
      label: 'Uploaded By',


      accessor: (row: unknown) => (row as TransportDocument).uploadedBy,
    },
    {
      header: 'Upload Date',
      key: 'uploadedAt',
      label: 'Upload Date',


      accessor: (row: unknown) => (row as TransportDocument).uploadedAt,
    },
    {
      header: 'File',
      key: 'fileUrl',
      label: 'File',


      accessor: (row: unknown) => (row as TransportDocument).fileUrl,
    },
    {
      header: 'Actions',
      key: 'id',
      label: 'Actions',


      accessor: (row: unknown) => (row as TransportDocument).id,
    },
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Transport Documentation</h2>
          <p className="text-gray-600">Manage all transport-related documents</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Upload Document
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{documents.filter(d => d.status === 'approved').length}</div>
            <p className="text-sm text-gray-600">Approved</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{documents.filter(d => d.status === 'pending').length}</div>
            <p className="text-sm text-gray-600">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{documents.filter(d => d.status === 'rejected').length}</div>
            <p className="text-sm text-gray-600">Rejected</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-600">{documents.length}</div>
            <p className="text-sm text-gray-600">Total Documents</p>
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
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={(value: DocumentType | 'all') => setTypeFilter(value)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="bill-of-lading">Bill of Lading</SelectItem>
                <SelectItem value="delivery-confirmation">Delivery Confirmation</SelectItem>
                <SelectItem value="vehicle-inspection">Vehicle Inspection</SelectItem>
                <SelectItem value="driver-certification">Driver Certification</SelectItem>
                <SelectItem value="insurance">Insurance</SelectItem>
                <SelectItem value="registration">Registration</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
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
              {filteredDocuments.map((document, index) => (
                <TableRow key={index}>
                  {columns.map((col) => (
                    <TableCell key={col.key}>
                      {col.accessor ? (col.accessor(document) as ReactNode) : (((document as unknown) as Record<string, unknown>)?.[col.dataIndex || col.key] as string || '') as ReactNode}
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
