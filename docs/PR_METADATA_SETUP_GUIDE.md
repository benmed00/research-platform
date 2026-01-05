# PR Metadata Setup Guide

## Overview

This guide provides instructions for manually adding metadata to the merged PRs (61-64) since API permissions are limited for automated updates.

## PRs That Need Metadata

### PR #61: Species edit page type ✅ MERGED
**Status**: Merged, needs metadata

**Required Actions**:
1. **Labels**: 
   - `type:bug`
   - `documentation`
   - `priority:medium`
   - `module:species` (optional)

2. **Milestone**: 
   - `v1.3 - Quality & Polish`

3. **Assignee**: 
   - `benmed00`

4. **Related Issues** (if applicable):
   - Could create issue: "Fix TypeScript errors in UI components"
   - Or link to existing component-related issues

5. **Project** (if projects exist):
   - Add to "Quality & Polish" project board
   - Status: Done

---

### PR #62: Cursor: Apply local changes for cloud agent ✅ MERGED
**Status**: Merged, needs metadata

**Required Actions**:
1. **Labels**: 
   - `documentation`
   - `type:documentation`
   - `priority:low`

2. **Milestone**: 
   - `v1.3 - Quality & Polish`

3. **Assignee**: 
   - `benmed00`

4. **Related Issues**: 
   - Could create issue: "Documentation organization and cleanup"

5. **Project**: 
   - Add to "Quality & Polish" project board
   - Status: Done

---

### PR #63: Project audit and review ✅ MERGED
**Status**: Merged, needs metadata

**Required Actions**:
1. **Labels**: 
   - `documentation`
   - `type:documentation`
   - `priority:high`

2. **Milestone**: 
   - `v1.3 - Quality & Polish`

3. **Assignee**: 
   - `benmed00`

4. **Related Issues**: 
   - Should create issues based on audit findings:
     - "Implement testing framework (Vitest/Jest)" - High priority
     - "Add security headers middleware" - High priority
     - "Implement structured logging system" - High priority
     - "Add Docker containerization" - Medium priority
     - "Implement rate limiting" - High priority
     - "Add error tracking (Sentry)" - High priority
     - "Backend pagination implementation" - Medium priority

5. **Project**: 
   - Add to "Quality & Polish" project board
   - Status: Done

---

### PR #64: Cursor: Apply local changes for cloud agent ✅ MERGED
**Status**: Merged, needs metadata

**Required Actions**:
1. **Labels**: 
   - `documentation`
   - `type:documentation`
   - `priority:low`

2. **Milestone**: 
   - `v1.3 - Quality & Polish`

3. **Assignee**: 
   - `benmed00`

4. **Related Issues**: 
   - Same as PR #62 (documentation cleanup)

5. **Project**: 
   - Add to "Quality & Polish" project board
   - Status: Done

---

## Manual Steps to Add Metadata

### Via GitHub Web Interface

1. **Navigate to each PR**:
   - Go to: https://github.com/benmed00/research-platform/pulls
   - Find the merged PR (use filter: `is:merged`)

2. **Add Labels**:
   - Click on "Labels" button
   - Select appropriate labels from the list
   - Click outside to save

3. **Add Milestone**:
   - Click on "Milestone" in the right sidebar
   - Select "v1.3 - Quality & Polish"
   - Click "Set milestone"

4. **Add Assignee**:
   - Click on "Assignees" in the right sidebar
   - Search for "benmed00"
   - Select the user
   - Click "Assign"

5. **Add to Project** (if project board exists):
   - Click on "Projects" in the right sidebar
   - Select the appropriate project
   - Choose the column (e.g., "Done")

### Via GitHub CLI (if permissions allow)

```bash
# Add labels
gh pr edit 61 --add-label "type:bug" --add-label "documentation" --add-label "priority:medium"

# Add milestone
gh pr edit 61 --milestone "v1.3 - Quality & Polish"

# Add assignee
gh pr edit 61 --add-assignee benmed00
```

**Note**: These commands may fail due to API permissions. Use web interface as fallback.

---

## Issues to Create Based on Audit Report

The audit report (PR #63) identified several critical areas. Create these issues:

### High Priority Issues

1. **Implement Testing Framework**
   - Title: "Implement testing framework (Vitest/Jest) with React Testing Library"
   - Labels: `type:testing`, `priority:high`, `type:enhancement`
   - Milestone: `v1.3 - Quality & Polish`
   - Description: Based on audit finding - 0% test coverage. Need to set up Vitest or Jest with React Testing Library for unit and component tests.

2. **Add Security Headers Middleware**
   - Title: "Implement security headers middleware (CSP, X-Frame-Options, etc.)"
   - Labels: `type:security`, `priority:high`, `type:enhancement`
   - Milestone: `v1.3 - Quality & Polish`
   - Description: Audit identified missing security headers. Need to create Next.js middleware with proper security headers.

3. **Implement Structured Logging**
   - Title: "Replace console.error with structured logging system (Winston/Pino)"
   - Labels: `type:enhancement`, `priority:high`
   - Milestone: `v1.3 - Quality & Polish`
   - Description: Audit found console.error usage throughout. Need centralized logging with levels and structured output.

4. **Add Rate Limiting**
   - Title: "Implement rate limiting for API routes"
   - Labels: `type:security`, `priority:high`, `type:enhancement`
   - Milestone: `v1.3 - Quality & Polish`
   - Description: Protect API endpoints from abuse and brute force attacks.

5. **Backend Pagination**
   - Title: "Implement pagination in all API routes (skip/take)"
   - Labels: `type:performance`, `priority:medium`, `type:enhancement`
   - Milestone: `v1.3 - Quality & Polish`
   - Description: Add pagination to prevent loading all data into memory.

### Medium Priority Issues

6. **Docker Containerization**
   - Title: "Create Dockerfile and docker-compose.yml for containerization"
   - Labels: `type:enhancement`, `priority:medium`
   - Milestone: `v1.3 - Quality & Polish`
   - Description: Add Docker support for easier deployment and development.

7. **Error Tracking Integration**
   - Title: "Integrate Sentry for error tracking and monitoring"
   - Labels: `type:enhancement`, `priority:high`
   - Milestone: `v1.3 - Quality & Polish`
   - Description: Replace console.error with Sentry for production error tracking.

8. **Server-Side Validation**
   - Title: "Add Zod validation to all API routes"
   - Labels: `type:security`, `priority:medium`, `type:enhancement`
   - Milestone: `v1.3 - Quality & Polish`
   - Description: Validate all API inputs with Zod schemas on the server side.

---

## Quick Reference: PR URLs

- PR #61: https://github.com/benmed00/research-platform/pull/61
- PR #62: https://github.com/benmed00/research-platform/pull/62
- PR #63: https://github.com/benmed00/research-platform/pull/63
- PR #64: https://github.com/benmed00/research-platform/pull/64

---

## Checklist

- [ ] Add labels to PR #61
- [ ] Add milestone to PR #61
- [ ] Add assignee to PR #61
- [ ] Add labels to PR #62
- [ ] Add milestone to PR #62
- [ ] Add assignee to PR #62
- [ ] Add labels to PR #63
- [ ] Add milestone to PR #63
- [ ] Add assignee to PR #63
- [ ] Add labels to PR #64
- [ ] Add milestone to PR #64
- [ ] Add assignee to PR #64
- [ ] Create issues based on audit findings
- [ ] Add PRs to project board (if exists)
- [ ] Link issues to PRs where applicable

---

**Last Updated**: 2026-01-05  
**Status**: Ready for manual completion
