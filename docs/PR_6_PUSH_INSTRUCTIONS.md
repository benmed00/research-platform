# PR #6: Instructions to Push Code Fixes

## Status

✅ **PR Description Updated**: Successfully updated via GitHub API  
⏳ **Code Fixes**: Need to be pushed to PR branch

## Current Situation

- ✅ PR description has been updated with comprehensive information
- ✅ All compatibility fixes have been implemented and tested
- ⏳ Code fixes are in commit `274230d` but not yet on the PR branch
- ⏳ PR branch (`dependabot/npm_and_yarn/hookform/resolvers-5.2.2`) only has the package.json update

## Files That Need to Be Updated on PR Branch

1. `src/lib/validations.ts` - Fix schema defaults
2. `src/app/dashboard/documents/[id]/edit/page.tsx` - Fix types and defaults
3. `src/app/dashboard/documents/new/page.tsx` - Use shared schema, fix types
4. `src/app/dashboard/publications/[id]/edit/page.tsx` - Fix types
5. `src/app/dashboard/publications/new/page.tsx` - Fix schema and types
6. `package-lock.json` - Already updated (via npm install)

## Solution Options

### Option 1: Manual Push (Recommended if in clean workspace)

```bash
# 1. Clone or navigate to a clean workspace
cd /path/to/clean/workspace
git clone https://github.com/benmed00/research-platform.git
cd research-platform

# 2. Fetch and checkout the PR branch
git fetch origin dependabot/npm_and_yarn/hookform/resolvers-5.2.2
git checkout dependabot/npm_and_yarn/hookform/resolvers-5.2.2

# 3. Apply the fixes manually or cherry-pick from commit 274230d
# (You'll need to get that commit from the worktree)

# 4. Or manually apply the changes:
# - Update src/lib/validations.ts (see diff below)
# - Update form files (see diffs below)
# - Run: npm install (to update package-lock.json)
# - Test: npm run build

# 5. Commit and push
git add .
git commit -m "fix: resolve @hookform/resolvers v5 compatibility issues"
git push origin dependabot/npm_and_yarn/hookform/resolvers-5.2.2
```

### Option 2: Use GitHub API to Create Commit (Automated)

We can create a script that uses the GitHub API to update the files directly.

### Option 3: Create Patch File

```bash
# From the worktree with commit 274230d
git format-patch -1 274230d --stdout > pr6-fixes.patch

# Then apply to PR branch
git checkout dependabot/npm_and_yarn/hookform/resolvers-5.2.2
git apply pr6-fixes.patch
git add .
git commit -m "fix: resolve @hookform/resolvers v5 compatibility issues"
git push origin dependabot/npm_and_yarn/hookform/resolvers-5.2.2
```

## Required Changes Summary

### 1. src/lib/validations.ts

Change:
```typescript
// Before:
isPublic: z.boolean().default(false),
status: z.enum([...]).default("DRAFT"),

// After:
isPublic: z.boolean().optional().default(false),
status: z.enum([...]).optional().default("DRAFT"),
```

### 2. src/app/dashboard/documents/new/page.tsx

- Remove duplicate `documentSchema` definition
- Import from `@/lib/validations`
- Change type to `z.input<typeof documentSchema>`
- Add `defaultValues: { isPublic: false }`
- Fix `data.isPublic.toString()` to `(data.isPublic ?? false).toString()`

### 3. src/app/dashboard/documents/[id]/edit/page.tsx

- Change type to `z.input<typeof documentSchema>`
- Add `defaultValues: { isPublic: false }`

### 4. src/app/dashboard/publications/[id]/edit/page.tsx

- Change type to `z.input<typeof publicationSchema> & { content?: string; coverImage?: string; }`

### 5. src/app/dashboard/publications/new/page.tsx

- Update schema: `isPublished: z.boolean().optional().default(false)`
- Change type to `z.input<typeof publicationSchema>`

## Verification

After applying fixes:

```bash
npm install
npm run build  # Should succeed
npm run test:run  # Run tests if available
```

## Alternative: Merge via GitHub Web UI

If the fixes are critical, you could:
1. Create a new branch from the PR branch
2. Apply the fixes
3. Create a PR targeting the dependabot branch
4. Merge it, then the main PR will include the fixes

## Current Commit Details

**Commit**: `274230d`  
**Message**: `fix: resolve @hookform/resolvers v5 compatibility issues`  
**Files Changed**: 7 files
- package.json
- package-lock.json
- src/lib/validations.ts
- src/app/dashboard/documents/[id]/edit/page.tsx
- src/app/dashboard/documents/new/page.tsx
- src/app/dashboard/publications/[id]/edit/page.tsx
- src/app/dashboard/publications/new/page.tsx

---

**Note**: The PR description has already been updated and is ready. Once the code fixes are pushed, the PR will be complete and ready for review/merge.
