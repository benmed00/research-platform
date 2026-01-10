# GitHub Project Setup Guide

## Current Status

✅ **All issues have been assigned to milestones:**

- **v1.0 - Production Foundation**: 18 issues
- **v1.1 - Performance & User Experience**: 21 issues  
- **v1.2 - Advanced Features & Integration**: 7 issues
- **v1.3 - Quality & Polish**: 29 issues

## Steps to Complete Project Assignment

### Step 1: Refresh GitHub Authentication Token

You need to grant project permissions to your GitHub CLI token:

```powershell
gh auth refresh -h github.com -s project,read:project,write:project
```

This will open your browser for authentication. Follow the prompts to authorize the additional scopes.

### Step 2: Create a GitHub Project (if it doesn't exist)

**Option A: Using GitHub CLI**

```powershell
gh project create --title "Research Platform Development" --owner benmed00
```

The output will show the project number. Save this number for the next step.

**Option B: Using GitHub Web Interface**

1. Go to <https://github.com/users/benmed00/projects> (or <https://github.com/orgs/benmed00/projects> if it's an org)
2. Click "New project"
3. Choose a template or start with a blank project
4. Name it "Research Platform Development"
5. After creation, check the URL - it will be something like:
   - `https://github.com/users/benmed00/projects/1` (project number is 1)
   - `https://github.com/users/benmed00/projects/2` (project number is 2)
6. Note the project number from the URL

### Step 3: Assign All Issues to the Project

Once you have the project number, run:

```powershell
.\scripts\assign-issues-to-project.ps1 -ProjectNumber <YOUR_PROJECT_NUMBER> -Owner benmed00
```

Replace `<YOUR_PROJECT_NUMBER>` with the actual project number from Step 2.

**Example:**

```powershell
.\scripts\assign-issues-to-project.ps1 -ProjectNumber 1 -Owner benmed00
```

### Alternative: Manual Assignment via Web Interface

If you prefer to assign issues manually:

1. Go to your project: <https://github.com/users/benmed00/projects/><PROJECT_NUMBER>
2. Click "Add item" or use the "+" button
3. Search for issues by number (e.g., "#71") or browse all issues
4. Add each issue to the project

### Verifying Assignment

After running the script, you can verify issues are assigned by:

```powershell
# Check issues in a specific project (requires read:project scope)
gh project item-list <PROJECT_NUMBER> --owner benmed00
```

Or visit the project page in your browser to see all assigned issues.

## Troubleshooting

### Error: "authentication token is missing required scopes"

- Solution: Run `gh auth refresh -h github.com -s project,read:project,write:project`

### Error: "Project not found"

- Solution: Verify the project number is correct. Check the URL of your project page.

### Error: "Issue already in project"

- This is normal if you run the script multiple times. The script handles this gracefully.

### Script doesn't exist

- Make sure you're in the repository root directory
- Verify the script exists: `ls scripts/assign-issues-to-project.ps1`

## Quick Reference

```powershell
# 1. Refresh token
gh auth refresh -h github.com -s project,read:project,write:project

# 2. Create project (if needed)
gh project create --title "Research Platform Development" --owner benmed00

# 3. Assign all issues (replace PROJECT_NUMBER)
.\scripts\assign-issues-to-project.ps1 -ProjectNumber PROJECT_NUMBER -Owner benmed00
```
