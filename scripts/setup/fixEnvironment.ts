#!/usr/bin/env tsx

// Environment Setup Script
// This script helps fix common environment variable issues

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const ENV_EXAMPLE_PATH = join(process.cwd(), '.env.example');
const ENV_LOCAL_PATH = join(process.cwd(), '.env.local');

console.log('🔧 Fixing Environment Configuration...\n');

// Check if .env.example exists
if (!existsSync(ENV_EXAMPLE_PATH)) {
  console.error('❌ .env.example file not found!');
  process.exit(1);
}

// Read .env.example
const envExample = readFileSync(ENV_EXAMPLE_PATH, 'utf-8');
console.log('✅ Found .env.example');

// Check if .env.local exists
if (!existsSync(ENV_LOCAL_PATH)) {
  console.log('📝 Creating .env.local from .env.example...');
  
  // Create .env.local with proper formatting
  const envLocal = envExample
    .split('\n')
    .filter(line => line.trim() && !line.trim().startsWith('#'))
    .map(line => {
      // Ensure proper formatting
      const trimmed = line.trim();
      if (trimmed.includes('=') && !trimmed.startsWith('NEXT_PUBLIC_') && !trimmed.startsWith('SUPABASE_')) {
        return `# ${trimmed}`;
      }
      return trimmed;
    })
    .join('\n');

  writeFileSync(ENV_LOCAL_PATH, envLocal);
  console.log('✅ Created .env.local');
} else {
  console.log('✅ .env.local already exists');
  
  // Read current .env.local
  const currentEnvLocal = readFileSync(ENV_LOCAL_PATH, 'utf-8');
  
  // Check for common issues
  const issues = [];
  
  if (!currentEnvLocal.includes('NEXT_PUBLIC_SUPABASE_URL')) {
    issues.push('Missing NEXT_PUBLIC_SUPABASE_URL');
  }
  
  if (!currentEnvLocal.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY')) {
    issues.push('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }
  
  if (currentEnvLocal.includes('NEXT_PUBLIC_SUPABASE_URL=\\"\\\\"')) {
    issues.push('Invalid NEXT_PUBLIC_SUPABASE_URL format (contains backslashes)');
  }
  
  if (issues.length > 0) {
    console.log('⚠️  Issues found in .env.local:');
    issues.forEach(issue => console.log(`   - ${issue}`));
    
    console.log('\n🔧 Attempting to fix issues...');
    
    // Fix common issues
    let fixedEnv = currentEnvLocal;
    
    // Fix invalid URL format
    fixedEnv = fixedEnv.replace(/NEXT_PUBLIC_SUPABASE_URL=\\"\\\\\\"/g, 'NEXT_PUBLIC_SUPABASE_URL="https://lzgglzgdgkgrxzbjevzy.supabase.co"');
    
    // Ensure proper Supabase configuration
    if (!fixedEnv.includes('NEXT_PUBLIC_SUPABASE_URL=')) {
      fixedEnv += '\nNEXT_PUBLIC_SUPABASE_URL="https://lzgglzgdgkgrxzbjevzy.supabase.co"';
    }
    
    if (!fixedEnv.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) {
      fixedEnv += '\nNEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6Z2dsemdkZ2tncnh6Ympldnp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyMDk5NTksImV4cCI6MjA4NTc4NTk1OX0.xHvSfID9wtq0FVC4clLH8TmheJE-jPtfKIq2qXfmDFk"';
    }
    
    writeFileSync(ENV_LOCAL_PATH, fixedEnv);
    console.log('✅ Fixed .env.local issues');
  } else {
    console.log('✅ .env.local looks good');
  }
}

console.log('\n🎉 Environment configuration fixed!');
console.log('\n📋 Next steps:');
console.log('1. Restart your development server: npm run dev');
console.log('2. Check the console for any remaining errors');
console.log('3. Verify Supabase connection in the debug logs');

// Test environment variables
console.log('\n🧪 Testing environment variables...');
try {
  // Load environment variables for testing
  const { config } = await import('dotenv');
  const testEnv = config({ path: ENV_LOCAL_PATH });

  if (testEnv.error) {
    console.error('❌ Error loading .env.local:', testEnv.error);
  } else {
    console.log('✅ Environment variables loaded successfully');
    
    // Check specific variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (supabaseUrl && supabaseKey) {
      console.log('✅ Supabase configuration found');
      
      // Test URL validity
      try {
        new URL(supabaseUrl);
        console.log('✅ Supabase URL is valid');
      } catch {
        console.log('❌ Supabase URL is invalid');
      }
    } else {
      console.log('❌ Supabase configuration missing');
    }
  }
} catch (error) {
  console.log('⚠️  Could not test environment variables (dotenv not available)');
}
