# Quick Start: Assign All Issues to GitHub Project

## ✅ Completed
- ✅ Merged branch cleaned up
- ✅ All 75 issues assigned to milestones

## 🚀 Complete Project Assignment (3 Steps)

### Step 1: Refresh GitHub Token with Project Scopes

**This is required to access projects.** Run:

```powershell
gh auth refresh -h github.com -s project,read:project,write:project
```

This will open your browser for authorization. Click "Authorize" when prompted.

### Step 2: Verify Project Exists

Based on your existing scripts, you may already have project #5. You can verify by visiting:
- https://github.com/users/benmed00/projects/5

Or check all projects:
```powershell
gh project list --owner benmed00
```

**If project doesn't exist**, create it:
```powershell
gh project create --title "Research Platform Development" --owner benmed00
```
Note the project number from the output.

### Step 3: Assign All Issues

Run the script with your project number (default is 5):

```powershell
# For all issues (open and closed)
.\scripts\assign-issues-to-project.ps1 -ProjectNumber 5

# Or specify a different project number
.\scripts\assign-issues-to-project.ps1 -ProjectNumber 1

# Or for open issues only (matches existing script behavior)
.\scripts\assign-issues-to-project.ps1 -ProjectNumber 5 -OpenOnly
```

## ✨ One-Line Command (After Token Refresh)

```powershell
gh auth refresh -h github.com -s project,read:project,write:project && .\scripts\assign-issues-to-project.ps1
```

## 📊 What Will Happen

The script will:
1. Fetch all 75 issues from the repository
2. Add each issue to the specified project
3. Show progress for each issue
4. Display a summary at the end

**Expected Output:**
```
Assigning all issues from benmed00/research-platform to project #5
Fetching all issues...
Adding issue #75 to project... ✓
Adding issue #74 to project... ✓
...
Summary:
  Total issues: 75
  Successfully added: 75
  Failed/Skipped: 0
```

## ⚠️ Troubleshooting

### Error: "authentication token is missing required scopes"
**Solution:** Run Step 1 above to refresh your token.

### Error: "Project not found" or "Project #5 doesn't exist"
**Solution:** 
- Check your project number: `gh project list --owner benmed00`
- Or create a new project: `gh project create --title "Research Platform Development" --owner benmed00`
- Update the script call with the correct project number

### Issues already in project
**This is OK!** The script will skip issues that are already in the project. You may see warnings, but that's normal.

## 🎯 Current Status Summary

| Task | Status |
|------|--------|
| Branch cleanup | ✅ Complete |
| Milestone assignment | ✅ Complete (75/75 issues) |
| Project assignment | ⏳ Ready - Just run Step 3 |

---

**Ready to go?** Just run the 3 steps above! 🚀
