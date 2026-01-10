# CRITICAL: PR Merge Process Guidelines

## ⚠️ NEVER MERGE WITHOUT EXPLICIT USER CONFIRMATION

### Rules
1. **NEVER merge a PR without explicit user confirmation**
2. **ALWAYS wait for user to say "proceed", "merge", "go ahead", etc.**
3. **ALWAYS verify all checks pass before suggesting merge**
4. **ALWAYS link issues and milestones before merge**
5. **ALWAYS create comprehensive commit messages with issue links**

### Process
1. Update PR metadata (labels, assignee, milestone)
2. Link related issues, PRs, branches
3. Wait for ALL workflow checks to pass
4. **WAIT FOR USER EXPLICIT CONFIRMATION**
5. Only then proceed with merge

### What to Check Before Merge
- [ ] All workflow checks passing
- [ ] Tests passing
- [ ] Build successful
- [ ] Lint passing
- [ ] PR description includes issue links (Closes #X, Fixes #Y)
- [ ] Milestone linked
- [ ] Labels applied
- [ ] Assignee set
- [ ] **USER EXPLICITLY CONFIRMED MERGE**

### Issue Linking
- Use "Closes #X" or "Fixes #X" in commit message to auto-close issues
- Link related PRs in description
- Link to milestones
- Update project boards

### Never Do
- ❌ Merge without user saying "proceed", "merge", "go ahead"
- ❌ Merge when checks are still running
- ❌ Merge when workflows are failing
- ❌ Merge without linking issues/milestones
- ❌ Assume user wants merge just because PR is ready

### Always Do
- ✅ Wait for explicit confirmation
- ✅ Verify all checks pass
- ✅ Link issues in commit message
- ✅ Update milestones
- ✅ Create professional commit messages
- ✅ Delete branch after merge (if user approved)
