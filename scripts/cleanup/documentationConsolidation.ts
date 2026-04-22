#!/usr/bin/env tsx

/**
 * Documentation Consolidation Script
 *
 * This script consolidates scattered documentation into a unified structure:
 * 1. Archives completed tasks
 * 2. Merges related documentation
 * 3. Creates unified guides
 * 4. Removes redundant files
 */

import fs from 'fs';
import path from 'path';

interface DocumentationFile {
  path: string;
  name: string;
  content: string;
  category: 'architecture' | 'api' | 'setup' | 'completed' | 'component' | 'general';
  priority: 'high' | 'medium' | 'low';
}

class DocumentationConsolidation {
  private docsDir: string;
  private archiveDir: string;
  private dryRun: boolean;

  constructor(dryRun: boolean = true) {
    this.docsDir = path.join(process.cwd(), 'docs');
    this.archiveDir = path.join(this.docsDir, 'ARCHIVE');
    this.dryRun = dryRun;
  }

  /**
   * Run the documentation consolidation process
   */
  async run(): Promise<void> {
    console.log('📚 Starting Documentation Consolidation...\n');

    // Ensure directories exist
    this.ensureDirectories();

    // Analyze existing documentation
    const docs = await this.analyzeDocumentation();

    // Archive completed tasks
    await this.archiveCompletedTasks(docs);

    // Consolidate architecture documentation
    await this.consolidateArchitectureDocs(docs);

    // Create unified setup guide
    await this.createSetupGuide(docs);

    // Create component reference
    await this.createComponentReference(docs);

    // Clean up redundant files
    await this.cleanupRedundantFiles(docs);

    console.log('\n✅ Documentation consolidation completed!');
  }

  /**
   * Ensure necessary directories exist
   */
  private ensureDirectories(): void {
    const dirs = [this.docsDir, this.archiveDir];

    for (const dir of dirs) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    }
  }

  /**
   * Analyze existing documentation files
   */
  private async analyzeDocumentation(): Promise<DocumentationFile[]> {
    console.log('📖 Analyzing existing documentation...');

    const docs: DocumentationFile[] = [];

    // Scan all markdown files in docs directory
    const scanDirectory = (dir: string, relativePath: string = ''): void => {
      if (!fs.existsSync(dir)) {
return;
}

      const items = fs.readdirSync(dir);

      for (const item of items) {
        const fullPath = path.join(dir, item);
        const relativeItemPath = path.join(relativePath, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          scanDirectory(fullPath, relativeItemPath);
        } else if (item.endsWith('.md')) {
          try {
            const content = fs.readFileSync(fullPath, 'utf8');
            const category = this.categorizeDocument(relativeItemPath, content);
            const priority = this.determinePriority(content);

            docs.push({
              path: fullPath,
              name: item,
              content,
              category,
              priority,
            });
          } catch (error) {
            console.warn(`  ⚠️  Could not read ${fullPath}:`, error);
          }
        }
      }
    };

    scanDirectory(this.docsDir);

    console.log(`  📄 Found ${docs.length} documentation files`);
    return docs;
  }

  /**
   * Categorize a document based on path and content
   */
  private categorizeDocument(relativePath: string, content: string): DocumentationFile['category'] {
    const pathLower = relativePath.toLowerCase();
    const contentLower = content.toLowerCase();

    // Check for completed tasks
    if (pathLower.includes('archive') ||
        contentLower.includes('completed') ||
        contentLower.includes('✅') ||
        contentLower.includes('done')) {
      return 'completed';
    }

    // Check categories
    if (pathLower.includes('architecture') || contentLower.includes('architecture')) {
      return 'architecture';
    }

    if (pathLower.includes('api') || contentLower.includes('api')) {
      return 'api';
    }

    if (pathLower.includes('setup') || contentLower.includes('setup') || contentLower.includes('installation')) {
      return 'setup';
    }

    if (pathLower.includes('component') || contentLower.includes('component')) {
      return 'component';
    }

    return 'general';
  }

  /**
   * Determine document priority based on content
   */
  private determinePriority(content: string): DocumentationFile['priority'] {
    const contentLower = content.toLowerCase();

    if (contentLower.includes('critical') || contentLower.includes('urgent') || contentLower.includes('security')) {
      return 'high';
    }

    if (contentLower.includes('important') || contentLower.includes('note') || contentLower.includes('warning')) {
      return 'medium';
    }

    return 'low';
  }

  /**
   * Archive completed tasks
   */
  private async archiveCompletedTasks(docs: DocumentationFile[]): Promise<void> {
    console.log('📦 Archiving completed tasks...');

    const completedDocs = docs.filter(doc => doc.category === 'completed');

    if (completedDocs.length === 0) {
      console.log('  ℹ️  No completed tasks to archive');
      return;
    }

    // Create consolidated archive content
    const archiveContent = this.createArchiveContent(completedDocs);
    const archiveFile = path.join(this.archiveDir, 'COMPLETED_TASKS_ARCHIVE.md');

    if (this.dryRun) {
      console.log(`  📝 Would create: ${archiveFile}`);
      console.log(`  📊 Would archive ${completedDocs.length} completed task documents`);
    } else {
      fs.writeFileSync(archiveFile, archiveContent);
      console.log(`  📝 Created: ${archiveFile}`);
      console.log(`  📊 Archived ${completedDocs.length} completed task documents`);

      // Move original files to archive
      for (const doc of completedDocs) {
        const archivePath = path.join(this.archiveDir, doc.name);
        if (doc.path !== archiveFile) { // Don't move the file we just created
          fs.renameSync(doc.path, archivePath);
          console.log(`  📁 Moved to archive: ${doc.name}`);
        }
      }
    }
  }

  /**
   * Create consolidated archive content
   */
  private createArchiveContent(completedDocs: DocumentationFile[]): string {
    let content = '# Completed Tasks Archive\n\n';
    content += 'This document contains all completed tasks and their summaries.\n\n';
    content += `**Last Updated:** ${new Date().toISOString()}\n\n`;
    content += '---\n\n';

    for (const doc of completedDocs) {
      content += `## ${doc.name.replace('.md', '')}\n\n`;
      content += `**Path:** ${path.relative(process.cwd(), doc.path)}\n\n`;
      content += `**Priority:** ${doc.priority}\n\n`;

      // Extract summary from content
      const summary = this.extractSummary(doc.content);
      content += `**Summary:** ${summary}\n\n`;

      content += '---\n\n';
    }

    return content;
  }

  /**
   * Extract summary from document content
   */
  private extractSummary(content: string): string {
    const lines = content.split('\n');

    // Look for executive summary or first paragraph
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('## Executive Summary') ||
          trimmed.startsWith('## Summary') ||
          trimmed.startsWith('## Overview')) {
        // Return the next non-empty line
        const nextLineIndex = lines.indexOf(line) + 1;
        while (nextLineIndex < lines.length) {
          const nextLine = lines[nextLineIndex].trim();
          if (nextLine && !nextLine.startsWith('#')) {
            return nextLine;
          }
        }
      }
    }

    // Fallback to first non-heading line
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#') && trimmed.length > 20) {
        return trimmed.length > 150 ? trimmed.substring(0, 147) + '...' : trimmed;
      }
    }

    return 'No summary available';
  }

  /**
   * Consolidate architecture documentation
   */
  private async consolidateArchitectureDocs(docs: DocumentationFile[]): Promise<void> {
    console.log('🏗️  Consolidating architecture documentation...');

    const archDocs = docs.filter(doc => doc.category === 'architecture');

    if (archDocs.length === 0) {
      console.log('  ℹ️  No architecture documents to consolidate');
      return;
    }

    const consolidatedContent = this.createArchitectureContent(archDocs);
    const archFile = path.join(this.docsDir, 'ARCHITECTURE.md');

    if (this.dryRun) {
      console.log(`  📝 Would create: ${archFile}`);
      console.log(`  📊 Would consolidate ${archDocs.length} architecture documents`);
    } else {
      fs.writeFileSync(archFile, consolidatedContent);
      console.log(`  📝 Created: ${archFile}`);
      console.log(`  📊 Consolidated ${archDocs.length} architecture documents`);

      // Archive original architecture docs
      for (const doc of archDocs) {
        if (doc.path !== archFile && !doc.path.includes('ARCHIVE')) {
          const archivePath = path.join(this.archiveDir, doc.name);
          fs.renameSync(doc.path, archivePath);
          console.log(`  📁 Archived: ${doc.name}`);
        }
      }
    }
  }

  /**
   * Create consolidated architecture content
   */
  private createArchitectureContent(archDocs: DocumentationFile[]): string {
    let content = '# Architecture Documentation\n\n';
    content += 'This document consolidates all architecture-related documentation.\n\n';
    content += `**Last Updated:** ${new Date().toISOString()}\n\n`;
    content += '---\n\n';

    // Table of contents
    content += '## Table of Contents\n\n';
    for (const doc of archDocs) {
      const title = doc.name.replace('.md', '').replace(/-/g, ' ');
      content += `- [${title}](#${title.toLowerCase().replace(/\s+/g, '-')})\n`;
    }
    content += '\n';

    // Content from each document
    for (const doc of archDocs) {
      const title = doc.name.replace('.md', '').replace(/-/g, ' ');
      content += `## ${title}\n\n`;
      content += `**Source:** ${path.relative(process.cwd(), doc.path)}\n\n`;
      content += doc.content;
      content += '\n\n---\n\n';
    }

    return content;
  }

  /**
   * Create unified setup guide
   */
  private async createSetupGuide(docs: DocumentationFile[]): Promise<void> {
    console.log('⚙️  Creating unified setup guide...');

    const setupDocs = docs.filter(doc => doc.category === 'setup');

    const setupContent = this.createSetupContent(setupDocs);
    const setupFile = path.join(this.docsDir, 'SETUP.md');

    if (this.dryRun) {
      console.log(`  📝 Would create: ${setupFile}`);
    } else {
      fs.writeFileSync(setupFile, setupContent);
      console.log(`  📝 Created: ${setupFile}`);

      // Archive original setup docs
      for (const doc of setupDocs) {
        if (doc.path !== setupFile && !doc.path.includes('ARCHIVE')) {
          const archivePath = path.join(this.archiveDir, doc.name);
          fs.renameSync(doc.path, archivePath);
          console.log(`  📁 Archived: ${doc.name}`);
        }
      }
    }
  }

  /**
   * Create setup guide content
   */
  private createSetupContent(setupDocs: DocumentationFile[]): string {
    let content = '# Setup Guide\n\n';
    content += 'This guide provides comprehensive setup instructions for the Maroon Traceability Demo.\n\n';
    content += `**Last Updated:** ${new Date().toISOString()}\n\n`;
    content += '---\n\n';

    content += '## Quick Start\n\n';
    content += '### Prerequisites\n';
    content += '- Node.js 18+\n';
    content += '- npm or yarn\n';
    content += '- Git\n\n';

    content += '### Installation\n';
    content += '```bash\n';
    content += 'git clone <repository-url>\n';
    content += 'cd maroon_traceability_demo\n';
    content += 'npm install\n';
    content += 'cp .env.example .env.local\n';
    content += '# Configure your environment variables\n';
    content += 'npm run dev\n';
    content += '```\n\n';

    // Add content from setup docs
    for (const doc of setupDocs) {
      const title = doc.name.replace('.md', '').replace(/-/g, ' ');
      content += `## ${title}\n\n`;
      content += doc.content;
      content += '\n\n---\n\n';
    }

    return content;
  }

  /**
   * Create component reference
   */
  private async createComponentReference(docs: DocumentationFile[]): Promise<void> {
    console.log('🧩 Creating component reference...');

    const componentDocs = docs.filter(doc => doc.category === 'component');

    if (componentDocs.length === 0) {
      console.log('  ℹ️  No component documents to reference');
      return;
    }

    const componentContent = this.createComponentContent(componentDocs);
    const componentFile = path.join(this.docsDir, 'COMPONENTS.md');

    if (this.dryRun) {
      console.log(`  📝 Would create: ${componentFile}`);
    } else {
      fs.writeFileSync(componentFile, componentContent);
      console.log(`  📝 Created: ${componentFile}`);
    }
  }

  /**
   * Create component reference content
   */
  private createComponentContent(componentDocs: DocumentationFile[]): string {
    let content = '# Component Reference\n\n';
    content += 'This document provides a comprehensive reference for all UI components.\n\n';
    content += `**Last Updated:** ${new Date().toISOString()}\n\n`;
    content += '---\n\n';

    for (const doc of componentDocs) {
      const title = doc.name.replace('.md', '').replace(/-/g, ' ');
      content += `## ${title}\n\n`;
      content += doc.content;
      content += '\n\n---\n\n';
    }

    return content;
  }

  /**
   * Clean up redundant files
   */
  private async cleanupRedundantFiles(docs: DocumentationFile[]): Promise<void> {
    console.log('🧹 Cleaning up redundant files...');

    // Find files with similar content
    const redundantGroups = this.findRedundantFiles(docs);

    for (const group of redundantGroups) {
      if (group.length > 1) {
        console.log(`  🔄 Found redundant group: ${group.map(g => g.name).join(', ')}`);

        if (!this.dryRun) {
          // Keep the first file, archive the rest
          const [_keep, ...archive] = group;
          for (const file of archive) {
            const archivePath = path.join(this.archiveDir, file.name);
            fs.renameSync(file.path, archivePath);
            console.log(`  📁 Archived redundant: ${file.name}`);
          }
        }
      }
    }
  }

  /**
   * Find files with similar content
   */
  private findRedundantFiles(docs: DocumentationFile[]): DocumentationFile[][] {
    const groups: DocumentationFile[][] = [];
    const processed = new Set<string>();

    for (const doc of docs) {
      if (processed.has(doc.path)) {
continue;
}

      const similar = docs.filter(other =>
        other.path !== doc.path &&
        !processed.has(other.path) &&
        this.calculateSimilarity(doc.content, other.content) > 0.8,
      );

      if (similar.length > 0) {
        const group = [doc, ...similar];
        groups.push(group);

        group.forEach(file => processed.add(file.path));
      }
    }

    return groups;
  }

  /**
   * Calculate similarity between two text contents
   */
  private calculateSimilarity(content1: string, content2: string): number {
    const words1 = content1.toLowerCase().split(/\s+/);
    const words2 = content2.toLowerCase().split(/\s+/);

    const set1 = new Set(words1);
    const set2 = new Set(words2);

    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);

    return intersection.size / union.size;
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const dryRun = !args.includes('--execute');

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Documentation Consolidation Script

Usage:
  tsx scripts/cleanup/documentationConsolidation.ts [options]

Options:
  --execute              Execute consolidation (default: dry run)
  --help, -h            Show this help

Examples:
  # Dry run (default)
  tsx scripts/cleanup/documentationConsolidation.ts

  # Execute consolidation
  tsx scripts/cleanup/documentationConsolidation.ts --execute
`);
    process.exit(0);
  }

  try {
    const consolidation = new DocumentationConsolidation(dryRun);
    await consolidation.run();

    console.log(`\n📊 Mode: ${dryRun ? 'Dry Run' : 'Execute'}`);
    console.log('✨ Documentation consolidation completed successfully!');
  } catch (error) {
    console.error('❌ Documentation consolidation failed:', error);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { DocumentationConsolidation };
