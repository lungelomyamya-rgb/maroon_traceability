// src/lib/mockDb.ts
import { Product, ProductEvent, QueueItem } from '@/types/database';

interface MockDB {
  products: Map<string, Product>;
  events: Map<string, ProductEvent>;
  queue: QueueItem[];
}
const db: MockDB = {
  products: new Map(),
  events: new Map(),
  queue: [],
};
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
export const mockDb = {
  async createProduct(data: Omit<Product, 'id' | 'createdAt'>): Promise<{ id: string }> {
    await delay(300);
    const id = `prod_${Date.now()}`;
    const product: Product = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
    };
    db.products.set(id, product);
    return { id };
  },
  async createEvent(data: Omit<ProductEvent, 'id' | 'timestamp'>): Promise<{ id: string }> {
    await delay(300);
    const id = `evt_${Date.now()}`;
    const event: ProductEvent = {
      ...data,
      id,
      timestamp: new Date().toISOString(),
    };
    db.events.set(id, event);
    return { id };
  },
  async queueEvent(type: string, data: unknown): Promise<{ id: string; queued: boolean }> {
    const id = `job_${Date.now()}`;
    db.queue.push({ id, type, data });
    return { id, queued: true };
  },

  async getProduct(id: string) {
    await delay(200);
    return db.products.get(id);
  },

  async getEventsForProduct(productId: string) {
    await delay(200);
    return Array.from(db.events.values()).filter(evt => evt.productId === productId);
  },

  getQueue() {
    return [...db.queue];
  },

  shiftQueue() {
    return db.queue.shift();
  },

  clearQueue() {
    db.queue = [];
  }
};