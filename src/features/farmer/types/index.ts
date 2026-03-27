// Farmer Feature Types
export interface Farmer {
  id: string;
  name: string;
  email: string;
  phone: string;
  farm: Farm;
}

export interface Farm {
  id: string;
  name: string;
  location: string;
  size: number;
  certifications: string[];
}

export interface Product {
  id: string;
  name: string;
  category: string;
  batch: string;
  quantity: number;
  unit: string;
  plantingDate: Date;
  expectedHarvest: Date;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  validUntil: Date;
  status: 'active' | 'expired' | 'pending';
}
