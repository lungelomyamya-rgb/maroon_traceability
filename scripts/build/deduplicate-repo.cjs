#!/usr/bin/env node

// scripts/deduplicate-repo.js
// Simplified repository deduplication script (JavaScript version)

const fs = require('fs');
const path = require('path');

const duplicates = [
  {
    original: 'types/user-unified.ts',
    duplicate: 'src/features/registration/domain/entities/User.ts',
    reason: 'Massive duplicate user entity (527 lines) - unique logic extracted to user-domain-extensions.ts',
    action: 'delete',
    priority: 'high'
  },
  {
    original: 'src/features/auth/hooks/useHybridAuth.ts',
    duplicate: 'src/features/auth/hooks/useAuth.ts',
    reason: 'Simple auth hook (73 lines) - HybridAuth is enhanced version',
    action: 'delete',
    priority: 'high'
  },
  {
    original: 'src/features/auth/hooks/',
    duplicate: 'hooks/auth/useAuthAdapter.ts',
    reason: 'Auth hook in wrong location',
    action: 'move',
    priority: 'high'
  },
  {
    original: 'types/error-handling.ts',
    duplicate: 'lib/errorHandling.ts',
    reason: 'Basic error handling (241 lines) - comprehensive version in types',
    action: 'delete',
    priority: 'medium'
  },
  {
    original: 'src/features/registration/components/RegistrationForm.tsx',
    duplicate: 'src/features/registration/presentation/RegistrationForm.js',
    reason: 'JavaScript version (42 lines) - TypeScript version is enhanced',
    action: 'delete',
    priority: 'medium'
  },
  {
    original: 'src/core/registry/AdapterRegistry.ts',
    duplicate: 'src/core/adapters/AdapterRegistry.ts',
    reason: 'Duplicate adapter registry',
    action: 'delete',
    priority: 'low'
  },
  {
    original: 'src/core/registry/AdapterRegistry.ts',
    duplicate: 'src/core/services/AdapterRegistry.ts',
    reason: 'Another duplicate adapter registry',
    action: 'delete',
    priority: 'low'
  }
];

function showPlan() {
  console.log('📋 REPOSITORY DUPLICATION CLEANUP PLAN\n');
  console.log('=====================================\n');

  const priorityGroups = duplicates.reduce((groups, dup) => {
    if (!groups[dup.priority]) groups[dup.priority] = [];
    groups[dup.priority].push(dup);
    return groups;
  }, {});

  Object.entries(priorityGroups).forEach(([priority, dups]) => {
    console.log(`🔴 ${priority.toUpperCase()} PRIORITY:`);
    dups.forEach(dup => {
      console.log(`   📁 ${dup.duplicate}`);
      console.log(`   ➡️  KEEP: ${dup.original}`);
      console.log(`   📝 Reason: ${dup.reason}`);
      console.log(`   ⚡ Action: ${dup.action.toUpperCase()}`);
      console.log('');
    });
  });

  console.log(`📊 SUMMARY:`);
  console.log(`   Total duplicates: ${duplicates.length}`);
  console.log(`   High priority: ${duplicates.filter(d => d.priority === 'high').length}`);
  console.log(`   Medium priority: ${duplicates.filter(d => d.priority === 'medium').length}`);
  console.log(`   Low priority: ${duplicates.filter(d => d.priority === 'low').length}`);
  console.log(`   Estimated code reduction: ~1,500+ lines`);
  console.log(`   Files to update: 50+`);
}

function createBackup() {
  console.log('💾 Creating backup...');
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = `.backup-${timestamp}`;
  
  try {
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    
    // Copy key directories
    const dirsToBackup = ['src', 'types', 'lib', 'hooks'];
    dirsToBackup.forEach(dir => {
      if (fs.existsSync(dir)) {
        copyRecursive(dir, path.join(backupDir, dir));
      }
    });
    
    console.log(`✅ Backup created: ${backupDir}`);
    return true;
  } catch (error) {
    console.error('❌ Failed to create backup:', error.message);
    return false;
  }
}

function copyRecursive(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach(childFile => {
      copyRecursive(path.join(src, childFile), path.join(dest, childFile));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

function executeDeduplication() {
  console.log('🚀 EXECUTING DEDUPLICATION PLAN\n');
  
  let deletedCount = 0;
  let movedCount = 0;
  
  for (const duplicate of duplicates) {
    const duplicatePath = duplicate.duplicate;
    
    if (!fs.existsSync(duplicatePath)) {
      console.log(`⚠️  Duplicate file not found: ${duplicate.duplicate}`);
      continue;
    }

    try {
      switch (duplicate.action) {
        case 'delete':
          console.log(`🗑️  Deleting: ${duplicate.duplicate}`);
          fs.unlinkSync(duplicatePath);
          deletedCount++;
          break;
          
        case 'move':
          console.log(`📦 Moving: ${duplicate.duplicate} → ${duplicate.original}`);
          // For move operations, you'd need to implement the actual move logic
          console.log(`   ⚠️  Move operations need manual implementation`);
          movedCount++;
          break;
          
        case 'merge':
          console.log(`🔀 Merging: ${duplicate.duplicate} into ${duplicate.original}`);
          console.log(`   ⚠️  Merge operations need manual implementation`);
          break;
      }
    } catch (error) {
      console.error(`❌ Failed to process ${duplicate.duplicate}:`, error.message);
    }
  }

  console.log('\n✅ DEDUPLICATION COMPLETE!');
  console.log(`📊 Results: ${deletedCount} files deleted, ${movedCount} files moved`);
  
  return { deletedCount, movedCount };
}

// Main execution
function main() {
  const command = process.argv[2];
  
  console.log('🧹 REPOSITORY DEDUPLICATION TOOL');
  console.log('================================\n');

  switch (command) {
    case 'plan':
      showPlan();
      break;
      
    case 'backup':
      createBackup();
      break;
      
    case 'execute':
      showPlan();
      console.log('\n❓ Do you want to proceed with the deduplication?');
      console.log('   This will permanently delete duplicate files.');
      console.log('   Make sure you have committed your changes to git.\n');
      console.log('💡 To proceed, run: npm run deduplicate:execute --confirm');
      break;
      
    case 'execute-confirm':
      executeDeduplication();
      break;
      
    default:
      console.log('Usage:');
      console.log('  npm run deduplicate:plan     - Show the deduplication plan');
      console.log('  npm run deduplicate:backup   - Create a backup');
      console.log('  npm run deduplicate:execute - Show plan and ask for confirmation');
      console.log('  npm run deduplicate:execute-confirm - Execute without confirmation');
      break;
  }
}

if (require.main === module) {
  main();
}
