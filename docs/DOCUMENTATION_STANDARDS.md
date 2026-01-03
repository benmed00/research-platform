# 📚 Documentation Standards & Guidelines

**Last Updated**: 2026-01-03  
**Status**: ✅ Active

---

## 🎯 Documentation Organization Rules

### ✅ Rule: Root Directory

**Only `README.md` should be in the root directory.**

All other markdown (`.md`) files must be placed in the `docs/` folder.

### ✅ Rule: Documentation Folder Structure

All documentation files (except `README.md`) should be organized in the `docs/` folder:

```
research-platform/
├── README.md                    ✅ ONLY markdown file in root
├── docs/
│   ├── *.md                     ✅ All other markdown files here
│   ├── wiki/
│   │   └── *.md                 ✅ Wiki pages
│   └── ...
```

---

## 📋 Documentation Categories

### Recommended Organization in `docs/`

Organize documentation files by category:

```
docs/
├── setup/                       # Setup and installation guides
│   ├── QUICKSTART.md
│   ├── ARCHITECTURE.md
│   └── ...
├── project-management/          # Project management docs
│   ├── GITHUB_MILESTONES_AND_PROJECT.md
│   ├── PROJECT_BOARD_SETUP_GUIDE.md
│   └── ...
├── development/                 # Development guides
│   ├── FEATURES.md
│   ├── IMPLEMENTATION_STATUS.md
│   └── ...
├── guides/                      # User and developer guides
│   ├── GIT_WORKFLOW.md
│   └── ...
└── reference/                   # Reference documentation
    ├── API_OPTIMIZATION.md
    └── ...
```

*(This is a recommendation - files can be directly in `docs/` if preferred)*

---

## ✅ Rules for Creating Documentation

### When Creating New Documentation:

1. **Never create `.md` files in the root directory** (except `README.md`)
2. **Always place new `.md` files in `docs/` folder**
3. **Use descriptive file names** (e.g., `PROJECT_SETUP_GUIDE.md` not `setup.md`)
4. **Update README.md** if adding new documentation (optional, but recommended)
5. **Follow naming conventions**:
   - UPPERCASE for important guides (e.g., `QUICKSTART.md`)
   - Descriptive names (e.g., `GITHUB_MILESTONES_AND_PROJECT.md`)
   - Use underscores or hyphens, not spaces

### File Naming Conventions:

- ✅ `FEATURE_NAME.md` - Uppercase for main documentation
- ✅ `feature-name.md` - Lowercase with hyphens
- ✅ `feature_name.md` - Lowercase with underscores
- ❌ `Feature Name.md` - Avoid spaces
- ❌ `feature name.md` - Avoid spaces

---

## 📝 README.md Guidelines

The `README.md` file in the root should:

- ✅ Provide an overview of the project
- ✅ Include quick start instructions
- ✅ Link to detailed documentation in `docs/`
- ✅ Be concise and user-friendly
- ✅ Stay focused on essential information

**Example structure:**
```markdown
# Project Name

Brief description...

## Quick Start
[Essential setup steps]

## Documentation
- [Setup Guide](./docs/QUICKSTART.md)
- [Architecture](./docs/ARCHITECTURE.md)
- [Features](./docs/FEATURES.md)
- [Full Documentation](./docs/)
```

---

## 🔄 Migration Completed

**Date**: 2026-01-03

All markdown files (except `README.md`) have been moved from root to `docs/` folder.

**Files moved:**
- All project management documentation
- All setup and configuration guides
- All development documentation
- All reference materials

---

## ✅ Compliance Checklist

When creating new documentation:

- [ ] File is in `docs/` folder (not root)
- [ ] File name follows conventions
- [ ] README.md is updated if needed (optional)
- [ ] Documentation is properly categorized
- [ ] Links in documentation are updated if files are moved

---

## 📚 Current Documentation Structure

All documentation is now organized in `docs/`:

- **Setup & Configuration**: QUICKSTART.md, ARCHITECTURE.md, etc.
- **Project Management**: GITHUB_MILESTONES_AND_PROJECT.md, PROJECT_BOARD_*.md, etc.
- **Development**: FEATURES.md, IMPLEMENTATION_STATUS.md, etc.
- **Guides**: GIT_WORKFLOW.md, TROUBLESHOOTING.md, etc.
- **Reference**: API_OPTIMIZATION.md, DATA_MODEL.md, etc.

---

## 🎯 Benefits of This Structure

1. **Clean Root Directory** - Only essential README.md in root
2. **Better Organization** - All documentation in one place
3. **Easier Navigation** - Clear documentation location
4. **Scalability** - Easy to add new documentation
5. **Consistency** - Standard structure for all projects

---

## 💡 For Developers

When creating new documentation:

```bash
# ✅ Correct - Create in docs/
touch docs/NEW_FEATURE_GUIDE.md

# ❌ Wrong - Don't create in root
touch NEW_FEATURE_GUIDE.md
```

When referencing documentation in code/comments:

```markdown
# ✅ Correct - Reference docs/
See [Setup Guide](./docs/QUICKSTART.md)

# ❌ Wrong - Don't reference root files
See [Setup Guide](./QUICKSTART.md)
```

---

**This standard ensures a clean, organized, and maintainable documentation structure! 📚**

