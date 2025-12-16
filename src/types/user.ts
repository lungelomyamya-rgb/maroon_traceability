// src/types/user.ts
export type UserRole = 'farmer' | 'retailer';

export interface User {
  role: UserRole;
  address?: string;
  name?: string;
}