// src/lib/mockDb.ts

interface MockProduct {
  id: string;
  createdAt: string;
  [key: string]: unknown;
}

interface MockEvent {
  id: string;
  type: string;
  data: unknown;
  timestamp: string;
}

// Mock database for demo purposes
export const mockDb = {
  products: [] as MockProduct[],
  events: [] as MockEvent[],

  async createProduct(productData: Record<string, unknown>) {
    const product = {
      id: `product_${Date.now()}`,
      ...productData,
      createdAt: new Date().toISOString(),
    };
    this.products.push(product);
    return product;
  },

  async getProduct(id: string) {
    return this.products.find(p => p.id === id);
  },

  async getAllProducts() {
    return this.products;
  },

  async queueEvent(eventType: string, eventData: Record<string, unknown>) {
    const event = {
      id: `event_${Date.now()}`,
      type: eventType,
      data: eventData,
      timestamp: new Date().toISOString(),
    };
    this.events.push(event);
    return event;
  },

  async createEvent(eventData: { type: string; [key: string]: unknown }) {
    const event = {
      id: `event_${Date.now()}`,
      type: eventData.type,
      data: eventData,
      timestamp: new Date().toISOString(),
    };
    this.events.push(event);
    return event;
  },
};
