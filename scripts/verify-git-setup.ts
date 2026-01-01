/**
 * @file verify-git-setup.ts
 * @description scripts/verify-git-setup.ts
 * @author 1
 * @created 2025-01-27
 * @updated 2026-01-01
 * @updates 2
 * @lines 134
 * @size 3.87 KB
 */
/**
 * Script to verify Git and GitHub setup
 */

import * as fs from 'fs';
import * as path from 'path';
import * as child_process from 'child_process';

const exec = (command: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    child_process.exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(stderr || error.message));
      } else {
        resolve(stdout.trim());
      }
    });
  });
};

interface CheckResult {
  name: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
}

const checks: CheckResult[] = [];

function check(name: string, condition: boolean, passMsg: string, failMsg: string): void {
  checks.push({
    name,
    status: condition ? 'pass' : 'fail',
    message: condition ? passMsg : failMsg
  });
}

async function verifyGitSetup(): Promise<void> {
  console.log('🔍 Verifying Git & GitHub Setup...\n');

  // Check Git installation
  try {
    await exec('git --version');
    check('Git installed', true, 'Git is installed', 'Git is not installed');
  } catch {
    check('Git installed', false, '', 'Git is not installed');
  }

  // Check if Git repo is initialized
  const gitDir = path.join(process.cwd(), '.git');
  check('Git repository', fs.existsSync(gitDir), 'Git repository initialized', 'Git repository not initialized');

  // Check package.json scripts
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
  const requiredScripts = [
    'headers:update',
    'git:branch',
    'git:commit-grouped',
    'git:push',
    'git:pr-desc'
  ];
  
  requiredScripts.forEach(script => {
    const exists = packageJson.scripts && packageJson.scripts[script];
    check(`Script: ${script}`, !!exists, `Script ${script} exists`, `Script ${script} missing`);
  });

  // Check documentation files
  const docs = [
    'docs/GIT_WORKFLOW.md',
    'README_GIT_SETUP.md',
    'CONTRIBUTING.md',
    '.github/pull_request_template.md'
  ];
  
  docs.forEach(doc => {
    const exists = fs.existsSync(doc);
    check(`Documentation: ${path.basename(doc)}`, exists, `${doc} exists`, `${doc} missing`);
  });

  // Check Git hooks
  const hooks = [
    '.githooks/pre-commit',
    '.githooks/commit-msg'
  ];
  
  hooks.forEach(hook => {
    const exists = fs.existsSync(hook);
    check(`Git hook: ${path.basename(hook)}`, exists, `${hook} exists`, `${hook} missing`);
  });

  // Check if headers script exists
  check('Header script', fs.existsSync('scripts/add-file-headers.ts'), 'Header script exists', 'Header script missing');
  check('Workflow script', fs.existsSync('scripts/git-workflow.ts'), 'Workflow script exists', 'Workflow script missing');

  // Check Git remote (optional)
  try {
    const remotes = await exec('git remote -v');
    check('GitHub remote', remotes.includes('origin'), 'GitHub remote configured', 'GitHub remote not configured (optional)');
  } catch {
    check('GitHub remote', false, '', 'GitHub remote not configured (optional)');
  }

  // Print results
  console.log('Results:\n');
  checks.forEach(check => {
    const icon = check.status === 'pass' ? '✅' : check.status === 'warning' ? '⚠️' : '❌';
    console.log(`${icon} ${check.name}: ${check.message}`);
  });

  const passed = checks.filter(c => c.status === 'pass').length;
  const total = checks.length;
  
  console.log(`\n📊 Summary: ${passed}/${total} checks passed\n`);

  if (passed === total) {
    console.log('🎉 All checks passed! Your Git setup is complete.');
  } else {
    console.log('⚠️  Some checks failed. Please review the results above.');
  }
}

verifyGitSetup().catch(console.error);

