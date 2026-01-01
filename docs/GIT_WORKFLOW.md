# Git & GitHub Workflow Guide

This document outlines the comprehensive Git and GitHub workflow for the Research Platform project, including code change tracking, commit management, branch strategy, and pull request procedures.

## Table of Contents

1. [Repository Setup](#repository-setup)
2. [File Metadata Headers](#file-metadata-headers)
3. [Branch Strategy](#branch-strategy)
4. [Commit Guidelines](#commit-guidelines)
5. [Pull Request Process](#pull-request-process)
6. [Code Review](#code-review)
7. [Documentation Standards](#documentation-standards)

## Repository Setup

### Initial Setup

```bash
# Initialize Git (if not already done)
git init

# Add remote repository
git remote add origin <your-github-repo-url>

# Set up branch tracking
git branch -M main
git push -u origin main
```

### Configuration

```bash
# Set your Git identity
git config user.name "Your Name"
git config user.email "your.email@example.com"

# Set default branch
git config init.defaultBranch main

# Enable auto-update of file headers
git config core.hooksPath .githooks
```

## File Metadata Headers

Every TypeScript file (`.ts` and `.tsx`) in the project must include a metadata header with the following information:

```typescript
/**
 * @file <filename>
 * @description <brief description>
 * @author <author name>
 * @created <creation date (YYYY-MM-DD)>
 * @updated <last update date (YYYY-MM-DD)>
 * @updates <number of updates>
 * @lines <total line count>
 * @size <file size in KB>
 */
```

### Adding/Updating Headers

Use the provided script to automatically add or update headers:

```bash
# Add headers to all TypeScript files
npm run headers:add

# Update headers (increments update count)
npm run headers:update
```

The script will:
- Add headers to files without them
- Update existing headers with current metadata
- Increment update count on each run
- Calculate line count and file size automatically

### Header Maintenance

Headers are automatically updated when:
- Files are committed (via Git hooks)
- Running the update script manually
- Before creating pull requests

## Branch Strategy

### Branch Naming Convention

```
<type>/<short-description>
```

Types:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions/updates
- `chore/` - Maintenance tasks

Examples:
- `feature/user-authentication`
- `fix/map-layer-rendering`
- `docs/api-documentation`
- `refactor/data-models`

### Creating Branches

```bash
# Using the workflow script
npm run git:branch <branch-name>

# Or manually
git checkout -b feature/my-feature
```

### Branch Workflow

1. **Start from main**: Always create branches from the latest `main` branch
2. **Keep branches focused**: One feature/fix per branch
3. **Keep branches updated**: Regularly merge `main` into your branch
4. **Delete after merge**: Remove branches after PR is merged

## Commit Guidelines

### Commit Message Format

```
<type>: <subject>

<body>

<footer>
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Test additions/updates
- `chore`: Maintenance tasks

### Creating Coherent Commits

The project uses a script to automatically group related changes into coherent commits:

```bash
# Create multiple coherent commits from staged/unstaged changes
npm run git:commit-grouped
```

This script:
- Groups files by type (API, components, lib, docs, etc.)
- Creates separate commits for each group
- Uses appropriate commit types
- Ensures logical commit history

### Manual Commit Process

1. **Stage related files**: `git add <files>`
2. **Create commit**: `git commit -m "feat: add user authentication"`
3. **Write detailed body** (optional): Use `git commit` without `-m` for multi-line messages

### Commit Best Practices

- ✅ Make small, focused commits
- ✅ Write clear, descriptive messages
- ✅ Group related changes together
- ✅ Test before committing
- ❌ Don't commit broken code
- ❌ Don't commit large binary files
- ❌ Don't commit sensitive data

## Pull Request Process

### Creating a Pull Request

1. **Ensure your branch is up to date**:
   ```bash
   git checkout main
   git pull origin main
   git checkout your-branch
   git merge main
   ```

2. **Update file headers**:
   ```bash
   npm run headers:update
   ```

3. **Create coherent commits**:
   ```bash
   npm run git:commit-grouped
   ```

4. **Push your branch**:
   ```bash
   npm run git:push
   # Or: git push -u origin your-branch
   ```

5. **Create PR on GitHub**:
   - Go to your repository on GitHub
   - Click "New Pull Request"
   - Select your branch
   - Fill out the PR template
   - Request reviewers

### PR Template

Use the provided PR template (`.github/pull_request_template.md`) which includes:
- Description of changes
- Type of change
- Testing instructions
- Checklist
- Screenshots (if applicable)

### Generating PR Description

```bash
# Generate PR description from commits
npm run git:pr-desc
```

### PR Review Checklist

Before submitting:
- [ ] Code follows project style guidelines
- [ ] All tests pass
- [ ] Documentation updated
- [ ] File headers updated
- [ ] No console.logs or debug code
- [ ] No sensitive data committed
- [ ] Branch is up to date with main

## Code Review

### Review Process

1. **Automated checks**: CI/CD runs automatically
2. **Peer review**: At least one approval required
3. **Address feedback**: Update branch with requested changes
4. **Re-request review**: After addressing feedback

### Review Guidelines

Reviewers should check:
- Code quality and style
- Functionality and edge cases
- Test coverage
- Documentation completeness
- Performance implications
- Security considerations

## Documentation Standards

### Code Comments

- Use JSDoc comments for functions/classes
- Explain "why" not "what"
- Keep comments up to date with code

### README Updates

- Update README for new features
- Document breaking changes
- Include usage examples

### API Documentation

- Document all API endpoints
- Include request/response examples
- Document error cases

## Git Hooks

The project includes Git hooks for:
- Pre-commit: Update file headers
- Pre-push: Run tests
- Commit-msg: Validate commit messages

Hooks are located in `.githooks/` directory.

## Troubleshooting

### Merge Conflicts

```bash
# Update your branch
git checkout main
git pull origin main
git checkout your-branch
git merge main

# Resolve conflicts, then:
git add .
git commit -m "fix: resolve merge conflicts"
```

### Undoing Changes

```bash
# Unstage files
git reset HEAD <file>

# Discard changes
git checkout -- <file>

# Undo last commit (keep changes)
git reset --soft HEAD~1
```

### Updating File Headers

If headers get out of sync:
```bash
npm run headers:update
git add .
git commit -m "chore: update file headers"
```

## Additional Resources

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)

