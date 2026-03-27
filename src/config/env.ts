// src/config/env.ts
// Centralized and validated environment configuration

import { z } from 'zod';

// Environment variable schema with validation
const envSchema = z.object({
  // Application
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
  NEXT_PUBLIC_APP_NAME: z.string().default('Maroon Traceability Demo'),
  NEXT_PUBLIC_APP_DESCRIPTION: z.string().default('Blockchain-based product traceability system'),
  
  // Supabase (only for registration feature)
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  
  // Blockchain
  NEXT_PUBLIC_BLOCKCHAIN_NETWORK: z.string().default('testnet'),
  NEXT_PUBLIC_BLOCKCHAIN_RPC_URL: z.string().url().optional(),
  
  // Features
  NEXT_PUBLIC_ENABLE_ANALYTICS: z.string().transform(Boolean).default(false),
  NEXT_PUBLIC_ENABLE_REALTIME: z.string().transform(Boolean).default(true),
  NEXT_PUBLIC_ENABLE_OFFLINE: z.string().transform(Boolean).default(true),
  
  // Development
  NEXT_PUBLIC_DEBUG_MODE: z.string().transform(Boolean).default(false),
  NEXT_PUBLIC_MOCK_DATA: z.string().transform(Boolean).default(true),
});

// Validate and export environment variables
export const env = envSchema.parse(process.env);

// Type-safe environment exports
export type Env = z.infer<typeof envSchema>;

// Feature flags
export const featureFlags = {
  supabase: Boolean(env.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  analytics: env.NEXT_PUBLIC_ENABLE_ANALYTICS,
  realtime: env.NEXT_PUBLIC_ENABLE_REALTIME,
  offline: env.NEXT_PUBLIC_ENABLE_OFFLINE,
  debug: env.NEXT_PUBLIC_DEBUG_MODE,
  mockData: env.NEXT_PUBLIC_MOCK_DATA,
} as const;

// Database configuration (only for registration)
export const databaseConfig = {
  supabase: {
    url: env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    serviceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY,
  },
} as const;

// API configuration
export const apiConfig = {
  baseUrl: env.NEXT_PUBLIC_APP_URL,
  timeout: 10000,
  retries: 3,
} as const;

// Blockchain configuration
export const blockchainConfig = {
  network: env.NEXT_PUBLIC_BLOCKCHAIN_NETWORK,
  rpcUrl: env.NEXT_PUBLIC_BLOCKCHAIN_RPC_URL,
} as const;
