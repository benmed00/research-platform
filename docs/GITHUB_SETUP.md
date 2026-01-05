# GitHub Repository Setup Instructions

## Prerequisites
- GitHub account: mbwk25
- GitHub CLI installed (optional but recommended): https://cli.github.com/
- Git configured locally

## Method 1: Using GitHub CLI (Recommended)

1. Install GitHub CLI if not already installed
2. Authenticate: `gh auth login`
3. Run the setup script:
   ```bash
   npm run github:setup
   ```

## Method 2: Using GitHub Web Interface

1. Go to https://github.com/new
2. Repository name: `research-platform`
3. Description: `ERP and scientific platform for environmental and biodiversity research center in northern Morocco`
4. Visibility: Public
5. DO NOT initialize with README, .gitignore, or license (we already have them)
6. Click "Create repository"

7. Then run these commands locally:
   ```bash
   git remote add origin https://github.com/mbwk25/research-platform.git
   git branch -M main
   git push -u origin main
   ```

8. Configure repository settings:
   - Go to Settings > General
   - Enable Issues, Projects, Wiki, Discussions
   - Set default branch to `main`
   - Enable branch protection rules (optional)

9. Add topics:
   - Go to the repository main page
   - Click the gear icon next to "About"
   - Add topics: nextjs, typescript, prisma, postgresql, postgis, environmental-research, biodiversity, erp, scientific-platform, research-platform, maroc, morocco, leaflet, nextauth, tailwindcss

## Method 3: Using GitHub API

```bash
# Create repository
curl -X POST https://api.github.com/user/repos \
  -H "Authorization: token YOUR_GITHUB_TOKEN" \
  -d '{
    "name": "research-platform",
    "description": "ERP and scientific platform for environmental and biodiversity research center in northern Morocco",
    "private": false,
    "has_issues": true,
    "has_projects": true,
    "has_wiki": true,
    "has_discussions": true
  }'

# Add topics
curl -X PUT https://api.github.com/repos/mbwk25/research-platform/topics \
  -H "Authorization: token YOUR_GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.mercy-preview+json" \
  -d '{
    "names": ["nextjs","typescript","prisma","postgresql","postgis","environmental-research","biodiversity","erp","scientific-platform","research-platform","maroc","morocco","leaflet","nextauth","tailwindcss"]
  }'
```

## After Repository Creation

1. Push all files:
   ```bash
   git add .
   git commit -m "chore: initial commit with complete project setup"
   git push -u origin main
   ```

2. Verify GitHub Actions are working:
   - Go to Actions tab
   - Check that CI/CD pipeline runs successfully

3. Set up branch protection (optional):
   - Settings > Branches > Add rule
   - Branch name pattern: `main`
   - Require pull request reviews
   - Require status checks to pass

4. Create initial release:
   ```bash
   git tag -a v1.0.0 -m "Initial release"
   git push origin v1.0.0
   ```

## Repository Configuration

- **Name**: research-platform
- **Description**: ERP and scientific platform for environmental and biodiversity research center in northern Morocco
- **Visibility**: Public
- **Topics**: nextjs, typescript, prisma, postgresql, postgis, environmental-research, biodiversity, erp, scientific-platform, research-platform, maroc, morocco, leaflet, nextauth, tailwindcss
- **Features Enabled**: Issues, Projects, Wiki, Discussions
- **Default Branch**: main
- **License**: MIT

## Next Steps

1. Review and customize `.github/workflows/` files
2. Set up GitHub Secrets for CI/CD (if needed):
   - DATABASE_URL
   - NEXTAUTH_SECRET
   - NEXTAUTH_URL
3. Create initial issues from templates
4. Set up project board
5. Configure wiki pages
