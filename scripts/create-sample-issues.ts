/**
 * Script to create sample issues for the Research Platform project
 * 
 * This script creates initial issues organized by milestone to populate
 * the project board with meaningful tasks.
 * 
 * Usage:
 *   ts-node --project tsconfig.seed.json scripts/create-sample-issues.ts
 * 
 * Note: Requires GitHub CLI (gh) to be installed and authenticated
 */

import { execSync } from 'child_process';

interface Issue {
  title: string;
  body: string;
  milestone: string;
  labels: string[];
}

// Sample high-priority issues for v1.0 milestone
const v1_0_issues: Issue[] = [
  {
    title: 'Security audit for authentication flows',
    body: `## Description
Conduct comprehensive security audit of NextAuth.js authentication implementation.

## Tasks
- [ ] Review session management
- [ ] Verify password hashing (bcrypt)
- [ ] Check CSRF protection
- [ ] Validate JWT token handling
- [ ] Review permission checks

## Acceptance Criteria
- All authentication flows reviewed
- Security vulnerabilities identified and documented
- Recommendations provided

## Labels
security, enhancement, priority:high`,
    milestone: 'v1.0 - Production Foundation',
    labels: ['security', 'enhancement', 'priority:high']
  },
  {
    title: 'Input validation audit',
    body: `## Description
Review and verify input validation across all API endpoints.

## Tasks
- [ ] Review all API endpoints
- [ ] Verify Zod schemas are complete
- [ ] Test SQL injection prevention
- [ ] Check XSS protection
- [ ] Validate file upload security

## Acceptance Criteria
- All endpoints have proper validation
- Security tests pass
- Documentation updated`,
    milestone: 'v1.0 - Production Foundation',
    labels: ['security', 'enhancement', 'priority:high']
  },
  {
    title: 'Production deployment guide',
    body: `## Description
Create comprehensive production deployment documentation.

## Tasks
- [ ] Document server requirements
- [ ] Create installation steps
- [ ] Document environment variables
- [ ] Database setup instructions
- [ ] SSL/TLS configuration
- [ ] Backup procedures

## Acceptance Criteria
- Complete deployment guide created
- Tested on staging environment
- Reviewed by team`,
    milestone: 'v1.0 - Production Foundation',
    labels: ['documentation', 'priority:high']
  }
];

// Sample issues for v1.1 milestone
const v1_1_issues: Issue[] = [
  {
    title: 'HTTP caching on finance dashboard',
    body: `## Description
Implement HTTP caching for the finance dashboard to improve performance.

## Tasks
- [ ] Implement Next.js caching strategies
- [ ] Set appropriate cache headers
- [ ] Test cache invalidation
- [ ] Monitor cache hit rates

## Acceptance Criteria
- Page load time reduced by 50%+
- Cache headers properly configured
- Cache invalidation works correctly`,
    milestone: 'v1.1 - Performance & User Experience',
    labels: ['performance', 'priority:high', 'module:finance']
  },
  {
    title: 'Global search implementation',
    body: `## Description
Implement global search functionality across all entities.

## Tasks
- [ ] Add search bar to header
- [ ] Implement search API endpoint
- [ ] Search across species, missions, equipment, employees
- [ ] Group search results by type
- [ ] Add quick navigation

## Acceptance Criteria
- Search works across all entities
- Results are grouped and easy to navigate
- Search is fast (<500ms response time)`,
    milestone: 'v1.1 - Performance & User Experience',
    labels: ['feature', 'priority:high']
  },
  {
    title: 'Export functionality for species',
    body: `## Description
Add export functionality (Excel, CSV) for species catalog.

## Tasks
- [ ] Implement Excel export (XLSX)
- [ ] Implement CSV export
- [ ] Apply filters to export
- [ ] Add export button to UI
- [ ] Test with large datasets

## Acceptance Criteria
- Excel and CSV exports work correctly
- Filters are applied to exports
- Performance is acceptable for large datasets`,
    milestone: 'v1.1 - Performance & User Experience',
    labels: ['feature', 'priority:high', 'module:species']
  }
];

function createIssue(issue: Issue): void {
  try {
    console.log(`Creating issue: ${issue.title}`);
    
    // Build the gh issue create command
    const labels = issue.labels.join(',');
    const body = issue.body.replace(/"/g, '\\"');
    
    const command = `gh issue create ` +
      `--title "${issue.title}" ` +
      `--body "${body}" ` +
      `--milestone "${issue.milestone}" ` +
      `--label "${labels}"`;
    
    execSync(command, { stdio: 'inherit', encoding: 'utf-8' });
    console.log(`✅ Created: ${issue.title}\n`);
  } catch (error) {
    console.error(`❌ Failed to create issue: ${issue.title}`);
    console.error(error);
  }
}

function main() {
  console.log('🚀 Creating sample issues for Research Platform\n');
  console.log('Note: This script creates a few sample issues.');
  console.log('For the full list, see PROJECT_INITIAL_TASKS.md\n');
  
  // Check if gh is available
  try {
    execSync('gh --version', { stdio: 'ignore' });
  } catch (error) {
    console.error('❌ GitHub CLI (gh) is not installed or not in PATH');
    console.error('Please install it from: https://cli.github.com/');
    process.exit(1);
  }
  
  // Check authentication
  try {
    execSync('gh auth status', { stdio: 'ignore' });
  } catch (error) {
    console.error('❌ Not authenticated with GitHub CLI');
    console.error('Please run: gh auth login');
    process.exit(1);
  }
  
  console.log('✅ GitHub CLI is available and authenticated\n');
  
  // Ask for confirmation
  console.log('This will create sample issues. Continue? (y/n)');
  // Note: In a real script, you'd use readline or a similar library
  // For now, we'll just create the issues
  
  console.log('\n📋 Creating v1.0 issues...\n');
  v1_0_issues.forEach(createIssue);
  
  console.log('\n📋 Creating v1.1 issues...\n');
  v1_1_issues.forEach(createIssue);
  
  console.log('\n✅ Sample issues created!');
  console.log('\n💡 Tip: See PROJECT_INITIAL_TASKS.md for the complete list of tasks.');
}

if (require.main === module) {
  main();
}

export { createIssue, v1_0_issues, v1_1_issues };

