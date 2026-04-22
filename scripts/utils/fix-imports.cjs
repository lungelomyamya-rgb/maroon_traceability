#!/usr/bin/env node

// scripts/fix-imports.cjs
// Fix import paths after structural deduplication

const fs = require('fs');
const path = require('path');
const glob = require('glob');

const importReplacements = [
  {
    from: '@/src/features/shared/ui/',
    to: '@/components/ui/',
    description: 'UI components import path'
  },
  {
    from: '@/src/features/shared/components/',
    to: '@/components/forms/',
    description: 'Form components import path'
  },
  {
    from: 'contexts/authContext',
    to: 'contexts/userContext',
    description: 'Auth context import path'
  },
  {
    from: '@/contexts/authContext',
    to: '@/contexts/userContext',
    description: 'Auth context import path with alias'
  }
];

function fixImportsInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;
    
    importReplacements.forEach(replacement => {
      if (content.includes(replacement.from)) {
        content = content.replace(new RegExp(replacement.from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), replacement.to);
        changed = true;
        console.log(`   ✏️  Fixed ${replacement.description} in ${path.relative(process.cwd(), filePath)}`);
      }
    });
    
    if (changed) {
      fs.writeFileSync(filePath, content, 'utf8');
    }
    
    return changed;
  } catch (error) {
    console.error(`   ❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

function fixAllImports() {
  console.log('🔧 FIXING IMPORT PATHS AFTER STRUCTURAL DEDUPLICATION\n');
  
  // Find all TypeScript and TSX files
  const files = glob.sync('**/*.{ts,tsx}', {
    ignore: ['node_modules/**', '.git/**', '.next/**', 'out/**', 'dist/**']
  });
  
  let fixedCount = 0;
  let totalFiles = files.length;
  
  files.forEach(file => {
    if (fixImportsInFile(file)) {
      fixedCount++;
    }
  });
  
  console.log(`\n✅ IMPORT FIXING COMPLETE!`);
  console.log(`📊 Results: ${fixedCount} files updated out of ${totalFiles} total files`);
  
  if (fixedCount > 0) {
    console.log('\n📝 NEXT STEPS:');
    console.log('1. Run TypeScript compilation check');
    console.log('2. Run ESLint check');
    console.log('3. Test application functionality');
  } else {
    console.log('\n🎉 No import fixes needed!');
  }
  
  return { fixedCount, totalFiles };
}

// Main execution
function main() {
  const command = process.argv[2];
  
  console.log('🔧 IMPORT PATH FIXER');
  console.log('====================\n');

  switch (command) {
    case 'dry-run':
      console.log('🔍 DRY RUN MODE - No files will be changed\n');
      // Add dry run logic here if needed
      break;
      
    case 'fix':
      fixAllImports();
      break;
      
    default:
      console.log('Usage:');
      console.log('  npm run fix:imports dry-run  - Show what would be changed');
      console.log('  npm run fix:imports fix     - Fix all import paths');
      break;
  }
}

if (require.main === module) {
  main();
}
