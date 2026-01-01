/**
 * @file setup-github-repo.ts
 * @description scripts/setup-github-repo.ts
 * @author 1
 * @created 2025-01-27
 * @updated 2026-01-01
 * @updates 2
 * @lines 245
 * @size 7.14 KB
 */
/**
 * Script to help set up GitHub repository
 * This script generates instructions and files for GitHub repository setup
 */

import * as fs from 'fs';
import * as path from 'path';

const GITHUB_USERNAME = 'mbwk25';
const REPO_NAME = 'research-platform';
const REPO_DESCRIPTION = 'ERP and scientific platform for environmental and biodiversity research center in northern Morocco';

interface RepoConfig {
  name: string;
  description: string;
  homepage: string;
  topics: string[];
  private: boolean;
  hasIssues: boolean;
  hasProjects: boolean;
  hasWiki: boolean;
  hasDiscussions: boolean;
  allowSquashMerge: boolean;
  allowMergeCommit: boolean;
  allowRebaseMerge: boolean;
  deleteBranchOnMerge: boolean;
}

const repoConfig: RepoConfig = {
  name: REPO_NAME,
  description: REPO_DESCRIPTION,
  homepage: `https://github.com/${GITHUB_USERNAME}/${REPO_NAME}`,
  topics: [
    'nextjs',
    'typescript',
    'prisma',
    'postgresql',
    'postgis',
    'environmental-research',
    'biodiversity',
    'erp',
    'scientific-platform',
    'research-platform',
    'maroc',
    'morocco',
    'leaflet',
    'nextauth',
    'tailwindcss'
  ],
  private: false,
  hasIssues: true,
  hasProjects: true,
  hasWiki: true,
  hasDiscussions: true,
  allowSquashMerge: true,
  allowMergeCommit: true,
  allowRebaseMerge: true,
  deleteBranchOnMerge: true
};

function generateGitHubCLICommands(): string {
  return `# GitHub CLI commands to set up the repository
# Install GitHub CLI: https://cli.github.com/

gh repo create ${REPO_NAME} \\
  --description "${REPO_DESCRIPTION}" \\
  --public \\
  --source=. \\
  --remote=origin \\
  --push

# Set repository topics
gh repo edit ${GITHUB_USERNAME}/${REPO_NAME} --add-topic nextjs --add-topic typescript --add-topic prisma --add-topic postgresql --add-topic postgis --add-topic environmental-research --add-topic biodiversity --add-topic erp --add-topic scientific-platform --add-topic research-platform --add-topic maroc --add-topic morocco --add-topic leaflet --add-topic nextauth --add-topic tailwindcss

# Enable features
gh api repos/${GITHUB_USERNAME}/${REPO_NAME} -X PATCH -f has_issues=true -f has_projects=true -f has_wiki=true -f has_discussions=true

# Set default branch protection (optional)
gh api repos/${GITHUB_USERNAME}/${REPO_NAME}/branches/main/protection -X PUT -f required_status_checks='{"strict":true,"contexts":["ci"]}' -f enforce_admins=true -f required_pull_request_reviews='{"required_approving_review_count":1}' -f restrictions=null
`;
}

function generateSetupInstructions(): string {
  return `# GitHub Repository Setup Instructions

## Prerequisites
- GitHub account: ${GITHUB_USERNAME}
- GitHub CLI installed (optional but recommended): https://cli.github.com/
- Git configured locally

## Method 1: Using GitHub CLI (Recommended)

1. Install GitHub CLI if not already installed
2. Authenticate: \`gh auth login\`
3. Run the setup script:
   \`\`\`bash
   npm run github:setup
   \`\`\`

## Method 2: Using GitHub Web Interface

1. Go to https://github.com/new
2. Repository name: \`${REPO_NAME}\`
3. Description: \`${REPO_DESCRIPTION}\`
4. Visibility: Public
5. DO NOT initialize with README, .gitignore, or license (we already have them)
6. Click "Create repository"

7. Then run these commands locally:
   \`\`\`bash
   git remote add origin https://github.com/${GITHUB_USERNAME}/${REPO_NAME}.git
   git branch -M main
   git push -u origin main
   \`\`\`

8. Configure repository settings:
   - Go to Settings > General
   - Enable Issues, Projects, Wiki, Discussions
   - Set default branch to \`main\`
   - Enable branch protection rules (optional)

9. Add topics:
   - Go to the repository main page
   - Click the gear icon next to "About"
   - Add topics: ${repoConfig.topics.join(', ')}

## Method 3: Using GitHub API

\`\`\`bash
# Create repository
curl -X POST https://api.github.com/user/repos \\
  -H "Authorization: token YOUR_GITHUB_TOKEN" \\
  -d '{
    "name": "${REPO_NAME}",
    "description": "${REPO_DESCRIPTION}",
    "private": false,
    "has_issues": true,
    "has_projects": true,
    "has_wiki": true,
    "has_discussions": true
  }'

# Add topics
curl -X PUT https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/topics \\
  -H "Authorization: token YOUR_GITHUB_TOKEN" \\
  -H "Accept: application/vnd.github.mercy-preview+json" \\
  -d '{
    "names": ${JSON.stringify(repoConfig.topics)}
  }'
\`\`\`

## After Repository Creation

1. Push all files:
   \`\`\`bash
   git add .
   git commit -m "chore: initial commit with complete project setup"
   git push -u origin main
   \`\`\`

2. Verify GitHub Actions are working:
   - Go to Actions tab
   - Check that CI/CD pipeline runs successfully

3. Set up branch protection (optional):
   - Settings > Branches > Add rule
   - Branch name pattern: \`main\`
   - Require pull request reviews
   - Require status checks to pass

4. Create initial release:
   \`\`\`bash
   git tag -a v1.0.0 -m "Initial release"
   git push origin v1.0.0
   \`\`\`

## Repository Configuration

- **Name**: ${repoConfig.name}
- **Description**: ${repoConfig.description}
- **Visibility**: Public
- **Topics**: ${repoConfig.topics.join(', ')}
- **Features Enabled**: Issues, Projects, Wiki, Discussions
- **Default Branch**: main
- **License**: MIT

## Next Steps

1. Review and customize \`.github/workflows/\` files
2. Set up GitHub Secrets for CI/CD (if needed):
   - DATABASE_URL
   - NEXTAUTH_SECRET
   - NEXTAUTH_URL
3. Create initial issues from templates
4. Set up project board
5. Configure wiki pages
`;
}

function main() {
  console.log('📦 Generating GitHub repository setup files...\n');

  // Create setup instructions
  const instructions = generateSetupInstructions();
  fs.writeFileSync('GITHUB_SETUP.md', instructions);
  console.log('✅ Created GITHUB_SETUP.md');

  // Create GitHub CLI commands file
  const cliCommands = generateGitHubCLICommands();
  fs.writeFileSync('scripts/github-cli-commands.sh', cliCommands);
  console.log('✅ Created scripts/github-cli-commands.sh');

  // Create repository config JSON
  fs.writeFileSync(
    'scripts/github-repo-config.json',
    JSON.stringify(repoConfig, null, 2)
  );
  console.log('✅ Created scripts/github-repo-config.json');

  console.log('\n📋 Repository Configuration:');
  console.log(`   Name: ${repoConfig.name}`);
  console.log(`   Description: ${repoConfig.description}`);
  console.log(`   Topics: ${repoConfig.topics.length} topics`);
  console.log(`   Features: Issues, Projects, Wiki, Discussions`);

  console.log('\n📖 Next steps:');
  console.log('   1. Read GITHUB_SETUP.md for detailed instructions');
  console.log('   2. Run: npm run github:setup (if using GitHub CLI)');
  console.log('   3. Or follow manual setup in GITHUB_SETUP.md');
  console.log('   4. Push your code: git push -u origin main');
}

main();

