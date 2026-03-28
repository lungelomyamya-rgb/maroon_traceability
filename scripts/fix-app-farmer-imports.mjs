#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// Fix app pages to import from feature components instead of relative paths
const MIGRATION_MAP = {
  '@/components/farmer/complianceStatus': '@/features/farmer/components/complianceStatus',
  '@/components/farmer/fertiliserLog': '@/features/farmer/components/fertiliserLog',
  '@/components/farmer/growthStageMonitor': '@/features/farmer/components/growthStageMonitor',
  '@/components/farmer/seedVarietyTracker': '@/features/farmer/components/seedVarietyTracker',
};

function findFilesToProcess() {
  try {
    const result = execSync('findstr /s /i "@/components/farmer/" app\\farmer\\*.tsx', { 
      encoding: 'utf8',
      cwd: process.cwd()
    });
    
    const files = new Set();
    result.split('\n').forEach(line => {
      const match = line.match(/^([^^:]+):/);
      if (match) {
        files.add(match[1]);
      }
    });
    
    return Array.from(files);
  } catch (error) {
    console.error('Error finding files:', error.message);
    return [];
  }
}

function processFile(filePath, dryRun = true) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let modifiedContent = content;
    let changesCount = 0;
    
    Object.entries(MIGRATION_MAP).forEach(([oldPath, newPath]) => {
      const regex = new RegExp(oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      const matches = content.match(regex);
      if (matches) {
        modifiedContent = modifiedContent.replace(regex, newPath);
        changesCount += matches.length;
      }
    });
    
    if (changesCount > 0) {
      if (dryRun) {
        console.log(`📄 Would modify: ${filePath}`);
        console.log(`   Changes: ${changesCount} import replacements`);
      } else {
        fs.writeFileSync(filePath, modifiedContent);
        console.log(`✅ Modified: ${filePath} (${changesCount} changes)`);
      }
    }
    
    return changesCount;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return 0;
  }
}

function main() {
  const args = process.argv.slice(2);
  const dryRun = !args.includes('--apply');
  
  console.log(dryRun ? '🔍 DRY RUN MODE' : '🚀 APPLY MODE');
  console.log('='.repeat(50));
  
  const filesToProcess = findFilesToProcess();
  console.log(`📁 Found ${filesToProcess.length} files to process`);
  
  let totalChanges = 0;
  let filesChanged = 0;
  
  filesToProcess.forEach(filePath => {
    const changes = processFile(filePath, dryRun);
    if (changes > 0) {
      totalChanges += changes;
      filesChanged++;
    }
  });
  
  console.log('='.repeat(50));
  console.log(`📊 Summary:`);
  console.log(`   Files to change: ${filesChanged}`);
  console.log(`   Total replacements: ${totalChanges}`);
  
  if (dryRun) {
    console.log('\n💡 To apply changes, run: node scripts/fix-app-farmer-imports.mjs --apply');
  } else {
    console.log('\n✅ App farmer imports fixed!');
  }
}

main();
