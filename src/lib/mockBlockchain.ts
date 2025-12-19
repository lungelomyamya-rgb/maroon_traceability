// src/lib/mockBlockchain.ts
import { TransactionResponse } from '@/types/blockchain';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockBlockchain = {
  async sendTransaction(method: string, params: unknown[] = []): Promise<TransactionResponse> {
    await delay(500); // Simulate network delay
    
    // 10% chance of failure to simulate real-world conditions
    if (Math.random() < 0.1) {
      throw new Error('Blockchain transaction failed');
    }
    
    console.log(`Blockchain: ${method}`, params);
    return { success: true, txHash: `0x${Math.random().toString(16).substr(2, 64)}` };
  }
};