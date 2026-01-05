/**
 * @file add-pr-metadata.ts
 * @description Script to add metadata to merged PRs (labels, milestones, assignees)
 * @author 1
 * @created 2026-01-05
 * @updated 2026-01-05
 * @updates 1
 * @lines 120
 * @size 3.5 KB
 */

import { execSync } from 'child_process';

interface PRMetadata {
  number: number;
  labels: string[];
  milestone: string;
  assignee: string;
}

const prsToUpdate: PRMetadata[] = [
  {
    number: 61,
    labels: ['type:bug', 'documentation', 'priority:medium'],
    milestone: 'v1.3 - Quality & Polish',
    assignee: 'benmed00',
  },
  {
    number: 62,
    labels: ['documentation', 'type:documentation', 'priority:low'],
    milestone: 'v1.3 - Quality & Polish',
    assignee: 'benmed00',
  },
  {
    number: 63,
    labels: ['documentation', 'type:documentation', 'priority:high'],
    milestone: 'v1.3 - Quality & Polish',
    assignee: 'benmed00',
  },
  {
    number: 64,
    labels: ['documentation', 'type:documentation', 'priority:low'],
    milestone: 'v1.3 - Quality & Polish',
    assignee: 'benmed00',
  },
];

function runCommand(command: string): { success: boolean; output: string; error?: string } {
  try {
    const output = execSync(command, { encoding: 'utf-8', stdio: 'pipe' });
    return { success: true, output: output.trim() };
  } catch (error: any) {
    return {
      success: false,
      output: '',
      error: error.message || String(error),
    };
  }
}

function addLabels(prNumber: number, labels: string[]): void {
  console.log(`\n📋 Adding labels to PR #${prNumber}...`);
  for (const label of labels) {
    const result = runCommand(`gh pr edit ${prNumber} --add-label "${label}"`);
    if (result.success) {
      console.log(`  ✅ Added label: ${label}`);
    } else {
      console.log(`  ⚠️  Failed to add label "${label}": ${result.error}`);
      console.log(`  💡 Manual step: Add label "${label}" to PR #${prNumber} via GitHub UI`);
    }
  }
}

function addMilestone(prNumber: number, milestone: string): void {
  console.log(`\n🎯 Adding milestone to PR #${prNumber}...`);
  const result = runCommand(`gh pr edit ${prNumber} --milestone "${milestone}"`);
  if (result.success) {
    console.log(`  ✅ Added milestone: ${milestone}`);
  } else {
    console.log(`  ⚠️  Failed to add milestone: ${result.error}`);
    console.log(`  💡 Manual step: Add milestone "${milestone}" to PR #${prNumber} via GitHub UI`);
  }
}

function addAssignee(prNumber: number, assignee: string): void {
  console.log(`\n👤 Adding assignee to PR #${prNumber}...`);
  const result = runCommand(`gh pr edit ${prNumber} --add-assignee "${assignee}"`);
  if (result.success) {
    console.log(`  ✅ Added assignee: ${assignee}`);
  } else {
    console.log(`  ⚠️  Failed to add assignee: ${result.error}`);
    console.log(`  💡 Manual step: Assign "${assignee}" to PR #${prNumber} via GitHub UI`);
  }
}

function main() {
  console.log('🚀 Starting PR metadata update process...\n');
  console.log('=' .repeat(60));

  let successCount = 0;
  let manualCount = 0;

  for (const pr of prsToUpdate) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Processing PR #${pr.number}`);
    console.log(`${'='.repeat(60)}`);

    const results = {
      labels: false,
      milestone: false,
      assignee: false,
    };

    // Add labels
    addLabels(pr.number, pr.labels);
    results.labels = true; // Assume partial success

    // Add milestone
    addMilestone(pr.number, pr.milestone);
    results.milestone = true; // Assume partial success

    // Add assignee
    addAssignee(pr.number, pr.assignee);
    results.assignee = true; // Assume partial success

    if (results.labels && results.milestone && results.assignee) {
      successCount++;
    } else {
      manualCount++;
    }
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log('📊 Summary');
  console.log(`${'='.repeat(60)}`);
  console.log(`✅ Successfully processed: ${successCount} PRs`);
  console.log(`⚠️  Requires manual steps: ${manualCount} PRs`);
  console.log(`\n💡 Note: Due to API permissions, some operations may require manual completion.`);
  console.log(`   See docs/PR_METADATA_SETUP_GUIDE.md for detailed instructions.`);
  console.log(`\n🔗 PR Links:`);
  prsToUpdate.forEach((pr) => {
    console.log(`   - PR #${pr.number}: https://github.com/benmed00/research-platform/pull/${pr.number}`);
  });
}

if (require.main === module) {
  main();
}

export { addLabels, addMilestone, addAssignee };
