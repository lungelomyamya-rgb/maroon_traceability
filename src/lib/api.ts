// src/lib/api.ts
import { mockDb } from './mockDb';
import { Product } from '@/types/database';
import { mockBlockchain } from './mockBlockchain';
import { ProductEvent } from '@/types/database';
import { ProductFormData } from './validation';

export async function createProduct(productData: ProductFormData) {
  if (navigator.onLine) {
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
export async function createEvent(eventData: Omit<ProductEvent, 'id' | 'timestamp'>) {
  if (navigator.onLine) {
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