// src/lib/mockDb.ts

// Mock database for demo purposes
export const mockDb = {
  products: [] as any[],
  events: [] as any[],
  
  async createProduct(productData: any) {
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

  async queueEvent(eventType: string, eventData: any) {
    const event = {
      id: `event_${Date.now()}`,
      type: eventType,
      data: eventData,
      timestamp: new Date().toISOString(),
    };
    this.events.push(event);
    return event;
  },

  async createEvent(eventData: any) {
    const event = {
      id: `event_${Date.now()}`,
      type: eventData.type,
      data: eventData,
      timestamp: new Date().toISOString(),
    };
    this.events.push(event);
    return event;
  }
};
