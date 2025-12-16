// src/lib/blockchain.ts
import { BlockchainRecord } from '@/types/blockchain';
import { NewProduct } from '@/types/product';
import { generateBlockHash, generateAddress, generateBlockId } from './utils';

export function createBlockchainRecord(
  product: NewProduct,
  currentRecordsLength: number,
  farmerName: string = 'Current Farm'
): BlockchainRecord {
  return {
    id: generateBlockId(currentRecordsLength),
    ...product,
    farmer: farmerName,
    farmerAddress: generateAddress(),
    blockHash: generateBlockHash(),
    timestamp: new Date().toISOString(),
    status: 'Certified',
    transactionFee: Math.random() * 0.005 + 0.001,
    verifications: 1,
  };
}

export function incrementVerification(record: BlockchainRecord): BlockchainRecord {
  return {
    ...record,
    verifications: record.verifications + 1,
  };
}