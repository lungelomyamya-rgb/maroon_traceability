#!/usr/bin/env node

// scripts/structural-deduplication.cjs
// Structural deduplication script for remaining repository issues

const fs = require('fs');
const path = require('path');

const structuralIssues = [
  {
    type: 'context-duplication',
    description: 'Authentication context duplication',
    files: {
      delete: ['contexts/authContext.tsx'],
      keep: ['contexts/userContext.tsx'],
      reason: 'userContext.tsx is more comprehensive with backward compatibility'
    },
    priority: 'high'
  },
  {
    type: 'component-scattered',
    description: 'Components scattered across multiple locations',
    actions: [
      {
        from: 'src/features/shared/ui/',
        to: 'src/components/ui/',
        action: 'move'
      },
      {
        from: 'src/features/shared/components/',
        to: 'src/components/forms/',
        action: 'move'
      },
      {
        from: 'components/index.tsx',
        to: 'src/components/layout/index.tsx',
        action: 'move'
      }
    ],
    priority: 'high'
  },
  {
    type: 'hook-consolidation',
    description: 'Multiple auth hook implementations',
    files: {
      evaluate: [
        'src/features/auth/hooks/useAuthAdapter.ts',
        'src/features/auth/hooks/useDecoupledAuth.ts'
      ],
      keep: ['src/features/auth/hooks/useHybridAuth.ts'],
      reason: 'useHybridAuth.ts is the most comprehensive implementation'
    },
    priority: 'medium'
  },
  {
    type: 'empty-directories',
    description: 'Empty hook directories',
    directories: [
      'hooks/auth/',
      'hooks/api/',
      'hooks/blockchain/',
      'hooks/cards/',
      'hooks/dashboard/',
      'hooks/data/',
      'hooks/errorBoundary/',
      'hooks/events/',
      'hooks/farmer/',
      'hooks/forms/',
      'hooks/inspector/',
      'hooks/layout/',
      'hooks/logistics/',
      'hooks/marketplace/',
      'hooks/monitoring/',
      'hooks/packaging/',
      'hooks/performance/',
      'hooks/products/',
      'hooks/assets/',
      'hooks/qr/',
      'hooks/retailer/',
      'hooks/retailers/',
      'hooks/search/',
      'hooks/shared/',
      'hooks/sync/',
      'hooks/traceability/',
      'hooks/ui/',
      'hooks/user/'
    ],
    priority: 'low'
  }
];

function showPlan() {
  console.log('🏗️ STRUCTURAL DEDUPLICATION PLAN\n');
  console.log('==================================\n');

  structuralIssues.forEach((issue, index) => {
    console.log(`${index + 1}. ${issue.description.toUpperCase()}`);
    console.log(`   Priority: ${issue.priority.toUpperCase()}`);
    
    if (issue.files) {
      if (issue.files.delete) {
        console.log(`   🗑️  DELETE: ${issue.files.delete.join(', ')}`);
      }
      if (issue.files.keep) {
        console.log(`   ✅ KEEP: ${issue.files.keep.join(', ')}`);
      }
      if (issue.files.evaluate) {
        console.log(`   🔍 EVALUATE: ${issue.files.evaluate.join(', ')}`);
      }
    }
    
    if (issue.actions) {
      issue.actions.forEach(action => {
        console.log(`   📦 ${action.action.toUpperCase()}: ${action.from} → ${action.to}`);
      });
    }
    
    if (issue.directories) {
      console.log(`   🧹 REMOVE EMPTY: ${issue.directories.length} directories`);
    }
    
    console.log('');
  });

  console.log('📊 SUMMARY:');
  console.log(`   Total issues: ${structuralIssues.length}`);
  console.log(`   High priority: ${structuralIssues.filter(i => i.priority === 'high').length}`);
  console.log(`   Medium priority: ${structuralIssues.filter(i => i.priority === 'medium').length}`);
  console.log(`   Low priority: ${structuralIssues.filter(i => i.priority === 'low').length}`);
}

function createBackup() {
  console.log('💾 Creating structural backup...');
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = `.structural-backup-${timestamp}`;
  
  try {
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    
    // Backup key directories for structural changes
    const dirsToBackup = ['contexts', 'components', 'src/features/shared', 'hooks', 'src/features/auth/hooks'];
    dirsToBackup.forEach(dir => {
      if (fs.existsSync(dir)) {
        copyRecursive(dir, path.join(backupDir, dir));
      }
    });
    
    console.log(`✅ Structural backup created: ${backupDir}`);
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

function executeStructuralDeduplication() {
  console.log('🚀 EXECUTING STRUCTURAL DEDUPLICATION\n');
  
  let deletedCount = 0;
  let movedCount = 0;
  let createdCount = 0;
  
  for (const issue of structuralIssues) {
    console.log(`\n🔧 Processing: ${issue.description}`);
    
    try {
      switch (issue.type) {
        case 'context-duplication':
          if (issue.files.delete) {
            issue.files.delete.forEach(file => {
              if (fs.existsSync(file)) {
                console.log(`   🗑️  Deleting: ${file}`);
                fs.unlinkSync(file);
                deletedCount++;
              }
            });
          }
          break;
          
        case 'component-scattered':
          // Create target directories
          if (issue.actions) {
            issue.actions.forEach(action => {
              if (action.action === 'move') {
                const targetDir = path.dirname(action.to);
                if (!fs.existsSync(targetDir)) {
                  console.log(`   📁 Creating: ${targetDir}`);
                  fs.mkdirSync(targetDir, { recursive: true });
                  createdCount++;
                }
                
                if (fs.existsSync(action.from)) {
                  console.log(`   📦 Moving: ${action.from} → ${action.to}`);
                  fs.renameSync(action.from, action.to);
                  movedCount++;
                }
              }
            });
          }
          break;
          
        case 'empty-directories':
          if (issue.directories) {
            issue.directories.forEach(dir => {
              if (fs.existsSync(dir) && fs.readdirSync(dir).length === 0) {
                console.log(`   🧹 Removing empty: ${dir}`);
                fs.rmdirSync(dir);
                deletedCount++;
              }
            });
          }
          break;
      }
    } catch (error) {
      console.error(`   ❌ Failed to process ${issue.description}:`, error.message);
    }
  }

  console.log('\n✅ STRUCTURAL DEDUPLICATION COMPLETE!');
  console.log(`📊 Results: ${deletedCount} files/directories deleted, ${movedCount} moved, ${createdCount} created`);
  
  console.log('\n📝 NEXT STEPS:');
  console.log('1. Update import statements in affected files');
  console.log('2. Run TypeScript compilation check');
  console.log('3. Update barrel exports if needed');
  console.log('4. Test application functionality');
  
  return { deletedCount, movedCount, createdCount };
}

// Main execution
function main() {
  const command = process.argv[2];
  
  console.log('🏗️ STRUCTURAL DEDUPLICATION TOOL');
  console.log('===============================\n');

  switch (command) {
    case 'plan':
      showPlan();
      break;
      
    case 'backup':
      createBackup();
      break;
      
    case 'execute':
      showPlan();
      console.log('\n❓ Do you want to proceed with structural deduplication?');
      console.log('   This will reorganize your repository structure.');
      console.log('   Make sure you have committed your changes to git.\n');
      console.log('💡 To proceed, run: npm run structural:dedup --confirm');
      break;
      
    case 'execute-confirm':
      executeStructuralDeduplication();
      break;
      
    default:
      console.log('Usage:');
      console.log('  npm run structural:dedup plan     - Show structural deduplication plan');
      console.log('  npm run structural:dedup backup   - Create a backup');
      console.log('  npm run structural:dedup execute  - Show plan and ask for confirmation');
      console.log('  npm run structural:dedup execute-confirm - Execute without confirmation');
      break;
  }
}

if (require.main === module) {
  main();
}
