# GitHub Wiki Setup Instructions

## Why is the Wiki Empty?

The GitHub Wiki is a **separate git repository** from your main codebase. The wiki files we created are in the main repository's `wiki/` directory, but they need to be pushed to the GitHub Wiki repository (`research-platform.wiki`).

## 🔧 Quick Setup (2 Steps)

### Step 1: Initialize Wiki Repository

GitHub needs the Wiki repository to exist before we can push to it. Initialize it via the GitHub UI:

1. **Go to**: https://github.com/benmed00/research-platform/wiki
2. **Click**: "Create the first page" button
3. **Create a simple page**:
   - Title: `Home`
   - Content: `# Home\n\nWelcome to the Research Platform Wiki!`
   - Click "Save page"

This will automatically create the `research-platform.wiki` repository.

### Step 2: Push Wiki Files

Once the Wiki repository is initialized, run:

```bash
bash scripts/push-wiki-files.sh
```

This script will:
- Clone the Wiki repository
- Copy all wiki files from `wiki/` directory
- Commit and push them to GitHub Wiki

## 📋 Alternative: Manual Setup

If you prefer to do it manually:

```bash
# 1. Clone the Wiki repository (after Step 1 above)
cd ..
git clone https://github.com/benmed00/research-platform.wiki.git

# 2. Copy files
cd research-platform.wiki
cp ../research-platform/wiki/*.md .
rm -f WIKI_GENERATION_SUMMARY.md  # Remove summary file

# 3. Commit and push
git add *.md
git commit -m "docs: add comprehensive Wiki documentation"
git push origin master
```

## ✅ Verification

After pushing, verify the Wiki is populated:

1. Go to: https://github.com/benmed00/research-platform/wiki
2. You should see all 12 Wiki pages in the sidebar
3. Click on "Home" to see the main page

## 📚 Wiki Pages Included

1. **Home** - Project overview
2. **Architecture** - System architecture
3. **Technology-Stack** - Technologies used
4. **Project-Structure** - Repository organization
5. **Core-Modules** - All 12 modules
6. **Data-Model** - Database schema
7. **Authentication-and-Roles** - Auth system
8. **Development-Workflow** - Setup guide
9. **Contribution-Guidelines** - How to contribute
10. **Roadmap** - Future plans
11. **README** - Wiki navigation
12. **_Sidebar** - Sidebar navigation

## 🔍 Troubleshooting

### "Repository not found" Error
- **Cause**: Wiki repository not initialized yet
- **Solution**: Complete Step 1 above (create first page via UI)

### "Permission denied" Error
- **Cause**: Token doesn't have write access
- **Solution**: Use a token with `repo` scope, or push via GitHub UI

### Files Not Appearing
- **Cause**: Wiki repository not synced
- **Solution**: Refresh the Wiki page, check git push was successful

## 📝 Notes

- GitHub Wiki uses a separate git repository
- The `wiki/` directory in main repo is for source files
- Wiki repository is automatically created when you create the first page
- Wiki files are in `/tmp/research-platform.wiki/` ready to push

---

**Status**: Wiki files ready, waiting for repository initialization  
**Next**: Initialize Wiki via GitHub UI, then run `bash scripts/push-wiki-files.sh`
