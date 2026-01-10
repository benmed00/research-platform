# Branch Protection Rules for Main Branch

## Overview
The `main` branch is now protected with strict rules to ensure code quality and prevent merging of code that doesn't pass all required checks.

## Protection Rules

### ✅ Required Status Checks
All of the following checks **MUST** pass before any merge to `main`:

1. **Build Application** - Ensures the application builds successfully
2. **ESLint Check** - Validates code quality and style
3. **Lint and Type Check** - Runs linting and TypeScript type checking
4. **Run Test Suite (20)** - Executes the full test suite on Node.js 20
5. **Run Tests** - Additional test validation

### 🔒 Additional Protection Settings

- **Strict Status Checks**: ✅ Enabled
  - Requires branches to be up to date with `main` before merging
  - All status checks must pass on the latest commit

- **Enforce Admins**: ✅ Enabled
  - Even repository administrators must follow these rules
  - No bypassing of protection rules

- **Required Pull Request Reviews**: ✅ Enabled
  - Minimum 1 approving review required
  - Stale reviews are dismissed when new commits are pushed

- **Merge Methods**:
  - ✅ **Squash and Merge**: Allowed (recommended)
  - ❌ **Merge Commit**: Not allowed
  - ❌ **Rebase and Merge**: Not allowed

- **Force Pushes**: ❌ Not allowed
- **Branch Deletion**: ❌ Not allowed

## Workflow

### For Pull Requests:
1. Create a feature branch from `main`
2. Make your changes and commit
3. Push to remote and create a Pull Request
4. **All required status checks must pass** (Build, Test, Lint, etc.)
5. Get at least 1 approving review
6. Merge using "Squash and Merge" method

### For Direct Commits:
- Direct commits to `main` are **blocked** by branch protection
- All changes must go through Pull Requests
- This ensures code review and CI validation

## Required Checks Details

| Check Name | Purpose | Failure Impact |
|------------|---------|----------------|
| Build Application | Verifies the application compiles and builds | Merge blocked |
| ESLint Check | Code quality and style validation | Merge blocked |
| Lint and Type Check | TypeScript type checking and linting | Merge blocked |
| Run Test Suite (20) | Full test suite execution | Merge blocked |
| Run Tests | Additional test validation | Merge blocked |

## Troubleshooting

### If checks are failing:
1. Check the workflow logs in GitHub Actions
2. Fix the issues locally
3. Push new commits to trigger re-runs
4. Wait for all checks to pass before requesting review

### If you see "Required status checks must pass":
- This means one or more required checks are still running or have failed
- Wait for all checks to complete and pass
- Review the failed check logs to identify issues

## Enforcement

These rules are enforced at the repository level and **cannot be bypassed**, even by administrators. This ensures:
- Code quality standards are maintained
- All code is tested before merging
- Consistent merge history (squash merges only)
- No force pushes that could rewrite history

## Related Documentation
- [GitHub Branch Protection Documentation](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [MERGE_PROCESS_GUIDELINES.md](./MERGE_PROCESS_GUIDELINES.md)
