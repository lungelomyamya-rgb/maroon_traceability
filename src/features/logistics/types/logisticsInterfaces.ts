export type DriverStatus = 'available' | 'on-delivery' | 'unavailable' | 'offline';
export type VehicleStatus = 'active' | 'maintenance' | 'out-of-service' | 'available';
export type TransportStatus = 'scheduled' | 'in-transit' | 'delivered' | 'delayed' | 'cancelled';
export type DocumentType = 'bill-of-lading' | 'delivery-confirmation' | 'vehicle-inspection' | 'driver-certification' | 'insurance' | 'registration';

export interface Vehicle {
  id: string;
  registrationNumber: string;
  make: string;
  model: string;
  year: number;
  type: 'truck' | 'van' | 'refrigerated' | 'flatbed';
  capacity: number; // in kg
  status: VehicleStatus;
  currentDriver?: string;
  lastMaintenance: string;
  nextMaintenance: string;
  insuranceExpiry: string;
  registrationExpiry: string;
  features: string[]; // e.g., ['refrigerated', 'gps-tracking', 'temperature-control']
  location?: {
    lat: number;
    lng: number;
  };
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  email: string;
  licenseNumber: string;
  licenseExpiry: string;
  certifications: string[];
  status: DriverStatus;
  currentVehicle?: string;
  currentLocation?: {
    lat: number;
    lng: number;
  };
  experience: number; // years
  rating: number; // 1-5
  totalDeliveries: number;
  onTimeDeliveryRate: number;
}

export interface TransportSchedule {
  id: string;
  vehicleId: string;
  driverId: string;
  productId: string;
  route: {
    origin: {
      name: string;
      address: string;
      lat: number;
      lng: number;
      contact: string;
    };
    destination: {
      name: string;
      address: string;
      lat: number;
      lng: number;
      contact: string;
    };
    waypoints?: Array<{
      name: string;
      address: string;
      lat: number;
      lng: number;
    }>;
  };
  scheduledDate: string;
  estimatedDuration: number; // in minutes
  actualDuration?: number;
  status: TransportStatus;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  cargoDetails: {
    weight: number;
    volume: number;
    temperatureRequirements?: string;
    specialHandling?: string[];
  };
  documents: TransportDocument[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransportDocument {
  id: string;
  type: DocumentType;
  title: string;
  fileUrl?: string;
  uploadedAt: string;
  uploadedBy: string;
  status: 'pending' | 'approved' | 'rejected';
  metadata?: {
    billOfLadingNumber?: string;
    deliveryConfirmationNumber?: string;
    inspectionDate?: string;
    certificateNumber?: string;
  };
}

export interface Location {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  type: 'pickup' | 'delivery' | 'warehouse' | 'truck';
  status?: 'pending' | 'in-transit' | 'delivered' | 'delayed';
  assignedDriver?: string | null;
  deliveryTime?: string | null;
  notes?: string;
  driver?: string;
  estimatedArrival?: string;
}

export interface LogisticsMapProps {
  center: { lat: number; lng: number };
  zoom: number;
  locations: Location[];
  drivers: Driver[];
  vehicles: Vehicle[];
  schedules: TransportSchedule[];
  selectedLocation?: Location | null;
  onLocationSelect: (location: Location) => void;
  onOptimizeRoute?: () => void;
  onAssignDriver?: (location: Location) => void;
  onConfirmDelivery?: (location: Location) => void;
}
