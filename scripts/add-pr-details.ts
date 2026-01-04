/**
 * Script to add labels, milestone, and project to PR #60
 * Run with: ts-node --project tsconfig.seed.json scripts/add-pr-details.ts
 */

import { execFileSync } from 'child_process';

const PR_NUMBER = 60;

// Labels to add
const LABELS = [
  'documentation',
  'type:documentation',
  'enhancement',
  'priority:medium'
];

// Milestone (v1.3 - Quality & Polish)
const MILESTONE_NUMBER = 4;

// Project name (if available)
const PROJECT_NAME = 'Research Platform Development';

console.log('📋 Adding details to PR #60...\n');

// Add labels
console.log('🏷️  Adding labels...');
for (const label of LABELS) {
  try {
    execFileSync('gh', [
      'pr',
      'edit',
      PR_NUMBER.toString(),
      '--add-label',
      label
    ], { stdio: 'inherit' });
    console.log(`   ✅ Added label: ${label}`);
  } catch (error) {
    console.log(`   ⚠️  Could not add label: ${label} (may already exist or need permissions)`);
  }
}

// Set milestone
console.log('\n🎯 Setting milestone...');
try {
  execFileSync('gh', [
    'api',
    'repos/benmed00/research-platform/issues/60',
    '--method',
    'PATCH',
    '--field',
    `milestone=${MILESTONE_NUMBER}`
  ], { stdio: 'inherit' });
  console.log(`   ✅ Set milestone: v1.3 - Quality & Polish`);
} catch (error) {
  console.log('   ⚠️  Could not set milestone (may need permissions)');
}

// Add to project (if project ID is known)
console.log('\n📊 Project details:');
console.log(`   Project: ${PROJECT_NAME}`);
console.log('   Note: Adding to project requires project ID');
console.log('   You can add manually via GitHub UI or use:');
console.log('   gh project item-add <project-id> --owner benmed00 --url https://github.com/benmed00/research-platform/pull/60');

console.log('\n✅ PR #60 details update complete!');
console.log('\nSummary:');
console.log(`- Labels: ${LABELS.join(', ')}`);
console.log('- Milestone: v1.3 - Quality & Polish');
console.log('- Project: Research Platform Development (add manually if needed)');
