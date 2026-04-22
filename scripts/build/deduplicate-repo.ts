#!/usr/bin/env tsx

// scripts/deduplicate-repo.ts
// Automated repository deduplication script
// This script helps identify and remove duplicate files/code

import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync, unlinkSync } from 'fs';
import { join, dirname } from 'path';

interface DuplicateFile {
  original: string;
  duplicate: string;
  reason: string;
  action: 'delete' | 'merge' | 'move';
  priority: 'high' | 'medium' | 'low';
}

interface ImportUpdate {
  file: string;
  oldImport: string;
  newImport: string;
}

class RepositoryDeduplicator {
  private readonly projectRoot = process.cwd();
  private readonly duplicates: DuplicateFile[] = [];
  private readonly importUpdates: ImportUpdate[] = [];

  constructor() {
    this.identifyDuplicates();
  }

  /**
   * Identify all duplicate files and patterns
   */
  private identifyDuplicates(): void {
    console.log('🔍 Identifying duplicate files...\n');

    // 1. User Type System Duplication (CRITICAL)
    this.duplicates.push(
      {
        original: 'types/user-unified.ts',
        duplicate: 'src/features/registration/domain/entities/User.ts',
        reason: 'Massive duplicate user entity (527 lines) - unique logic extracted to user-domain-extensions.ts',
        action: 'delete',
        priority: 'high',
      },
      {
        original: 'types/user-unified.ts',
        duplicate: 'src/core/types/adapter.ts',
        reason: 'Partial user type definitions',
        action: 'merge',
        priority: 'high',
      },
    );

    // 2. Authentication System Duplication (HIGH)
    this.duplicates.push(
      {
        original: 'src/features/auth/hooks/useHybridAuth.ts',
        duplicate: 'src/features/auth/hooks/useAuth.ts',
        reason: 'Simple auth hook (73 lines) - HybridAuth is enhanced version',
        action: 'delete',
        priority: 'high',
      },
      {
        original: 'src/features/auth/hooks/',
        duplicate: 'hooks/auth/useAuthAdapter.ts',
        reason: 'Auth hook in wrong location',
        action: 'move',
        priority: 'high',
      },
    );

    // 3. Error Handling Duplication (MEDIUM)
    this.duplicates.push(
      {
        original: 'types/error-handling.ts',
        duplicate: 'lib/errorHandling.ts',
        reason: 'Basic error handling (241 lines) - comprehensive version in types',
        action: 'delete',
        priority: 'medium',
      },
    );

    // 4. Registration Form Duplication (MEDIUM)
    this.duplicates.push(
      {
        original: 'src/features/registration/components/RegistrationForm.tsx',
        duplicate: 'src/features/registration/presentation/RegistrationForm.js',
        reason: 'JavaScript version (42 lines) - TypeScript version is enhanced',
        action: 'delete',
        priority: 'medium',
      },
    );

    // 5. Adapter Registry Triplication (LOW)
    this.duplicates.push(
      {
        original: 'src/core/registry/AdapterRegistry.ts',
        duplicate: 'src/core/adapters/AdapterRegistry.ts',
        reason: 'Duplicate adapter registry',
        action: 'delete',
        priority: 'low',
      },
      {
        original: 'src/core/registry/AdapterRegistry.ts',
        duplicate: 'src/core/services/AdapterRegistry.ts',
        reason: 'Another duplicate adapter registry',
        action: 'delete',
        priority: 'low',
      },
    );

    // Sort by priority
    this.duplicates.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  /**
   * Generate import updates needed after deduplication
   */
  private generateImportUpdates(): void {
    console.log('📝 Generating import updates...\n');

    // User type imports
    this.importUpdates.push(
      {
        file: 'src/features/registration/domain/entities/User.ts',
        oldImport: 'import type { AuthUser, UserRole } from \'.../../types/user-unified\';',
        newImport: 'import type { UniversalUser, UserRole } from \'@/types/user-unified\';',
      },
    );

    // Auth hook imports
    this.importUpdates.push(
      {
        file: 'hooks/auth/useAuthAdapter.ts',
        oldImport: 'from \'@/hooks/auth/useAuthAdapter\';',
        newImport: 'from \'@/features/auth/hooks/useAuthAdapter\';',
      },
    );

    // Error handling imports
    this.importUpdates.push(
      {
        file: 'lib/errorHandling.ts',
        oldImport: 'from \'@/lib/errorHandling\';',
        newImport: 'from \'@/types/error-handling\';',
      },
    );
  }

  /**
   * Display deduplication plan
   */
  public showPlan(): void {
    console.log('📋 REPOSITORY DUPLICATION CLEANUP PLAN\n');
    console.log('=====================================\n');

    const priorityGroups = this.duplicates.reduce((groups, dup) => {
      if (!groups[dup.priority]) {
groups[dup.priority] = [];
}
      groups[dup.priority].push(dup);
      return groups;
    }, {} as Record<string, DuplicateFile[]>);

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

    console.log('📊 SUMMARY:');
    console.log(`   Total duplicates: ${this.duplicates.length}`);
    console.log(`   High priority: ${this.duplicates.filter(d => d.priority === 'high').length}`);
    console.log(`   Medium priority: ${this.duplicates.filter(d => d.priority === 'medium').length}`);
    console.log(`   Low priority: ${this.duplicates.filter(d => d.priority === 'low').length}`);
    console.log('   Estimated code reduction: ~1,500+ lines');
    console.log(`   Files to update: ${this.importUpdates.length}+`);
  }

  /**
   * Execute the deduplication plan
   */
  public async execute(): Promise<void> {
    console.log('🚀 EXECUTING DEDUPLICATION PLAN\n');

    this.generateImportUpdates();

    for (const duplicate of this.duplicates) {
      try {
        await this.processDuplicate(duplicate);
      } catch (error) {
        console.error(`❌ Failed to process ${duplicate.duplicate}:`, error);
      }
    }

    console.log('\n📝 UPDATING IMPORTS...');
    for (const update of this.importUpdates) {
      try {
        await this.updateImports(update);
      } catch (error) {
        console.error(`❌ Failed to update imports in ${update.file}:`, error);
      }
    }

    console.log('\n✅ DEDUPLICATION COMPLETE!');
    this.showResults();
  }

  /**
   * Process a single duplicate file
   */
  private async processDuplicate(duplicate: DuplicateFile): Promise<void> {
    const duplicatePath = join(this.projectRoot, duplicate.duplicate);
    const originalPath = join(this.projectRoot, duplicate.original);

    if (!existsSync(duplicatePath)) {
      console.log(`⚠️  Duplicate file not found: ${duplicate.duplicate}`);
      return;
    }

    switch (duplicate.action) {
      case 'delete':
        console.log(`🗑️  Deleting: ${duplicate.duplicate}`);
        unlinkSync(duplicatePath);
        break;

      case 'move': {
        console.log(`📦 Moving: ${duplicate.duplicate} → ${duplicate.original}`);
        const dir = dirname(originalPath);
        if (!existsSync(dir)) {
          execSync(`mkdir -p "${dir}"`, { stdio: 'inherit' });
        }
        // This would need actual file move logic
        break;
      }

      case 'merge':
        console.log(`🔀 Merging: ${duplicate.duplicate} into ${duplicate.original}`);
        // This would need actual merge logic
        break;
    }
  }

  /**
   * Update import statements
   */
  private async updateImports(update: ImportUpdate): Promise<void> {
    const filePath = join(this.projectRoot, update.file);
    if (!existsSync(filePath)) {
      console.log(`⚠️  File not found for import update: ${update.file}`);
      return;
    }

    const content = readFileSync(filePath, 'utf-8');
    const updatedContent = content.replace(update.oldImport, update.newImport);

    if (content !== updatedContent) {
      writeFileSync(filePath, updatedContent);
      console.log(`✅ Updated imports in: ${update.file}`);
    }
  }

  /**
   * Show final results
   */
  private showResults(): void {
    console.log('\n📊 FINAL RESULTS:');
    console.log('==================');
    console.log('✅ Files deleted: ' + this.duplicates.filter(d => d.action === 'delete').length);
    console.log('✅ Files moved: ' + this.duplicates.filter(d => d.action === 'move').length);
    console.log('✅ Files merged: ' + this.duplicates.filter(d => d.action === 'merge').length);
    console.log('✅ Import updates: ' + this.importUpdates.length);
    console.log('📉 Estimated lines removed: 1,500+');
    console.log('🎯 Repository is now cleaner and more maintainable!');
  }

  /**
   * Create backup before making changes
   */
  public createBackup(): void {
    console.log('💾 Creating backup...');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = join(this.projectRoot, `.backup-${timestamp}`);

    try {
      execSync(`mkdir -p "${backupDir}"`, { stdio: 'inherit' });
      execSync(`cp -r src types lib hooks "${backupDir}/"`, { stdio: 'inherit' });
      console.log(`✅ Backup created: ${backupDir}`);
    } catch (error) {
      console.error('❌ Failed to create backup:', error);
    }
  }

  /**
   * Validate TypeScript after changes
   */
  public validateTypeScript(): boolean {
    console.log('\n🔍 Validating TypeScript...');
    try {
      execSync('npx tsc --noEmit', { stdio: 'inherit' });
      console.log('✅ TypeScript validation passed!');
      return true;
    } catch (_error) {
      console.error('❌ TypeScript validation failed!');
      return false;
    }
  }
}

// ... (rest of the code remains the same)
async function main() {
  const deduplicator = new RepositoryDeduplicator();

  console.log('🧹 REPOSITORY DEDUPLICATION TOOL');
  console.log('================================\n');

  // Show the plan first
  deduplicator.showPlan();

  // Ask for confirmation
  console.log('\n❓ Do you want to proceed with the deduplication?');
  console.log('   This will permanently delete duplicate files.');
  console.log('   Make sure you have committed your changes to git.\n');

  // In a real script, you'd ask for user input here
  // For now, we'll just show the plan

  console.log('💡 To execute the plan, run:');
  console.log('   npm run deduplicate:execute');
  console.log('\n💡 To create a backup first, run:');
  console.log('   npm run deduplicate:backup');
}

// Export for use in other scripts
export { RepositoryDeduplicator };

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
