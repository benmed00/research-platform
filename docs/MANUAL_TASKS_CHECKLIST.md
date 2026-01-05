# Manual Tasks Checklist

## Quick Reference for Remaining Tasks

Due to API permission limitations, these tasks need to be completed manually via GitHub web interface. Estimated time: **15-20 minutes total**.

---

## ✅ PR Metadata Setup (4 PRs)

### PR #61: Species edit page type
**URL**: https://github.com/benmed00/research-platform/pull/61

- [ ] Add labels: `type:bug`, `documentation`, `priority:medium`
- [ ] Add milestone: `v1.3 - Quality & Polish`
- [ ] Add assignee: `benmed00`

### PR #62: Cursor: Apply local changes
**URL**: https://github.com/benmed00/research-platform/pull/62

- [ ] Add labels: `documentation`, `type:documentation`, `priority:low`
- [ ] Add milestone: `v1.3 - Quality & Polish`
- [ ] Add assignee: `benmed00`

### PR #63: Project audit and review
**URL**: https://github.com/benmed00/research-platform/pull/63

- [ ] Add labels: `documentation`, `type:documentation`, `priority:high`
- [ ] Add milestone: `v1.3 - Quality & Polish`
- [ ] Add assignee: `benmed00`

### PR #64: Cursor: Apply local changes
**URL**: https://github.com/benmed00/research-platform/pull/64

- [ ] Add labels: `documentation`, `type:documentation`, `priority:low`
- [ ] Add milestone: `v1.3 - Quality & Polish`
- [ ] Add assignee: `benmed00`

---

## ✅ Issue Metadata Setup (7 Issues)

### Issue #65: Testing Framework
**URL**: https://github.com/benmed00/research-platform/issues/65

- [ ] Add labels: `type:testing`, `priority:high`, `type:enhancement`
- [ ] Add milestone: `v1.3 - Quality & Polish`
- [ ] Add assignee: `benmed00`

### Issue #66: Security Headers
**URL**: https://github.com/benmed00/research-platform/issues/66

- [ ] Add labels: `type:security`, `priority:high`, `type:enhancement`
- [ ] Add milestone: `v1.3 - Quality & Polish`
- [ ] Add assignee: `benmed00`

### Issue #67: Structured Logging
**URL**: https://github.com/benmed00/research-platform/issues/67

- [ ] Add labels: `type:enhancement`, `priority:high`
- [ ] Add milestone: `v1.3 - Quality & Polish`
- [ ] Add assignee: `benmed00`

### Issue #68: Rate Limiting
**URL**: https://github.com/benmed00/research-platform/issues/68

- [ ] Add labels: `type:security`, `priority:high`, `type:enhancement`
- [ ] Add milestone: `v1.3 - Quality & Polish`
- [ ] Add assignee: `benmed00`

### Issue #69: Backend Pagination
**URL**: https://github.com/benmed00/research-platform/issues/69

- [ ] Add labels: `type:performance`, `priority:medium`, `type:enhancement`
- [ ] Add milestone: `v1.3 - Quality & Polish`
- [ ] Add assignee: `benmed00`

### Issue #70: Docker Containerization
**URL**: https://github.com/benmed00/research-platform/issues/70

- [ ] Add labels: `type:enhancement`, `priority:medium`
- [ ] Add milestone: `v1.3 - Quality & Polish`
- [ ] Add assignee: `benmed00`

### Issue #71: Sentry Integration
**URL**: https://github.com/benmed00/research-platform/issues/71

- [ ] Add labels: `type:enhancement`, `priority:high`
- [ ] Add milestone: `v1.3 - Quality & Polish`
- [ ] Add assignee: `benmed00`

---

## 📝 How to Add Metadata

### Via GitHub Web Interface

1. **Navigate to PR/Issue**
   - Click the URL above or go to GitHub
   - Find the PR/Issue number

2. **Add Labels**
   - Click "Labels" button (right sidebar)
   - Search and select labels
   - Click outside to save

3. **Add Milestone**
   - Click "Milestone" (right sidebar)
   - Select "v1.3 - Quality & Polish"
   - Click "Set milestone"

4. **Add Assignee**
   - Click "Assignees" (right sidebar)
   - Search for "benmed00"
   - Select and click "Assign"

---

## ⏱️ Time Estimate

- **PR Metadata**: ~2-3 minutes per PR = 8-12 minutes
- **Issue Metadata**: ~1-2 minutes per issue = 7-14 minutes
- **Total**: 15-26 minutes

---

## ✅ Verification

After completing, verify with:

```bash
# Check PRs
gh pr list --state merged --limit 10

# Check issues
gh issue list --milestone "v1.3 - Quality & Polish"

# Check specific issue
gh issue view 65 --json labels,milestone,assignees
```

---

## 🎯 Priority Order

1. **High Priority**: PR #63, Issues #65, #66, #68, #71
2. **Medium Priority**: PR #61, Issues #67, #69, #70
3. **Low Priority**: PRs #62, #64

---

**Estimated Completion Time**: 15-20 minutes  
**Status**: Ready to complete  
**Next**: Begin implementation of improvements
