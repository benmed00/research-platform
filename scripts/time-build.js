#!/usr/bin/env node
/**
 * @file time-build.js
 * @description Script to time the Next.js build process
 */

const { spawn } = require('child_process');
const startTime = Date.now();

console.log('🚀 Starting build...\n');

const buildProcess = spawn('npx', ['next', 'build'], {
  stdio: 'inherit',
  shell: true,
  cwd: process.cwd(),
});

buildProcess.on('close', (code) => {
  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);
  const minutes = Math.floor(duration / 60);
  const seconds = (duration % 60).toFixed(2);

  console.log('\n' + '='.repeat(50));
  if (code === 0) {
    console.log(`✅ Build completed successfully!`);
  } else {
    console.log(`❌ Build failed with exit code ${code}`);
  }
  console.log(`⏱️  Total build time: ${minutes > 0 ? `${minutes}m ` : ''}${seconds}s`);
  console.log('='.repeat(50) + '\n');

  process.exit(code);
});

buildProcess.on('error', (error) => {
  console.error('❌ Error starting build process:', error);
  process.exit(1);
});
