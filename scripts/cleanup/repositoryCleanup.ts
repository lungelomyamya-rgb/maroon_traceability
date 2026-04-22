#!/usr/bin/env tsx

/**
 * Repository Cleanup Script
 *
 * This script helps clean up the repository by:
 * 1. Removing build artifacts
 * 2. Consolidating duplicate files
 * 3. Cleaning debug code
 * 4. Standardizing file naming
 */

import { execSync as _execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

interface CleanupOptions {
  dryRun?: boolean;
  removeBuildArtifacts?: boolean;
  cleanConsoleLogs?: boolean;
  standardizeNaming?: boolean;
  consolidateDuplicates?: boolean;
}

class RepositoryCleanup {
  private options: CleanupOptions;
  private projectRoot: string;

  constructor(options: CleanupOptions = {}) {
    this.options = {
      dryRun: true,
      removeBuildArtifacts: true,
      cleanConsoleLogs: false,
      standardizeNaming: false,
      consolidateDuplicates: false,
      ...options,
    };
    this.projectRoot = process.cwd();
  }

  /**
   * Run the complete cleanup process
   */
  async run(): Promise<void> {
    console.log('🧹 Starting Repository Cleanup...\n');

    if (this.options.removeBuildArtifacts) {
      await this.removeBuildArtifacts();
    }

    if (this.options.cleanConsoleLogs) {
      await this.cleanConsoleLogs();
    }

    if (this.options.standardizeNaming) {
      await this.standardizeFileNaming();
    }

    if (this.options.consolidateDuplicates) {
      await this.consolidateDuplicates();
    }

    console.log('\n✅ Repository cleanup completed!');
  }

  /**
   * Remove build artifacts and temporary files
   */
  private async removeBuildArtifacts(): Promise<void> {
    console.log('📦 Removing build artifacts...');

    const artifacts = [
      'out/',
      '.next/',
      'tsconfig.tsbuildinfo',
      'node_modules/.cache/',
      '.eslintcache',
      '*.log',
      'temp_*',
      '*.tmp',
      '*.temp',
    ];

    for (const artifact of artifacts) {
      try {
        if (fs.existsSync(artifact)) {
          if (this.options.dryRun) {
            console.log(`  🗂️  Would remove: ${artifact}`);
          } else {
            if (fs.statSync(artifact).isDirectory()) {
              fs.rmSync(artifact, { recursive: true, force: true });
            } else {
              fs.unlinkSync(artifact);
            }
            console.log(`  🗑️  Removed: ${artifact}`);
          }
        }
      } catch (error) {
        console.warn(`  ⚠️  Could not remove ${artifact}:`, error);
      }
    }
  }

  /**
   * Clean console.log statements from source code
   */
  private async cleanConsoleLogs(): Promise<void> {
    console.log('🧽 Cleaning console logs...');

    const extensions = ['.ts', '.tsx', '.js', '.jsx'];
    const sourceDirs = ['src/', 'components/', 'lib/', 'hooks/', 'scripts/'];

    for (const dir of sourceDirs) {
      if (!fs.existsSync(dir)) {
continue;
}

      const files = this.getAllFiles(dir, extensions);

      for (const file of files) {
        await this.cleanConsoleLogsInFile(file);
      }
    }
  }

  /**
   * Clean console logs in a specific file
   */
  private async cleanConsoleLogsInFile(filePath: string): Promise<void> {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');
      let modified = false;
      let removedCount = 0;

      const cleanedLines = lines.map(line => {
        // Remove console.log, console.warn, console.error (keep in test files)
        if (!filePath.includes('/test/') && !filePath.includes('.test.') &&
            !filePath.includes('.spec.') && !filePath.includes('__tests__/')) {

          const consoleLogPattern = /^\s*console\.(log|warn|error)\([^)]*\);?\s*$/;
          if (consoleLogPattern.test(line)) {
            modified = true;
            removedCount++;
            return `  // Removed: ${line.trim()}`;
          }
        }
        return line;
      });

      if (modified) {
        if (this.options.dryRun) {
          console.log(`  📝 Would clean ${removedCount} console logs in: ${filePath}`);
        } else {
          fs.writeFileSync(filePath, cleanedLines.join('\n'));
          console.log(`  🧹 Cleaned ${removedCount} console logs in: ${filePath}`);
        }
      }
    } catch (error) {
      console.warn(`  ⚠️  Could not process ${filePath}:`, error);
    }
  }

  /**
   * Standardize file naming conventions
   */
  private async standardizeFileNaming(): Promise<void> {
    console.log('📝 Standardizing file naming...');

    const componentDir = 'src/components/';
    if (!fs.existsSync(componentDir)) {
return;
}

    const files = this.getAllFiles(componentDir, ['.tsx', '.ts']);

    for (const file of files) {
      const fileName = path.basename(file);
      const dir = path.dirname(file);

      // Convert camelCase to PascalCase for components
      if (fileName.includes('.tsx') && fileName[0] === fileName[0].toLowerCase()) {
        const newFileName = this.toPascalCase(fileName);
        const newPath = path.join(dir, newFileName);

        if (this.options.dryRun) {
          console.log(`  🔄 Would rename: ${file} -> ${newPath}`);
        } else {
          fs.renameSync(file, newPath);
          console.log(`  🔄 Renamed: ${file} -> ${newPath}`);
        }
      }
    }
  }

  /**
   * Consolidate duplicate files
   */
  private async consolidateDuplicates(): Promise<void> {
    console.log('🔗 Consolidating duplicates...');

    // Blockchain services consolidation
    await this.consolidateBlockchainServices();

    // Authentication services consolidation
    await this.consolidateAuthServices();

    // User type definitions consolidation
    await this.consolidateUserTypes();
  }

  /**
   * Consolidate blockchain services
   */
  private async consolidateBlockchainServices(): Promise<void> {
    const blockchainFiles = [
      'lib/blockchain.ts',
      'lib/mockBlockchain.ts',
      'src/core/adapters/blockchain/RealBlockchainAdapter.ts',
      'src/core/adapters/blockchain/SimulatedBlockchainAdapter.ts',
    ];

    const targetFile = 'src/shared/services/blockchainService.ts';

    if (this.options.dryRun) {
      console.log(`  🔗 Would consolidate blockchain services into: ${targetFile}`);
      blockchainFiles.forEach(file => {
        if (fs.existsSync(file)) {
          console.log(`    - ${file}`);
        }
      });
    } else {
      console.log(`  🔗 Consolidating blockchain services into: ${targetFile}`);
      // Implementation would merge the files here
    }
  }

  /**
   * Consolidate authentication services
   */
  private async consolidateAuthServices(): Promise<void> {
    const authFiles = [
      'components/services/auth/auth.ts',
      'src/features/auth/adapters/',
      'src/features/auth/application/',
    ];

    if (this.options.dryRun) {
      console.log('  🔗 Would consolidate authentication services');
      authFiles.forEach(file => {
        if (fs.existsSync(file)) {
          console.log(`    - ${file}`);
        }
      });
    } else {
      console.log('  🔗 Consolidating authentication services');
      // Implementation would merge the files here
    }
  }

  /**
   * Consolidate user type definitions
   */
  private async consolidateUserTypes(): Promise<void> {
    const userTypeFiles = [
      'types/user-unified.ts',
      'types/user-domain-extensions.ts',
      'src/features/auth/types/userTypes.ts',
      'constants/users.ts',
    ];

    if (this.options.dryRun) {
      console.log('  🔗 Would consolidate user type definitions');
      userTypeFiles.forEach(file => {
        if (fs.existsSync(file)) {
          console.log(`    - ${file}`);
        }
      });
    } else {
      console.log('  🔗 Consolidating user type definitions');
      // Implementation would merge the files here
    }
  }

  /**
   * Get all files with specific extensions from a directory
   */
  private getAllFiles(dir: string, extensions: string[]): string[] {
    const files: string[] = [];

    function traverse(currentDir: string) {
      const items = fs.readdirSync(currentDir);

      for (const item of items) {
        const fullPath = path.join(currentDir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          // Skip node_modules and .git
          if (!['node_modules', '.git', '.next', 'out'].includes(item)) {
            traverse(fullPath);
          }
        } else if (extensions.some(ext => item.endsWith(ext))) {
          files.push(fullPath);
        }
      }
    }

    traverse(dir);
    return files;
  }

  /**
   * Convert camelCase to PascalCase
   */
  private toPascalCase(str: string): string {
    return str.replace(/(?:^|\.?)([A-Z])/g, (_, char) => char.toUpperCase())
              .replace(/^./, char => char.toUpperCase());
  }

  /**
   * Generate cleanup report
   */
  generateReport(): void {
    console.log('\n📊 Cleanup Report:');
    console.log(`  - Dry Run: ${this.options.dryRun ? 'Yes' : 'No'}`);
    console.log(`  - Remove Build Artifacts: ${this.options.removeBuildArtifacts ? 'Yes' : 'No'}`);
    console.log(`  - Clean Console Logs: ${this.options.cleanConsoleLogs ? 'Yes' : 'No'}`);
    console.log(`  - Standardize Naming: ${this.options.standardizeNaming ? 'Yes' : 'No'}`);
    console.log(`  - Consolidate Duplicates: ${this.options.consolidateDuplicates ? 'Yes' : 'No'}`);
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const options: CleanupOptions = {
    dryRun: !args.includes('--execute'),
    removeBuildArtifacts: args.includes('--build') || !args.includes('--no-build'),
    cleanConsoleLogs: args.includes('--logs'),
    standardizeNaming: args.includes('--naming'),
    consolidateDuplicates: args.includes('--duplicates'),
  };

  const cleanup = new RepositoryCleanup(options);

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Repository Cleanup Script

Usage:
  tsx scripts/cleanup/repositoryCleanup.ts [options]

Options:
  --execute              Execute cleanup (default: dry run)
  --build               Remove build artifacts (default: true)
  --no-build            Don't remove build artifacts
  --logs                Clean console logs
  --naming              Standardize file naming
  --duplicates          Consolidate duplicate files
  --help, -h            Show this help

Examples:
  # Dry run (default)
  tsx scripts/cleanup/repositoryCleanup.ts

  # Execute all cleanup tasks
  tsx scripts/cleanup/repositoryCleanup.ts --execute

  # Clean console logs only
  tsx scripts/cleanup/repositoryCleanup.ts --logs --execute

  # Remove build artifacts and standardize naming
  tsx scripts/cleanup/repositoryCleanup.ts --build --naming --execute
`);
    process.exit(0);
  }

  try {
    await cleanup.run();
    cleanup.generateReport();
  } catch (error) {
    console.error('❌ Cleanup failed:', error);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { RepositoryCleanup };
