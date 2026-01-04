# Contributing Guide

Thank you for your interest in contributing to the Research Platform project! This guide will help you get started.

## Getting Started

1. **Fork the repository**
2. **Clone your fork**:
   ```bash
   git clone https://github.com/your-username/research-platform.git
   cd research-platform
   ```

3. **Set up the development environment**:
   ```bash
   npm install
   npm run db:generate
   ```

4. **Create a branch**:
   ```bash
   npm run git:branch feature/your-feature-name
   ```

## Development Workflow

### 1. Make Your Changes

- Write clean, maintainable code
- Follow the project's code style
- Add comments where necessary
- Update documentation as needed

### 2. Update File Headers

Before committing, ensure all TypeScript files have updated metadata headers:

```bash
npm run headers:update
```

### 3. Create Commits

Use the automated commit grouping:

```bash
npm run git:commit-grouped
```

Or create commits manually following the [commit guidelines](docs/GIT_WORKFLOW.md#commit-guidelines).

### 4. Push Your Branch

```bash
npm run git:push
```

### 5. Create a Pull Request

1. Go to the GitHub repository
2. Click "New Pull Request"
3. Select your branch
4. Fill out the PR template
5. Request reviewers

## Code Standards

### TypeScript

- Use TypeScript strict mode
- Define types for all functions
- Avoid `any` types
- Use meaningful variable names

### File Headers

Every `.ts` and `.tsx` file must include a metadata header:

```typescript
/**
 * @file <filename>
 * @description <description>
 * @author <author>
 * @created <date>
 * @updated <date>
 * @updates <count>
 * @lines <count>
 * @size <KB>
 */
```

### Code Style

- Use 2 spaces for indentation
- Use single quotes for strings
- Add trailing commas in objects/arrays
- Use semicolons

### Testing

- Write tests for new features
- Ensure all tests pass before submitting PR
- Add tests for bug fixes

## Branch Naming

Follow the convention: `<type>/<description>`

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation
- `refactor/` - Code refactoring
- `test/` - Tests
- `chore/` - Maintenance

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>: <subject>

<body>
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`

## Pull Request Guidelines

- Keep PRs focused and small
- Include a clear description
- Reference related issues
- Ensure CI passes
- Request appropriate reviewers

## Review Process

1. Automated checks run on PR creation
2. Code review by maintainers
3. Address feedback and update PR
4. Approval and merge

## Questions?

Feel free to open an issue for questions or reach out to the maintainers.

Thank you for contributing! 🎉

