# Automated Workflows Documentation

This document describes all automated workflows configured for the Research Platform project. These workflows enhance project **structure**, **stability**, **longevity**, **coherence**, and **semantics**.

## 📋 Workflow Overview

### 🔄 Continuous Integration Workflows

#### 1. **CI/CD Pipeline** (`ci.yml`)
- **Purpose**: Main CI pipeline that runs on every push/PR
- **Features**:
  - Linting and type checking
  - Unit tests with coverage
  - Build verification
  - Security scanning
- **Triggers**: Push to main/develop, Pull requests

#### 2. **Test Suite** (`test.yml`)
- **Purpose**: Dedicated test execution
- **Features**:
  - Multi-version Node.js testing
  - Test result artifacts
  - Coverage reporting
- **Triggers**: Push to main/develop, Pull requests

#### 3. **Build Verification** (`build.yml`)
- **Purpose**: Ensure application builds successfully
- **Features**:
  - Prisma client generation
  - Production build
  - Build size analysis
- **Triggers**: Push to main/develop, Pull requests

#### 4. **Linting** (`lint.yml`)
- **Purpose**: Code style and quality checks
- **Features**:
  - ESLint validation
  - TypeScript compilation check
  - Zero warnings policy
- **Triggers**: Push to main/develop, Pull requests

---

### 🎯 Quality & Coherence Workflows

#### 5. **Code Quality & Coherence** (`code-quality.yml`)
- **Purpose**: Maintain code structure and consistency
- **Features**:
  - ✅ File header consistency validation
  - ✅ Import organization checks
  - ✅ Code structure analysis
  - ✅ File size monitoring (>500 lines warning)
  - ✅ Circular dependency detection
- **Benefits**:
  - Ensures consistent code style
  - Identifies overly complex files
  - Maintains project structure
- **Triggers**: Push to main/develop, Pull requests, Manual dispatch

#### 6. **PR Quality Check** (`pr-quality-check.yml`)
- **Purpose**: Ensure pull requests meet quality standards
- **Features**:
  - ✅ PR size validation (warns if >1000 lines or >50 files)
  - ✅ Test coverage for changed files
  - ✅ PR description quality check
  - ✅ Breaking change detection
  - ✅ Console statement detection
  - ✅ Database migration verification
- **Benefits**:
  - Improves code review efficiency
  - Ensures comprehensive PRs
  - Prevents common issues early
- **Triggers**: PR opened, synchronized, reopened, ready for review

---

### 🗄️ Database & Schema Workflows

#### 7. **Prisma Schema & Migration Validation** (`prisma-validation.yml`)
- **Purpose**: Ensure database schema integrity and migration safety
- **Features**:
  - ✅ Prisma schema syntax validation
  - ✅ Breaking change detection
  - ✅ Migration safety checks (with test database)
  - ✅ Schema consistency verification
  - ✅ Client generation validation
- **Benefits**:
  - Prevents database schema errors
  - Validates migration safety
  - Ensures type safety
- **Triggers**: Changes to `prisma/schema.prisma` or migrations, Manual dispatch

---

### 📦 Dependency Management Workflows

#### 8. **Dependency Health & Security Monitoring** (`dependency-health.yml`)
- **Purpose**: Maintain dependency health and security
- **Features**:
  - ✅ Security audit (npm audit)
  - ✅ Outdated package detection
  - ✅ License compliance checking
  - ✅ Deprecation warning monitoring
  - ✅ Vulnerability tracking (critical, high, moderate)
- **Schedule**: Weekly on Mondays at 9 AM UTC
- **Benefits**:
  - Keeps dependencies up-to-date
  - Identifies security vulnerabilities
  - Ensures license compliance
- **Triggers**: Weekly schedule, Package.json changes, Manual dispatch

#### 9. **Enhanced Dependabot Configuration** (`dependabot.yml`)
- **Purpose**: Automated dependency updates
- **Features**:
  - ✅ Grouped updates (production, dev, security, major)
  - ✅ Weekly update schedule (Mondays 9 AM UTC)
  - ✅ Smart ignore rules for major version updates
  - ✅ Supports npm, GitHub Actions, and Docker
- **Benefits**:
  - Reduces PR noise
  - Prioritizes security updates
  - Controlled major version updates

---

### 📊 Performance & Bundle Workflows

#### 10. **Bundle Size & Performance Budget** (`bundle-size.yml`)
- **Purpose**: Monitor and control bundle size and performance
- **Features**:
  - ✅ Build size analysis
  - ✅ Static asset size tracking
  - ✅ Largest chunk identification
  - ✅ Performance budget enforcement (50MB warning)
  - ✅ Duplicate dependency detection
  - ✅ Lighthouse performance checks (PRs and main branch)
- **Benefits**:
  - Prevents bundle bloat
  - Maintains performance standards
  - Identifies optimization opportunities
- **Triggers**: Push to main/develop, Pull requests, Manual dispatch

---

### 🧪 Testing Workflows

#### 11. **E2E Tests** (`e2e-tests.yml`)
- **Purpose**: End-to-end testing with Playwright
- **Features**:
  - ✅ Multi-browser testing (Chromium, Firefox, WebKit)
  - ✅ Parallel test execution (sharded)
  - ✅ Test result artifacts
  - ✅ Video recordings on failure
  - ✅ Accessibility testing
- **Schedule**: Daily at 2 AM UTC
- **Benefits**:
  - Ensures application functionality
  - Catches regressions early
  - Validates user workflows
- **Triggers**: Push to main/develop, Pull requests, Daily schedule, Manual dispatch

---

### 📚 Documentation Workflows

#### 12. **Documentation Quality & Freshness** (`documentation-check.yml`)
- **Purpose**: Maintain high-quality, up-to-date documentation
- **Features**:
  - ✅ README completeness check
  - ✅ Required documentation sections validation
  - ✅ Code documentation analysis (JSDoc)
  - ✅ Broken link detection
  - ✅ Documentation freshness check (flags >90 days old)
  - ✅ Changelog validation
- **Schedule**: Weekly on Sundays at 8 AM UTC
- **Benefits**:
  - Keeps documentation accurate
  - Ensures documentation standards
  - Improves developer experience
- **Triggers**: Documentation changes, Weekly schedule, Manual dispatch

---

### 🏷️ Semantic Versioning Workflows

#### 13. **Semantic Versioning & Commit Message Validation** (`semantic-validation.yml`)
- **Purpose**: Enforce semantic versioning and commit standards
- **Features**:
  - ✅ Commit message format validation (conventional commits)
  - ✅ Branch naming convention check
  - ✅ Semantic version tag validation
  - ✅ Version consistency with package.json
  - ✅ Changelog entry validation
- **Conventions**:
  - Commits: `type(scope): description` (feat, fix, docs, etc.)
  - Branches: `type/description` (feature, fix, docs, etc.)
  - Tags: `vMAJOR.MINOR.PATCH` (e.g., v1.2.3)
- **Benefits**:
  - Consistent commit history
  - Automated changelog generation
  - Better release management
- **Triggers**: Pull requests, Version tags, Manual dispatch

---

### 🔍 Type Safety & API Workflows

#### 14. **Type Coverage & API Contract Validation** (`type-coverage.yml`)
- **Purpose**: Ensure type safety and API contract integrity
- **Features**:
  - ✅ TypeScript strict type checking
  - ✅ Type coverage analysis (85% threshold)
  - ✅ API route type validation
  - ✅ Zod schema validation coverage
  - ✅ Prisma schema type safety
- **Benefits**:
  - Catches type errors early
  - Ensures API contract consistency
  - Validates request/response schemas
- **Triggers**: Push to main/develop, Pull requests, Manual dispatch

---

### 🏥 Health & Maintenance Workflows

#### 15. **Weekly Health Check & Maintenance** (`weekly-health-check.yml`)
- **Purpose**: Comprehensive project health monitoring
- **Features**:
  - ✅ Codebase statistics (files, lines, tests)
  - ✅ Dependency health report
  - ✅ Security status summary
  - ✅ Build health verification
  - ✅ Documentation freshness analysis
  - ✅ Recent activity tracking
  - ✅ Stale branch detection
  - ✅ Code quality trend analysis
  - ✅ Auto-creates issues for failures
- **Schedule**: Every Monday at 8 AM UTC
- **Benefits**:
  - Proactive issue detection
  - Project health visibility
  - Maintenance guidance
- **Triggers**: Weekly schedule, Manual dispatch

---

### 🚀 Release Workflows

#### 16. **Release** (`release.yml`)
- **Purpose**: Automated release creation
- **Features**:
  - ✅ Changelog generation
  - ✅ Release notes
  - ✅ Build artifacts
- **Triggers**: Version tags (v*.*.*)

---

## 📈 Workflow Status & Requirements

### Required Secrets
- `DATABASE_URL`: Database connection string (optional, uses default for CI)
- `NEXTAUTH_SECRET`: NextAuth secret (optional, uses default for CI)
- `NEXTAUTH_URL`: Application URL (optional, uses default for CI)
- `SNYK_TOKEN`: Snyk security token (optional, for security scanning)
- `GITHUB_TOKEN`: Automatically provided by GitHub Actions

### Workflow Scheduling
- **Dependency Health**: Weekly (Mondays, 9 AM UTC)
- **Documentation Check**: Weekly (Sundays, 8 AM UTC)
- **Weekly Health Check**: Weekly (Mondays, 8 AM UTC)
- **E2E Tests**: Daily (2 AM UTC)

### Status Checks
All workflows run as status checks that must pass before merging to `main`:
- ✅ Linting and type checking
- ✅ Tests (unit and E2E)
- ✅ Build verification
- ✅ Security scans
- ✅ Code quality checks
- ✅ PR quality checks

---

## 🎯 Benefits Summary

### Structure & Stability
- ✅ Consistent code organization
- ✅ Migration safety validation
- ✅ Build verification
- ✅ Type safety enforcement

### Longevity
- ✅ Automated dependency updates
- ✅ Weekly health monitoring
- ✅ Documentation freshness tracking
- ✅ Stale branch detection

### Coherence
- ✅ Code quality standards
- ✅ Commit message conventions
- ✅ Branch naming standards
- ✅ PR quality requirements

### Semantics
- ✅ Type coverage monitoring
- ✅ API contract validation
- ✅ Schema validation (Prisma + Zod)
- ✅ Semantic versioning enforcement

---

## 🔧 Configuration & Customization

### Adjusting Thresholds
Workflows include configurable thresholds:
- Bundle size: 50MB (in `bundle-size.yml`)
- Type coverage: 85% (in `type-coverage.yml`)
- File size: 500 lines (in `code-quality.yml`)
- Documentation age: 90 days (in `documentation-check.yml`)

### Adding New Checks
To add new quality checks:
1. Create a new workflow file or modify existing ones
2. Follow the existing pattern and structure
3. Add appropriate triggers
4. Update this documentation

### Disabling Workflows
To temporarily disable a workflow:
- Comment out the workflow file
- Or remove the trigger conditions
- Or set `if: false` at the job level

---

## 📊 Monitoring & Alerts

### GitHub Actions Dashboard
Monitor workflow status at:
- `https://github.com/{owner}/{repo}/actions`

### Weekly Health Reports
Check `weekly-health-check.yml` artifacts for comprehensive reports:
- Codebase statistics
- Dependency health
- Security status
- Build health
- Documentation status

### Automatic Issue Creation
The weekly health check automatically creates GitHub issues if critical failures are detected.

---

## 🔗 Related Documentation

- [Contributing Guide](../CONTRIBUTING.md)
- [Git Workflow Guide](../../docs/GIT_WORKFLOW.md)
- [Documentation Standards](../../docs/DOCUMENTATION_STANDARDS.md)
- [Project README](../../README.md)

---

## 📝 Notes

- Most workflows are **non-blocking** for warnings but **blocking** for errors
- Security scans are set to `continue-on-error: true` to avoid blocking development
- Some checks require optional tools (e.g., `markdown-link-check`, `type-coverage`) and gracefully degrade if unavailable
- Workflows use caching to improve execution speed
- All workflows include timeout limits to prevent infinite runs

---

**Last Updated**: 2026-01-06
**Maintained by**: Project Automation Team
