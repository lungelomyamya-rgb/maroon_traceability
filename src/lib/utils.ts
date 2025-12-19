// src/lib/utils.ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateBlockHash(): string {
  return '0x' + Math.random().toString(16).substr(2, 40);
}

export function generateAddress(): string {
  return '0x' + Math.random().toString(16).substr(2, 40);
}

export function generateBlockId(currentLength: number): string {
  return `BLK${String(currentLength + 1).padStart(3, '0')}`;
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString();
}

export function formatDateTime(date: string | number): string {
  return new Date(date).toLocaleString();
}