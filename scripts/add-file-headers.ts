/**
 * @file add-file-headers.ts
 * @description scripts/add-file-headers.ts
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-01
 * @updates 1
 * @lines 183
 * @size 5.42 KB
 */
import * as fs from 'fs';
import * as path from 'path';

interface FileMetadata {
  author: string;
  createdAt: string;
  updatedAt: string;
  updateCount: number;
  lineCount: number;
  sizeKB: number;
  description?: string;
}

const AUTHOR = process.env.GIT_AUTHOR_NAME || process.env.USERNAME || 'Unknown Author';
const PROJECT_ROOT = path.resolve(__dirname, '..');

// Directories to process
const SOURCE_DIRS = [
  'src',
  'prisma',
  'scripts'
];

// Files to exclude
const EXCLUDE_PATTERNS = [
  /node_modules/,
  /\.next/,
  /\.git/,
  /dist/,
  /build/,
  /next-env\.d\.ts$/,
  /\.tsbuildinfo$/
];

function shouldExclude(filePath: string): boolean {
  return EXCLUDE_PATTERNS.some(pattern => pattern.test(filePath));
}

function getFileStats(filePath: string): { lines: number; sizeKB: number } {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').length;
  const sizeKB = fs.statSync(filePath).size / 1024;
  return { lines, sizeKB };
}

function parseExistingHeader(content: string): Partial<FileMetadata> | null {
  const headerMatch = content.match(/\/\*\*\s*\n([\s\S]*?)\*\/\s*\n/);
  if (!headerMatch) return null;

  const headerText = headerMatch[1];
  const metadata: Partial<FileMetadata> = {};

  const authorMatch = headerText.match(/\*\s*@author\s+(.+)/);
  if (authorMatch) metadata.author = authorMatch[1].trim();

  const createdAtMatch = headerText.match(/\*\s*@created\s+(.+)/);
  if (createdAtMatch) metadata.createdAt = createdAtMatch[1].trim();

  const updatedAtMatch = headerText.match(/\*\s*@updated\s+(.+)/);
  if (updatedAtMatch) metadata.updatedAt = updatedAtMatch[1].trim();

  const updateCountMatch = headerText.match(/\*\s*@updates\s+(\d+)/);
  if (updateCountMatch) metadata.updateCount = parseInt(updateCountMatch[1], 10);

  return metadata;
}

function generateHeader(metadata: FileMetadata, existingMetadata?: Partial<FileMetadata>): string {
  const author = existingMetadata?.author || metadata.author;
  const createdAt = existingMetadata?.createdAt || metadata.createdAt;
  const updatedAt = metadata.updatedAt;
  const updateCount = existingMetadata ? (existingMetadata.updateCount || 0) + 1 : 1;
  const lineCount = metadata.lineCount;
  const sizeKB = metadata.sizeKB.toFixed(2);
  const filePath = metadata.description || '';
  const fileName = path.basename(filePath);

  // Extract description from existing comments if available
  let description = '';
  if (filePath) {
    // Try to infer a simple description from the file path
    const relativePath = filePath.replace(/\\/g, '/');
    description = relativePath;
  }

  let header = '/**\n';
  header += ` * @file ${fileName}\n`;
  header += ` * @description ${description}\n`;
  header += ` * @author ${author}\n`;
  header += ` * @created ${createdAt}\n`;
  header += ` * @updated ${updatedAt}\n`;
  header += ` * @updates ${updateCount}\n`;
  header += ` * @lines ${lineCount}\n`;
  header += ` * @size ${sizeKB} KB\n`;
  header += ' */\n';

  return header;
}

function processFile(filePath: string): void {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const existingMetadata = parseExistingHeader(content);
    const stats = getFileStats(filePath);
    
    const now = new Date().toISOString().split('T')[0];
    const metadata: FileMetadata = {
      author: existingMetadata?.author || AUTHOR,
      createdAt: existingMetadata?.createdAt || now,
      updatedAt: now,
      updateCount: existingMetadata ? (existingMetadata.updateCount || 0) + 1 : 1,
      lineCount: stats.lines,
      sizeKB: stats.sizeKB,
      description: path.relative(PROJECT_ROOT, filePath)
    };

    const newHeader = generateHeader(metadata, existingMetadata || undefined);
    
    // Remove existing header if present
    let newContent = content.replace(/\/\*\*[\s\S]*?\*\/\s*\n/, '');
    
    // Add new header at the beginning
    newContent = newHeader + newContent;
    
    fs.writeFileSync(filePath, newContent, 'utf-8');
    console.log(`✓ Updated: ${filePath}`);
  } catch (error) {
    console.error(`✗ Error processing ${filePath}:`, error);
  }
}

function findTypeScriptFiles(dir: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    
    if (shouldExclude(filePath)) {
      return;
    }

    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      findTypeScriptFiles(filePath, fileList);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

function main() {
  console.log('Adding metadata headers to TypeScript files...\n');
  
  const allFiles: string[] = [];
  
  SOURCE_DIRS.forEach(dir => {
    const dirPath = path.join(PROJECT_ROOT, dir);
    if (fs.existsSync(dirPath)) {
      const files = findTypeScriptFiles(dirPath);
      allFiles.push(...files);
    }
  });

  console.log(`Found ${allFiles.length} TypeScript files\n`);

  allFiles.forEach(processFile);

  console.log(`\n✓ Processed ${allFiles.length} files`);
}

main();

