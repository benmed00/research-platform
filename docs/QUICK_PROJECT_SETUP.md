# 🚀 Quick Project Board Setup via GitHub CLI

Since GitHub Projects v2 requires the `project` scope for management via CLI, here's the quickest way to set everything up:

## Step 1: Add Project Scope (One-time)

```powershell
gh auth refresh -s project
```

This will open your browser to authorize the project scope.

## Step 2: Create Labels (Already Done ✅)

Labels have been created. If you need to run it again:

```powershell
.\scripts\setup-labels.ps1
```

## Step 3: Configure Project Board via Web Interface

Since GitHub Projects v2 configuration (columns, views) is best done via the web interface:

1. Go to: https://github.com/benmed00/research-platform/projects
2. Click on your project
3. Configure:
   - **Columns**: Backlog, To Do, In Progress, Review, Done
   - **Views**: Create "By Milestone" view (group by milestone)
   - **Automation**: Set up auto-move rules (optional)

## Step 4: Create Issues

You can create issues via CLI:

```powershell
# Example: Create a security audit issue
gh issue create `
  --title "Security audit for authentication flows" `
  --body "Conduct comprehensive security audit of NextAuth.js implementation." `
  --milestone "v1.0 - Production Foundation" `
  --label "security,enhancement,priority:high"
```

Or use the web interface with the task lists from `PROJECT_INITIAL_TASKS.md`.

## Available Scripts

- `scripts/setup-labels.ps1` - Creates all labels
- `scripts/create-sample-issues.ts` - Creates sample issues (requires ts-node)

## Next Steps

1. ✅ Labels created
2. ⏳ Configure project board columns/views (web interface)
3. ⏳ Create initial issues
4. ⏳ Organize issues in project board

See `PROJECT_BOARD_COMPLETE.md` for detailed instructions.

