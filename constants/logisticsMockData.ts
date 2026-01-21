// src/constants/logisticsMockData.ts
import { Vehicle, Driver, TransportSchedule, TransportDocument, DocumentType } from '@/types/logistics';

export const mockVehicles: Vehicle[] = [
  {
    id: 'veh1',
    registrationNumber: 'CA 123456',
    make: 'Mercedes-Benz',
    model: 'Actros 1845',
    year: 2022,
    type: 'truck',
    capacity: 28000,
    status: 'active',
    currentDriver: 'driver1',
    lastMaintenance: '2025-01-15',
    nextMaintenance: '2025-04-15',
    insuranceExpiry: '2025-12-31',
    registrationExpiry: '2026-03-31',
    features: ['GPS Tracking', 'Air Suspension', 'Sleeping Cabin'],
    location: { lat: -33.9249, lng: 18.4241 }
  },
  {
    id: 'veh2',
    registrationNumber: 'CA 789012',
    make: 'Isuzu',
    model: 'NPR 300',
    year: 2021,
    type: 'refrigerated',
    capacity: 3500,
    status: 'available',
    lastMaintenance: '2025-01-10',
    nextMaintenance: '2025-04-10',
    insuranceExpiry: '2025-11-30',
    registrationExpiry: '2026-02-28',
    features: ['Temperature Control', 'Refrigerated', 'GPS Tracking'],
    location: { lat: -33.8688, lng: 18.5058 }
  }
];

export const mockDrivers: Driver[] = [
  {
    id: 'driver1',
    name: 'John Smith',
    phone: '+27 83 123 4567',
    email: 'john.smith@logistics.co.za',
    licenseNumber: 'DL12345678901',
    licenseExpiry: '2025-12-31',
    certifications: ['Commercial Driver License', 'Refrigerated Goods', 'Food Safety Handling'],
    status: 'on-delivery',
    currentVehicle: 'veh1',
    currentLocation: { lat: -33.9249, lng: 18.4241 },
    experience: 8,
    rating: 4.8,
    totalDeliveries: 342,
    onTimeDeliveryRate: 96.5
  },
  {
    id: 'driver2',
    name: 'Maria Johnson',
    phone: '+27 82 987 6543',
    email: 'maria.j@logistics.co.za',
    licenseNumber: 'DL98765432109',
    licenseExpiry: '2026-03-15',
    certifications: ['Commercial Driver License', 'Hazardous Materials', 'Defensive Driving'],
    status: 'available',
    currentLocation: { lat: -33.8688, lng: 18.5058 },
    experience: 5,
    rating: 4.6,
    totalDeliveries: 189,
    onTimeDeliveryRate: 94.2
  }
];

export const mockDocuments: TransportDocument[] = [
  {
    id: 'doc-001',
    type: 'bill-of-lading' as DocumentType,
    title: 'Bill of Lading - BOL-2025-002',
    uploadedAt: '2025-01-22T14:30:00Z',
    uploadedBy: 'logistics-admin',
    status: 'approved',
    metadata: {
      billOfLadingNumber: 'BOL-2025-002'
    }
  },
  {
    id: 'doc-002',
    type: 'insurance' as DocumentType,
    title: 'Insurance Certificate',
    uploadedAt: '2025-01-22T14:30:00Z',
    uploadedBy: 'logistics-admin',
    status: 'approved'
  },
  {
    id: 'doc-003',
    type: 'delivery-confirmation' as DocumentType,
    title: 'Delivery Note',
    uploadedAt: '2025-01-23T16:45:00Z',
    uploadedBy: 'driver1',
    status: 'approved',
    metadata: {
      deliveryConfirmationNumber: 'DN-2025-003'
    }
  },
  {
    id: 'doc-004',
    type: 'bill-of-lading' as DocumentType,
    title: 'Proof of Delivery',
    uploadedAt: '2025-01-24T16:45:00Z',
    uploadedBy: 'driver1',
    status: 'approved',
    metadata: {
      billOfLadingNumber: 'POD-2025-003'
    }
  },
  {
    id: 'doc-005',
    type: 'vehicle-inspection' as DocumentType,
    title: 'Export Permit',
    uploadedAt: '2025-01-25T09:00:00Z',
    uploadedBy: 'logistics-admin',
    status: 'approved',
    metadata: {
      certificateNumber: 'EXP-2025-004'
    }
  },
  {
    id: 'doc-006',
    type: 'driver-certification' as DocumentType,
    title: 'Phytosanitary Certificate',
    uploadedAt: '2025-01-25T09:00:00Z',
    uploadedBy: 'logistics-admin',
    status: 'approved',
    metadata: {
      certificateNumber: 'PHY-2025-004'
    }
  }
];

export const mockSchedules: TransportSchedule[] = [
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
        name: 'Sunshine Orchard',
        address: '789 Orchard Way, Paarl',
        lat: -33.7543,
        lng: 18.5058,
        contact: '+27 82 345 6789'
      },
      destination: {
        name: 'Cape Town International Airport',
        address: 'Airport Road, Cape Town',
        lat: -33.9692,
        lng: 18.6010,
        contact: '+27 21 111 2222'
      }
    },
    scheduledDate: '2025-01-26T06:00:00Z',
    estimatedDuration: 90,
    status: 'in-transit',
    priority: 'medium',
    cargoDetails: {
      weight: 300,
      volume: 1,
      temperatureRequirements: '3-5°C',
      specialHandling: ['Standard', 'Fragile']
    },
    documents: [mockDocuments[0], mockDocuments[1]],
    notes: 'Mixed fruit cargo - careful handling required',
    createdAt: '2025-01-22T14:30:00Z',
    updatedAt: '2025-01-26T14:30:00Z'
  },
  {
    id: 'sched3',
    vehicleId: 'veh1',
    driverId: 'driver1',
    productId: 'PRD-2024-003',
    route: {
      origin: {
        name: 'Green Valley Farm',
        address: '123 Farm Road, Stellenbosch',
        lat: -33.9249,
        lng: 18.4241,
        contact: '+27 21 123 4567'
      },
      destination: {
        name: 'Johannesburg Market',
        address: '456 Market Street, Johannesburg',
        lat: -26.2041,
        lng: 28.0473,
        contact: '+27 11 234 5678'
      }
    },
    scheduledDate: '2025-01-24T10:00:00Z',
    estimatedDuration: 180,
    status: 'delivered',
    priority: 'low',
    cargoDetails: {
      weight: 800,
      volume: 4,
      temperatureRequirements: '4-6°C',
      specialHandling: ['Standard', 'Bulk']
    },
    documents: [mockDocuments[2], mockDocuments[3]],
    notes: 'Large shipment - successful delivery',
    createdAt: '2025-01-23T16:45:00Z',
    updatedAt: '2025-01-24T16:45:00Z'
  },
  {
    id: 'sched4',
    vehicleId: 'veh3',
    driverId: 'driver3',
    productId: 'PRD-2024-004',
    route: {
      origin: {
        name: 'Coastal Citrus Farm',
        address: '12 Coastal Road, Hermanus',
        lat: -34.4238,
        lng: 19.2344,
        contact: '+27 28 765 4321'
      },
      destination: {
        name: 'Port of Cape Town',
        address: 'Port Road, Cape Town',
        lat: -33.9249,
        lng: 18.4241,
        contact: '+27 21 555 1234'
      }
    },
    scheduledDate: '2025-01-27T14:00:00Z',
    estimatedDuration: 60,
    status: 'scheduled',
    priority: 'high',
    cargoDetails: {
      weight: 600,
      volume: 3,
      temperatureRequirements: '2-8°C',
      specialHandling: ['Refrigerated', 'Export Quality']
    },
    documents: [mockDocuments[4], mockDocuments[5]],
    notes: 'Export shipment - customs clearance pending',
    createdAt: '2025-01-25T09:00:00Z',
    updatedAt: '2025-01-25T09:00:00Z'
  }
];
