// src/services/realtime.ts

export interface RealtimeEvent {
  type: string;
  data: unknown;
  timestamp: number;
}

export type EventCallback = (event: RealtimeEvent) => void;

export class RealtimeService {
  private static instance: RealtimeService;
  private listeners: Map<string, EventCallback[]> = new Map();
  private mockInterval: NodeJS.Timeout | null = null;
  private isRunning = false;

  static getInstance(): RealtimeService {
    if (!RealtimeService.instance) {
      RealtimeService.instance = new RealtimeService();
    }
    return RealtimeService.instance;
  }

  constructor() {
    this.startMockActivity();
  }

  private startMockActivity() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.mockInterval = setInterval(() => {
      this.generateMockEvent();
    }, 3000 + Math.random() * 4000); // Random interval between 3-7 seconds
  }

  private stopMockActivity() {
    if (this.mockInterval) {
      clearInterval(this.mockInterval);
      this.mockInterval = null;
    }
    this.isRunning = false;
  }

  private generateMockEvent() {
    const eventTypes = [
      'product_update',
      'verification_update', 
      'blockchain_update',
      'new_product',
      'quality_check',
      'shipment_update'
    ];

    const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    let mockData: any;

    switch (eventType) {
      case 'product_update':
        mockData = {
          productId: `PRD-2024-${String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}`,
          status: Math.random() > 0.5 ? 'verified' : 'pending',
          timestamp: new Date().toISOString()
        };
        break;

      case 'verification_update':
        mockData = {
          productId: `PRD-2024-${String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}`,
          verificationCount: Math.floor(Math.random() * 10) + 1,
          verifiedBy: ['Inspector', 'Retailer', 'Consumer'][Math.floor(Math.random() * 3)],
          timestamp: new Date().toISOString()
        };
        break;

      case 'blockchain_update':
        mockData = {
          blockNumber: Math.floor(Math.random() * 100000) + 1700000,
          transactionCount: Math.floor(Math.random() * 50) + 1,
          timestamp: new Date().toISOString()
        };
        break;

      case 'new_product':
        const products = ['Organic Apples', 'Free Range Eggs', 'Artisanal Cheese', 'Fresh Vegetables', 'Grass-fed Beef'];
        mockData = {
          productId: `PRD-2024-${String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}`,
          productName: products[Math.floor(Math.random() * products.length)],
          farmer: ['Green Valley Farm', 'Sunny Acres', 'Happy Farms', 'Organic Haven'][Math.floor(Math.random() * 4)],
          timestamp: new Date().toISOString()
        };
        break;

      case 'quality_check':
        mockData = {
          productId: `PRD-2024-${String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}`,
          quality: ['Grade A+', 'Grade A', 'Grade B'][Math.floor(Math.random() * 3)],
          inspector: ['John Smith', 'Jane Doe', 'Mike Johnson'][Math.floor(Math.random() * 3)],
          timestamp: new Date().toISOString()
        };
        break;

      case 'shipment_update':
        mockData = {
          productId: `PRD-2024-${String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}`,
          status: ['In Transit', 'Delivered', 'Processing'][Math.floor(Math.random() * 3)],
          location: ['Cape Town', 'Johannesburg', 'Durban', 'Pretoria'][Math.floor(Math.random() * 4)],
          timestamp: new Date().toISOString()
        };
        break;

      default:
        mockData = { message: 'Mock event', timestamp: new Date().toISOString() };
    }

    this.emit(eventType, mockData);
  }

  subscribe(eventType: string, callback: EventCallback): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    
    const callbacks = this.listeners.get(eventType)!;
    callbacks.push(callback);

    // Return unsubscribe function
    return () => {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    };
  }

  subscribeToAll(callback: EventCallback): () => void {
    return this.subscribe('*', callback);
  }

  getConnectionStatus(): boolean {
    return this.isRunning; // Return actual mock connection status
  }

  // Control methods for mock activity
  enableMockActivity() {
    this.startMockActivity();
  }

  disableMockActivity() {
    this.stopMockActivity();
  }

  // Generate specific events for testing
  generateTestEvent(eventType: string, customData?: any) {
    if (customData) {
      this.emit(eventType, customData);
    } else {
      this.generateMockEvent();
    }
  }

  emit(eventType: string, data: unknown): void {
    const event: RealtimeEvent = {
      type: eventType,
      data,
      timestamp: Date.now()
    };

    // Send to specific listeners
    const specificListeners = this.listeners.get(eventType);
    if (specificListeners) {
      specificListeners.forEach(callback => callback(event));
    }

    // Send to all listeners
    const allListeners = this.listeners.get('*');
    if (allListeners) {
      allListeners.forEach(callback => callback(event));
    }
  }
}

export const realtime = RealtimeService.getInstance();
