# Git & GitHub Setup Guide

This guide will help you set up Git and GitHub integration for the Research Platform project.

## Quick Start

### 1. Initial Git Setup

```bash
# Git is already initialized, but configure your identity:
git config user.name "Your Name"
git config user.email "your.email@example.com"

# Set up Git hooks (optional but recommended)
git config core.hooksPath .githooks
```

### 2. Connect to GitHub

```bash
# Add your GitHub repository as remote
git remote add origin https://github.com/your-username/research-platform.git

# Or if using SSH
git remote add origin git@github.com:your-username/research-platform.git

# Verify remote
git remote -v
```

### 3. Initial Commit

```bash
# Add all files
git add .

# Create initial commit
git commit -m "chore: initial commit with Git workflow setup"

# Push to GitHub
git push -u origin main
```

## File Headers

All TypeScript files must have metadata headers. Run this command to add/update headers:

```bash
npm run headers:update
```

This will:
- Add headers to files without them
- Update existing headers with current metadata
- Track author, dates, update count, line count, and file size

## Workflow Commands

### Create a Branch

```bash
npm run git:branch feature/my-feature
```

### Create Coherent Commits

```bash
# This automatically groups related files into logical commits
npm run git:commit-grouped
```

### Push Branch

```bash
npm run git:push
```

### Generate PR Description

```bash
npm run git:pr-desc
```

## Complete Workflow Example

```bash
# 1. Create a new branch
npm run git:branch feature/user-authentication

# 2. Make your changes
# ... edit files ...

# 3. Update file headers
npm run headers:update

# 4. Create coherent commits
npm run git:commit-grouped

# 5. Push to GitHub
npm run git:push

# 6. Create PR on GitHub and use generated description
npm run git:pr-desc
```

## Git Hooks

The project includes Git hooks that:
- **Pre-commit**: Automatically update file headers before committing
- **Commit-msg**: Validate commit message format

To enable hooks:
```bash
git config core.hooksPath .githooks
```

## Branch Strategy

- `main` - Production-ready code
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation
- `refactor/` - Code refactoring

## Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>: <subject>

<body>
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`

Examples:
- `feat: add user authentication`
- `fix: resolve map layer rendering issue`
- `docs: update API documentation`

## Pull Requests

1. Ensure your branch is up to date with `main`
2. Update file headers: `npm run headers:update`
3. Create coherent commits: `npm run git:commit-grouped`
4. Push your branch: `npm run git:push`
5. Create PR on GitHub using the template
6. Generate PR description: `npm run git:pr-desc`

## Documentation

For detailed information, see:
- [Git Workflow Guide](docs/GIT_WORKFLOW.md) - Complete workflow documentation
- [Contributing Guide](CONTRIBUTING.md) - Contribution guidelines
- [PR Template](.github/pull_request_template.md) - Pull request template

## Troubleshooting

### Headers Not Updating

```bash
# Manually update headers
npm run headers:update
```

### Merge Conflicts

```bash
# Update your branch
git checkout main
git pull origin main
git checkout your-branch
git merge main
# Resolve conflicts, then commit
```

### Undo Last Commit

```bash
# Keep changes
git reset --soft HEAD~1

# Discard changes
git reset --hard HEAD~1
```

## Next Steps

1. Set up your GitHub repository
2. Configure Git identity
3. Add file headers to all TypeScript files
4. Create your first feature branch
5. Start contributing!

For questions or issues, please open an issue on GitHub.

