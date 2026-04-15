// Retailers Feature Types
export interface Retailer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  businessType: string;
}

export interface Order {
  id: string;
  retailerId: string;
  products: OrderItem[];
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  orderDate: Date;
  deliveryDate?: Date;
}

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  loyaltyPoints: number;
}
