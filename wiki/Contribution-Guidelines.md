# Contribution Guidelines

Thank you for your interest in contributing to the Research Platform! This guide will help you understand how to contribute effectively to the project.

## Getting Started

### 1. Fork and Clone

```bash
# Fork the repository on GitHub, then:
git clone https://github.com/your-username/research-platform.git
cd research-platform
```

### 2. Set Up Development Environment

Follow the [Development Workflow](./Development-Workflow.md) guide to set up your local environment.

### 3. Create a Branch

```bash
npm run git:branch feature/your-feature-name
```

Or manually:
```bash
git checkout -b feature/your-feature-name
```

## Branch Naming Convention

Follow this pattern: `<type>/<short-description>`

**Types**:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions/updates
- `chore/` - Maintenance tasks

**Examples**:
- `feature/user-profile-page`
- `fix/mission-date-validation`
- `docs/api-documentation`
- `refactor/species-observations`

## Development Process

### 1. Make Your Changes

- Write clean, maintainable code
- Follow the project's code style
- Add comments where necessary
- Update documentation as needed

### 2. Update File Headers

Before committing, update file metadata headers:

```bash
npm run headers:update
```

This ensures all TypeScript files have current metadata.

### 3. Create Commits

**Recommended**: Use automated commit grouping:

```bash
npm run git:commit-grouped
```

This automatically groups related changes into logical commits.

**Manual**: Follow Conventional Commits format:

```bash
git add .
git commit -m "feat: add user profile page"
```

### Commit Message Format

```
<type>: <subject>

<body>

<footer>
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Test additions/updates
- `chore`: Maintenance tasks

**Examples**:
```
feat: add species observation export

Adds Excel export functionality for species observations
with filtering and date range selection.

Closes #123
```

```
fix: correct mission date validation

Fixes issue where mission end date could be before start date.
Adds validation in both frontend and backend.

Fixes #456
```

### 4. Push Your Branch

```bash
npm run git:push
```

Or manually:
```bash
git push -u origin feature/your-feature-name
```

### 5. Create Pull Request

1. Go to the GitHub repository
2. Click "New Pull Request"
3. Select your branch
4. Fill out the PR template
5. Request reviewers

## Code Standards

### TypeScript

- **Use TypeScript strict mode**: Already configured
- **Define types for all functions**: Avoid `any`
- **Use meaningful variable names**: Self-documenting code
- **Add JSDoc comments**: For complex functions

**Example**:
```typescript
/**
 * Calculate species observation statistics
 * @param speciesId - The species identifier
 * @param dateRange - Optional date range filter
 * @returns Observation statistics
 */
async function getObservationStats(
  speciesId: string,
  dateRange?: { start: Date; end: Date }
): Promise<ObservationStats> {
  // Implementation
}
```

### File Headers

Every `.ts` and `.tsx` file must include a metadata header:

```typescript
/**
 * @file component.tsx
 * @description Brief description of the file
 * @author Your Name
 * @created YYYY-MM-DD
 * @updated YYYY-MM-DD
 * @updates Count
 * @lines Line count
 * @size Size in KB
 */
```

**Update headers**:
```bash
npm run headers:update
```

### Code Style

**Indentation**: 2 spaces

**Quotes**: Single quotes for strings

**Semicolons**: Always use semicolons

**Trailing Commas**: Add trailing commas in objects/arrays

**Example**:
```typescript
const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
};
```

### Component Structure

**Server Components** (default):
```typescript
// No "use client" directive
export default async function Page() {
  const data = await fetchData();
  return <div>{/* JSX */}</div>;
}
```

**Client Components** (when needed):
```typescript
'use client';

import { useState } from 'react';

export default function InteractiveComponent() {
  const [state, setState] = useState();
  return <div>{/* JSX */}</div>;
}
```

### API Routes

**Structure**:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/permissions';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const session = await requireAuth();
  // Implementation
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const session = await requireAuth();
  const body = await request.json();
  // Validation
  // Implementation
  return NextResponse.json(result, { status: 201 });
}
```

## Testing

### Manual Testing

Before submitting a PR:

1. **Test your changes**: Navigate and test all affected features
2. **Check console**: No errors in browser or terminal
3. **Test edge cases**: Empty states, errors, loading states
4. **Test different roles**: If applicable, test with different user roles

### Database Testing

**Prisma Studio**:
```bash
npm run db:studio
```

Verify data changes are correct.

### Linting

**Run linter**:
```bash
npm run lint
```

**Fix issues**:
```bash
npm run lint -- --fix
```

All code must pass linting before PR submission.

## Pull Request Guidelines

### PR Checklist

Before submitting:

- [ ] Code follows project style guidelines
- [ ] All tests pass (manual testing completed)
- [ ] Linter passes (`npm run lint`)
- [ ] Documentation updated (if needed)
- [ ] File headers updated (`npm run headers:update`)
- [ ] No console.logs or debug code
- [ ] No sensitive data committed
- [ ] Branch is up to date with main
- [ ] Commit messages follow conventions

### PR Description

Use the PR template and include:

1. **Description**: What changes were made and why
2. **Type of Change**: Feature, bug fix, refactor, etc.
3. **Testing**: How to test the changes
4. **Screenshots**: If UI changes (optional)
5. **Related Issues**: Reference related issues

**Example PR Description**:
```markdown
## Description
Adds Excel export functionality for species observations with filtering options.

## Type of Change
- [x] New feature
- [ ] Bug fix
- [ ] Documentation

## Testing
1. Navigate to /dashboard/species
2. Apply filters
3. Click "Export to Excel"
4. Verify exported file contains filtered data

## Related Issues
Closes #123
```

### PR Size

**Keep PRs focused and small**:
- One feature or fix per PR
- Easier to review
- Faster to merge
- Less risk of conflicts

**If your PR is large**:
- Consider breaking into smaller PRs
- Or clearly explain why it must be large
- Add detailed description

## Review Process

### Automated Checks

When you create a PR:
1. **CI/CD runs**: Automated tests and checks
2. **Linter runs**: Code quality checks
3. **Build runs**: Verify build succeeds

### Code Review

**Reviewers will check**:
- Code quality and style
- Functionality and edge cases
- Test coverage
- Documentation completeness
- Performance implications
- Security considerations

### Addressing Feedback

1. **Read feedback carefully**: Understand requested changes
2. **Make changes**: Update your branch
3. **Update commits**: Add new commits or amend
4. **Re-request review**: After addressing feedback

**Example**:
```bash
# Make changes
git add .
git commit -m "fix: address review feedback"
git push
# Re-request review on GitHub
```

## Documentation

### Code Comments

**When to comment**:
- Complex logic or algorithms
- Non-obvious decisions
- Workarounds or temporary solutions
- Public APIs

**JSDoc for functions**:
```typescript
/**
 * Validates mission dates and returns error if invalid
 * @param startDate - Mission start date
 * @param endDate - Mission end date
 * @returns Error message or null if valid
 */
function validateMissionDates(
  startDate: Date,
  endDate: Date
): string | null {
  // Implementation
}
```

### README Updates

**Update README if**:
- New features added
- Installation process changes
- New dependencies added
- Configuration changes

### Wiki Updates

**Update Wiki if**:
- Architecture changes
- New modules added
- Workflow changes
- Significant feature additions

## Git Workflow Best Practices

### Commit Best Practices

✅ **Do**:
- Make small, focused commits
- Write clear, descriptive messages
- Group related changes together
- Test before committing

❌ **Don't**:
- Commit broken code
- Commit large binary files
- Commit sensitive data (passwords, keys)
- Commit generated files (unless necessary)

### Branch Management

**Keep branches updated**:
```bash
# Update your branch with latest main
git checkout main
git pull origin main
git checkout your-branch
git merge main
```

**Resolve conflicts**:
1. Merge main into your branch
2. Resolve conflicts
3. Test changes
4. Commit resolution

### Clean Up

**After PR is merged**:
```bash
# Delete local branch
git checkout main
git pull origin main
git branch -d feature/your-feature-name

# Delete remote branch (if not auto-deleted)
git push origin --delete feature/your-feature-name
```

## Code of Conduct

### Be Respectful

- Be respectful in all interactions
- Provide constructive feedback
- Accept feedback gracefully
- Help others learn and grow

### Be Professional

- Write professional commit messages
- Write professional PR descriptions
- Respond to reviews professionally
- Follow project conventions

### Be Collaborative

- Help others when possible
- Share knowledge
- Document your work
- Ask questions when needed

## Getting Help

### Questions?

- **Check documentation**: Wiki, README, code comments
- **Search issues**: Check if question was asked before
- **Open an issue**: For bugs or feature requests
- **Ask maintainers**: For clarification

### Stuck?

- **Review similar code**: Look at existing implementations
- **Check examples**: Review similar features
- **Ask for help**: Don't hesitate to ask

## Recognition

Contributors will be:
- Listed in project documentation (if desired)
- Credited in commit history
- Acknowledged in release notes (for significant contributions)

Thank you for contributing to the Research Platform! 🎉

---

*Following these guidelines ensures consistent, high-quality contributions that benefit the entire project.*
