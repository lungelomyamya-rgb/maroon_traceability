// src/lib/api.ts
import { mockDb } from './mockDb';
import { mockBlockchain } from './mockBlockchain';
import { productEvent } from '@/types/database';
import { ProductFormData } from './validation';

export async function fetchWithProxy(url: string, options?: RequestInit): Promise<Response> {
  // Mock implementation for proxy requests
  console.log('Proxy request:', url, options);
  return new Response(JSON.stringify({ message: 'Proxy request received' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function createProduct(productData: ProductFormData) {
  if (typeof window !== 'undefined' && navigator.onLine) {
    try {
      await mockBlockchain.sendTransaction('createProduct', [productData]);
      return await mockDb.createProduct(productData);
    } catch (error) {
      console.error('Blockchain error:', error);
      throw new Error('Failed to create product on blockchain');
    }
  } else {
    return await mockDb.queueEvent('productCreate', productData);
  }
}
export async function createEvent(eventData: Omit<productEvent, 'id' | 'timestamp'>) {
  if (typeof window !== 'undefined' && navigator.onLine) {
    try {
      await mockBlockchain.sendTransaction('createEvent', [eventData]);
      return await mockDb.createEvent(eventData);
    } catch (error) {
      console.error('Blockchain error:', error);
      throw new Error('Failed to create event on blockchain');
    }
  } else {
    return await mockDb.queueEvent('eventCreate', eventData);
  }
}