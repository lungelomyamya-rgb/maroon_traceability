#!/usr/bin/env tsx

console.log('🧹 Starting Test Cleanup...');

// Test basic functionality
import fs from 'fs';
import path from 'path';

console.log('📁 Checking directories...');

const projectRoot = process.cwd();
console.log(`Project root: ${projectRoot}`);

// Check for build artifacts
const outDir = path.join(projectRoot, 'out');
const nextDir = path.join(projectRoot, '.next');

if (fs.existsSync(outDir)) {
  console.log(`✅ Found out directory: ${fs.statSync(outDir).size} bytes`);
} else {
  console.log('❌ No out directory found');
}

if (fs.existsSync(nextDir)) {
  console.log('✅ Found .next directory');
} else {
  console.log('❌ No .next directory found');
}

// Check for tsconfig.tsbuildinfo
const tsbuildinfo = path.join(projectRoot, 'tsconfig.tsbuildinfo');
if (fs.existsSync(tsbuildinfo)) {
  console.log('✅ Found tsconfig.tsbuildinfo');
} else {
  console.log('❌ No tsconfig.tsbuildinfo found');
}

console.log('✅ Test cleanup completed!');
